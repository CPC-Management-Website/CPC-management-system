import React, { useContext, useReducer, useState } from "react";
import HERO from "../assets/developer.svg";
import AlertDialog from "../components/AlertDialog";
import { Store } from "../context/store";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CourseContent from "../components/CourseContent";

function Home() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, seasons, registrationAvailable, newSeasonWindowOpen } = state;

  const level1Content = [
    {value:"C++ Fundamentals (Intro to C++, Data Types, Control Flow, etc.)"},
    {value:"Complexity Analysis and Array Techniques"},
    {value:"Functions and Built-in Functions"},
    {value:"STLs (Vector, Set, Map, Queue, etc.)"},
    {value:"Elementray Number Theory & Sieve of Eratosthenes"},
    {value:"Binary Search"}
  ]

  const level2Content = [
    {value:"Recursion & Backtracking"},
    {value:"Number Theory (Mod Inverse, Fast Power, Combinatorics)"},
    {value:"Bitmasks"},
    {value:"Introduction to Graph Theory"},
    {value:"Graph Traversal"},
    {value:"Graph Shortest Paths"},
    {value:"Introduction to Dynamic Programming"}
  ]

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
        <div className="md:h-[570px] h-72">
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
            <CourseContent title={"Level 1 - Fall 2023"} contentList={level1Content} registrationEnabled={true}/>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      : null}
      <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
        <p className="text-5xl font-semibold lg:my-10 mb-4 text-center">
          Fall 2023 Training
        </p>
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col  lg:w-[50%] mb-0 lg:mb-4 m-4">
              <div className="flex flex-col sm:text-xl border-2 border-gray-200 rounded-xl p-6">
                <CourseContent title={"Level 1"} contentList={level1Content} registrationEnabled={true}/>
              </div>
          </div>
          <div className="flex flex-col  lg:w-[50%] mb-0 lg:mb-4 m-4">
              <div className="flex flex-col sm:text-xl border-2 border-gray-200 rounded-xl p-6">
                <CourseContent title={"Level 2"} contentList={level2Content} registrationEnabled={false}/>
                {/* <p className="text-3xl font-semibold mb-4 text-center">Level 2</p>
                <label className="text-xl font-semibold mb-4">Content:</label>
                <ol className="list-disc list-inside">
                    <li>Recursion & Backtracking</li>
                    <li>Number Theory (Mod Inverse, Fast Power, Combinatorics)</li>
                    <li>Bitmasks</li>
                    <li>Introduction to Graph Theory</li>
                    <li>Graph Traversal</li>
                    <li>Graph Shortest Paths</li>
                    <li>Introduction to Dynamic Programming</li>
                </ol>
                <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4"
                  disabled
                >
                    Register
                </button> */}
              </div>
          </div>

        </div>
      </div>
      </>
  );
}

export default Home;
