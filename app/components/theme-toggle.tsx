"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-background border border-border hover:bg-accent transition-colors relative"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all dark:opacity-0 dark:scale-0" />
      <Moon className="absolute h-5 w-5 top-2 left-2 transition-all opacity-0 scale-0 dark:opacity-100 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}