// auth.config.ts
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/lib/schema";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export default {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        console.log("Received credentials:", credentials);
        const validated = LoginSchema.safeParse(credentials);
        if (validated.success) {
          const { email, password } = validated.data;
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user) {
            console.log("User not found");
            return null;
          }
          const isPasswordValid = await compare(password, user.passwordHash);
          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }
          console.log("User authenticated");
          return user;
        }
        console.log("Validation failed");
        return null;
      },
    }),
    // Add other providers if needed
  ],
  pages: {
    error: 'error', // Custom error page URL
  },
} satisfies NextAuthConfig;
