import React, { useContext, useReducer, useState } from "react";
import HERO from "../assets/developer.svg";
import AlertDialog from "../components/AlertDialog";
import { Store } from "../context/store";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import NewSeasonWindow from "../components/NewSeasonWindow";

function Home() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, seasons, registrationAvailable, newSeasonWindowOpen } = state;

  const handleClosePopup = () => {
    ctxDispatch({ type: "CLOSE_NEWSEASONWINDOW"});
    sessionStorage.setItem("newSeasonWindowOpen", false);
  };

  return (
    <>
    <div className="flex bg-white justify-center min-h-[5vh]">
      <div className="flex lg:flex-row flex-col items-center justify-center lg:px-32">
        <div className="flex flex-col p-2">
          <div className="text-violet-500 text-4xl lg:text-7xl lg:text-left text-center font-bold pb-5 whitespace-nowrap">
            Welcome back!
          </div>
          <div className="text-xl lg:text-2xl font-medium lg:text-left text-center">
          We will help you keep track of your progress within enrolled levels, build a learning community,
          get connected to your mentor - all in one place
          </div>
        </div>
        <div className="h-96 md:h-[800px]">
          <img src={HERO} className="w-full h-full" />
        </div>
      </div>
    </div>
      {userInfo && userInfo.latestEnrollmentSeason < import.meta.env.VITE_CURRENT_SEASON_ID && registrationAvailable ?
      <div className="flex flex-col justify-center">
        <div>
          <Dialog
            fullWidth
            open={newSeasonWindowOpen}
            onClose={handleClosePopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <NewSeasonWindow/>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      : null}
      <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
        <p className="text-3xl font-semibold lg:my-10 mb-4">
          Available Levels
        </p>
        <div className="flex flex-col  lg:w-[50%] mb-0 lg:mb-4">
            <div className="flex flex-col sm:text-xl border-2 border-gray-200 rounded-xl p-6">
              <NewSeasonWindow/>
            </div>
        </div>
      </div>
      </>
  );
}

export default Home;
