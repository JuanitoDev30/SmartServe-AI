import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     // Allows relative callback URLs
  //     console.log('Redirecting to:', url, 'Base URL:', baseUrl);
  //     if (url.startsWith('/')) return `${baseUrl}${url}`;

  //     // Allows callback URLs on the same origin
  //     if (new URL(url).origin === baseUrl) return url;

  //     return `${baseUrl}${url}`;
  //   },
  // },
  callbacks: {
    redirect: (params): string => {
      return '/dashboard';
    },
  },
});
