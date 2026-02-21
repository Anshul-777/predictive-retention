import { Sun, Moon, Palette } from "lucide-react";
import { useTheme, ThemeMode } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const themes: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: "light", icon: Sun, label: "Light" },
  { mode: "dark", icon: Moon, label: "Dark" },
  { mode: "rainbow", icon: Palette, label: "Rainbow" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-secondary/80 p-1">
      {themes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all duration-300",
            theme === mode
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
