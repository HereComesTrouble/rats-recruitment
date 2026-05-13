import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login"
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnAccount = nextUrl.pathname.startsWith("/account");
      if (isOnAccount) {
        if (isLoggedIn) return true;
        const redirectTo = new URL("/login", nextUrl);
        redirectTo.searchParams.set("next", nextUrl.pathname);
        return Response.redirect(redirectTo);
      }
      return true;
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
} satisfies NextAuthConfig;
