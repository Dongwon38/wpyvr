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
  Sparkles
} from "lucide-react";
import { fetchAllMembers, type UserProfile } from "@/lib/profileApi";
import LoadingSpinner from "@/components/LoadingSpinner";

type SortOption = "default" | "name-asc" | "name-desc";

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
        console.error('Failed to load members:', error);
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
    members.forEach(member => {
      if (member.specialties) {
        member.specialties.forEach(specialty => specialtiesSet.add(specialty));
      }
    });
    return Array.from(specialtiesSet).sort();
  }, [members]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (filterSpecialty !== "all") {
      filtered = filtered.filter(member =>
        member.specialties && member.specialties.includes(filterSpecialty)
      );
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => (a.nickname || '').localeCompare(b.nickname || ''));
        break;
      case "name-desc":
        filtered.sort((a, b) => (b.nickname || '').localeCompare(a.nickname || ''));
        break;
      case "default":
      default:
        // Sort by role (staff first), then by most recent activity
        filtered.sort((a, b) => {
          const roleOrder: Record<string, number> = { administrator: 0, staff: 1, subscriber: 2, member: 3 };
          const aRoleOrder = roleOrder[a.role || 'member'] ?? 3;
          const bRoleOrder = roleOrder[b.role || 'member'] ?? 3;
          
          if (aRoleOrder !== bRoleOrder) {
            return aRoleOrder - bRoleOrder;
          }
          // Most recent first (descending order)
          const aTime = a.last_active_at ? new Date(a.last_active_at).getTime() : 0;
          const bTime = b.last_active_at ? new Date(b.last_active_at).getTime() : 0;
          return bTime - aTime;
        });
        break;
    }

    return filtered;
  }, [members, searchQuery, sortBy, filterSpecialty]);

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section with Gradient */}
      <section className="relative isolate overflow-hidden border-b border-[#00749C]/10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(135deg, #003B52 0%, #00749C 55%, #00B7D3 100%)",
          }}
        />
        <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#00B4D8]/20 blur-3xl" />
        <div className="absolute right-8 top-12 h-48 w-48 rounded-full bg-[#0390B8]/15 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 backdrop-blur-sm">
              <Users className="h-3.5 w-3.5" />
              Community
            </span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              Community Members
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/85">
              {loading
                ? "Discovering who's active in the community..."
                : `Connect with ${members.length} talented creators, developers, and designers in our community.`}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Search and Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 rounded-3xl border border-[#00749C]/10 bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00749C]/60" size={20} />
                      <input
                        type="text"
                        placeholder="Search by name or nickname..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] py-2.5 pl-10 pr-4 text-[#444140] placeholder-[#444140]/50 focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="text-[#00749C]" size={18} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-2.5 text-sm font-medium text-[#444140] focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
                    >
                      <option value="default">Default (Role & Activity)</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                    </select>
                  </div>

                  {/* Filter by Specialty */}
                  <div className="flex items-center gap-2">
                    <Filter className="text-[#00749C]" size={18} />
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-2.5 text-sm font-medium text-[#444140] focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
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

                {/* Active Filters Summary */}
                {(searchQuery || filterSpecialty !== "all") && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#00749C]/10 pt-4">
                    <span className="text-sm font-semibold text-[#444140]/70">
                      Active Filters:
                    </span>
                    {searchQuery && (
                      <span className="rounded-full border border-[#00749C]/30 bg-[#00749C]/10 px-3 py-1 text-xs font-medium text-[#00749C]">
                        Search: {searchQuery}
                      </span>
                    )}
                    {filterSpecialty !== "all" && (
                      <span className="rounded-full border border-[#00749C]/30 bg-[#00749C]/10 px-3 py-1 text-xs font-medium text-[#00749C]">
                        Specialty: {filterSpecialty}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterSpecialty("all");
                        setSortBy("default");
                      }}
                      className="text-xs font-medium text-[#444140]/60 hover:text-[#444140]"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Results Count */}
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00749C]" />
                <span className="text-sm font-medium text-[#444140]/70">
                  Showing {filteredMembers.length} of {members.length} members
                </span>
              </div>

              {/* Members Table */}
              {filteredMembers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative rounded-3xl border border-[#00749C]/10 bg-white shadow-xl"
                >
                  <div className="overflow-x-auto md:overflow-visible">
                    <table className="w-full">
                      <thead className="border-b border-[#00749C]/10 bg-gradient-to-r from-[#00749C]/5 to-[#00B7D3]/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-[#00749C]">
                            Member
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-[#00749C]">
                            Specialties
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-[#00749C]">
                            Position / Company
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-[#00749C]">
                            Website
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#00749C]/5">
                        {filteredMembers.map((member, index) => {
                          const trimmedBio =
                            typeof member.bio === "string" ? member.bio.trim() : "";
                          const hasBio = trimmedBio.length > 0;
                          const memberId = member.user_id ?? member.id ?? index;
                          const rowIsActive = activeBioId === memberId;
                          const inlineOpen =
                            hasBio &&
                            (rowIsActive || (!isMobile && hoveredBioId === memberId));
                          const rowClassName = `group transition-colors hover:bg-[#00749C]/5${
                            hasBio
                              ? " cursor-pointer focus-within:bg-[#00749C]/5"
                              : ""
                          }${inlineOpen ? " bg-[#00B7D3]/10" : ""}`;

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
                                      `[data-member-bio="${memberId}"]`
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
                                {/* Member Info */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="relative flex-shrink-0">
                                      <div className="relative h-14 w-14">
                                        {member.avatar_url ? (
                                          <>
                                            <img
                                              src={member.avatar_url}
                                              alt={member.nickname}
                                              className="h-14 w-14 rounded-full object-cover ring-2 ring-[#00749C]/20"
                                              onError={(e) => {
                                                console.error(
                                                  `❌ Avatar failed to load for ${member.nickname}:`,
                                                  member.avatar_url
                                                );
                                                e.currentTarget.style.display = "none";
                                                const placeholder =
                                                  e.currentTarget.nextElementSibling as HTMLElement;
                                                if (placeholder) placeholder.style.display = "flex";
                                              }}
                                              onLoad={() => {
                                                console.log(`✅ Avatar loaded for ${member.nickname}`);
                                              }}
                                            />
                                            <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00749C] to-[#00B7D3] text-base font-bold text-white">
                                              {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00749C] to-[#00B7D3] text-base font-bold text-white">
                                            {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {(member.role === "administrator" || member.role === "staff") && (
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                          <Award size={10} />
                                          Staff
                                        </span>
                                      )}

                                      <span className="font-semibold text-[#444140]">
                                        {member.nickname}
                                      </span>

                                      {(member.custom_email || member.email) && (
                                        <a
                                          href={`mailto:${member.custom_email || member.email}`}
                                          title={member.custom_email || member.email}
                                          className="group/email relative inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#00749C]/10 text-[#00749C] transition-all hover:bg-[#00749C] hover:text-white"
                                          onClick={(event) => event.stopPropagation()}
                                        >
                                          <Mail size={13} />
                                          <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#444140] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/email:opacity-100">
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
                                          className="rounded-lg border border-[#00749C]/30 bg-[#00749C]/10 px-2 py-1 text-xs font-medium text-[#00749C]"
                                        >
                                          {specialty}
                                        </span>
                                      ))}
                                      {member.specialties.length > 2 && (
                                        <span className="rounded-lg border border-[#444140]/20 bg-[#444140]/5 px-2 py-1 text-xs font-medium text-[#444140]/70">
                                          +{member.specialties.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-[#444140]/40">—</span>
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  {member.position || member.company ? (
                                    <div className="flex flex-col gap-1">
                                      {member.position ? (
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#444140]">
                                          <Briefcase size={14} className="flex-shrink-0 text-[#00749C]" />
                                          <span>{member.position}</span>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-[#444140]/40">—</span>
                                      )}
                                      {member.company && (
                                        <div className="flex items-center gap-2 text-xs text-[#444140]/70">
                                          <Building2 size={12} className="flex-shrink-0 text-[#444140]/50" />
                                          <span>{member.company}</span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-[#444140]/40">—</span>
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
                                        className="group/website relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#00749C]/10 text-[#00749C] transition-all hover:bg-gradient-to-r hover:from-[#00749C] hover:to-[#00B7D3] hover:text-white"
                                        onClick={(event) => event.stopPropagation()}
                                      >
                                        <Globe size={18} />
                                        <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#444140] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/website:opacity-100">
                                          {member.website.replace(/https?:\/\//, "")}
                                        </span>
                                      </a>
                                    ) : (
                                      <span className="text-sm text-[#444140]/40">—</span>
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
                                        `[data-member-bio="${memberId}"]`
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
                                      className={`overflow-hidden rounded-2xl border border-[#00749C]/20 bg-gradient-to-br from-[#00749C]/5 to-[#00B7D3]/5 text-sm text-[#444140] shadow-lg transition-all duration-200 ${
                                        inlineOpen
                                          ? "mt-2 max-h-80 scale-100 opacity-100"
                                          : "mt-0 max-h-0 scale-95 opacity-0 pointer-events-none"
                                      }`}
                                      onClick={() => handleMemberToggle(memberId, hasBio)}
                                    >
                                      <div className="flex items-center justify-between gap-3 border-b border-[#00749C]/20 bg-white/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#00749C]">
                                        <span>Bio</span>
                                        <span className="text-[10px] font-medium text-[#444140]/50">
                                          클릭하거나 탭하면 닫혀요
                                        </span>
                                      </div>
                                      <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm leading-6">
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

                  <div className="border-t border-[#00749C]/10 bg-[#FFFDF9] px-6 py-3">
                    <p className="text-xs text-[#444140]/60">
                      <span className="font-medium">Note:</span> "—" indicates information is unavailable or set to private by the user.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-[#00749C]/10 bg-white p-12 text-center shadow-lg"
                >
                  <Users className="mx-auto mb-4 h-16 w-16 text-[#00749C]/40" />
                  <h3 className="mb-2 text-xl font-bold text-[#444140]">
                    No members found
                  </h3>
                  <p className="mb-6 text-[#444140]/70">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterSpecialty("all");
                      setSortBy("default");
                    }}
                    className="rounded-xl bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
                  >
                    Clear Filters
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
