import React, { useContext, useEffect, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import { toast } from "react-toastify";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import ProgressList from "../components/ProgressList";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, trainee: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "FETCH_REQUEST_transcript":
      return { ...state, loading_transcript: true };
    case "FETCH_SUCCESS_transcript":
      return {
        ...state,
        transcript: action.payload,
        loading_transcript: false,
      };
    case "FETCH_FAIL_transcript":
      return { ...state, loading_transcript: false, error: action.payload };
    default:
      return state;
  }
};

export default function Transcript() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, trainee, transcript, loading_transcript }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const getTrainee = async () => {
    const params = new URLSearchParams([["email", userInfo.email]]);
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.get(
        URLS.PROFILE,
        { params },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL" });
      toast.error(err);
    }
  };

  const getProgressList = async () => {
    const params = new URLSearchParams([["email", userInfo.email]]);
    try {
      dispatch({ type: "FETCH_REQUEST_transcript" });
      const response = await axios.get(
        URLS.TRANSCRIPT,
        { params },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "FETCH_SUCCESS_transcript", payload: response.data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL_transcript" });
      console.log(err);
    }
  };

  useEffect(() => {
    getTrainee();
    getProgressList();
  }, []);

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Trasncript</p>
      {loading ? (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <div className="flex flex-col space-y-4 lg:w-[50%]">
          <div className="flex flex-col sm:text-xl space-y-4 border-2 border-gray-200 rounded-xl p-6">
            <div className="flex flex-row ">
              <strong className="mr-2">Name:</strong> {trainee.name}
            </div>
            <div className="flex flex-row ">
              <strong className="mr-2">E-mail:</strong> {trainee.email}
            </div>
            <div className="flex flex-row ">
              <strong className="mr-2">VjudgeHandle:</strong>
              {trainee.vjudge_handle}
            </div>
          </div>
          <div className="flex flex-col space-y-4 border-2 border-gray-200 rounded-xl p-6">
            <ProgressList email={userInfo.email} />
          </div>
        </div>
      )}
      {/* {loading_transcript ? (
        <div className="py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <div className="flex flex-col lg:w-[80%] space-y-4 border-2 border-gray-200 rounded-xl p-6 mt-8">
          {console.log(transcript?.progress)}

          {transcript?.contests.map((item) => (
            <div className="flex flex-row text-xl space-x-2 items-center">
              <strong className="mr-2">Topic Name:</strong> {item.topic}
              <strong className="mr-2">Week number:</strong> {item.week_number}
              <strong className="mr-2">Type:</strong> {item.type_id}
            </div>
          ))}

          {transcript?.progress.map((item) => (
            <div className="flex flex-col text-xl">
              <strong className="mr-2">Solved Problems:</strong>solved:
              {item.solved_problems} out of 
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
