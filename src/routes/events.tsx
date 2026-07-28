import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Calendar,
  Image as ImageIcon,
  X,
  MapPin,
  Search,
  Filter,
  Maximize2,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useSiteStore } from "@/lib/site-store";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events, Hackathons & Bootcamps — TWA SHASC" },
      {
        name: "description",
        content:
          "Explore upcoming national hackathons, coding bootcamps, cybersecurity CTF competitions, and guest lectures hosted by Tech Wizard Association, Department of Computer Applications, SHASC.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association events, SHASC hackathon 2026, coding bootcamps Kilakarai, CTF competition Tamil Nadu, DCA workshops, student tech events",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Tech Wizard Association — SHASC" },
      { property: "og:title", content: "Events, Hackathons & Bootcamps — TWA SHASC" },
      {
        property: "og:description",
        content:
          "Explore upcoming and featured events, hackathons, and technical bootcamps hosted by Tech Wizard Association.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/events" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/events" }],
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
                  name: "Events & Hackathons",
                  item: "https://shasc.edu.in/events",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { events, site } = useSiteStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<{
    url: string;
    caption?: string;
    title?: string;
  } | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.tag) set.add(e.tag);
      if (e.status) set.add(e.status);
    });
    return ["All", ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === "All" || e.tag === selectedTag || e.status === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [events, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen pb-16">
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Events &amp; Memories
              </div>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Ship. Learn. Repeat.</h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Everything on the {site.short} calendar — from all-night hackathons to focused
                workshops, guest lectures, and team photo highlights.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
              >
                <ImageIcon className="h-4 w-4" /> View Media Gallery{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Filter Controls */}
        <div className="mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-smooth ${
                  selectedTag === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="font-bold text-lg text-foreground">No Events Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchQuery || selectedTag !== "All"
                ? "Try clearing your search query or selecting another tag."
                : "No upcoming events scheduled right now."}
            </p>
            {(searchQuery || selectedTag !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("All");
                }}
                className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          <ol className="relative border-s-2 border-border ps-5 sm:ps-8">
            {filteredEvents.map((e) => (
              <li key={e.id || e.title} className="mb-10 sm:mb-12">
                <span className="absolute -start-3.5 sm:-start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary ring-4 ring-background shadow-xs">
                  <Calendar className="h-3 w-3 text-primary-foreground" />
                </span>
                <div className="rounded-2xl border border-border bg-surface-elevated p-5 sm:p-6 shadow-soft transition-smooth hover:shadow-elegant">
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {e.imageUrl && (
                      <div
                        onClick={() =>
                          setActivePhoto({ url: e.imageUrl!, title: `${e.title} (Poster)` })
                        }
                        className="group relative h-40 w-full sm:h-40 sm:w-40 rounded-xl overflow-hidden ring-1 ring-border shadow-sm shrink-0 cursor-pointer"
                      >
                        <img
                          src={e.imageUrl}
                          alt={e.title}
                          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center text-white text-xs font-semibold gap-1">
                          <Maximize2 className="h-4 w-4" /> Zoom
                        </div>
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-foreground flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {e.tag}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {e.date}
                        </span>
                        {e.location && (
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" /> {e.location}
                          </span>
                        )}
                        {e.status && (
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              e.status === "Featured"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : e.status === "Completed"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {e.status}
                          </span>
                        )}
                      </div>

                      <h2 className="font-display text-xl font-bold">{e.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>

                      {/* Event Photo Gallery Highlights */}
                      {e.photos && e.photos.length > 0 && (
                        <div className="mt-5 border-t border-border/60 pt-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3">
                            <ImageIcon className="h-3.5 w-3.5" /> Event Photo Memories (
                            {e.photos.length} Photos)
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {e.photos.map((p) => (
                              <button
                                key={p.id}
                                onClick={() =>
                                  setActivePhoto({ url: p.url, caption: p.caption, title: e.title })
                                }
                                className="group/photo relative h-24 overflow-hidden rounded-xl border border-border/80 bg-background/50 transition-smooth hover:scale-[1.02] hover:border-primary/50 hover:shadow-md"
                              >
                                <img
                                  src={p.url}
                                  alt={p.caption || "Event photo"}
                                  className="h-full w-full object-cover transition-smooth group-hover/photo:scale-105"
                                />
                                {p.caption && (
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-left">
                                    <p className="truncate text-[10px] font-medium text-white">
                                      {p.caption}
                                    </p>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-2">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || "Event detail"}
                className="max-h-[75vh] w-full rounded-xl object-contain mx-auto"
              />
              <div className="mt-3 text-center">
                <h4 className="font-semibold text-sm text-slate-200">{activePhoto.title}</h4>
                {activePhoto.caption && (
                  <p className="text-xs text-slate-400 mt-1">{activePhoto.caption}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
