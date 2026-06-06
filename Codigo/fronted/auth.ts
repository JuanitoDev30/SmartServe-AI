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
        if (!credentials?.email || !credentials?.password) {
          console.log(' Credenciales vacías');
          return null;
        }

        try {
          // console.log(
          //   ' Llamando al backend:',
          //   `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          // );

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          //  console.log(' Respuesta del backend:', res.status);

          if (!res.ok) {
            //const error = await res.json();
            //console.log(' Error del backend:', error);
            return null;
          }

          const data = await res.json();
          //  console.log(' Login exitoso:', data.admin);

          return {
            id: data.admin.id,
            name: data.admin.nombre,
            email: data.admin.email,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error(' Error en authorize:', error);
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
