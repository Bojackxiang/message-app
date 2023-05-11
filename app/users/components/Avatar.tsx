"use client";

import { User } from "@prisma/client";

// import useActiveList from "../hooks/useActiveList";
import Image from "next/image";

interface AvatarProps {
  user?: User | null;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  // const { members } = useActiveList();
  // const isActive = members.indexOf(user?.email!) !== -1;
  const isActive = true;
  console.log("user", user);

  return (
    <div className="relative">
      {user?.name ? (
        <>
          <div className="relative inline-block rounded-full overflow-hiddenh-9 w-9 md:h-11 md:w-11 bg-red-300 text-center">
            <span className="block text-xl mt-2">{user.name[0].toUpperCase()}</span>
          </div>
        </>
      ) : (
        <>
          <div className="relative inline-block rounded-full overflow-hiddenh-9 w-9 md:h-11 md:w-11">
            <Image
              fill
              src={user?.image || "/images/placeholder.jpg"}
              alt="Avatar"
            />
          </div>
        </>
      )}

      {isActive ? (
        <span
          className="
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
          "
        />
      ) : null}
    </div>
  );
};

export default Avatar;
