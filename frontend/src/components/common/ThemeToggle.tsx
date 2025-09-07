import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
        onClick={toggleTheme}
        className="p-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
        aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5" />
            ) : (
                <Sun className="w-5 h-5" />
            )}
        </button>
    );
};