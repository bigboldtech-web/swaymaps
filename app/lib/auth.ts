import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../../lib/prisma";

const providers: any[] = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() }
      });
      if (!user) return null;
      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) return null;
      return { id: user.id, email: user.email, name: user.name, plan: user.plan };
    }
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleProvider = require("next-auth/providers/google").default;
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  const GithubProvider = require("next-auth/providers/github").default;
  providers.push(GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }));
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && user?.email) {
        // Upsert user for OAuth providers (Google, GitHub, SAML, etc.)
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name || user.email.split("@")[0] },
          create: {
            email: user.email,
            name: user.name || user.email.split("@")[0],
            passwordHash: crypto.randomUUID(), // placeholder for OAuth users
            plan: "free",
          },
        });
        // Get the DB user to set the id and plan on the session
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          (user as any).id = dbUser.id;
          (user as any).plan = dbUser.plan;
          (user as any).isAdmin = dbUser.isAdmin;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.plan = (user as any).plan ?? "free";
        token.isAdmin = (user as any).isAdmin ?? false;
      } else {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email as string } });
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan ?? "free";
          token.isAdmin = dbUser.isAdmin ?? false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup"
  }
};
