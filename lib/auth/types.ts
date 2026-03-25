// Auth types — shared between JSON provider and future DB provider

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  workspaceId: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  workspaceId: string;
  iat?: number;
  exp?: number;
}

// RBAC helpers
export function canManageWorkspace(role: UserRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canEdit(role: UserRole): boolean {
  return role === 'owner' || role === 'admin' || role === 'editor';
}

export function isReadOnly(role: UserRole): boolean {
  return role === 'viewer';
}
