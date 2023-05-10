import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    return params?.conversationId as string || "";
  }, [params]);

  const isOpen = useMemo(() => {
    return !!conversationId;
  }, [conversationId]);

  return useMemo(() => {
    return {isOpen, conversationId};
  }, [isOpen, conversationId]);
};

export default useConversation;
