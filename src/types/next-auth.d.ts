import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      role?: 'SUPER_ADMIN' | 'ADMIN';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'SUPER_ADMIN' | 'ADMIN';
  }
}
