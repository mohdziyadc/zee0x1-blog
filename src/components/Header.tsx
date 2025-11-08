import { Link } from "@tanstack/react-router";

import { useEffect, useRef, useState } from "react";
import { Construction, Home, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    // Only add listener when sidebar is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <header className="p-4 flex items-center bg-sidebar border-b border-sidebar-border shadow-lg backdrop-blur-sm sticky top-0 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-white">
          <Link
            to="/"
            className="text-white hover:text-primary transition-colors"
          >
            zee0x1
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-sidebar text-sidebar-foreground shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-sidebar-border ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        ref={sidebarRef}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className="text-xl font-bold text-white">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors mb-2 text-sidebar-foreground"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-colors mb-2",
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors mb-2 text-sidebar-foreground"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-colors mb-2",
            }}
          >
            <Construction size={20} />
            <span className="font-medium">Projects</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
