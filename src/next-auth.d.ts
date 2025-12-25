// next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      roleId?: number; // Thêm roleId vào Session
    } & DefaultSession['user'];
  }

  interface User {
    roleId?: number; // Thêm roleId vào User (để dùng trong authorize)
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roleId?: number;
  }
}
