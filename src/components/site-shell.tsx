import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Sparkles,
  ArrowUp,
  Heart,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Mail,
} from "lucide-react";
import { nav } from "@/lib/site-data";
import { useSiteStore, defaultCreatorProfile } from "@/lib/site-store";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./announcement-bar";
import { ThemeToggle } from "./theme-toggle";

function CreatorShowcaseFooter() {
  const { site, incrementCreatorLikes } = useSiteStore();
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
    if (!hasLiked) {
      incrementCreatorLikes();
      setHasLiked(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("twa_creator_liked", "true");
      }
    } else {
      incrementCreatorLikes();
    }
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 800);
  };

  const socials = [
    {
      name: "GitHub",
      url: creator.githubUrl,
      icon: Github,
      color:
        "hover:bg-slate-800 hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900",
    },
    {
      name: "LinkedIn",
      url: creator.linkedinUrl,
      icon: Linkedin,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Instagram",
      url: creator.instagramUrl,
      icon: Instagram,
      color: "hover:bg-pink-600 hover:text-white",
    },
    {
      name: "YouTube",
      url: creator.youtubeUrl,
      icon: Youtube,
      color: "hover:bg-red-600 hover:text-white",
    },
    {
      name: "Twitter",
      url: creator.twitterUrl,
      icon: Twitter,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "Portfolio",
      url: creator.websiteUrl,
      icon: Globe,
      color: "hover:bg-emerald-600 hover:text-white",
    },
    {
      name: "Email",
      url: creator.emailUrl,
      icon: Mail,
      color: "hover:bg-purple-600 hover:text-white",
    },
  ].filter((s) => Boolean(s.url));

  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-card/60 p-4 shadow-sm backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>Creator Showcase</span>
        </div>
        <button
          onClick={handleLike}
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-300 shadow-xs cursor-pointer",
            hasLiked
              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
              : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:scale-105 active:scale-95",
            likeAnim && "scale-125 ring-2 ring-rose-500/50",
          )}
          title={hasLiked ? "Click to add another appreciation!" : "Click to send likes to creator"}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-all",
              hasLiked ? "fill-rose-500 text-rose-500" : "text-primary",
            )}
          />
          <span>{creator.likesCount || 0} Likes</span>
        </button>
      </div>

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={
              creator.avatarUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            }
            alt={creator.name}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40 shadow-xs"
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-card"
            title="Creator Active"
          />
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-display text-sm font-bold text-foreground truncate">
              {creator.name}
            </h4>
            <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
              Lead Architect
            </span>
          </div>
          <p className="text-[11px] font-semibold text-primary/90 truncate">{creator.role}</p>
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-1">
            {creator.bio}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          {socials.slice(0, 4).map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border border-border/70 bg-background/80 px-2 py-1 text-[11px] font-medium text-foreground transition-all duration-200 hover:shadow-xs",
                  s.color,
                )}
                title={`Visit ${creator.name} on ${s.name}`}
              >
                <Icon className="h-3 w-3" />
                <span>{s.name}</span>
              </a>
            );
          })}
        </div>
        <Link
          to="/creator"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all shrink-0"
        >
          <span>Full Showcase</span>
          <ArrowUp className="h-3 w-3 rotate-90" />
        </Link>
      </div>
    </div>
  );
}

export function SiteShell() {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { site } = useSiteStore();

  // Scroll to top smoothly on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Monitor scroll offset to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (site.logoUrl && typeof document !== "undefined") {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = site.logoUrl;
    }
  }, [site.logoUrl]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={cn(
                "relative flex items-center justify-center overflow-hidden ring-2 ring-primary/20 shadow-sm transition-smooth group-hover:ring-primary/60 group-hover:scale-105",
                site.logoShape === "circle"
                  ? "rounded-full"
                  : site.logoShape === "square"
                    ? "rounded-none"
                    : site.logoShape === "pill"
                      ? "rounded-2xl"
                      : "rounded-xl",
              )}
              style={{
                backgroundColor: site.logoBg || "transparent",
                padding: `${site.logoPadding ?? 2}px`,
                width: `${40 * ((site.logoScale || 100) / 100)}px`,
                height: `${40 * ((site.logoScale || 100) / 100)}px`,
              }}
            >
              <img
                src={site.logoUrl}
                alt={site.name}
                className={cn(
                  "h-full w-full",
                  site.logoFit === "cover"
                    ? "object-cover"
                    : site.logoFit === "fill"
                      ? "object-fill"
                      : "object-contain",
                )}
              />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xs sm:text-sm font-semibold transition-smooth group-hover:text-primary">
                {site.name}
              </div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate max-w-[180px] sm:max-w-none">
                {site.department}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-smooth",
                    active
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> Contact Us
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="rounded-md p-2 text-foreground hover:bg-accent"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-smooth flex items-center justify-between",
                    pathname === item.to
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-accent",
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between px-1">
                <span className="text-xs font-medium text-muted-foreground">Theme Preference</span>
                <ThemeToggle showLabel />
              </div>

              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant"
              >
                <Sparkles className="h-4 w-4" /> Contact Us
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={site.logoUrl}
                alt={site.name}
                className="h-12 w-12 rounded-full bg-background p-1 ring-2 ring-primary/30 object-contain shadow-sm"
              />
              <div>
                <div className="font-display text-base font-semibold">{site.name}</div>
                <div className="text-xs text-muted-foreground">{site.college}</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A student-led community of makers, coders and dreamers under the {site.department}.
            </p>
          </div>
          <div>
            <CreatorShowcaseFooter />
          </div>
          <div>
            <div className="text-sm font-semibold">Reach us</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>{site.college}</li>
              <li>{site.address}</li>
              <li>{site.email}</li>
              <li>{site.phone}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} {site.name} · All rights reserved
        </div>
      </footer>

      {/* Floating Smooth Back To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-glow hover:scale-110 active:scale-95 transition-smooth animate-in fade-in slide-in-from-bottom-4 duration-300"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
