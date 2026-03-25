"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/mock-auth";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Auto-redirect only if a session is found (bypass active)
    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            const timer = setTimeout(() => {
                router.push("/dashboard");
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch("/api/auth/login", { method: "POST" });
            router.push("/dashboard");
            router.refresh();
        } catch {
            // Even if it fails, try to go in
            router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            {/* Background orbs */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8 animate-[fadeInUp_0.6s_ease-out]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff36a2] to-[#ff6b9d] flex items-center justify-center shadow-lg shadow-pink-500/30">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">RENEN</span>
                </div>

                <Card className="shadow-2xl shadow-pink-500/10 border-2 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <CardDescription>Sign in to your RENEN workspace</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="email">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="owner@renen.app"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium" htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff36a2] focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#ff36a2] to-[#ff6b9d] hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-[1.02] py-2.5 text-base font-medium"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        {/* Dev credentials hint */}
                        <div className="mt-6 p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 mb-2">Demo credentials (password: password123)</p>
                            <div className="space-y-1">
                                {[
                                    { email: "owner@renen.app", role: "Owner" },
                                    { email: "admin@renen.app", role: "Admin" },
                                    { email: "editor@renen.app", role: "Editor" },
                                    { email: "viewer@renen.app", role: "Viewer" },
                                ].map((u) => (
                                    <button
                                        key={u.email}
                                        type="button"
                                        onClick={() => { setEmail(u.email); setPassword("password123"); }}
                                        className="w-full text-left text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors flex items-center justify-between"
                                    >
                                        <span className="text-gray-700">{u.email}</span>
                                        <span className="text-[#ff36a2] font-medium">{u.role}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
