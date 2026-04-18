import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const CYCLE: Record<string, string> = { system: "light", light: "dark", dark: "system" };
const LABELS: Record<string, string> = { light: "Light", dark: "Dark", system: "System" };
const ICONS: Record<string, React.ReactNode> = {
  light:  <Sun  className="size-3.5" />,
  dark:   <Moon className="size-3.5" />,
  system: <Monitor className="size-3.5" />,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme ?? "system";
  const next = CYCLE[current] ?? "light";

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABELS[current]}. Tap to switch to ${LABELS[next]}`}
      className="fixed top-3 right-3 z-50 flex items-center gap-1.5
        bg-white text-gray-800 border border-gray-200 shadow-md
        dark:bg-gray-800 dark:text-white dark:border-gray-600
        rounded-full px-3 py-1.5 text-xs font-semibold
        transition-all duration-200 hover:opacity-90"
    >
      {ICONS[current]}
      <span>{LABELS[current]}</span>
    </button>
  );
}
