"use client";

import { useState, useMemo } from "react";
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
  Star,
  Award,
  User as UserIcon
} from "lucide-react";
import { mockUsers, getAllSpecialties, type User } from "@/lib/mockData";

type SortOption = "default" | "name-asc" | "name-desc";
type FilterMemberType = "all" | "member" | "expert";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filterMemberType, setFilterMemberType] = useState<FilterMemberType>("all");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");

  const allSpecialties = useMemo(() => getAllSpecialties(), []);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = [...mockUsers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Member type filter
    if (filterMemberType !== "all") {
      filtered = filtered.filter(member => member.memberType === filterMemberType);
    }

    // Specialty filter
    if (filterSpecialty !== "all") {
      filtered = filtered.filter(member =>
        member.specialties.includes(filterSpecialty)
      );
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "default":
      default:
        // Sort by role (staff first), then by last active
        filtered.sort((a, b) => {
          const roleOrder = { admin: 0, staff: 1, member: 2 };
          if (roleOrder[a.role] !== roleOrder[b.role]) {
            return roleOrder[a.role] - roleOrder[b.role];
          }
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        });
        break;
    }

    return filtered;
  }, [mockUsers, searchQuery, sortBy, filterMemberType, filterSpecialty]);

  const getMemberBadge = (member: User) => {
    if (member.role === "staff") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white">
          <Award size={12} />
          Staff
        </span>
      );
    }
    if (member.memberType === "expert") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white">
          <Star size={12} />
          Expert
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
        <UserIcon size={12} />
        Member
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <Users className="text-purple-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Community Members
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect with {mockUsers.length} talented creators, developers, and designers in our community
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800"
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

            {/* Filter by Member Type */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-500" size={18} />
              <select
                value={filterMemberType}
                onChange={(e) => setFilterMemberType(e.target.value as FilterMemberType)}
                className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Members</option>
                <option value="member">Regular Members</option>
                <option value="expert">Experts</option>
              </select>
            </div>

            {/* Filter by Specialty */}
            <div className="flex items-center gap-2">
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
          {(searchQuery || filterMemberType !== "all" || filterSpecialty !== "all") && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Filters:
              </span>
              {searchQuery && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  Search: {searchQuery}
                </span>
              )}
              {filterMemberType !== "all" && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Type: {filterMemberType}
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
                  setFilterMemberType("all");
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
          Showing {filteredMembers.length} of {mockUsers.length} members
        </div>

        {/* Members Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl dark:bg-gray-800"
              >
                {/* Member Badge - Top Right */}
                <div className="absolute right-4 top-4">
                  {getMemberBadge(member)}
                </div>

                {/* Avatar and Basic Info */}
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold text-white">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{member.nickname}
                    </p>
                  </div>
                </div>

                {/* Position */}
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Briefcase size={16} className="flex-shrink-0 text-purple-500" />
                  <span className="font-medium">{member.position}</span>
                </div>

                {/* Bio */}
                <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      >
                        {specialty}
                      </span>
                    ))}
                    {member.specialties.length > 3 && (
                      <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        +{member.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                  {member.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building2 size={14} className="flex-shrink-0" />
                      <span className="truncate">{member.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} className="flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe size={14} className="flex-shrink-0 text-gray-600 dark:text-gray-400" />
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        {member.website.replace(/https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors group-hover:border-purple-500/20" />
              </motion.div>
            ))}
          </div>
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
                setFilterMemberType("all");
                setFilterSpecialty("all");
                setSortBy("default");
              }}
              className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
