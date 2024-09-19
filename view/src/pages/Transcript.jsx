import React, { useContext } from "react";
import { Store } from "../context/store";
import ProgressList from "../components/ProgressList";

export default function Transcript() {
  const { state } = useContext(Store);
  const { userInfo, seasonID } = state;

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Progress</p>
      <div className="flex flex-col space-y-4 lg:w-[50%] mb-0 lg:mb-4">
        <div className="flex flex-col space-y-4 border-2 border-gray-200 rounded-xl p-6">
          <ProgressList
            user_id={userInfo.id}
            level_id={userInfo.enrollment?.level_id}
            season={seasonID}
          />
        </div>
      </div>
    </div>
  );
}
