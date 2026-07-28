import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Code2, Cpu, Rocket, Users, Target } from "lucide-react";
import { useSiteStore } from "@/lib/site-store";

function AnimatedStat({ value }: { value: string }) {
  const [displayNum, setDisplayNum] = useState(0);
  const match = value.match(/^(\d+)(.*)$/);
  const targetNum = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : value;

  useEffect(() => {
    if (targetNum === null) return;
    let current = 0;
    const duration = 1200;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = targetNum / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNum) {
        setDisplayNum(targetNum);
        clearInterval(timer);
      } else {
        setDisplayNum(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetNum]);

  if (targetNum === null) {
    return <span>{value}</span>;
  }

  return (
    <span>
      {displayNum}
      {suffix}
    </span>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tech Wizard Association — Department of Computer Applications | SHASC" },
      {
        name: "description",
        content:
          "Official platform of Tech Wizard Association (TWA), Department of Computer Applications at Syed Hameedha Arts and Science College, Kilakarai. Explore academic programs (BCA, MCA, Ph.D), student wings, hackathons, and tech projects.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association, TWA, Department of Computer Applications, DCA SHASC, Syed Hameedha Arts and Science College, BCA course, MCA degree, Ph.D Computer Applications, Kilakarai college, student coding association, Tamil Nadu tech club",
      },
      { name: "author", content: "Department of Computer Applications, SHASC" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: "Tech Wizard Association — SHASC" },
      {
        property: "og:title",
        content: "Tech Wizard Association — Department of Computer Applications | SHASC",
      },
      {
        property: "og:description",
        content:
          "A vibrant student community of coders, designers, and innovators shipping real-world tech under the Department of Computer Applications.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tech Wizard Association — SHASC" },
      {
        name: "twitter:description",
        content:
          "A vibrant student community of coders, designers, and innovators shipping real-world tech.",
      },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EducationalOrganization",
              "@id": "https://shasc.edu.in/#organization",
              name: "Department of Computer Applications",
              alternateName: "DCA SHASC",
              url: "https://shasc.edu.in",
              description:
                "Department of Computer Applications at Syed Hameedha Arts and Science College offering BCA, MCA, and Research programs alongside Tech Wizard Association student community.",
              parentOrganization: {
                "@type": "CollegeOrUniversity",
                name: "Syed Hameedha Arts and Science College",
                url: "https://shasc.edu.in",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Kilakarai",
                  addressRegion: "Tamil Nadu",
                  postalCode: "623517",
                  addressCountry: "IN",
                },
              },
            },
            {
              "@type": "WebSite",
              "@id": "https://shasc.edu.in/#website",
              url: "https://shasc.edu.in",
              name: "Tech Wizard Association",
              publisher: { "@id": "https://shasc.edu.in/#organization" },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://shasc.edu.in/events?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://shasc.edu.in",
                },
              ],
            },
            {
              "@type": "EducationalOccupationalProgram",
              name: "Bachelor of Computer Applications (BCA)",
              educationalProgramMode: "Full-time",
              educationalCredentialAwarded: "BCA Degree",
              programPrerequisites: "10+2 with Mathematics or Computer Science",
              timeToComplete: "P3Y",
              provider: { "@id": "https://shasc.edu.in/#organization" },
            },
            {
              "@type": "EducationalOccupationalProgram",
              name: "Master of Computer Applications (MCA)",
              educationalProgramMode: "Full-time",
              educationalCredentialAwarded: "MCA Degree",
              programPrerequisites:
                "Graduation with 50% aggregate and Mathematics at 10+2 or degree level",
              timeToComplete: "P2Y",
              provider: { "@id": "https://shasc.edu.in/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { site, stats, teams, departmentInfo, isAuthenticated } = useSiteStore();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.85_0.02_255/0.4)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.85_0.02_255/0.4)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Powered by {site.department} · {site.college}
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
            Where student <span className="text-gradient">technologists</span> come to build.
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base text-muted-foreground sm:text-lg leading-relaxed">
            {site.name} is the student-led tech community under {site.department}. We ship projects,
            host hackathons, run tech wings, and shape future tech careers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-lg sm:max-w-none mx-auto">
            <Link
              to="/teams"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow hover:scale-105"
            >
              Explore Teams <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/members"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-6 py-3.5 text-sm font-semibold transition-smooth hover:bg-accent hover:border-primary/40"
            >
              Meet the Members
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3.5 text-sm font-semibold text-primary transition-smooth hover:bg-primary/20"
            >
              Upcoming Events
            </Link>
          </div>

          {stats.length > 0 && (
            <dl className="mt-12 sm:mt-16 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 max-w-4xl mx-auto rounded-2xl border border-border bg-surface-elevated/80 p-4 sm:p-6 shadow-soft backdrop-blur-sm">
              {stats.map((s) => (
                <div key={s.label} className="p-1 sm:p-2">
                  <dt className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl sm:text-3xl font-bold text-gradient">
                    <AnimatedStat value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">
            What we do
          </div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">A launchpad for makers.</h2>
          <p className="mt-3 text-muted-foreground">
            From your first commit to your first conference talk — {site.short} is the space to
            learn loudly, ship fast and grow together.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Code2,
              title: "Build",
              desc: "Weekly project sprints across web, mobile and AI.",
            },
            {
              icon: Users,
              title: "Collaborate",
              desc: "Cross-team squads that mirror real-world engineering.",
            },
            {
              icon: Rocket,
              title: "Launch",
              desc: "Ship real products at CodeStorm and internal demo days.",
            },
            {
              icon: Cpu,
              title: "Learn",
              desc: "Bootcamps on cutting-edge tools from industry mentors.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEPARTMENT OVERVIEW SECTION */}
      <section className="border-y border-border bg-surface-elevated/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Academic Foundation
              </div>
              <h2 className="mt-3 text-2xl font-bold sm:text-4xl font-display">
                {site.department}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {departmentInfo.overview ||
                  `Housed within ${site.college}, the Department of Computer Applications shapes the next generation of software engineers, AI developers, and tech pioneers.`}
              </p>

              {departmentInfo.vision && (
                <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 p-5 shadow-xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Department Vision
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                    "{departmentInfo.vision}"
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/department"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition-smooth hover:scale-105"
                >
                  Explore Department Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              {/* Quick Academic Highlights */}
              <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Offered Academic Programs
                  </div>
                  <Link
                    to="/department"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Details <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {(departmentInfo.programs || []).map((p) => (
                    <div
                      key={p.code}
                      className="rounded-xl border border-border/80 bg-background/80 p-3.5 shadow-xs transition-smooth hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-bold text-sm text-foreground">
                          {p.code} · {p.name}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                          {p.years.split("·")[0]}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.desc}</p>
                      {p.eligibility && (
                        <div className="mt-2 text-[11px] text-muted-foreground/90 bg-muted/30 rounded-lg p-2 font-medium">
                          <strong className="text-foreground font-semibold">Eligibility:</strong>{" "}
                          {p.eligibility}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAMS PREVIEW */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-primary">
                Specialized Teams
              </div>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Find your wing.</h2>
            </div>
            <Link
              to="/teams"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View all teams <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface-elevated/50 p-10 text-center text-muted-foreground text-sm">
              No team wings created yet.
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teams.slice(0, 6).map((t) => (
                <Link
                  key={t.slug}
                  to="/teams"
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant`}
                >
                  <div
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${t.color} opacity-0 transition-smooth group-hover:opacity-100`}
                  />
                  <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Team
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold">{t.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Lead · {t.lead}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      {t.members.length} members
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-elegant sm:p-16">
          <div className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,white/20_1px,transparent_1px),linear-gradient(to_bottom,white/20_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>
          <div className="relative flex flex-col items-center">
            <img
              src={site.logoUrl}
              alt={site.name}
              className="h-20 w-20 rounded-full bg-white/10 p-1 object-contain shadow-lg ring-2 ring-white/40 mb-4"
            />
            <h2 className="text-3xl font-bold sm:text-4xl">Get in Touch with {site.short}</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              {site.department} · {site.college}
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-elegant transition-smooth hover:scale-105"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
