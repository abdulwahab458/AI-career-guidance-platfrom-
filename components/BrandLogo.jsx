import Link from "next/link";

export default function BrandLogo({ compact = false }) {
  return (
    <Link
      href="/"
      aria-label="Mentora home"
      className={`group inline-flex items-center ${compact ? "text-lg" : "text-xl"}`}
    >
      <span className="bg-gradient-to-r from-white via-sky-100 to-indigo-300 bg-clip-text font-semibold tracking-[-0.055em] text-transparent transition-opacity duration-200 group-hover:opacity-80">
        Mentora
      </span>
    </Link>
  );
}
