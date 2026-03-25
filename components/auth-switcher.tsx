"use client";

import { useState, useEffect } from "react";
import {
    getCurrentUser,
    login,
    logout,
    MOCK_USERS,
    type MockUser,
} from "@/lib/mock-auth";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, ChevronDown } from "lucide-react";

export function AuthSwitcher() {
    const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setCurrentUser(getCurrentUser());
    }, []);

    const handleLogin = (email: string) => {
        const user = login(email);
        setCurrentUser(user);
        // Reload to update UI
        window.location.reload();
    };

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        window.location.href = "/";
    };

    if (!mounted) {
        return null;
    }

    if (!currentUser) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <User className="w-4 h-4" />
                        Sign In (Test Mode)
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Select Test Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {MOCK_USERS.map((user) => (
                        <DropdownMenuItem
                            key={user.id}
                            onClick={() => handleLogin(user.email)}
                            className="cursor-pointer"
                        >
                            <div className="flex flex-col gap-1">
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {user.email}
                                </div>
                                <Badge
                                    variant={user.role === "admin" ? "default" : "secondary"}
                                    className="w-fit text-xs"
                                >
                                    {user.role}
                                </Badge>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{currentUser.name}</span>
                        <Badge
                            variant={currentUser.role === "admin" ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {currentUser.role}
                        </Badge>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <div>{currentUser.name}</div>
                        <div className="text-xs font-normal text-muted-foreground">
                            {currentUser.email}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Switch Account
                </DropdownMenuLabel>
                {MOCK_USERS.filter((u) => u.id !== currentUser.id).map((user) => (
                    <DropdownMenuItem
                        key={user.id}
                        onClick={() => handleLogin(user.email)}
                        className="cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <div className="flex flex-col">
                                <span className="text-sm">{user.name}</span>
                                <Badge
                                    variant={user.role === "admin" ? "default" : "secondary"}
                                    className="w-fit text-xs mt-1"
                                >
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
