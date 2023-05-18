import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    // update the conersation seenIdList
    const currentUser = await getCurrentUser();
    const currentUserId = currentUser?.id;
    const {
      conversationId
    } = params;

    // if valid update existing conversation
    if (currentUserId && typeof conversationId === "string") {
      const existingConversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: {
          messages: {
            include: {
              seen: true,
            },
          },
          users: true,
        },
      });

      if (!existingConversation) {
        return new NextResponse("Invalid ID", { status: 400 });
      }

      // Only start to update the last message seen
      const lastMessage =
        existingConversation.messages[existingConversation.messages.length - 1];

      if (!lastMessage) {
        return NextResponse.json(existingConversation);
      }

      // Update seen of last message
      const updatedMessage = await prisma.message.update({
        where: {
          id: lastMessage.id,
        },
        include: {
          sender: true,
          seen: true,
        },
        data: {
          seen: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });

      await pusherServer.trigger(conversationId, "message:seen", {
        conversationId, 
        messages: [updatedMessage]
      });

      // check if the message has been read 
      if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
        return NextResponse.json(existingConversation);
      }

      await pusherServer.trigger(conversationId, "message:update", updatedMessage)

      return NextResponse.json(updatedMessage);
    }

    // handle not valid case
    return NextResponse.json(
      "cannot find the conversation with the conversation id ",
      { status: 404 }
    );
  } catch (error: any) {
    console.log('error', error.message);
    return NextResponse.json(
      "somthing wrong",
      { status: 500 }
    );
  }
}
