import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Shield, Sparkles, ArrowUp } from "lucide-react";
import { nav } from "@/lib/site-data";
import { useSiteStore } from "@/lib/site-store";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./announcement-bar";
import { ThemeToggle } from "./theme-toggle";

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
            <div className="text-sm font-semibold">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-foreground flex items-center gap-1.5">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
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
