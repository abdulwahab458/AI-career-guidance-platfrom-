"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import AppSidebar from "./AppSidebar";

const applicationRoutes = ["/dashboard", "/roadmap", "/resume", "/cover-letter", "/interprep", "/job-matcher"];

const AppShell = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const showAppNavigation = applicationRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <>
      <Header />
      {showAppNavigation && <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((isOpen) => !isOpen)} onClose={() => setSidebarOpen(false)} />}
      <main className={`min-h-screen transition-[padding] duration-300 ${showAppNavigation && sidebarOpen ? "lg:pl-72" : ""}`}>
        {children}
      </main>
      <footer className={`bg-gray-900 py-4 text-center text-gray-300 transition-[padding] duration-300 ${showAppNavigation && sidebarOpen ? "lg:pl-72" : ""}`}>
        <p className="text-sm">Created with <span className="text-red-500">♥</span> by Abdul Wahab</p>
        <p className="mt-1 text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </>
  );
};

export default AppShell;