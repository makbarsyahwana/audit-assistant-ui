import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // MVP: mock authentication — will connect to audit-assistant-api in production
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo users for development
        const demoUsers: Record<string, { id: string; name: string; email: string; role: string }> = {
          "admin@audit.dev": {
            id: "usr_001",
            name: "Admin User",
            email: "admin@audit.dev",
            role: "admin",
          },
          "manager@audit.dev": {
            id: "usr_002",
            name: "Sarah Chen",
            email: "manager@audit.dev",
            role: "audit_manager",
          },
          "auditor@audit.dev": {
            id: "usr_003",
            name: "James Wilson",
            email: "auditor@audit.dev",
            role: "auditor",
          },
        };

        const user = demoUsers[credentials.email];
        if (user && credentials.password === "demo123") {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
};
