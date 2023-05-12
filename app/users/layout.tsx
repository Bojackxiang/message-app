// import getUsers from "../actions/getUsers";
// import Sidebar from "../components/sidebar/Sidebar";
// import UserList from "./components/UserList";

import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";
import Sidebar from "./components/sidebar";

// 每个文件夹都可以有一个 layout 文件
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
