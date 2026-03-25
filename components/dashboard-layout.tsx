"use client";

import { AuthSwitcher } from "@/components/auth-switcher";
import { getCurrentUser } from "@/lib/mock-auth";
import {
    LayoutDashboard,
    FileText,
    Settings,
    Menu,
    X,
    PlusCircle,
    History,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const user = getCurrentUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isAdmin = user?.role === "admin";

    const navItems = isAdmin
        ? [
            { name: "Overview", href: "/admin", icon: LayoutDashboard },
            { name: "Consultations", href: "/admin", icon: FileText },
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ]
        : [
            { name: "My Dashboard", href: "/company", icon: LayoutDashboard },
            { name: "Submit Idea", href: "/submit", icon: PlusCircle },
            { name: "My Reports", href: "/company", icon: History },
            { name: "Settings", href: "/company/settings", icon: Settings },
        ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r shadow-sm transition-all duration-300 z-50 fixed lg:static inset-y-0 left-0 ${isSidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
                    } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Section */}
                    <div className="p-6 flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center shrink-0">
                                <span className="text-white font-bold">R</span>
                            </div>
                            {isSidebarOpen && (
                                <span className="text-xl font-bold bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] bg-clip-text text-transparent">
                                    RENEN
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.href
                                        ? "bg-pink-50 text-[#ff36a2]"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* User Section at bottom */}
                    <div className="p-4 border-t">
                        <AuthSwitcher />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>

                    <div className="flex items-center gap-4">
                        {!isAdmin && (
                            <Link href="/submit">
                                <Button className="bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d]">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    New Idea
                                </Button>
                            </Link>
                        )}
                        {isAdmin && (
                            <div className="text-xs font-bold text-[#ff36a2] bg-pink-50 px-2 py-1 rounded">ADMIN MODE</div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
