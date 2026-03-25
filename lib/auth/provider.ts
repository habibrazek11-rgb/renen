// IUserProvider — abstract interface for user lookup and password verification
// To swap from JSON to DB auth: implement this interface with a DB-backed class
// and replace the import in app/api/auth/login/route.ts

import type { AuthUser } from './types';

export interface IUserProvider {
  findByEmail(email: string): Promise<AuthUser | null>;
  verifyPassword(user: AuthUser, plainPassword: string): Promise<boolean>;
}
