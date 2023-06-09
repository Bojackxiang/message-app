import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import React from "react";
import Header from "../components/Header";
import Body from "../components/Body";
import Form from "../components/Form";

interface ConversationIdProps {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: ConversationIdProps }) => {
  const conversation = await getConversationById(params.conversationId);
  const messages = conversation?.id ? await getMessages(conversation.id) : [];
  
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
