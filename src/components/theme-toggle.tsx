import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, showLabel }: { className?: string; showLabel?: boolean }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
        className,
      )}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300" />
        )}
      </span>
      {showLabel ? (
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      ) : (
        <span className="sr-only">{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
      )}
    </button>
  );
}
