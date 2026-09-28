"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair, FileText, GraduationCap, LayoutDashboard, Map, Menu, PenBox, X } from "lucide-react";
import { Button } from "./ui/button";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Career roadmap", icon: Map },
  { href: "/resume", label: "Resume builder", icon: FileText },
  { href: "/cover-letter", label: "Cover letter", icon: PenBox },
  { href: "/interprep", label: "Interview prep", icon: GraduationCap },
  { href: "/job-matcher", label: "Job matcher", icon: Crosshair },
];

const AppSidebar = ({ open, onToggle, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 top-16 z-30 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      {!open && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          aria-label="Open navigation"
          aria-expanded={false}
          className="fixed left-4 top-20 z-50 border-slate-200 bg-white/90 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <aside className={`fixed bottom-0 left-0 top-16 z-40 w-72 border-r border-slate-200/80 bg-white/95 px-4 py-6 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-white/10 dark:bg-slate-950/95 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between px-3">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Workspace</span>
          <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Close navigation" aria-expanded={open}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1" aria-label="Application navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"}`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50/80 p-4 dark:border-sky-400/10 dark:bg-sky-400/10">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Keep moving forward</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Build, practice, and refine your next career move.</p>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;