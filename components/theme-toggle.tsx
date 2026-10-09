"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("stlab.theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const value = saved ? saved === "dark" : prefers;
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }, []);
  function toggle() {
    const value = !dark;
    setDark(value);
    localStorage.setItem("stlab.theme", value ? "dark" : "light");
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }
  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={dark ? "切換淺色模式" : "切換深色模式"}>{dark ? "☼" : "◐"}</button>;
}
