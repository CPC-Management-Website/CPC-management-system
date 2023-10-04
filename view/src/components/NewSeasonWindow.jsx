import React, { useContext, useReducer } from "react";
import { Store } from "../context/store";
import { toast } from "react-toastify";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";

export default function NewSeasonWindow(){
    const { state, dispatch: ctxDispatch } = useContext(Store);
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
        ctxDispatch({ type: "USER_SIGNIN", payload: {...userInfo, 
          latestEnrollmentSeason: parseInt(import.meta.env.VITE_CURRENT_SEASON_ID),
          enrolledSeasons: response.data.enrolledSeasons
        }});
        sessionStorage.setItem("userInfo", JSON.stringify({...userInfo,
          latestEnrollmentSeason: parseInt(import.meta.env.VITE_CURRENT_SEASON_ID),
          enrolledSeasons: response.data.enrolledSeasons
        }));
        // userInfo.latestEnrollmentSeason = import.meta.env.VITE_CURRENT_SEASON_ID
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
        <>
        <p className="text-3xl font-semibold mb-4 text-center">Level 1 - { seasons[0].name }</p>
        <label className="text-xl font-semibold mb-4">Content:</label>
        <ol className="list-disc list-inside">
            <li>C++ Fundamentals (Introduction to C++, Data Types, Control Flow, etc.)</li>
            <li>Complexity Analysis and Array Techniques</li>
            <li>Functions and Built-in Functions</li>
            <li>STLs (Vector, Set, Map, Queue, etc.)</li>
            <li>Elementray Number Theory & Sieve of Eratosthenes</li>
            <li>Binary search</li>
        </ol>
        {loading ? (
            <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4">
                <CircularProgress size={23} thickness={4} color="inherit" />
            </button>
        ) : (
            <button className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded block m-auto mt-4"
                onClick={()=>registerHandler()}
            >
                Register
            </button>
        
        )}
        </>
    );}