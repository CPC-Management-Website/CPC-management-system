import React, { useState, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_REQUEST":
      return { ...state, loading: true };
    case "ADD_SUCCESS":
      return { ...state, loading: false};
    case "ADD_FAIL":
      return { ...state, loading: false, error: action.payload };
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

  const addContest = async (e) => {
    console.log(contestID)
    e.preventDefault();
    try {
      dispatch({ type: "ADD_REQUEST" });
      await axios.post(
        URLS.CONTEST,
        JSON.stringify({
          contestID: contestID,
          numOfProblems,
          startDate,
          endDate,
          topic,
          weekNum,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "ADD_SUCCESS" });
      toast.success("Contest Added Successfully")
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      dispatch({ type: "ADD_FAIL" });
    }
  };

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
      <p className="text-3xl font-semibold lg:my-10 mb-4">
        Add Contest Details
      </p>
        <form className="flex flex-col lg:w-[40%]" onSubmit={addContest}>
          <div className="flex flex-col">
            <label className="inputlabel">Contest ID*</label>
            <div className="inputCont">
              <input
                className="input"
                type="number"
                required
                min={1}
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
                min={1}
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
                min={1}
                placeholder="Number of Problems"
                onChange={(e) => setNumOfProblems(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col mt-4">
            {loading ? (
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
    </div>
  );
}
export default ContestDetails;
