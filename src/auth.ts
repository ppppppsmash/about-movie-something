import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  secret: env.AUTH_SECRET,
  session: { maxAge: 24 * 60 * 60 },
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET
    })
  ],
  callbacks: {
    /** Restrict sign-in to a workspace domain when AUTH_ALLOWED_DOMAIN is set. */
    async signIn({ profile }) {
      const allowed = env.AUTH_ALLOWED_DOMAIN;
      if (!allowed) return true;
      return profile?.email?.endsWith(`@${allowed}`) ?? false;
    },
    /** Make sure session.user.email is populated client-side. */
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    }
  }
});
