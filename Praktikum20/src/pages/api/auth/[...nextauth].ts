import { signIn, signInWithGoogle } from "@/utils/db/servicefirebase";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import googleProvider from "next-auth/providers/google";
import githubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        fullName: { label: "Full Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
          const user:any = await signIn(credentials.email);

          if (user) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password, 
              user.password,
            );
            if (isPasswordValid) {
              return {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
              };
            }
          }
          return null;
      },
    }),

    googleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    githubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),

  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials" && user) {
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;
      }

      // Handle OAuth providers (Google, GitHub)
      const oauthProviders = ["google", "github"];
      if (account && oauthProviders.includes(account.provider)) {
        const data = {
          fullName: user.name,
          email: user.email,
          image: user.image,
          type: account.provider,
        };

        await signInWithGoogle(data, (result: any) => {
          if (result.status) {
            token.fullName = result.data.fullName;
            token.email = result.data.email;
            token.image = result.data.image;
            token.type = result.data.type;
            token.role = result.data.role;
          }
        });
      }
      return token;
    },
    async session({ session, token }: any) {
        if (!session.user) {
            session.user = {};
        }

        session.user.email = token.email;
        session.user.fullName = token.fullName;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.type = token.type;

        return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  }
};

export default NextAuth(authOptions);