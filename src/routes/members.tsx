import { useState } from "react";
import {
  Search,
  UserCheck,
  Users,
  Sparkles,
  Mail,
  Phone,
  Linkedin,
  Github,
  Twitter,
  Award,
  BookOpen,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useSiteStore, OfficeMember } from "@/lib/site-store";

export const Route = createFileRoute("/members")({
  head: () => ({
    meta: [
      { title: "Office Bearers & Student Leaders — TWA SHASC" },
      {
        name: "description",
        content:
          "Meet the office bearers, student leaders, committee chairs, and active student members powering Tech Wizard Association at Syed Hameedha Arts and Science College.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association members, TWA office bearers, DCA student leaders, SHASC computer applications students, Kilakarai coding association",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Tech Wizard Association — SHASC" },
      { property: "og:title", content: "Office Bearers & Student Leaders — TWA SHASC" },
      {
        property: "og:description",
        content: "Meet the office bearers and active members powering Tech Wizard Association.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/members" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/members" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://shasc.edu.in/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Members & Leaders",
                  item: "https://shasc.edu.in/members",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: MembersPage,
});

function Avatar({
  initials,
  avatarUrl,
  size = 12,
}: {
  initials: string;
  avatarUrl?: string;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        className="rounded-full object-cover ring-2 ring-primary/20 shadow-soft shrink-0"
        style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
      />
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-soft"
      style={{ height: `${size * 4}px`, width: `${size * 4}px` }}
    >
      {initials}
    </div>
  );
}

function MembersPage() {
  const { office, teams, site } = useSiteStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState<OfficeMember | null>(null);

  const allTeamMembers = teams.flatMap((t) => t.members.map((m) => ({ ...m, team: t.name })));

  const filteredMembers = allTeamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.team.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam =
      selectedTeamFilter === "All" || m.team.toLowerCase() === selectedTeamFilter.toLowerCase();

    return matchesSearch && matchesTeam;
  });

  const availableTeamNames = Array.from(new Set(allTeamMembers.map((m) => m.team)));

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">Members</div>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">The people who make {site.short}.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Students, faculty and alumni working shoulder to shoulder under {site.department}.
          </p>
        </div>
      </section>

      {/* Office Bearers & Leadership */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Leadership &amp; Advisory Council
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Office Bearers &amp; Advisors</h2>
            <p className="mt-1 text-muted-foreground text-sm max-w-2xl">
              The executive council and student advisors leading {site.short} with vision and
              excellence this academic year.
            </p>
          </div>
        </div>

        {office.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
            No office bearers or advisors added yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {office.map((m) => (
              <div
                key={m.id || m.name}
                onClick={() => setSelectedMember(m)}
                className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <Avatar initials={m.initials} avatarUrl={m.avatarUrl} size={14} />
                      <div>
                        <h3 className="font-display text-lg font-bold group-hover:text-primary transition-smooth">
                          {m.name}
                        </h3>
                        <p className="text-xs font-semibold text-primary">{m.role}</p>
                        {m.year && <p className="text-xs text-muted-foreground mt-0.5">{m.year}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {m.category || "Office Bearer"}
                    </span>
                    {m.termYears && (
                      <span className="inline-block rounded-md bg-muted px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                        Term: {m.termYears}
                      </span>
                    )}
                  </div>

                  {m.bio && (
                    <p className="mt-3 line-clamp-2 text-xs text-muted-foreground leading-relaxed italic">
                      "{m.bio}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                        title={m.email}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-smooth"
                        title={m.phone}
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    {m.linkedinUrl && (
                      <a
                        href={m.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-600/10 transition-smooth"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {m.githubUrl && (
                      <a
                        href={m.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
                        title="GitHub Profile"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {m.twitterUrl && (
                      <a
                        href={m.twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 transition-smooth"
                        title="Twitter Profile"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline">
                    View Profile <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-smooth"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4">
              <Avatar
                initials={selectedMember.initials}
                avatarUrl={selectedMember.avatarUrl}
                size={18}
              />
              <div className="space-y-1 pr-6">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {selectedMember.category || "Office Bearer"}
                </span>
                <h3 className="font-display text-2xl font-bold">{selectedMember.name}</h3>
                <p className="text-sm font-semibold text-primary">{selectedMember.role}</p>
                {selectedMember.year && (
                  <p className="text-xs text-muted-foreground">{selectedMember.year}</p>
                )}
                {selectedMember.termYears && (
                  <p className="text-xs font-mono text-muted-foreground">
                    Term: {selectedMember.termYears}
                  </p>
                )}
              </div>
            </div>

            {selectedMember.bio && (
              <div className="rounded-2xl bg-muted/30 p-4 text-xs text-foreground/90 leading-relaxed border border-border/50">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-1.5 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" /> Biography &amp; Vision
                </h4>
                {selectedMember.bio}
              </div>
            )}

            {selectedMember.achievements && (
              <div className="space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-500" /> Key Achievements &amp; Highlights
                </h4>
                <p className="text-xs text-muted-foreground bg-amber-500/5 rounded-xl p-3 border border-amber-500/20">
                  {selectedMember.achievements}
                </p>
              </div>
            )}

            {selectedMember.skills && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Key Skills &amp; Specializations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.skills.split(",").map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Contact Links */}
            <div className="pt-3 border-t border-border/80 flex flex-wrap items-center gap-2">
              {selectedMember.email && (
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              )}
              {selectedMember.phone && (
                <a
                  href={`tel:${selectedMember.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20"
                >
                  <Phone className="h-3.5 w-3.5" /> Call / WhatsApp
                </a>
              )}
              {selectedMember.linkedinUrl && (
                <a
                  href={selectedMember.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/20"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
              {selectedMember.githubUrl && (
                <a
                  href={selectedMember.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              )}
              {selectedMember.twitterUrl && (
                <a
                  href={selectedMember.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-500/20"
                >
                  <Twitter className="h-3.5 w-3.5" /> Twitter / X
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Team Members Directory */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Team Directory</h2>
              <p className="mt-1 text-muted-foreground text-sm">
                All active members across {site.short} wings ({allTeamMembers.length} members
                total).
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, role or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          {/* Team Filter Chips */}
          {availableTeamNames.length > 0 && (
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              <button
                onClick={() => setSelectedTeamFilter("All")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-smooth ${
                  selectedTeamFilter === "All"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-background text-muted-foreground hover:bg-accent"
                }`}
              >
                All Wings ({allTeamMembers.length})
              </button>
              {availableTeamNames.map((teamName) => {
                const count = allTeamMembers.filter((m) => m.team === teamName).length;
                return (
                  <button
                    key={teamName}
                    onClick={() => setSelectedTeamFilter(teamName)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-smooth ${
                      selectedTeamFilter === teamName
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border bg-background text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {teamName} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {filteredMembers.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-sm">
              No team members match your search or filter.
            </div>
          ) : (
            <div className="mt-6">
              {/* Mobile Card Layout */}
              <div className="grid gap-3 sm:hidden">
                {filteredMembers.map((m, idx) => (
                  <div
                    key={`mobile-${m.team}-${m.name}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-elevated p-4 shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar initials={m.initials} avatarUrl={m.avatarUrl} size={11} />
                      <div>
                        <div className="font-semibold text-sm">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.role}</div>
                        <span className="mt-1 inline-block rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                          {m.team}
                        </span>
                      </div>
                    </div>
                    {m.year && (
                      <div className="text-right text-[11px] font-mono text-muted-foreground shrink-0">
                        {m.year}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-soft">
                <table className="w-full text-left text-sm">
                  <thead className="bg-accent/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">Member</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Team</th>
                      <th className="px-6 py-3">Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredMembers.map((m, idx) => (
                      <tr
                        key={`desktop-${m.team}-${m.name}-${idx}`}
                        className="transition-smooth hover:bg-accent/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar initials={m.initials} avatarUrl={m.avatarUrl} size={9} />
                            <span className="font-semibold">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{m.role}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                            {m.team}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {m.year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
