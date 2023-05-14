// import getConversations from "../actions/getConversations";

import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../users/components/sidebar";
import ConversationList from "./components/ConversationList";
// import getUsers from "../actions/getUsers";
// import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  console.log("conversation layout");
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList
          users={users}
          title="Messages"
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}
