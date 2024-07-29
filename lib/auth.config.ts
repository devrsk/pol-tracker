import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/lib/schema";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials);
        if (validated.success) {
          const { email, password } = validated.data;
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (user && await compare(password, user.passwordHash)) {
            return user;
          }
        }
        return null;
      },
    }),
    // Add other providers like GitHub if needed
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        const userDB = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
          include: {
            budgets: {
              include: {
                transactions: true,
              },
            },
            settings: true,
          },
        });
        if (userDB) {
          session.user = userDB;
        }
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};

export default authConfig;
