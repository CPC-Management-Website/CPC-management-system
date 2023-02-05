import React, { useState, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function ContestDetails() {
  const [contestID, setContestID] = useState("");
  const [numOfProblems, setNumOfProblems] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topic, setTopic] = useState("");
  const [weekNum, setWeekNum] = useState("");

  const [{ loading, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const addContest = async () => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axios.post(
        URLS.CONTEST,
        JSON.stringify({
          contestID,
          numOfProblems,
          startDate,
          endDate,
          topic,
          weekNum,
        })
      );
      dispatch({ type: "FETCH_REQUEST" });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL" });
      if (!error?.response) {
        setErrMsg("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
    }
  };

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
      <p className="text-3xl font-semibold lg:my-10 mb-4">
        Add Contest Details
      </p>
      {loading ? (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <form className="flex flex-col lg:w-[40%]" onSubmit={addContest}>
          <div className="flex flex-col">
            <label className="inputlabel">Contest ID*</label>
            <div className="inputCont">
              <input
                className="input"
                type="string"
                required
                placeholder="Contest ID"
                onChange={(e) => setContestID(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">Topic*</label>
            <div className="inputCont">
              <input
                className="input"
                required
                placeholder="Topic"
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">Start Date*</label>
            <div className="inputCont">
              <input
                className="input"
                type="date"
                required
                placeholder="DD/MM/YYYY"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">End Date*</label>
            <div className="inputCont">
              <input
                className="input"
                type="date"
                required
                placeholder="DD/MM/YYYY"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">Week Number*</label>
            <div className="inputCont">
              <input
                className="input"
                type="number"
                required
                placeholder="Week Number"
                onChange={(e) => setWeekNum(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">Number of Problems*</label>
            <div className="inputCont">
              <input
                className="input"
                type="number"
                required
                placeholder="Number of Problems"
                onChange={(e) => setNumOfProblems(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col mt-4">
            {loadingUpdate ? (
              <button
                className="bg-slate-300 text-white py-2 px-6 rounded flex justify-center items-center"
                type="submit"
              >
                <CircularProgress size={23} thickness={4} color="inherit" />
              </button>
            ) : (
              <button
                className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded"
                type="submit"
              >
                Add
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
export default ContestDetails;
