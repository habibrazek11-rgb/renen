"use client";

/**
 * Mock Authentication System
 * Provides simple JSON-based authentication for testing without database
 */

export type SimplifiedRole = "admin" | "company";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: SimplifiedRole;
  company_name?: string;
}

// Mock users for testing
export const MOCK_USERS: MockUser[] = [
  {
    id: "user-admin-1",
    name: "Admin User",
    email: "admin@test.com",
    role: "admin",
  },
  {
    id: "user-company-a",
    name: "John Smith",
    email: "company-a@test.com",
    role: "company",
    company_name: "Company A",
  },
  {
    id: "user-company-b",
    name: "Jane Doe",
    email: "company-b@test.com",
    role: "company",
    company_name: "Company B",
  },
];

const STORAGE_KEY = "renen_current_user";

/**
 * Get the current logged-in user from localStorage
 */
export function getCurrentUser(): MockUser | null {
  if (typeof window !== "undefined") {
    const isSignedOut = document.cookie.includes("renen_signed_out=true");
    if (isSignedOut) return null;
  }
  
  // Static Auth Bypass: Always return Admin unless explicitly signed out
  return MOCK_USERS[0];
}

/**
 * Login a user by email
 */
export function login(email: string): MockUser | null {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return null;
  
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // Clear the signed out flag cookie (handled by API but for safety here too)
    document.cookie = "renen_signed_out=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
  
  return user;
}

/**
 * Logout the current user
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    // Signout flag is handled by the /api/auth/logout route
  }
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if current user can view a submission
 */
export function canViewSubmission(submissionUserId: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin can view all
  if (user.role === "admin") return true;
  
  // Company can only view their own
  return user.id === submissionUserId;
}

/**
 * Get all mock users (for admin)
 */
export function getAllUsers(): MockUser[] {
  return MOCK_USERS;
}

/**
 * Find user by ID
 */
export function getUserById(id: string): MockUser | null {
  return MOCK_USERS.find((u) => u.id === id) || null;
}
