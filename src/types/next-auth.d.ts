import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

export type UserRole = "ADMIN" | "AUDIT_MANAGER" | "AUDITOR" | "VIEWER";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
    accessToken?: string;
  }
}
