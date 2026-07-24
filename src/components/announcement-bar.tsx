import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Megaphone, X, ArrowRight, Edit3, Timer } from "lucide-react";
import { useSiteStore } from "@/lib/site-store";
import { cn } from "@/lib/utils";

export function AnnouncementBar() {
  const { announcement, isAuthenticated } = useSiteStore();
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const duration = announcement.durationSeconds ?? 10;
  const isBottom = (announcement.position || "bottom-popup") === "bottom-popup";

  useEffect(() => {
    setDismissed(false);
    if (duration > 0 && announcement.enabled) {
      setTimeLeft(duration);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setDismissed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [
    announcement.enabled,
    announcement.text,
    announcement.position,
    announcement.durationSeconds,
    duration,
  ]);

  if (!announcement.enabled || dismissed) {
    return null;
  }

  // Define styles based on selected preference
  const styleVariants = {
    transparent: isBottom
      ? "bg-background/80 backdrop-blur-2xl border-border/80 shadow-2xl text-foreground ring-1 ring-primary/20"
      : "bg-primary/10 backdrop-blur-md border-b border-primary/20 text-foreground shadow-xs",
    glass: isBottom
      ? "bg-surface-elevated/90 backdrop-blur-xl border-border/80 text-foreground shadow-2xl"
      : "bg-background/60 backdrop-blur-xl border-b border-border/80 text-foreground shadow-sm",
    gradient: isBottom
      ? "bg-gradient-to-r from-primary/20 via-purple-500/15 to-indigo-500/20 backdrop-blur-2xl border-primary/30 text-foreground shadow-2xl ring-1 ring-primary/30"
      : "bg-gradient-to-r from-primary/20 via-purple-500/15 to-indigo-500/20 backdrop-blur-md border-b border-primary/30 text-foreground shadow-sm",
    solid: isBottom
      ? "bg-primary text-primary-foreground shadow-2xl"
      : "bg-primary text-primary-foreground shadow-md",
  };

  const currentStyle = styleVariants[announcement.style || "transparent"];

  if (isBottom) {
    return (
      <div
        aria-label="Site Announcement Popup"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300",
            currentStyle,
          )}
        >
          {/* Progress Bar for Auto-dismiss */}
          {duration > 0 && timeLeft !== null && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="mt-0.5 inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-xl bg-primary/20 border border-primary/30 text-primary shadow-xs">
                <Megaphone className="h-4 w-4 animate-bounce" />
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    {announcement.badge || "ANNOUNCEMENT"}
                  </span>
                  {duration > 0 && timeLeft !== null && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                      <Timer className="h-3 w-3 text-primary" /> {timeLeft}s
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium leading-relaxed text-foreground">
                  {announcement.text}
                </p>

                {announcement.linkText && announcement.linkUrl && (
                  <div className="pt-1">
                    <Link
                      to={announcement.linkUrl}
                      onClick={() => setDismissed(true)}
                      className="inline-flex items-center gap-1.5 font-semibold text-xs text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                    >
                      <span>{announcement.linkText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setDismissed(true)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-smooth"
                aria-label="Dismiss announcement popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Site Announcement Bar"
      className={cn(
        "relative z-40 w-full transition-all duration-300 py-2.5 px-4 sm:px-6 lg:px-8",
        currentStyle,
      )}
    >
      {/* Progress Bar */}
      {duration > 0 && timeLeft !== null && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted/20">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / duration) * 100}%` }}
          />
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">
            <Megaphone className="h-3.5 w-3.5 animate-pulse" />
            <span>{announcement.badge || "ANNOUNCEMENT"}</span>
          </div>

          <span className="font-medium leading-tight text-foreground/90">{announcement.text}</span>

          {announcement.linkText && announcement.linkUrl && (
            <Link
              to={announcement.linkUrl}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
            >
              <span>{announcement.linkText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {duration > 0 && timeLeft !== null && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground pl-2 border-l border-border/60">
              <Timer className="h-3 w-3 text-primary" /> {timeLeft}s
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full p-1 text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-smooth"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
