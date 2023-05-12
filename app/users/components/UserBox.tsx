import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useCallback, useReducer, useState } from "react";
import Avatar from "./Avatar";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    setLoading(true);
    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((data) => {
        console.log(data)
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className=" w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      onClick={handleClick}
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
