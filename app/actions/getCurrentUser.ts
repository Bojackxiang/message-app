import prisma from '@/app/libs/prismadb'
import { getSession } from './getSession';

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if(!session){
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string
      }
    });

    return user;
  } catch (error) {
    return null; 
  }
}

export default getCurrentUser;