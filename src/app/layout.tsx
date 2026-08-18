import type { Metadata } from "next";
import { Alexandria, Cairo, Tajawal, Almarai, Readex_Pro, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/store/cartStore";
import { prisma } from "@/lib/prisma";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { GlobalStyleProvider } from "@/components/providers/GlobalStyleProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-alexandria"
});

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "900"],
  variable: "--font-cairo"
});

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal"
});

const almarai = Almarai({ 
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai"
});

const readex = Readex_Pro({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-readex"
});

const amiri = Amiri({ 
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri"
});

export const metadata: Metadata = {
  title: "أورجينال - لفرش السيارات الفاخر",
  description: "تجهيز، تفصيل، وعناية فائقة بفرش السيارات. اكتشف أجود أنواع الجلود الألمانية واحجز موعداً لسيارتك.",
  keywords: ["فرش سيارات", "جلود ألمانية", "تفصيل سيارات", "أورجينال", "car upholstery", "original"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  // Fetch global settings safely
  let settings: Record<string, string> = {};
  try {
    if (prisma && (prisma as any).siteSettings) {
      const settingsRecords = await (prisma as any).siteSettings.findMany();
      if (Array.isArray(settingsRecords)) {
        settings = settingsRecords.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>);
      }
    }
  } catch (error) {
    console.error("Safe fallback - Failed to fetch site settings:", error);
  }

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${alexandria.variable} ${cairo.variable} ${tajawal.variable} ${almarai.variable} ${readex.variable} ${amiri.variable} font-sans antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <ThemeProvider>
          <SessionProvider>
            <GlobalStyleProvider settings={settings} />
            <CartProvider>
              {/* Premium Global Grid & Lighting Background */}
              <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
                {/* Advanced Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--primary),0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary),0.07)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                
                {/* Hexagon / Diagonal Tech texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAiLz4KPHBhdGggZD0iTTAgMEw4IDhNOCAwTDAgOCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDgiLz4KPC9zdmc+')] opacity-50 dark:[filter:invert(1)] dark:opacity-20 mix-blend-overlay"></div>
                
                {/* Cinematic Lighting effects */}
                <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vh] rounded-full bg-primary/10 blur-[120px] mix-blend-normal opacity-50"></div>
                <div className="absolute top-[20%] -right-[20%] w-[50vw] h-[60vh] rounded-full bg-accent/10 blur-[150px] mix-blend-normal opacity-40"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[40vw] h-[40vh] rounded-full bg-primary/5 blur-[100px] mix-blend-normal opacity-30"></div>
              </div>

              <LayoutWrapper settings={settings}>
                {children}
              </LayoutWrapper>

              <Toaster position="top-center" 
                toastOptions={{
                  className: 'bg-card text-card-foreground border border-border shadow-2xl',
                  style: { borderRadius: '12px', padding: '16px' }
                }} 
              />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
