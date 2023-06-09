import { format } from "date-fns";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Avatar from "@/app/users/components/Avatar";
import AvatarGroup from "./AvatarGroup";
import clsx from "clsx";
import React, { useMemo, useCallback } from "react";
import useOtherUser from "@/app/hooks/useOtherUsers";

interface ConversationBoxProps {
  data: FullConversationType;
  selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const router = useRouter();
  const otherUser = useOtherUser(data);
  const session = useSession();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    return data.messages[data.messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, []);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || []; // seen 是一个 User[], 表示谁看过了这条信息

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email !== userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    return lastMessage?.body || "Start a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        ` w-full relative flex items-center space-x-3 p-3 hover:bg-blue-200 rounded-lg transition cursor-pointer `,
        selected ? "bg-blue-300" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser as User} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || (otherUser as User).name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  text-gray-400 
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate 
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
