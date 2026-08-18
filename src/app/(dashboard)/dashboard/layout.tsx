import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30 neon-grid" dir="rtl">
      {/* 
        The top navigation is handled by the global Navbar.
        We just provide a nice container for the dashboard pages.
      */}
      <main className="container mx-auto px-4 py-8 lg:py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
