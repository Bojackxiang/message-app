import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    // 创建一个 新的 group conversation 
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({  
                id: member.value 
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        include: {
          users: true, // 返回 conversation 中的所有 users
        }
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          // pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    // 找到已经存在 conversations
    // 这边找到的对话，
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // 创建一个 和别人的新的 conversation 
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    });

     // Update all connections with new conversation
     newConversation.users.map((user) => {
      if (user.email) {
        // pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation)





  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
