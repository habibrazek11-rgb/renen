"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Upload, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    idea: "",
    stage: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call the API
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff36a2] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">RENEN</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-3xl">Submit Your Startup Idea</CardTitle>
                <CardDescription>
                  Tell us about your startup. We&apos;ll evaluate your submission and get back
                  to you within 48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@startup.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Your Startup Inc."
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://yourstartup.com"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stage">Current Stage *</Label>
                      <select
                        id="stage"
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a stage</option>
                        <option value="idea">Idea</option>
                        <option value="mvp">MVP</option>
                        <option value="early-revenue">Early Revenue</option>
                        <option value="growth">Growth</option>
                        <option value="scale">Scale</option>
                      </select>
                    </div>
                  </div>

                  {/* Idea Description */}
                  <div className="space-y-2">
                    <Label htmlFor="idea">Describe Your Startup Idea *</Label>
                    <Textarea
                      id="idea"
                      name="idea"
                      placeholder="Tell us about your startup. What problem are you solving? Who are your customers? What makes your solution unique? Include any relevant traction, team background, and market insights."
                      value={formData.idea}
                      onChange={handleChange}
                      required
                      rows={10}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 200 characters. Be as detailed as possible.
                    </p>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="files">Supporting Documents (Optional)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="files"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag
                            and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOCX, PPTX up to 10MB
                          </p>
                        </div>
                        <input
                          id="files"
                          name="files"
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.docx,.pptx"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card text-center">
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Application Submitted!</CardTitle>
                  <CardDescription className="text-base max-w-md">
                    Thank you for submitting your startup idea. Our team will review your
                    application and get back to you within 48 hours.
                  </CardDescription>
                  <div className="pt-4">
                    <Button asChild variant="outline">
                      <Link href="/">Return to Homepage</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 RENEN. Investment Evaluation, Automated & Defensible.</p>
        </div>
      </footer>
    </div>
  );
}
