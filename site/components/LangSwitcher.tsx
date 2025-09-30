"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

function toLocalePath(path: string, locale: "en" | "tr" | "es"): string {
  if (locale === "en") {
    // Root serves EN
    if (path.startsWith("/tr")) return path.replace(/^\/tr/, "");
    if (path.startsWith("/es")) return path.replace(/^\/es/, "");
    return path;
  }
  if (locale === "tr") {
    if (path.startsWith("/tr")) return path;
    if (path.startsWith("/es")) return path.replace(/^\/es/, "/tr");
    return path === "/" ? "/tr" : `/tr${path}`;
  }
  // es
  if (path.startsWith("/es")) return path;
  if (path.startsWith("/tr")) return path.replace(/^\/tr/, "/es");
  return path === "/" ? "/es" : `/es${path}`;
}

export default function LangSwitcher() {
  const pathname = usePathname() || "/";
  return (
    <div className="flex items-center gap-2">
      <Link href={toLocalePath(pathname, "en")} className="hover:underline">EN</Link>
      <span>·</span>
      <Link href={toLocalePath(pathname, "tr")} className="hover:underline">TR</Link>
      <span>·</span>
      <Link href={toLocalePath(pathname, "es")} className="hover:underline">ES</Link>
    </div>
  );
}


