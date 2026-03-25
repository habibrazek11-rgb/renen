import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import { RoleBanner } from '@/components/role-banner';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session) redirect('/login');

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <DashboardNav user={{ name: session.name, email: session.email, role: session.role }} />
            <main className="flex-1 min-w-0 overflow-auto">
                <RoleBanner role={session.role} name={session.name} />
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
