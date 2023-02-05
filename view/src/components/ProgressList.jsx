import ProgressPerContest from "./ProgressPerContest";
import React, { useEffect, useState, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from '../urls/server_urls.json';
import CircularProgress from "@mui/material/CircularProgress";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function render(contestList, progressList) {
  const data = [];
  for (let i = 0; i < contestList.length; i++) {
    data.push(
      <ProgressPerContest
        key={i}
        progressItem={progressList[i]}
        contestItem={contestList[i]}
      />
    );
  }
  return data;
}

function ProgressList(email) {
  const [progressList, setProgressList] = useState([]);
  const [contestList, setContestList] = useState([]);
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const getProgressList = async () => {
    const params = new URLSearchParams([["email", email["email"]]]);
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.get(
        URLS.TRANSCRIPT,
        { params },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "FETCH_SUCCESS" });
      setProgressList(response.data.progress);
      setContestList(response.data.contests);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL" });
      console.log(err);
    }
  };

  useEffect(() => {
    getProgressList();
  }, []);

  return loading ? (
    <div className="flex justify-center py-32">
      <CircularProgress size={50} thickness={4} color="inherit" />
    </div>
  ) : (
    render(contestList, progressList)
  );
}

export default ProgressList;
