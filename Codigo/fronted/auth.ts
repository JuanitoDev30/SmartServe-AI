import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.API_URL}/api/auth/login`,
           // `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!res.ok) return null;

          const data = await res.json();

          const payload = JSON.parse(
            Buffer.from(data.access_token.split('.')[1], 'base64').toString(),
          );

          return {
            id: data.admin.id,
            name: data.admin.nombre,
            email: data.admin.email,
            accessToken: data.access_token,
            expiresAt: payload.exp * 1000,
          };
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.expiresAt = user.expiresAt;
      }

      if (token.expiresAt && Date.now() > (token.expiresAt as number)) {
        return null;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id ?? '';
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
