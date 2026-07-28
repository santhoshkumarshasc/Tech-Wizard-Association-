import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  CalendarHeart,
  Globe,
  Palette,
  PenLine,
  ShieldCheck,
  Code,
  Terminal,
  Users,
  Sparkles,
  Cpu,
  Smartphone,
  Layers,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { useSiteStore } from "@/lib/site-store";

const icons: Record<string, LucideIcon> = {
  Globe,
  Brain,
  ShieldCheck,
  Palette,
  CalendarHeart,
  PenLine,
  Code,
  Terminal,
  Users,
  Sparkles,
  Cpu,
  Smartphone,
  Layers,
  Rocket,
};

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Specialized Technical Wings & Squads — TWA SHASC" },
      {
        name: "description",
        content:
          "Explore the specialized technical wings (AI & ML, Web Engineering, Cybersecurity & CTF, Mobile App Studio, UI/UX Design) and project squads of Tech Wizard Association.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association teams, tech wings, AI wing, web dev squad, cybersecurity wing, SHASC, Department of Computer Applications, coding wings",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Tech Wizard Association — SHASC" },
      { property: "og:title", content: "Specialized Wings — Tech Wizard Association | SHASC" },
      {
        property: "og:description",
        content: "Discover and join the specialized tech wings of Tech Wizard Association.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/teams" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/teams" }],
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
                  name: "Specialized Teams",
                  item: "https://shasc.edu.in/teams",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: TeamsPage,
});

function Avatar({ initials, avatarUrl }: { initials: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary/20 shadow-soft"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground shadow-soft">
      {initials}
    </div>
  );
}

function TeamsPage() {
  const { teams, site } = useSiteStore();

  return (
    <div>
      {/* Hero Header */}
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">
                Teams &amp; Wings
              </div>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                Specialized Squads. One Community.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Each {site.short} team runs independently — with its own lead, rituals and roadmap —
                building impactful projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {teams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="font-bold text-xl text-foreground">No Team Wings Created Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Team wings will appear here as they are created.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {teams.map((t) => {
              const Icon = icons[t.icon] ?? Globe;

              return (
                <article
                  key={t.slug}
                  className="relative overflow-hidden rounded-3xl border border-border bg-surface-elevated p-6 sm:p-8 shadow-soft transition-smooth hover:shadow-elegant"
                >
                  <div
                    className={`absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br ${t.color} blur-3xl`}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="font-display text-2xl font-bold">{t.name}</h2>
                          {t.lead && (
                            <p className="text-xs font-mono text-muted-foreground">
                              Lead · {t.lead}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-muted-foreground text-sm">{t.description}</p>

                    {/* Members List */}
                    <div className="mt-6">
                      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Members ({t.members.length})</span>
                      </div>
                      {t.members.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic rounded-xl border border-border/40 bg-background/40 p-4 text-center">
                          No members assigned to this team wing yet.
                        </div>
                      ) : (
                        <ul className="space-y-2.5">
                          {t.members.map((m, idx) => (
                            <li
                              key={`${m.name}-${idx}`}
                              className="group/item flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 transition-smooth hover:border-border"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar initials={m.initials} avatarUrl={m.avatarUrl} />
                                <div>
                                  <div className="text-sm font-semibold">{m.name}</div>
                                  <div className="text-xs text-muted-foreground">{m.role}</div>
                                </div>
                              </div>

                              {m.year && (
                                <span className="text-xs font-mono text-muted-foreground bg-accent/40 px-2 py-0.5 rounded-md">
                                  {m.year}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
