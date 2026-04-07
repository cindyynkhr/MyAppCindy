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
        try {
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
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      googleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      githubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),

  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      try {
        if (account?.provider === "credentials" && user) {
          token.email = user.email || "";
          token.fullName = user.fullName || "";
          token.role = user.role || "user";
          token.id = user.id || "";
        }

        // Handle OAuth providers (Google, GitHub)
        const oauthProviders = ["google", "github"];
        if (account && oauthProviders.includes(account.provider) && user) {
          const data = {
            fullName: user.name || "",
            email: user.email || "",
            image: user.image || "",
            type: account.provider,
          };

          // Wrap callback in Promise
          try {
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error("OAuth callback timeout"));
              }, 5000);

              signInWithGoogle(data, (result: any) => {
                clearTimeout(timeout);
                if (result && result.status) {
                  token.fullName = result.data?.fullName || data.fullName;
                  token.email = result.data?.email || data.email;
                  token.image = result.data?.image || data.image;
                  token.type = result.data?.type || data.type;
                  token.role = result.data?.role || "user";
                  resolve(result);
                } else {
                  // Fallback if callback doesn't return proper structure
                  token.fullName = data.fullName;
                  token.email = data.email;
                  token.image = data.image;
                  token.type = data.type;
                  token.role = "user";
                  resolve({ status: true });
                }
              });
            });
          } catch (oauthError) {
            console.error("OAuth callback error:", oauthError);
            // Fallback values for OAuth
            token.fullName = user.name || "";
            token.email = user.email || "";
            token.image = user.image || "";
            token.type = account.provider;
            token.role = "user";
          }
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }: any) {
        try {
          if (!session.user) {
              session.user = {};
          }

          session.user.email = token.email || "";
          session.user.fullName = token.fullName || "";
          session.user.image = token.image || "";
          session.user.role = token.role || "user";
          session.user.type = token.type || "";
          session.user.id = token.id || "";

          return session;
        } catch (error) {
          console.error("Session callback error:", error);
          return session;
        }
    },
  },

  pages: {
    signIn: "/auth/login",
  }
};

export default NextAuth(authOptions);