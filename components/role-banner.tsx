"use client";

import { ShieldCheck, Eye, PenLine, Crown, Info } from "lucide-react";

const ROLE_CONFIG: Record<string, {
    label: string;
    description: string;
    icon: React.ElementType;
    bg: string;
    text: string;
    border: string;
    dot: string;
}> = {
    owner: {
        label: "Owner",
        description: "Full access — manage workspace, billing, and all settings.",
        icon: Crown,
        bg: "bg-pink-50",
        text: "text-pink-700",
        border: "border-pink-200",
        dot: "bg-pink-400",
    },
    admin: {
        label: "Admin",
        description: "Manage funnels, leads, and team members. No billing access.",
        icon: ShieldCheck,
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        dot: "bg-purple-400",
    },
    editor: {
        label: "Editor",
        description: "Create and edit funnels. Cannot manage team or workspace settings.",
        icon: PenLine,
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-400",
    },
    viewer: {
        label: "Viewer",
        description: "Read-only access. Cannot create, edit, or delete anything.",
        icon: Eye,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-400",
    },
};

export function RoleBanner({ role, name }: { role: string; name: string }) {
    const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.viewer;
    const Icon = config.icon;

    return (
        <div className={`w-full px-6 py-2.5 ${config.bg} border-b ${config.border} flex items-center gap-3`}>
            <div className={`flex items-center gap-1.5 ${config.text} font-semibold text-sm`}>
                <span className={`inline-block w-2 h-2 rounded-full ${config.dot}`} />
                <Icon className="w-4 h-4" />
                Signed in as <span className="font-bold">{name}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs border ${config.border} ${config.bg} ${config.text} font-bold uppercase tracking-wide`}>
                    {config.label}
                </span>
            </div>
            <span className={`text-xs ${config.text} opacity-75 hidden sm:block`}>
                — {config.description}
            </span>
            {role === "viewer" && (
                <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                    <Info className="w-3 h-3" /> Read-only mode
                </span>
            )}
        </div>
    );
}
