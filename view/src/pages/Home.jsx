import React, { useContext, useReducer, useState } from "react";
import HERO from "../assets/developer.svg";
import URLS from "../urls/server_urls.json";
import AlertDialog from "../components/AlertDialog";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import axios from "../hooks/axios";

function Home() {
  const { state } = useContext(Store);
  const { userInfo, seasons } = state;
  const reducer = (state, action) => {
    switch (action.type) {
      case "REGISTER_REQUEST":
        return { ...state, loading: true };
      case "REGISTER_SUCCESS":
        return { ...state, loading: false };
      case "REGISTER_FAIL":
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const registerHandler = async () => {
    try {
      dispatch({ type: "REGISTER_REQUEST" });
      const email = userInfo.email
      const user_id = userInfo.id
      console.log(email)
      const response = await axios.post(
        URLS.ENROLL,
        JSON.stringify({user_id, email,}),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: "REGISTER_SUCCESS" });
      userInfo.latestEnrollmentSeason = import.meta.env.VITE_CURRENT_SEASON_ID
      console.log(userInfo.latestEnrollmentSeason)
      toast.success("Registration Successfull");
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({ type: "REGISTER_FAIL" })
    }
  };
  return (
    <div className="flex bg-white justify-center min-h-[90vh]">
      <div className="flex lg:flex-row flex-col items-center justify-center lg:px-32">
        <div className="flex flex-col p-2">
          {userInfo?.latestEnrollmentSeason < import.meta.env.VITE_CURRENT_SEASON_ID && seasons ? 
            <div className="flex flex-col my-10 justify-center">
            {loading ? (
              <button
                className="bg-slate-300 text-white py-2 px-6 rounded flex justify-center self-center"
              >
                <CircularProgress size={23} thickness={4} color="inherit" />
              </button>
            ) : (
              <button
                className="bg-violet-800 hover:bg-violet-500 text-white justify-center self-center py-2 px-6 rounded"
                onClick={()=>registerHandler()}
              >
                {console.log(seasons)}
                Register Level 1 - {seasons[0]["name"]}
              </button>
            )}
          </div>
          : null}
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
  );
}

export default Home;
