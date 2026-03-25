"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Layers, Shield, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/mock-auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff36a2] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">RENEN</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign in →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff36a2]" />
            <span className="text-xs font-medium text-[#ff36a2]">Investment Evaluation Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Evaluate startup ideas
            <br />
            <span className="text-[#ff36a2]">at scale.</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mb-10">
            Structured intake, deterministic scoring, and automated segment routing —
            so your team focuses on the best opportunities.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff36a2] text-white text-sm font-semibold rounded-lg hover:bg-[#e02d8f] transition-colors"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              View demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-100" />
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Everything in one place</h2>
          <p className="text-gray-500 text-sm">Built for investment teams that need speed and consistency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {[
            {
              icon: FileText,
              title: "Smart Intake",
              desc: "Capture ideas via text, files, and custom questionnaires with automatic field extraction.",
            },
            {
              icon: BarChart3,
              title: "Deterministic Scoring",
              desc: "Category-based evaluation with configurable weights. Auditable and investor-defensible.",
            },
            {
              icon: Layers,
              title: "Segment Routing",
              desc: "Automatic Pass / Revise / Reject decisions based on score thresholds and rules.",
            },
            {
              icon: Shield,
              title: "Human Review",
              desc: "Nothing auto-publishes. Built-in guardrails ensure your team stays in control.",
            },
            {
              icon: Zap,
              title: "Webhooks & API",
              desc: "Connect to your CRM or data warehouse with HMAC-signed webhook delivery.",
            },
            {
              icon: FileText,
              title: "PDF Reports",
              desc: "Generate professional feasibility reports with full scoring breakdowns.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white p-6 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center mb-4">
                <f.icon className="w-4 h-4 text-[#ff36a2]" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "100+", label: "Evaluations run" },
            { value: "< 2 min", label: "Per assessment" },
            { value: "100%", label: "Auditable decisions" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-[#ff36a2] mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to get started?</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Sign in to your workspace and start evaluating startup ideas with confidence.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#ff36a2] text-white text-sm font-semibold rounded-lg hover:bg-[#e02d8f] transition-colors"
        >
          Sign in to RENEN
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#ff36a2] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold">RENEN</span>
          </div>
          <p className="text-xs text-gray-400">Investment Evaluation Platform</p>
        </div>
      </footer>
    </div>
  );
}
