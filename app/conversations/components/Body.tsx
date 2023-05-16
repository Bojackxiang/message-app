'use client';

import useConversation from "@/app/hooks/useConversation";
import { Message } from "@prisma/client";
import axios from "axios";
import React, { useRef, useState, useEffect} from "react";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";


interface BodyProps {
  initialMessages: Message[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return <div className="flex-1 overflow-y-auto">
    {messages.map((message, i) => (
        <MessageBox 
          isLatest={i === messages.length - 1} 
          key={message.id} 
          data={message as FullMessageType}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
  </div>;
};

export default Body;
