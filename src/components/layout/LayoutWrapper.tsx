"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ 
  children,
  settings = {}
}: { 
  children: React.ReactNode;
  settings?: Record<string, string>;
}) {
  const pathname = usePathname();
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  return (
    <>
      {!isDashboardOrAdmin && <Navbar settings={settings} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboardOrAdmin && <Footer settings={settings} />}
    </>
  );
}
