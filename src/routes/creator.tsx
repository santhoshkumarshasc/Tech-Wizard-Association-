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
import { useSiteStore, defaultCreatorProfile } from "@/lib/site-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Creator Showcase — Tech Wizard Association Platform" },
      {
        name: "description",
        content:
          "Meet Santhosh Kumar S, Lead Platform Creator & Full-Stack Architect of Tech Wizard Association. Connect via social media, send appreciation likes, and explore the architecture.",
      },
      {
        name: "keywords",
        content:
          "Tech Wizard Association Creator, Santhosh Kumar S, TWA Architect, Full Stack Developer, Computer Applications SHASC",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Creator Showcase — Tech Wizard Association Platform" },
      {
        property: "og:description",
        content:
          "Meet the Lead Creator & Full-Stack Architect behind Tech Wizard Association. View social profiles and send appreciation.",
      },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: CreatorPage,
});

function CreatorPage() {
  const { site, isAdmin, incrementCreatorLikes } = useSiteStore();
  const [hasLiked, setHasLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);

  const creator = site.creator || defaultCreatorProfile;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const likedState = localStorage.getItem("twa_creator_liked");
      if (likedState === "true") {
        setHasLiked(true);
      }
    }
  }, []);

  const handleLike = () => {
    incrementCreatorLikes();
    setHasLiked(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("twa_creator_liked", "true");
    }
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 800);
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: creator.githubUrl,
      icon: Github,
      desc: "Source code, open-source projects & repositories",
      handle: "@santhoshkumarshasc",
      badge: "Developer",
      bgClass: "hover:border-slate-800 hover:bg-slate-900/5 dark:hover:bg-slate-800/20",
      btnClass: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900",
    },
    {
      name: "LinkedIn",
      url: creator.linkedinUrl,
      icon: Linkedin,
      desc: "Professional career network & engineering updates",
      handle: "in/santhoshkumar",
      badge: "Professional",
      bgClass: "hover:border-blue-500/50 hover:bg-blue-500/5",
      btnClass: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      name: "Instagram",
      url: creator.instagramUrl,
      icon: Instagram,
      desc: "Tech updates, department event stories & behind-the-scenes",
      handle: "@techwizards_shasc",
      badge: "Community",
      bgClass: "hover:border-pink-500/50 hover:bg-pink-500/5",
      btnClass:
        "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white hover:opacity-90",
    },
    {
      name: "YouTube",
      url: creator.youtubeUrl,
      icon: Youtube,
      desc: "Video tutorials, workshop recordings & project demos",
      handle: "@techwizards_shasc",
      badge: "Media",
      bgClass: "hover:border-red-500/50 hover:bg-red-500/5",
      btnClass: "bg-red-600 text-white hover:bg-red-700",
    },
    {
      name: "Twitter / X",
      url: creator.twitterUrl,
      icon: Twitter,
      desc: "Tech insights, Web dev trends & announcements",
      handle: "@techwizards_tw",
      badge: "Thoughts",
      bgClass: "hover:border-sky-500/50 hover:bg-sky-500/5",
      btnClass: "bg-sky-500 text-white hover:bg-sky-600",
    },
    {
      name: "Portfolio Website",
      url: creator.websiteUrl,
      icon: Globe,
      desc: "Interactive web showcase & full project portfolio",
      handle: "techwizards-shasc.web.app",
      badge: "Official Web",
      bgClass: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
      btnClass: "bg-emerald-600 text-white hover:bg-emerald-700",
    },
    {
      name: "Official Email",
      url: creator.emailUrl,
      icon: Mail,
      desc: "Direct contact for collaborations & inquiries",
      handle: "techwizardsassociation@gmail.com",
      badge: "Inquiries",
      bgClass: "hover:border-purple-500/50 hover:bg-purple-500/5",
      btnClass: "bg-purple-600 text-white hover:bg-purple-700",
    },
  ].filter((s) => Boolean(s.url));

  const techStack = [
    { name: "React 18 & Vite", desc: "Ultra-fast frontend UI rendering", icon: Code2 },
    { name: "TypeScript", desc: "Strict end-to-end type safety", icon: Terminal },
    { name: "Tailwind CSS", desc: "Modern utility-first design system", icon: Layers },
    { name: "TanStack Router", desc: "Type-safe routing & search params", icon: Zap },
    { name: "Firebase Firestore", desc: "Real-time persistent database", icon: Cpu },
    { name: "Cloud Architecture", desc: "Serverless deployments & API endpoints", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Hero Banner Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-12 shadow-xl">
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
                title="Creator Online & Active"
              />
            </div>

            {/* Profile Info */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
                  Lead Platform Creator
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Award className="h-3.5 w-3.5" /> Full-Stack Architect
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

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {creator.name}
              </h1>

              <p className="text-base sm:text-lg font-semibold text-primary/90">{creator.role}</p>

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
                      title={`Visit ${creator.name}'s ${s.name} profile (${s.handle})`}
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
                  onClick={handleLike}
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 cursor-pointer active:scale-95",
                    hasLiked
                      ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-600"
                      : "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105",
                    likeAnim && "scale-110 ring-4 ring-rose-400/50",
                  )}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      hasLiked ? "fill-white text-white" : "fill-none text-current",
                      likeAnim && "scale-125 animate-ping",
                    )}
                  />
                  <span>
                    {hasLiked ? "Appreciated!" : "Send Appreciation Like"} (
                    {creator.likesCount || 0})
                  </span>
                </button>

                <div className="text-xs text-muted-foreground font-medium">
                  {creator.likesCount || 0} student & developer appreciations received
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Architecture & Engineering Stack */}
        <div className="space-y-6 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              <span>Platform Engineering & Architecture</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Built with cutting-edge web technologies, reactive state synchronization, and
              high-performance design
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/50 p-4 transition-colors hover:border-primary/30"
                >
                  <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{tech.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{tech.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
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
