import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;
    console.log('channel: ', channel);

    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      console.log("pusher:member_added ", member.id);
      add(member.id)
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      console.log('pusher:member_removed', member);
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    }
  }, [activeChannel, set, add, remove]);
}

export default useActiveChannel;
