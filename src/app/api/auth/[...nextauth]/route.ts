import NextAuth from 'next-auth';
import { authOptions } from '@/constants/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
