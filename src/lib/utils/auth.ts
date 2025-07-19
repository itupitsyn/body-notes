import { authOptions } from '@/constants/auth';
import { getServerSession } from 'next-auth';

export const auth = () => {
  return getServerSession(authOptions);
};
