"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
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

type StatusTagVariant = "looking_for_job" | "taking_on_projects";

const STATUS_TAG_BASE_CLASS =
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white";

const STATUS_TAG_CONFIG: Record<
  StatusTagVariant,
  { label: string; icon: LucideIcon; className: string }
> = {
  looking_for_job: {
    label: "Seeking",
    icon: Briefcase,
    className: "bg-amber-600",
  },
  taking_on_projects: {
    label: "Freelancing",
    icon: Sparkles,
    className: "bg-emerald-600",
  },
};

const STAFF_BADGE_CLASS =
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white bg-violet-700";

const StaffBadge = () => (
  <span className={STAFF_BADGE_CLASS}>
    <Award className="h-3 w-3" strokeWidth={2} />
    Staff
  </span>
);

const StatusTag = ({ variant }: { variant: StatusTagVariant }) => {
  const { label, icon: Icon, className } = STATUS_TAG_CONFIG[variant];
  return (
    <span className={`${STATUS_TAG_BASE_CLASS} ${className}`}>
      <Icon className="h-3 w-3" strokeWidth={2} />
      {label}
    </span>
  );
};

const ALLOWED_STATUS_VALUES: StatusTagVariant[] = [
  "looking_for_job",
  "taking_on_projects",
];

const getMemberStatusTags = (member: UserProfile): StatusTagVariant[] => {
  if (!Array.isArray(member.status)) {
    return [];
  }
  return member.status.filter((status): status is StatusTagVariant =>
    ALLOWED_STATUS_VALUES.includes(status as StatusTagVariant)
  );
};

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
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery) {
      filtered = filtered.filter(member => {
        const matchesName = member.nickname?.toLowerCase().includes(trimmedQuery);
        const matchesStatus = getMemberStatusTags(member).some((variant) => {
          const label = STATUS_TAG_CONFIG[variant].label.toLowerCase();
          if (label.includes(trimmedQuery)) return true;
          const slug = variant.replace(/_/g, " ");
          return slug.includes(trimmedQuery);
        });
        return Boolean(matchesName) || matchesStatus;
      });
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

  const isTargetInsideBioSection = (
    target: EventTarget | null,
    memberId: number
  ) => {
    if (!target) return false;
    if (target instanceof Element) {
      return Boolean(target.closest(`[data-member-bio="${memberId}"]`));
    }
    return false;
  };

    return (
      <div className="min-h-screen bg-white text-[#111111]">
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                <Users className="h-3 w-3 text-[#00749C]" />
                Members
              </span>
              <h1 className="text-3xl font-semibold leading-snug sm:text-4xl">
                Community Members
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-neutral-500">
                {loading
                  ? "Discovering who's active in the community..."
                  : `Connect with ${members.length} creators, developers, and designers in our chapter.`}
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
                  className="mb-6 rounded-sm border border-neutral-200 bg-white p-4 sm:p-6"
                >
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                      <input
                        type="text"
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full rounded-sm border border-neutral-300 bg-white py-2 pl-10 pr-4 text-sm text-[#111111] placeholder:text-neutral-500 focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
                      />
                    </div>
                  </div>

                  {/* Sort & Filter */}
                  <div className="flex gap-2">
                    {/* Sort */}
                      <div className="flex flex-1 items-center gap-2 sm:flex-initial">
                        <ArrowUpDown className="hidden text-neutral-500 sm:block" size={16} />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-[#111111] focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20 sm:text-sm"
                      >
                        <option value="default">Default</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                    </div>

                    {/* Filter by Specialty */}
                      <div className="flex flex-1 items-center gap-2 sm:flex-initial">
                        <Filter className="hidden text-neutral-500 sm:block" size={16} />
                      <select
                        value={filterSpecialty}
                        onChange={(e) => setFilterSpecialty(e.target.value)}
                          className="w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-[#111111] focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20 sm:text-sm"
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
                </div>

                {/* Active Filters Summary */}
                  {(searchQuery || filterSpecialty !== "all") && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-3">
                      <span className="text-xs font-semibold text-neutral-500">
                        Active:
                      </span>
                      {searchQuery && (
                        <span className="rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                          "{searchQuery}"
                        </span>
                      )}
                      {filterSpecialty !== "all" && (
                        <span className="rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                          {filterSpecialty}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilterSpecialty("all");
                          setSortBy("default");
                        }}
                        className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                      >
                        Clear
                      </button>
                    </div>
                  )}
              </motion.div>

              {/* Results Count */}
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-600">
                  {filteredMembers.length} of {members.length} members
                </span>
              </div>

              {/* Members List - Card Layout for Mobile, Table for Desktop */}
              {filteredMembers.length > 0 ? (
                <>
                  {/* Mobile Card View */}
                    <div className="space-y-4 md:hidden">
                      {filteredMembers.map((member, index) => {
                        const trimmedBio = typeof member.bio === "string" ? member.bio.trim() : "";
                        const hasBio = trimmedBio.length > 0;
                        const memberId = member.user_id ?? member.id ?? index;
                        const isExpanded = activeBioId === memberId;
                        const statusTags = getMemberStatusTags(member);
                        const isStaff = member.role === "administrator" || member.role === "staff";

                        return (
                          <motion.div
                            key={memberId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                {member.avatar_url ? (
                                  <img
                                    src={member.avatar_url}
                                    alt={member.nickname}
                                    className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (placeholder) placeholder.style.display = "flex";
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`${member.avatar_url ? "hidden" : "flex"} h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold uppercase text-white`}
                                >
                                  {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                </div>
                              </div>

                                <div className="min-w-0 flex-1">
                                  {(isStaff || statusTags.length > 0) && (
                                    <div className="mb-1 flex flex-wrap gap-1.5">
                                      {isStaff && <StaffBadge />}
                                      {statusTags.map((variant) => (
                                        <StatusTag key={variant} variant={variant} />
                                      ))}
                                    </div>
                                  )}
                                  <h3 className="truncate text-base font-semibold text-[#111111]">
                                    {member.nickname}
                                  </h3>

                                <div className="mt-2 flex items-center gap-1.5">
                                  {(member.custom_email || member.email) && (
                                    <a
                                      href={`mailto:${member.custom_email || member.email}`}
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Mail size={14} />
                                    </a>
                                  )}
                                  {member.website && (
                                    <a
                                      href={member.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Globe size={14} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {(member.position || member.company) && (
                              <div className="mt-3 space-y-1 border-t border-neutral-200 pt-3">
                                {member.position && (
                                  <div className="flex items-center gap-2 text-sm text-[#111111]">
                                    <Briefcase size={14} className="flex-shrink-0 text-neutral-500" />
                                    <span>{member.position}</span>
                                  </div>
                                )}
                                {member.company && (
                                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <Building2 size={12} className="flex-shrink-0 text-neutral-400" />
                                    <span>{member.company}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {member.specialties && member.specialties.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                  {member.specialties.slice(0, 3).map((specialty) => (
                                    <span
                                      key={specialty}
                                      className="rounded-sm border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700"
                                    >
                                      {specialty}
                                    </span>
                                  ))}
                                  {member.specialties.length > 3 && (
                                    <span className="rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-500">
                                      +{member.specialties.length - 3}
                                    </span>
                                  )}
                              </div>
                            )}

                            {hasBio && (
                              <>
                                <button
                                  onClick={() => handleMemberToggle(memberId, hasBio)}
                                  className="mt-3 w-full rounded-full border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900"
                                >
                                  {isExpanded ? "Hide Bio" : "Show Bio"}
                                </button>
                                {isExpanded && (
                                  <div className="mt-2 rounded-sm border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                                    {trimmedBio}
                                  </div>
                                )}
                              </>
                            )}
                          </motion.div>
                        );
                    })}
                  </div>

                  {/* Desktop Table View */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative hidden rounded-sm border border-neutral-200 bg-white md:block"
                    >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-sm font-semibold text-neutral-600">
                          <tr>
                              <th className="px-6 py-4">Member</th>
                              <th className="px-6 py-4">Specialties</th>
                              <th className="px-6 py-4">Position / Company</th>
                              <th className="px-6 py-4 text-center">Website</th>
                          </tr>
                        </thead>
                          <tbody className="divide-y divide-neutral-200">
                          {filteredMembers.map((member, index) => {
                              const trimmedBio = typeof member.bio === "string" ? member.bio.trim() : "";
                              const hasBio = trimmedBio.length > 0;
                              const memberId = member.user_id ?? member.id ?? index;
                              const rowIsActive = activeBioId === memberId;
                              const inlineOpen = hasBio && (rowIsActive || (!isMobile && hoveredBioId === memberId));
                              const statusTags = getMemberStatusTags(member);
                              const isStaff = member.role === "administrator" || member.role === "staff";
                              const rowClassName = `group transition-colors hover:bg-neutral-50${
                                hasBio ? " cursor-pointer" : ""
                              }${inlineOpen ? " bg-neutral-50" : ""}`;

                            return (
                              <Fragment key={memberId}>
                                <motion.tr
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.03 }}
                                  className={rowClassName}
                                  data-member-bio={memberId}
                                  tabIndex={hasBio ? 0 : undefined}
                                  onMouseEnter={() => {
                                    if (!isMobile && hasBio) setHoveredBioId(memberId);
                                  }}
                                  onMouseLeave={(event) => {
                                    if (isMobile || !hasBio) return;
                                    const stillWithin = isTargetInsideBioSection(event.relatedTarget, memberId);
                                    if (!stillWithin) {
                                      setHoveredBioId((current) => (current === memberId ? null : current));
                                    }
                                  }}
                                  onClick={() => handleMemberToggle(memberId, hasBio)}
                                  onKeyDown={(event) => {
                                    if (!hasBio) return;
                                    const target = event.target as HTMLElement;
                                    if (target.closest("a, button")) return;
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      handleMemberToggle(memberId, hasBio);
                                    }
                                  }}
                                >
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-4">
                                        <div className="relative flex-shrink-0">
                                          {member.avatar_url ? (
                                            <>
                                              <img
                                                src={member.avatar_url}
                                                alt={member.nickname}
                                              className="h-10 w-10 rounded-full object-cover ring-1 ring-neutral-200"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = "none";
                                                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                                  if (placeholder) placeholder.style.display = "flex";
                                                }}
                                              />
                                              <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-base font-semibold uppercase text-white">
                                                {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                              </div>
                                            </>
                                          ) : (
                                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-base font-semibold uppercase text-white">
                                              {member.nickname?.substring(0, 2).toUpperCase() || "UN"}
                                            </div>
                                          )}
                                        </div>

                                          <div className="flex flex-col gap-1">
                                            {(isStaff || statusTags.length > 0) && (
                                              <div className="flex flex-wrap gap-1.5">
                                                {isStaff && <StaffBadge />}
                                                {statusTags.map((variant) => (
                                                  <StatusTag key={variant} variant={variant} />
                                                ))}
                                              </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-[#111111]">{member.nickname}</span>
                                              {(member.custom_email || member.email) && (
                                                <a
                                                  href={`mailto:${member.custom_email || member.email}`}
                                                  title={member.custom_email || member.email}
                                                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <Mail size={13} />
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                      </div>
                                    </td>

                                    <td className="px-6 py-4">
                                      {member.specialties && member.specialties.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {member.specialties.slice(0, 2).map((specialty) => (
                                              <span
                                                key={specialty}
                                                className="rounded-sm border border-neutral-300 bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700"
                                              >
                                                {specialty}
                                              </span>
                                            ))}
                                            {member.specialties.length > 2 && (
                                              <span className="rounded-sm border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-500">
                                                +{member.specialties.length - 2}
                                              </span>
                                            )}
                                        </div>
                                      ) : (
                                        <span className="text-sm text-neutral-400">—</span>
                                      )}
                                    </td>

                                    <td className="px-6 py-4">
                                      {member.position || member.company ? (
                                        <div className="flex flex-col gap-1">
                                          {member.position ? (
                                            <div className="flex items-center gap-2 text-sm font-medium text-[#111111]">
                                              <Briefcase size={14} className="flex-shrink-0 text-neutral-500" />
                                              <span>{member.position}</span>
                                            </div>
                                          ) : (
                                            <span className="text-sm text-neutral-400">—</span>
                                          )}
                                          {member.company && (
                                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                                              <Building2 size={12} className="flex-shrink-0 text-neutral-400" />
                                              <span>{member.company}</span>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-sm text-neutral-400">—</span>
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
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <Globe size={18} />
                                          </a>
                                        ) : (
                                          <span className="text-sm text-neutral-400">—</span>
                                        )}
                                      </div>
                                    </td>
                                </motion.tr>

                                {hasBio && (
                                  <tr
                                    data-member-bio={memberId}
                                    onMouseEnter={() => {
                                      if (!isMobile) setHoveredBioId(memberId);
                                    }}
                                    onMouseLeave={(event) => {
                                      if (isMobile) return;
                                      const stillWithin = isTargetInsideBioSection(event.relatedTarget, memberId);
                                      if (!stillWithin) {
                                        setHoveredBioId((current) => (current === memberId ? null : current));
                                      }
                                    }}
                                  >
                                      <td colSpan={4} className="px-6 pb-4 pt-0">
                                        <div
                                          className={`overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 transition-all duration-200 ${
                                            inlineOpen
                                              ? "mt-2 max-h-80 scale-100 opacity-100"
                                              : "mt-0 max-h-0 scale-95 opacity-0 pointer-events-none"
                                          }`}
                                          onClick={() => handleMemberToggle(memberId, hasBio)}
                                        >
                                          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                                            <span>Bio</span>
                                            <span className="text-[10px] font-medium text-neutral-500">
                                              Click or tap to close
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

                      <div className="border-t border-neutral-200 bg-white px-6 py-3">
                        <p className="text-xs text-neutral-500">
                          <span className="font-semibold text-neutral-700">Note:</span> "—" indicates information is unavailable or private.
                        </p>
                      </div>
                  </motion.div>
                </>
              ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-sm border border-neutral-200 bg-white p-12 text-center"
                  >
                    <Users className="mx-auto mb-4 h-16 w-16 text-neutral-200" />
                    <h3 className="mb-2 text-xl font-semibold text-[#111111]">
                      No members found
                    </h3>
                    <p className="mb-6 text-neutral-500">
                      Try adjusting your search or filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterSpecialty("all");
                        setSortBy("default");
                      }}
                      className="rounded-full border border-neutral-900 px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
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
