import React from "react";
import HERO from "../assets/developer.svg";
import AlertDialog from "../components/AlertDialog";

function Home() {
  return (
    <div className="flex bg-white justify-center min-h-[90vh]">
      <div className="flex lg:flex-row flex-col items-center justify-center lg:px-32">
        <div className="flex flex-col p-2">
          <div className="text-violet-500 text-4xl lg:text-7xl lg:text-left text-center font-bold pb-5 whitespace-nowrap">
            Welcome back!
          </div>
          <div className="text-xl lg:text-2xl font-medium lg:text-left text-center">
            Create resources, manage enrollment, track the performance of each
            trainee and build learning community — all in one place.
          </div>
        </div>
        <div className="h-96 md:h-[800px]">
          <img src={HERO} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Home;
