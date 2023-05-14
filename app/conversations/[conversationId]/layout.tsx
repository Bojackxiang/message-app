import Sidebar from "@/app/users/components/sidebar";

// 每个文件夹都可以有一个 layout 文件
async function ConversationIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <h2>hello world</h2>
      {children}
    </Sidebar>
  );
}

export default ConversationIdLayout;
