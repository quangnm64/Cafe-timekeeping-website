import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '../prisma/prismaClient';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // const user = await prisma.account.findUnique({
        //   where: {
        //     employeeCode: parseInt(credentials.username as string),
        //     password: credentials.password as string,
        //   },
        // });
        const user = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Bắt buộc để Server hiểu là JSON
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error('Request failed');
          }
          return res.json();
        });
        if (!user) return null;
        return {
          id: user.accountId.toString(),
          name: user.employeeId.toString(),
          roleId: user.roleId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // token.roleId = (user as any).roleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.roleId = token.roleId as number;
      }
      return session;
    },
  },
});
