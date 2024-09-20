import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
} from "react";
import { Store } from "../context/store";
import axios from "../hooks/axios";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import ContestContainer from "../components/ContestContainer";
import { ADD_CONTESTS } from "../permissions/permissions";

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_CONTESTS_REQUEST":
      return { ...state, loadingContests: true };
    case "GET_CONTESTS_SUCCESS":
      return { ...state, contests: action.payload, loadingContests: false };
    case "GET_CONTESTS_FAIL":
      return { ...state, loadingContests: false, error: action.payload };
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false };
    case "ADD_FAIL":
      return { ...state, loadingAdd: false, error: action.payload };
    default:
      return state;
  }
};

function ContestDetails() {
  const { state } = useContext(Store);
  const { levels, userInfo, seasonID } = state;
  const [contestID, setContestID] = useState("");
  const [numOfProblems, setNumOfProblems] = useState("");
  const [yellowThreshold, setYellowThreshold] = useState("");
  const [greenThreshold, setGreenThreshold] = useState("");
  const [topic, setTopic] = useState("");
  const [weekNum, setWeekNum] = useState("");
  const [levelID, setLevelID] = useState("");

  const [{ loadingAdd, loadingContests, contests }, dispatch] = useReducer(
    reducer,
    {
      loadingAdd: false,
      loadingContests: true,
      error: "",
    }
  );

  const addContest = async (e) => {
    console.log(contestID);
    e.preventDefault();
    try {
      console.log(levelID);
      dispatch({ type: "ADD_REQUEST" });
      await axios.post(
        `/api/admin/contests`,
        JSON.stringify({
          contestID: contestID,
          numOfProblems,
          yellowThreshold,
          greenThreshold,
          topic,
          weekNum,
          levelID,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "ADD_SUCCESS" });
      getAllContests();
      toast.success("Contest Added Successfully");
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      dispatch({ type: "ADD_FAIL" });
    }
  };

  const getAllContests = useCallback(async () => {
    try {
      const params = new URLSearchParams([["season", seasonID]]);
      dispatch({ type: "GET_CONTESTS_REQUEST" });
      const response = await axios.get("/api/admin/contests", { params });
      dispatch({ type: "GET_CONTESTS_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "GET_CONTESTS_FAIL" });
      console.log(error);
    }
  }, [seasonID]);
  useEffect(() => {
    getAllContests();
  }, [getAllContests]);

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0 my-5">
      {userInfo.permissions.find((perm) => perm === ADD_CONTESTS) ? (
        <>
          <p className="text-3xl font-semibold lg:my-10 mb-4">Add Contest</p>
          <form className="flex flex-col lg:w-[50%] " onSubmit={addContest}>
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
              <label className="inputlabel">Yellow threshold*</label>
              <div className="inputCont">
                <input
                  className="input"
                  type="number"
                  required
                  min={1}
                  placeholder="Yellow threshold"
                  onChange={(e) => setYellowThreshold(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="inputlabel">Green threshold*</label>
              <div className="inputCont">
                <input
                  className="input"
                  type="number"
                  required
                  min={1}
                  placeholder="Green threshold"
                  onChange={(e) => setGreenThreshold(e.target.value)}
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
              <label className="inputlabel">Level*</label>
              <div className="inputCont">
                <select
                  onChange={(e) =>
                    setLevelID(
                      e.target.value === "NULL" ? null : e.target.value
                    )
                  }
                  type="string"
                  placeholder="Level"
                  className="input"
                  required
                >
                  <option key={null} value={undefined}>
                    {""}
                  </option>
                  {levels?.map(({ level_id, name }) => (
                    <option key={level_id} value={level_id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col mt-4">
              {loadingAdd ? (
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
        </>
      ) : null}
      {loadingContests ? (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-semibold my-10">
            {"Current season's contests"}
          </p>
          <div className="flex flex-col space-y-4 lg:w-[50%]">
            {contests?.map((contest) => (
              <ContestContainer
                key={contest.contest_id}
                contest={contest}
                permissions={userInfo.permissions}
                refreshContests={getAllContests}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default ContestDetails;
