import prisma from "@/app/libs/prismadb";
import { getSession } from "./getSession";

const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }

  try {
    // ? 这边是找到所有的 users，但是我们不是应该找到 conversation 吗
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          email: session?.user?.email,
        }
      },
    });

    return users; 
  } catch (error: any) {
    console.log('get users error', error.message);
    return [];
  }
};

export default getUsers;
