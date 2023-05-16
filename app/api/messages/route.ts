import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser();
    const { message, conversationId } = body;
    
    // create message
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser?.id },
        },
        seen: {
          connect: {
            id: currentUser?.id, // 这边 默认发送的人已读
          },
        },
      },
    });

    // update conversation 
    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    

    return new NextResponse(newMessage.body);
  } catch (error: any) {
    console.log("post messages error", error.message);
    return new NextResponse("success", { status: 500 });
  }
}
