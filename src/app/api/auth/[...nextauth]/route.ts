import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session(sessionData) {
      sessionData.session.user.id = sessionData.user.id;

      return sessionData.session;
    },
  },
};

const handler = NextAuth(authOptions);

export const auth = () => {
  return getServerSession(authOptions);
};

export { handler as GET, handler as POST };
