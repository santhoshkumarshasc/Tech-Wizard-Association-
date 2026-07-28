import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Target,
  CheckCircle2,
  UserCheck,
  Users,
  Mail,
  Award,
  Briefcase,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  Clock,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useSiteStore, ProgramItem } from "@/lib/site-store";

export const Route = createFileRoute("/department")({
  head: () => ({
    meta: [
      { title: "Offered Academic Programs & Department — DCA | SHASC" },
      {
        name: "description",
        content:
          "Explore detailed academic programs (BCA 3-Year UG, MCA 2-Year PG, Ph.D Doctoral Research), eligibility criteria, curriculum focus, lab access, and career prospects at the Department of Computer Applications, Syed Hameedha Arts and Science College.",
      },
      {
        name: "keywords",
        content:
          "Department of Computer Applications, DCA SHASC, BCA course details, MCA degree syllabus, Ph.D Computer Applications, Syed Hameedha Arts and Science College, BCA eligibility, MCA admissions, Tech Wizard Association, Kilakarai college",
      },
      { name: "author", content: "Department of Computer Applications, SHASC" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { property: "og:site_name", content: "Department of Computer Applications — SHASC" },
      { property: "og:title", content: "Offered Academic Programs & Department — DCA | SHASC" },
      {
        property: "og:description",
        content:
          "Comprehensive details on BCA, MCA & Doctoral research programs, eligibility, course highlights, labs, and faculty at DCA SHASC.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/department" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Offered Academic Programs — DCA SHASC" },
      {
        name: "twitter:description",
        content:
          "Explore BCA, MCA, and Research opportunities at Syed Hameedha Arts and Science College.",
      },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/department" }],
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
                  name: "Department & Academic Programs",
                  item: "https://shasc.edu.in/department",
                },
              ],
            },
            {
              "@type": "EducationalOrganization",
              name: "Department of Computer Applications",
              alternateName: "DCA SHASC",
              url: "https://shasc.edu.in/department",
              parentOrganization: {
                "@type": "CollegeOrUniversity",
                name: "Syed Hameedha Arts and Science College",
              },
            },
            {
              "@type": "EducationalOccupationalProgram",
              name: "Bachelor of Computer Applications (BCA)",
              description: "3-Year Undergraduate Program in Computer Applications",
              educationalCredentialAwarded: "BCA Degree",
              programPrerequisites: "10+2 with Mathematics/Computer Science",
              timeToComplete: "P3Y",
            },
            {
              "@type": "EducationalOccupationalProgram",
              name: "Master of Computer Applications (MCA)",
              description: "2-Year Postgraduate Program in Advanced Computing & AI",
              educationalCredentialAwarded: "MCA Degree",
              programPrerequisites:
                "BCA / B.Sc Computer Science or equivalent degree with 50% aggregate",
              timeToComplete: "P2Y",
            },
          ],
        }),
      },
    ],
  }),
  component: DepartmentPage,
});

function DepartmentPage() {
  const { site, departmentInfo } = useSiteStore();
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary">
                The Department
              </div>
              <h1 className="mt-2 text-3xl font-bold sm:text-5xl">{site.department}</h1>
              <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                {departmentInfo.overview ||
                  `Housed within ${site.college}, the Department of Computer Applications nurtures technologists through rigorous academics, hands-on projects and a vibrant student community.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOD / Department Head Message if available */}
      {departmentInfo.hodName && (
        <section className="border-b border-border bg-surface-elevated/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center gap-6">
              {departmentInfo.hodPhotoUrl ? (
                <img
                  src={departmentInfo.hodPhotoUrl}
                  alt={departmentInfo.hodName}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-primary/30 shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md">
                  <UserCheck className="h-10 w-10" />
                </div>
              )}
              <div>
                <div className="text-xs uppercase font-semibold text-primary tracking-wider">
                  Department Leadership
                </div>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold">
                  {departmentInfo.hodName}
                </h2>
                <div className="text-xs text-muted-foreground font-medium">
                  {departmentInfo.hodRole || "Head of Department"}
                </div>
                {departmentInfo.hodMessage && (
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground italic leading-relaxed">
                    "{departmentInfo.hodMessage}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Faculty Members Section */}
      {departmentInfo.faculty && departmentInfo.faculty.length > 0 && (
        <section className="border-b border-border bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Users className="h-4 w-4" /> Department Academic Staff
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold">Faculty Members</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Dedicated professors and mentors shaping student careers in Computer Applications.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {departmentInfo.faculty.map((f) => (
                <div
                  key={f.id || f.name}
                  className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft transition-smooth hover:shadow-elegant flex items-start gap-4"
                >
                  {f.photoUrl ? (
                    <img
                      src={f.photoUrl}
                      alt={f.name}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-primary/20 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg shadow-xs">
                      {f.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base text-foreground leading-snug">
                      {f.name}
                    </h3>
                    <div className="text-xs font-semibold text-primary">{f.designation}</div>
                    {f.qualification && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Award className="h-3 w-3 shrink-0 text-amber-500" />
                        <span className="truncate">{f.qualification}</span>
                      </div>
                    )}
                    {f.email && (
                      <div className="pt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3 shrink-0 text-primary" />
                        <a href={`mailto:${f.email}`} className="hover:underline truncate">
                          {f.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 shadow-soft">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-xs">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold">Our Vision</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {departmentInfo.vision}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-elevated p-6 sm:p-8 shadow-soft">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold">Our Mission</h2>
            <ul className="mt-3 space-y-2.5 text-sm sm:text-base text-muted-foreground">
              {departmentInfo.mission.map((m, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span className="leading-snug">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Offered Academic Programs With More Details */}
      {departmentInfo.programs && departmentInfo.programs.length > 0 && (
        <section className="bg-surface py-16 sm:py-20 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <GraduationCap className="h-3.5 w-3.5" /> Department Degrees
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-display mt-2">
                  Offered Academic Programs
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
                  Comprehensive undergraduate, postgraduate, and doctoral degrees conducting
                  in-depth computing curriculum, state-of-the-art lab access, and placement
                  pathways.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {departmentInfo.programs.map((p, idx) => (
                <div
                  key={p.code || idx}
                  className="group rounded-3xl border border-border bg-surface-elevated p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                        <GraduationCap className="h-3.5 w-3.5" /> {p.code}
                      </span>
                      {p.intake && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                          <Users className="h-3 w-3" /> {p.intake}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>

                    <div className="mt-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{p.years}</span>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {p.desc}
                    </p>

                    {/* Eligibility Brief */}
                    {p.eligibility && (
                      <div className="mt-4 rounded-xl border border-border/80 bg-background/60 p-3 text-xs text-muted-foreground">
                        <strong className="text-foreground font-semibold block mb-0.5">
                          Eligibility Criteria:
                        </strong>
                        <span className="line-clamp-2">{p.eligibility}</span>
                      </div>
                    )}

                    {/* Curriculum Highlights Preview */}
                    {p.curriculum && p.curriculum.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          Key Curriculum Focus
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.curriculum.slice(0, 4).map((cItem, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-lg bg-surface border border-border/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                            >
                              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                              {cItem}
                            </span>
                          ))}
                          {p.curriculum.length > 4 && (
                            <span className="text-[11px] font-medium text-primary self-center px-1">
                              +{p.curriculum.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProgram(p)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>View Full Curriculum & Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROGRAM DETAILS INSPECTION MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute right-5 top-5 rounded-full bg-muted p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-smooth"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <GraduationCap className="h-4 w-4" /> {selectedProgram.code} Degree Program
              </div>
              <h3 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-foreground">
                {selectedProgram.name}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                <span className="inline-flex items-center gap-1 bg-surface border border-border px-2.5 py-1 rounded-lg">
                  <Clock className="h-3.5 w-3.5 text-primary" /> {selectedProgram.years}
                </span>
                {selectedProgram.intake && (
                  <span className="inline-flex items-center gap-1 bg-surface border border-border px-2.5 py-1 rounded-lg">
                    <Users className="h-3.5 w-3.5 text-primary" /> {selectedProgram.intake}
                  </span>
                )}
              </div>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Program Overview
              </h4>
              <p className="mt-1.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {selectedProgram.desc}
              </p>
            </div>

            {/* Eligibility Criteria */}
            {selectedProgram.eligibility && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" /> Admission & Eligibility Criteria
                </div>
                <p className="mt-1.5 text-sm text-foreground leading-relaxed">
                  {selectedProgram.eligibility}
                </p>
              </div>
            )}

            {/* Curriculum Modules */}
            {selectedProgram.curriculum && selectedProgram.curriculum.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <BookOpen className="h-4 w-4 text-primary" /> Comprehensive Core Curriculum
                </h4>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {selectedProgram.curriculum.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-surface-elevated p-3 text-xs font-medium text-foreground flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Program Highlights */}
            {selectedProgram.highlights && selectedProgram.highlights.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Program Highlights & Lab
                  Facilities
                </h4>
                <ul className="space-y-2">
                  {selectedProgram.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Career Opportunities */}
            {selectedProgram.careerRoles && selectedProgram.careerRoles.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Briefcase className="h-4 w-4 text-primary" /> Career Pathways & Job Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProgram.careerRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-accent/40 px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      <Briefcase className="h-3 w-3 text-primary" />
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Close */}
            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedProgram(null)}
                className="rounded-xl bg-gradient-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:scale-105 transition-smooth"
              >
                Close Program Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tech Wizard Association Motive */}
      {departmentInfo.facilities && departmentInfo.facilities.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Target className="h-4 w-4" /> Driving Vision & Objectives
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1">Tech Wizard Association Motive</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Core objectives, student empowerment initiatives, and growth motives driving TWA
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {departmentInfo.facilities.map((f, idx) => (
              <div
                key={f.title || idx}
                className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft transition-smooth hover:shadow-elegant flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-xs">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-base text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
