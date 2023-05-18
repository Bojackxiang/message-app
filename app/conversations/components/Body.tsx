"use client";

import useConversation from "@/app/hooks/useConversation";
import { Message } from "@prisma/client";
import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: Message[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  // handle new message
  const messagehandler = (message: FullMessageType) => {
    // update seen message
    axios.post(`/api/conversations/${conversationId}/seen`);

    // update messages view
    setMessages((current) => {
      if (find(current, { id: message.id })) {
        return current;
      }
      return [...messages, message];
    });

    // scroll to bottom in the view
    bottomRef.current?.scrollIntoView();
  };

  // update the seen list when for all user
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`).then((resp) => {
      console.log(resp);
    });
  }, [conversationId]);

  // connect to the puser
  useEffect(() => {
    pusherClient.subscribe(conversationId); // sub to the conversation channnel
    bottomRef.current?.scrollIntoView();

    pusherClient.bind("message:new", messagehandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new", messagehandler);
    };
  }),
    [conversationId];

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLatest={i === messages.length - 1}
          key={message.id}
          data={message as FullMessageType}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
