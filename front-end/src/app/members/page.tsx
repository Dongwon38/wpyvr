"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Mail,
  Briefcase,
  Building2,
  Globe,
  Award,
  Sparkles,
  LineChart,
} from "lucide-react";
import { fetchAllMembers, type UserProfile } from "@/lib/profileApi";
import LoadingSpinner from "@/components/LoadingSpinner";

type SortOption = "default" | "name-asc" | "name-desc";

const heroGradient = `
  radial-gradient(circle at 18% 22%, rgba(0, 180, 216, 0.45), transparent 45%),
  radial-gradient(circle at 80% 0%, rgba(0, 116, 156, 0.85), rgba(3, 25, 38, 0.95)),
  linear-gradient(120deg, #03121C, #063549 55%, #0097C2)
`;

export default function MembersPage() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [activeBioId, setActiveBioId] = useState<number | null>(null);
  const [hoveredBioId, setHoveredBioId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function updateIsMobile() {
      if (typeof window === "undefined") return;
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile(nextIsMobile);
      if (nextIsMobile) {
        setHoveredBioId(null);
      }
    }

    updateIsMobile();

    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await fetchAllMembers();
        setMembers(data);
      } catch (error) {
        console.error("Failed to load members:", error);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  const handleMemberToggle = (memberId: number, hasBio: boolean) => {
    if (!hasBio) {
      return;
    }
    setActiveBioId((current) => {
      const nextValue = current === memberId ? null : memberId;
      if (nextValue === null) {
        setHoveredBioId(null);
      }
      return nextValue;
    });
  };

  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>();
    members.forEach((member) => {
      if (member.specialties) {
        member.specialties.forEach((specialty) => specialtiesSet.add(specialty));
      }
    });
    return Array.from(specialtiesSet).sort();
  }, [members]);

  const staffCount = useMemo(
    () =>
      members.filter(
        (member) => member.role === "administrator" || member.role === "staff",
      ).length,
    [members],
  );

  const websiteCount = useMemo(
    () => members.filter((member) => Boolean(member.website)).length,
    [members],
  );

  const heroStats = useMemo(
    () => [
      {
        label: "Members live",
        value: loading ? "..." : String(members.length),
        helper: "Profiles connected",
      },
      {
        label: "Specialties tracked",
        value: loading ? "..." : String(allSpecialties.length),
        helper: "Skill tags curated",
      },
      {
        label: "Staff & admins",
        value: loading ? "..." : String(staffCount),
        helper: "Core team",
      },
      {
        label: "Public sites",
        value: loading ? "..." : String(websiteCount),
        helper: "Portfolios linked",
      },
    ],
    [loading, members.length, allSpecialties.length, staffCount, websiteCount],
  );

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.nickname?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterSpecialty !== "all") {
      filtered = filtered.filter(
        (member) => member.specialties && member.specialties.includes(filterSpecialty),
      );
    }

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) =>
          (a.nickname || "").localeCompare(b.nickname || ""),
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          (b.nickname || "").localeCompare(a.nickname || ""),
        );
        break;
      case "default":
      default: {
        filtered.sort((a, b) => {
          const roleOrder: Record<string, number> = {
            administrator: 0,
            staff: 1,
            subscriber: 2,
            member: 3,
          };
          const aRoleOrder = roleOrder[a.role || "member"] ?? 3;
          const bRoleOrder = roleOrder[b.role || "member"] ?? 3;

          if (aRoleOrder !== bRoleOrder) {
            return aRoleOrder - bRoleOrder;
          }

          const aTime = a.last_active_at
            ? new Date(a.last_active_at).getTime()
            : 0;
          const bTime = b.last_active_at
            ? new Date(b.last_active_at).getTime()
            : 0;
          return bTime - aTime;
        });
        break;
      }
    }

    return filtered;
  }, [members, searchQuery, sortBy, filterSpecialty]);

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#444140]">
      <section className="relative isolate overflow-hidden border-b border-white/10 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: heroGradient,
          }}
        />
        <div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-[#00B7D3]/30 blur-[120px]" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-[#00749C]/25 blur-[140px]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
              <Sparkles className="h-4 w-4" />
              WordPress community hub
            </span>
            <div>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Community Members
              </h1>
              <p className="mt-4 text-lg text-white/85">
                {loading
                  ? "Discovering who is active in the community..."
                  : `Connect with ${members.length} creators, developers, and strategists who keep the WordPress ecosystem thriving.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
              <span className="rounded-full border border-white/30 px-3 py-1">
                #00749C
              </span>
              <span className="rounded-full border border-white/30 px-3 py-1">
                #444140
              </span>
              <span className="rounded-full border border-white/30 px-3 py-1">
                #00B7D3
              </span>
            </div>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-[#021820]/40 backdrop-blur-xl">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.4em] text-white/70">
              <span>Live snapshot</span>
              <LineChart className="h-4 w-4 text-white/70" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/65">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-black">{stat.value}</p>
                  <p className="text-sm text-white/75">{stat.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-6 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 rounded-[32px] border border-[#00749C]/15 bg-white/90 p-6 shadow-xl shadow-[#021820]/10 backdrop-blur"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 border-b border-[#00749C]/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#00749C]/80">
                        Filters
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-[#1F1C1A]">
                        Tailor the roster
                      </h2>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#00749C]/30 px-3 py-1 text-xs font-semibold text-[#00749C]">
                      <LineChart className="h-4 w-4" />
                      Live sync enabled
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00749C]/60" size={20} />
                        <input
                          type="text"
                          placeholder="Search by name or nickname..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-2xl border border-transparent bg-white/80 py-3 pl-12 pr-4 text-[#1F1C1A] placeholder:text-[#5C5856]/70 shadow-inner shadow-[#031926]/5 focus:border-[#00B7D3] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/25 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="text-[#444140]/70" size={18} />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="rounded-2xl border border-[#00749C]/15 bg-white/80 px-4 py-2.5 text-sm font-medium text-[#1F1C1A] focus:border-[#00B7D3] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/25 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="default">Default (Role & Activity)</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="text-[#444140]/70" size={18} />
                      <select
                        value={filterSpecialty}
                        onChange={(e) => setFilterSpecialty(e.target.value)}
                        className="rounded-2xl border border-[#00749C]/15 bg-white/80 px-4 py-2.5 text-sm font-medium text-[#1F1C1A] focus:border-[#00B7D3] focus:outline-none focus:ring-2 focus:ring-[#00B7D3]/25 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="all">All Specialties</option>
                        {allSpecialties.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(searchQuery || filterSpecialty !== "all") && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-[#00749C]/10 pt-4">
                      <span className="text-sm font-medium text-[#5C5856]">
                        Active Filters:
                      </span>
                      {searchQuery && (
                        <span className="rounded-full bg-[#00749C]/10 px-3 py-1 text-xs font-medium text-[#00749C]">
                          Search: {searchQuery}
                        </span>
                      )}
                      {filterSpecialty !== "all" && (
                        <span className="rounded-full bg-[#00B7D3]/10 px-3 py-1 text-xs font-medium text-[#006A82]">
                          Specialty: {filterSpecialty}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilterSpecialty("all");
                          setSortBy("default");
                        }}
                        className="text-xs font-semibold text-[#00749C] transition hover:text-[#00B7D3]"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="mb-4 text-sm text-[#5C5856]">
                Showing {filteredMembers.length} of {members.length} members
              </div>

              {filteredMembers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="relative rounded-[32px] border border-[#00749C]/15 bg-white/95 shadow-2xl shadow-[#012433]/10 backdrop-blur"
                >
                  <div className="overflow-x-auto md:overflow-visible">
                    <table className="w-full">
                      <thead className="border-b border-[#E1EBF0] bg-[#00749C]/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F1C1A]">
                            Member
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F1C1A]">
                            Specialties
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#1F1C1A]">
                            Position / Company
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-[#1F1C1A]">
                            Website
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8EDF0]">
                        {filteredMembers.map((member, index) => {
                          const trimmedBio =
                            typeof member.bio === "string" ? member.bio.trim() : "";
                          const hasBio = trimmedBio.length > 0;
                          const memberId = member.user_id ?? member.id ?? index;
                          const rowIsActive = activeBioId === memberId;
                          const inlineOpen =
                            hasBio &&
                            (rowIsActive || (!isMobile && hoveredBioId === memberId));
                          const rowClassName = `group transition-colors hover:bg-[#E3F4F9]${
                            hasBio
                              ? " cursor-pointer focus-within:bg-[#E3F4F9]"
                              : ""
                          }${inlineOpen ? " bg-[#00749C]/5" : ""}`;

                          return (
                            <Fragment key={memberId}>
                              <motion.tr
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.03 }}
                                className={rowClassName}
                                data-member-bio={memberId}
                                tabIndex={hasBio ? 0 : undefined}
                                aria-expanded={hasBio ? inlineOpen : undefined}
                                onMouseEnter={() => {
                                  if (!isMobile && hasBio) {
                                    setHoveredBioId(memberId);
                                  }
                                }}
                                onMouseLeave={(event) => {
                                  if (!isMobile) {
                                    const nextTarget = event.relatedTarget as HTMLElement | null;
                                    const stillWithin = nextTarget?.closest(
                                      `[data-member-bio="${memberId}"]`,
                                    );
                                    if (!stillWithin) {
                                      setHoveredBioId((current) =>
                                        current === memberId ? null : current,
                                      );
                                    }
                                  }
                                }}
                                onClick={() => handleMemberToggle(memberId, hasBio)}
                                onKeyDown={(event) => {
                                  if (!hasBio) {
                                    return;
                                  }
                                  const target = event.target as HTMLElement;
                                  if (target.closest("a, button")) {
                                    return;
                                  }
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    handleMemberToggle(memberId, hasBio);
                                  }
                                }}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="relative flex-shrink-0">
                                      <div className="relative h-14 w-14">
                                        {member.avatar_url ? (
                                          <>
                                            <img
                                              src={member.avatar_url}
                                              alt={member.nickname}
                                              className="h-14 w-14 rounded-full object-cover"
                                              onError={(e) => {
                                                console.error(
                                                  `Avatar failed to load for ${member.nickname}:`,
                                                  member.avatar_url,
                                                );
                                                e.currentTarget.style.display = "none";
                                                const placeholder =
                                                  e.currentTarget.nextElementSibling as HTMLElement;
                                                if (placeholder) placeholder.style.display = "flex";
                                              }}
                                            />
                                            <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#003B52] to-[#00749C] text-base font-bold text-white">
                                              {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#003B52] to-[#00B7D3] text-base font-bold text-white">
                                            {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[#1F1C1A]">
                                      {(member.role === "administrator" ||
                                        member.role === "staff") && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                          <Award size={10} />
                                          Staff
                                        </span>
                                      )}

                                      <span className="font-semibold text-[#1F1C1A]">
                                        {member.nickname}
                                      </span>

                                      {(member.custom_email || member.email) && (
                                        <a
                                          href={`mailto:${member.custom_email || member.email}`}
                                          title={member.custom_email || member.email}
                                          className="group/email relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#00749C]/10 text-[#00749C] transition hover:bg-white/20"
                                          onClick={(event) => event.stopPropagation()}
                                        >
                                          <Mail size={13} />
                                          <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#031926] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/email:opacity-100">
                                            {member.custom_email || member.email}
                                          </span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-4">
                                  {member.specialties && member.specialties.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                      {member.specialties.slice(0, 2).map((specialty) => (
                                        <span
                                          key={specialty}
                                          className="rounded-md bg-[#00749C]/10 px-2 py-1 text-xs font-medium text-[#00749C]"
                                        >
                                          {specialty}
                                        </span>
                                      ))}
                                      {member.specialties.length > 2 && (
                                        <span className="rounded-md bg-[#E8E1D9] px-2 py-1 text-xs font-medium text-[#5C5856]">
                                          +{member.specialties.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-[#9A9086]">—</span>
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  {member.position || member.company ? (
                                    <div className="flex flex-col gap-1">
                                      {member.position ? (
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#1F1C1A]">
                                          <Briefcase size={14} className="flex-shrink-0 text-[#00749C]" />
                                          <span>{member.position}</span>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-[#9A9086]">—</span>
                                      )}
                                      {member.company && (
                                        <div className="flex items-center gap-2 text-xs text-[#5C5856]">
                                          <Building2 size={12} className="flex-shrink-0 text-[#8E8580]" />
                                          <span>{member.company}</span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-[#9A9086]">—</span>
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center">
                                    {member.website ? (
                                      <a
                                        href={member.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={member.website}
                                        className="group/website relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#00749C]/20 bg-[#00749C]/10 text-[#00749C] transition hover:border-[#00B7D3]/40 hover:text-[#00B7D3]"
                                        onClick={(event) => event.stopPropagation()}
                                      >
                                        <Globe size={18} />
                                        <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#031926] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/website:opacity-100">
                                          {member.website.replace(/https?:\/\//, "")}
                                        </span>
                                      </a>
                                    ) : (
                                      <span className="text-sm text-[#9A9086]">—</span>
                                    )}
                                  </div>
                                </td>
                              </motion.tr>

                              {hasBio && (
                                <tr
                                  data-member-bio={memberId}
                                  onMouseEnter={() => {
                                    if (!isMobile) {
                                      setHoveredBioId(memberId);
                                    }
                                  }}
                                  onMouseLeave={(event) => {
                                    if (!isMobile) {
                                      const nextTarget = event.relatedTarget as HTMLElement | null;
                                      const stillWithin = nextTarget?.closest(
                                        `[data-member-bio="${memberId}"]`,
                                      );
                                      if (!stillWithin) {
                                        setHoveredBioId((current) =>
                                          current === memberId ? null : current,
                                        );
                                      }
                                    }
                                  }}
                                >
                                  <td colSpan={4} className="px-6 pb-4 pt-0">
                                    <div
                                      className={`overflow-hidden rounded-2xl border border-[#00749C]/25 bg-[#F5FCFF] text-sm text-[#1F1C1A] shadow-lg transition-all duration-200 ${
                                        inlineOpen
                                          ? "mt-3 max-h-80 scale-100 opacity-100"
                                          : "mt-0 max-h-0 scale-95 opacity-0 pointer-events-none"
                                      }`}
                                      onClick={() => handleMemberToggle(memberId, hasBio)}
                                    >
                                      <div className="flex items-center justify-between gap-3 border-b border-[#00749C]/15 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#00749C]">
                                        <span>Bio</span>
                                        <span className="text-[10px] font-medium text-[#5C5856]">
                                          클릭하거나 탭하면 닫혀요
                                        </span>
                                      </div>
                                      <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm leading-6 text-[#444140]">
                                        {trimmedBio}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-[#E1EBF0] bg-[#F3F8FA] px-6 py-3 text-xs text-[#5C5856]">
                    <span className="font-semibold text-[#1F1C1A]">Note:</span> "—" indicates information is unavailable or set to private by the user.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-[32px] border border-[#00749C]/15 bg-white/90 p-12 text-center shadow-xl shadow-[#012433]/10"
                >
                  <Users className="mx-auto mb-4 h-16 w-16 text-[#00749C]" />
                  <h3 className="mb-2 text-xl font-bold text-[#1F1C1A]">
                    No members found
                  </h3>
                  <p className="mb-6 text-[#5C5856]">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterSpecialty("all");
                      setSortBy("default");
                    }}
                    className="rounded-full bg-[#00749C] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#00749C]/30 transition hover:bg-[#00A4C8]"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
