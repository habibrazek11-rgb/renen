"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Funnel, Users, BarChart3, Webhook,
    Sparkles, LogOut, ChevronRight, Bot, FlaskConical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface NavUser {
    name: string;
    email: string;
    role: string;
}

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/funnels", label: "Funnels", icon: Funnel },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/integrations/webhooks", label: "Webhooks", icon: Webhook },
];

const aiItems = [
    { href: "/ai/create-funnel", label: "Create Funnel", icon: Bot },
    { href: "/ai/improve-funnel", label: "Improve Funnel", icon: Bot },
    { href: "/ai/generate-segments", label: "Generate Segments", icon: Bot },
];

const DEV_ROLES = [
    { role: "owner", label: "Owner", color: "bg-pink-100 text-pink-700 border-pink-200" },
    { role: "admin", label: "Admin", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { role: "editor", label: "Editor", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { role: "viewer", label: "Viewer", color: "bg-gray-100 text-gray-600 border-gray-200" },
];

export function DashboardNav({ user }: { user: NavUser }) {
    const pathname = usePathname();
    const router = useRouter();
    const [switching, setSwitching] = useState<string | null>(null);
    const [showDevPanel, setShowDevPanel] = useState(false);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    }

    async function handleSwitchRole(role: string) {
        setSwitching(role);
        await fetch("/api/auth/switch-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });
        // Full page reload so server components re-render with new session
        window.location.href = pathname;
    }

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center shadow-md shadow-pink-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">RENEN</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                                    ? "bg-pink-50 text-[#ff36a2] border border-pink-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                            {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </Link>
                    );
                })}

                <div className="pt-4 pb-1">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Bot className="w-3 h-3" /> AI Copilot
                    </p>
                </div>
                {aiItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${active
                                    ? "bg-purple-50 text-purple-700 border border-purple-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Dev Role Switcher */}
            <div className="p-3 border-t border-dashed border-amber-200 bg-amber-50/60">
                <button
                    onClick={() => setShowDevPanel((v) => !v)}
                    className="w-full flex items-center gap-2 text-xs text-amber-700 font-semibold mb-2 hover:text-amber-900 transition-colors"
                >
                    <FlaskConical className="w-3.5 h-3.5" />
                    DEV · Switch Role
                    <ChevronRight
                        className={`w-3 h-3 ml-auto transition-transform ${showDevPanel ? "rotate-90" : ""}`}
                    />
                </button>
                {showDevPanel && (
                    <div className="grid grid-cols-2 gap-1.5">
                        {DEV_ROLES.map(({ role, label, color }) => (
                            <button
                                key={role}
                                onClick={() => handleSwitchRole(role)}
                                disabled={switching !== null}
                                className={`text-xs px-2 py-1.5 rounded-md border font-medium transition-all ${color} ${user.role === role
                                        ? "ring-2 ring-offset-1 ring-amber-400 scale-105"
                                        : "opacity-80 hover:opacity-100 hover:scale-105"
                                    } ${switching === role ? "animate-pulse" : ""}`}
                            >
                                {switching === role ? "..." : label}
                                {user.role === role && " ✓"}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* User */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs capitalize border-pink-200 text-[#ff36a2]">
                        {user.role}
                    </Badge>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-3 h-3" />
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    );
}
