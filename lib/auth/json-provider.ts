// JSON-based user provider — reads from data/users.json
// To switch to DB auth: create a PrismaUserProvider implementing IUserProvider
// and swap the import in app/api/auth/login/route.ts

import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import type { IUserProvider } from './provider';
import type { AuthUser } from './types';

interface JsonUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  workspaceId: string;
}

function loadUsers(): JsonUser[] {
  const filePath = path.join(process.cwd(), 'data', 'users.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as JsonUser[];
}

export class JsonUserProvider implements IUserProvider {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const users = loadUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      workspaceId: user.workspaceId,
    };
  }

  async verifyPassword(user: AuthUser, plainPassword: string): Promise<boolean> {
    const users = loadUsers();
    const jsonUser = users.find((u) => u.id === user.id);
    if (!jsonUser) return false;
    return bcrypt.compare(plainPassword, jsonUser.passwordHash);
  }
}

// Singleton instance — swap this to new PrismaUserProvider() when ready
export const userProvider: IUserProvider = new JsonUserProvider();
