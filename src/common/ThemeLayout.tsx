import { useEffect, useState } from "react";

const ThemeLayout = () => {
  const [theme, setTheme] = useState("");
  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    applyTheme(savedTheme);
  }, [theme]);

  return <div />;
};

export default ThemeLayout;
