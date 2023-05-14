import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "next-auth";

const useOtherUser = (
  conversations:
    | FullConversationType
    | {
        users: User[];
      }
) => {
  const session = useSession();
  const currentUser = session.data?.user?.email;
  const otherUser = useMemo(() => {
    if (conversations) {
      const otherUsers =  conversations.users.filter((user: User) => user.email !== currentUser);

      return otherUsers[0]
    }
  }, [conversations, currentUser, session]);

  return otherUser;
};

export default useOtherUser;
