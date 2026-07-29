import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Heart,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Mail,
  Code2,
  Cpu,
  Layers,
  Zap,
  Shield,
  ArrowRight,
  ExternalLink,
  Award,
  Terminal,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  useSiteStore,
  defaultCreatorProfile,
  getCreatorsList,
  CreatorProfile,
} from "@/lib/site-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Creators Showcase — Tech Wizard Association Platform" },
      {
        name: "description",
        content:
          "Meet the Lead Creators & Full-Stack Architects behind Tech Wizard Association. Connect via social media, send appreciation likes, and explore the platform.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association Creators, TWA Architects, Full Stack Developers, Computer Applications SHASC",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Creators Showcase — Tech Wizard Association Platform" },
      {
        property: "og:description",
        content:
          "Meet the Lead Creators & Full-Stack Architects behind Tech Wizard Association. View social profiles and send appreciation.",
      },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: CreatorPage,
});

function CreatorPage() {
  const { site, isAdmin, incrementCreatorLikesAtIndex } = useSiteStore();
  const creators = getCreatorsList(site);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [animIdx, setAnimIdx] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const map: Record<number, boolean> = {};
      creators.forEach((_, idx) => {
        if (localStorage.getItem(`twa_creator_liked_${idx}`) === "true") {
          map[idx] = true;
        }
      });
      setLikedMap(map);
    }
  }, [creators]);

  const handleLike = (idx: number) => {
    incrementCreatorLikesAtIndex(idx);
    setLikedMap((prev) => ({ ...prev, [idx]: true }));
    if (typeof window !== "undefined") {
      localStorage.setItem(`twa_creator_liked_${idx}`, "true");
    }
    setAnimIdx(idx);
    setTimeout(() => setAnimIdx(null), 800);
  };

  const getSocialLinksForCreator = (creator: CreatorProfile) =>
    [
      {
        name: "GitHub",
        url: creator.githubUrl,
        icon: Github,
        bgClass: "hover:border-slate-800 hover:bg-slate-900/5 dark:hover:bg-slate-800/20",
      },
      {
        name: "LinkedIn",
        url: creator.linkedinUrl,
        icon: Linkedin,
        bgClass: "hover:border-blue-500/50 hover:bg-blue-500/5",
      },
      {
        name: "Instagram",
        url: creator.instagramUrl,
        icon: Instagram,
        bgClass: "hover:border-pink-500/50 hover:bg-pink-500/5",
      },
      {
        name: "YouTube",
        url: creator.youtubeUrl,
        icon: Youtube,
        bgClass: "hover:border-red-500/50 hover:bg-red-500/5",
      },
      {
        name: "Twitter / X",
        url: creator.twitterUrl,
        icon: Twitter,
        bgClass: "hover:border-sky-500/50 hover:bg-sky-500/5",
      },
      {
        name: "Portfolio Website",
        url: creator.websiteUrl,
        icon: Globe,
        bgClass: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
      },
      {
        name: "Official Email",
        url: creator.emailUrl,
        icon: Mail,
        bgClass: "hover:border-purple-500/50 hover:bg-purple-500/5",
      },
    ].filter((s) => Boolean(s.url));

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Title when multiple creators exist */}
        {creators.length > 1 && (
          <div className="text-center space-y-3 pb-4 border-b border-border">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary border border-primary/20">
              <Sparkles className="h-4 w-4 text-amber-500 animate-spin-slow" />
              Platform Creators &amp; Lead Architects ({creators.length})
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Meet the Platform Creators
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {
                "The architects, developers, and designers behind the Tech Wizard Association digital platform."
              }
            </p>
          </div>
        )}

        {/* Creator Showcase Cards */}
        <div className="space-y-10">
          {creators.map((creator, cIdx) => {
            const socialLinks = getSocialLinksForCreator(creator);
            const hasLiked = Boolean(likedMap[cIdx]);
            const isAnimating = animIdx === cIdx;

            return (
              <div
                key={cIdx}
                className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-12 shadow-xl"
              >
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar & Ring */}
                  <div className="relative shrink-0 group">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-amber-500 to-rose-500 opacity-75 blur-md group-hover:opacity-100 transition duration-500" />
                    <img
                      src={
                        creator.avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      }
                      alt={creator.name}
                      className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover ring-4 ring-background shadow-2xl"
                    />
                    <span
                      className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-background"
                      title="Creator Active"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-4 text-center md:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
                        {cIdx === 0 ? "Lead Platform Creator" : `Creator #${cIdx + 1}`}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Award className="h-3.5 w-3.5" /> {creator.role || "Architect"}
                      </span>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                        >
                          Edit Profile in Admin
                        </Link>
                      )}
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                      {creator.name}
                    </h2>

                    <p className="text-base sm:text-lg font-semibold text-primary/90">
                      {creator.role}
                    </p>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      {creator.bio}
                    </p>

                    {creator.longBio && (
                      <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed max-w-2xl pt-1">
                        {creator.longBio}
                      </p>
                    )}

                    {/* Integrated Creator Social & Contact Links */}
                    <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                      {socialLinks.map((s) => {
                        const Icon = s.icon;
                        return (
                          <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-1.5 text-xs font-bold text-foreground transition-all duration-200 shadow-2xs hover:scale-105 hover:shadow-xs",
                              s.bgClass,
                            )}
                            title={`Visit ${creator.name}'s ${s.name}`}
                          >
                            <Icon className="h-3.5 w-3.5 text-primary" />
                            <span>{s.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        );
                      })}

                      {/* Custom Social Links */}
                      {creator.customSocials?.map((cs, idx) => (
                        <a
                          key={cs.id || idx}
                          href={cs.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all duration-200 shadow-2xs hover:scale-105 hover:bg-primary/20"
                          title={cs.url}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>{cs.label || cs.platform}</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      ))}
                    </div>

                    {/* Appreciation Likes Counter */}
                    <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <button
                        onClick={() => handleLike(cIdx)}
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 cursor-pointer active:scale-95",
                          hasLiked
                            ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-600"
                            : "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105",
                          isAnimating && "scale-110 ring-4 ring-rose-400/50",
                        )}
                      >
                        <Heart
                          className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            hasLiked ? "fill-white text-white" : "fill-none text-current",
                            isAnimating && "scale-125 animate-ping",
                          )}
                        />
                        <span>
                          {hasLiked ? "Appreciated!" : "Send Appreciation Like"} (
                          {creator.likesCount || 0})
                        </span>
                      </button>

                      <div className="text-xs text-muted-foreground font-medium">
                        {creator.likesCount || 0} student &amp; developer appreciations received
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Footer Box */}
        <div className="rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold">
              Have an idea or collaboration proposal?
            </h3>
            <p className="text-xs sm:text-sm text-primary-foreground/80">
              Get in touch with the Tech Wizard Association department team or join as a member!
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-foreground shadow-md hover:bg-surface transition-all shrink-0"
          >
            <span>Get in Touch</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
