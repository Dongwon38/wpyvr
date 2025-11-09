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
  Loader2
} from "lucide-react";
import { fetchAllMembers, type UserProfile } from "@/lib/profileApi";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="border-b border-gray-200 px-4 py-8 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="mb-3 text-3xl font-normal text-gray-900 dark:text-white">
              Community Members
            </h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {loading
                ? "Discovering who’s active in the community..."
                : `Connect with ${members.length} talented creators, developers, and designers in our community.`}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              {/* Search and Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search by name or nickname..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="text-gray-500" size={18} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="default">Default (Role & Activity)</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                    </select>
                  </div>

                  {/* Filter by Specialty */}
                  <div className="flex items-center gap-2">
                    <Filter className="text-gray-500" size={18} />
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Filters:
                    </span>
                    {searchQuery && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        Search: {searchQuery}
                      </span>
                    )}
                    {filterSpecialty !== "all" && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Specialty: {filterSpecialty}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterSpecialty("all");
                        setSortBy("default");
                      }}
                      className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredMembers.length} of {members.length} members
              </div>

              {/* Members Table */}
              {filteredMembers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative rounded-2xl bg-white shadow-md dark:bg-gray-800"
                >
                  <div className="overflow-x-auto md:overflow-visible">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Member
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Specialties
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Position / Company
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                            Website
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredMembers.map((member, index) => {
                          const trimmedBio =
                            typeof member.bio === "string" ? member.bio.trim() : "";
                          const hasBio = trimmedBio.length > 0;
                          const memberId = member.user_id ?? member.id ?? index;
                          const rowIsActive = activeBioId === memberId;
                          const inlineOpen =
                            hasBio &&
                            (rowIsActive || (!isMobile && hoveredBioId === memberId));
                          const rowClassName = `group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50${
                            hasBio
                              ? " cursor-pointer focus-within:bg-gray-50 dark:focus-within:bg-gray-700/50"
                              : ""
                          }${inlineOpen ? " bg-purple-50/40 dark:bg-purple-900/10" : ""}`;

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
                                              className="h-14 w-14 rounded-full object-cover"
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
                                            <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-base font-bold text-white">
                                              {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-base font-bold text-white">
                                            {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {(member.role === "administrator" || member.role === "staff") && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                          <Award size={10} />
                                          Staff
                                        </span>
                                      )}

                                      <span className="font-semibold text-gray-900 dark:text-white">
                                        {member.nickname}
                                      </span>

                                      {(member.custom_email || member.user_email) && (
                                        <a
                                          href={`mailto:${member.custom_email || member.user_email}`}
                                          title={member.custom_email || member.user_email}
                                          className="group/email relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-all hover:bg-purple-100 hover:text-purple-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
                                          onClick={(event) => event.stopPropagation()}
                                        >
                                          <Mail size={13} />
                                          <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/email:opacity-100 dark:bg-gray-700">
                                            {member.custom_email || member.user_email}
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
                                          className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                        >
                                          {specialty}
                                        </span>
                                      ))}
                                      {member.specialties.length > 2 && (
                                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                          +{member.specialties.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  {member.position || member.company ? (
                                    <div className="flex flex-col gap-1">
                                      {member.position ? (
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                          <Briefcase size={14} className="flex-shrink-0 text-purple-500" />
                                          <span>{member.position}</span>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                                      )}
                                      {member.company && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                          <Building2 size={12} className="flex-shrink-0 text-gray-400" />
                                          <span>{member.company}</span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
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
                                        className="group/website relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-purple-100 hover:text-purple-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-purple-900/30 dark:hover:text-purple-400"
                                        onClick={(event) => event.stopPropagation()}
                                      >
                                        <Globe size={18} />
                                        <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/website:opacity-100 dark:bg-gray-700">
                                          {member.website.replace(/https?:\/\//, "")}
                                        </span>
                                      </a>
                                    ) : (
                                      <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
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
                                      className={`overflow-hidden rounded-2xl border border-purple-200 bg-white/95 text-sm text-gray-700 shadow-lg transition-all duration-200 dark:border-purple-900/40 dark:bg-gray-900/90 dark:text-gray-200 ${
                                        inlineOpen
                                          ? "mt-2 max-h-80 scale-100 opacity-100"
                                          : "mt-0 max-h-0 scale-95 opacity-0 pointer-events-none"
                                      }`}
                                      onClick={() => handleMemberToggle(memberId, hasBio)}
                                    >
                                      <div className="flex items-center justify-between gap-3 border-b border-purple-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:border-purple-900/40 dark:text-purple-300">
                                        <span>Bio</span>
                                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
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

                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Note:</span> "—" indicates information is unavailable or set to private by the user.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl bg-white p-12 text-center shadow-md dark:bg-gray-800"
                >
                  <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    No members found
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterSpecialty("all");
                      setSortBy("default");
                    }}
                    className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
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
