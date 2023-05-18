import getCurrentUser from "@/app/actions/getCurrentUser";
import { FullMessageType } from "@/app/types";
import Avatar from "@/app/users/components/Avatar";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import React from "react";

interface MessageBoxProps {
  data: FullMessageType;
  isLatest: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLatest }) => {
  const session = useSession();
  const isOwn = data.sender.email === session.data?.user?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');


  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden p-2 rounded-xl",
    isOwn ? "bg-green-500" : "bg-gray-100"
  );

  return (
    <div className={container}>
      {/* avatar */}
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      {/* body */}
      <div className={body}>
        {/* date format */}
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>

        {/* message  */}
        <div className={message}>{data.body}</div>

        {/* check if latest */}

        {isLatest && isOwn && seenList.length > 0 && (
          <div
            className="
              text-xs 
              font-light 
              text-gray-500
              "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
