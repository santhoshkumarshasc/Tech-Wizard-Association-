import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Search,
  Filter,
  Maximize2,
  X,
  UserCheck,
  Calendar,
  Tag,
  Shield,
  Wand2,
  Trash2,
} from "lucide-react";
import { useSiteStore } from "@/lib/site-store";
import { ImageEditorModal } from "@/components/image-editor";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Event Gallery & Photo Highlights — TWA SHASC" },
      {
        name: "description",
        content:
          "Browse high-resolution event photos, hackathon highlights, workshop galleries, and ceremony moments from Tech Wizard Association at Syed Hameedha Arts and Science College.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association gallery, SHASC event photos, DCA hackathon pictures, coding bootcamp photo album, Kilakarai college tech event photos",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Tech Wizard Association — SHASC" },
      { property: "og:title", content: "Event Gallery & Photo Highlights — TWA SHASC" },
      {
        property: "og:description",
        content: "Browse event photos and hackathon highlights from Tech Wizard Association.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shasc.edu.in/gallery" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shasc.edu.in/gallery" }],
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
                  name: "Event Gallery",
                  item: "https://shasc.edu.in/gallery",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: GalleryPage,
});

interface GalleryImageItem {
  id: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
  eventTitle: string;
  eventId: string;
  eventTag: string;
  eventDate: string;
  type: "Poster" | "Gallery Highlight";
}

function GalleryPage() {
  const store = useSiteStore();
  const { events } = store;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [activeImage, setActiveImage] = useState<GalleryImageItem | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editorInitialImg, setEditorInitialImg] = useState<string>("");

  const handleDeletePhoto = (img: GalleryImageItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete this gallery photo?`)) {
      if (img.id.startsWith("poster-")) {
        store.updateEvent(img.eventId, { imageUrl: "" });
      } else {
        store.deleteEventPhoto(img.eventId, img.id);
      }
      if (activeImage && activeImage.id === img.id) {
        setActiveImage(null);
      }
    }
  };

  // Consolidate all uploaded event images & gallery photos across all events
  const allImages = useMemo(() => {
    const list: GalleryImageItem[] = [];

    events.forEach((evt) => {
      // Primary event poster
      if (evt.imageUrl) {
        list.push({
          id: `poster-${evt.id}`,
          url: evt.imageUrl,
          caption: `${evt.title} — Official Event Poster`,
          uploadedBy: "Event Manager",
          uploadedAt: evt.date,
          eventTitle: evt.title,
          eventId: evt.id,
          eventTag: evt.tag || "General",
          eventDate: evt.date,
          type: "Poster",
        });
      }

      // Event photo gallery uploads
      if (evt.photos && evt.photos.length > 0) {
        evt.photos.forEach((photo) => {
          list.push({
            id: photo.id,
            url: photo.url,
            caption: photo.caption || `${evt.title} Moment`,
            uploadedBy: photo.uploadedBy || "TWA Access Person",
            uploadedAt: photo.uploadedAt || evt.date,
            eventTitle: evt.title,
            eventId: evt.id,
            eventTag: evt.tag || "Gallery",
            eventDate: evt.date,
            type: "Gallery Highlight",
          });
        });
      }
    });

    return list;
  }, [events]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    allImages.forEach((img) => {
      if (img.eventTag) set.add(img.eventTag);
      if (img.type) set.add(img.type);
    });
    return ["All", ...Array.from(set)];
  }, [allImages]);

  const filteredImages = useMemo(() => {
    return allImages.filter((img) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        img.eventTitle.toLowerCase().includes(q) ||
        (img.caption && img.caption.toLowerCase().includes(q)) ||
        (img.uploadedBy && img.uploadedBy.toLowerCase().includes(q));

      const matchesTag =
        selectedTag === "All" || img.eventTag === selectedTag || img.type === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [allImages, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> TWA Media &amp; Photo Gallery
              </div>
              <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
                Captured Moments &amp; Highlights
              </h1>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                Browse official event posters and photo memories from our association events and
                workshops.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setEditorInitialImg("");
                  setShowImageEditor(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-md hover:opacity-90 transition-smooth"
              >
                <Wand2 className="h-4 w-4" /> Open Photo Studio &amp; Editor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gallery by caption, event title, or uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-primary/20"
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

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/50">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
            <h3 className="font-bold text-lg text-foreground">No Gallery Images Found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchQuery || selectedTag !== "All"
                ? "No uploaded images match your search or filter criteria."
                : "No photos have been uploaded yet."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              {(searchQuery || selectedTag !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("All");
                  }}
                  className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveImage(img)}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-elegant transition-smooth cursor-pointer flex flex-col"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <img
                    src={img.url}
                    alt={img.caption || img.eventTitle}
                    className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Maximize2 className="h-4 w-4" /> View Fullscreen
                    </div>
                  </div>
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                    {img.type}
                  </span>

                  {store.isAuthenticated && (
                    <button
                      onClick={(e) => handleDeletePhoto(img, e)}
                      className="absolute top-2.5 left-2.5 z-20 rounded-full bg-red-600/90 hover:bg-red-700 p-1.5 text-white shadow-md transition-smooth"
                      title="Delete Photo from Gallery"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wide">
                      <Tag className="h-3 w-3" /> {img.eventTag}
                    </div>
                    <h3 className="font-bold text-xs text-foreground line-clamp-1 mt-0.5">
                      {img.eventTitle}
                    </h3>
                    {img.caption && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                        {img.caption}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-foreground/80 font-medium truncate max-w-[120px]">
                      <UserCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                      {img.uploadedBy}
                    </span>
                    <span className="font-mono">{img.uploadedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fullscreen Photo Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black transition-smooth"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="md:w-2/3 bg-black/90 flex items-center justify-center p-4 min-h-[300px]">
              <img
                src={activeImage.url}
                alt={activeImage.caption || activeImage.eventTitle}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="md:w-1/3 p-6 flex flex-col justify-between space-y-4 bg-card">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {activeImage.eventTag}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {activeImage.eventDate}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold">{activeImage.eventTitle}</h3>
                {activeImage.caption && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeImage.caption}
                  </p>
                )}

                <div className="rounded-xl border border-border/80 bg-muted/30 p-3 space-y-1 text-xs">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    Access Uploader Details
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <UserCheck className="h-4 w-4 text-emerald-500" />
                    <span>Uploaded by: {activeImage.uploadedBy}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    Date: {activeImage.uploadedAt}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border">
                {store.isAuthenticated && (
                  <button
                    onClick={() => handleDeletePhoto(activeImage)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600/10 border border-red-600/30 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-600/20 transition-smooth"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Photo from Gallery
                  </button>
                )}

                <button
                  onClick={() => {
                    if (activeImage) {
                      setEditorInitialImg(activeImage.url);
                      setShowImageEditor(true);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-smooth"
                >
                  <Wand2 className="h-4 w-4" /> Edit &amp; Filter Photo
                </button>

                <a
                  href={activeImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-smooth"
                >
                  <Maximize2 className="h-4 w-4" /> Open Full Resolution
                </a>

                <Link
                  to="/events"
                  onClick={() => setActiveImage(null)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <Calendar className="h-4 w-4" /> View Associated Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal for Users */}
      <ImageEditorModal
        isOpen={showImageEditor}
        onClose={() => setShowImageEditor(false)}
        initialImage={editorInitialImg}
        title="TWA Photo Editor &amp; Media Studio"
        onSave={() => {
          setShowImageEditor(false);
        }}
      />
    </div>
  );
}
