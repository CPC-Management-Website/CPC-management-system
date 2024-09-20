import React, { useState, useContext, useReducer } from "react";
import { Store } from "../context/store";
import axios from "../hooks/axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
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

export default function ContestEdit({
  contest,
  isOpened,
  setIsOpened,
  refreshContests,
}) {
  const [tempContest, updatetempContest] = useState(contest);
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const { state } = useContext(Store);
  const { levels } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const request = await axios.patch(
        `/api/admin/contests/${contest.contest_id}`,
        JSON.stringify({ ...tempContest }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(request);
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Contest updated successfully");
      setIsOpened(false);
      refreshContests();
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <div>
      <Dialog
        fullWidth
        open={isOpened}
        onClose={() => setIsOpened(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col lg:items-center p-4">
            <p className="text-3xl font-semibold lg:mb-10 mb-4">
              Contest Details
            </p>
            <form className="flex flex-col" onSubmit={submitHandler}>
              <div className="flex flex-col">
                <label className="inputlabel">Contest ID</label>
                <div className="inputCont">
                  <input
                    value={tempContest.contest_id}
                    className="input"
                    type="number"
                    required
                    min={1}
                    placeholder="Contest ID"
                    onChange={(e) =>
                      updatetempContest({
                        ...tempContest,
                        contest_id: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Topic</label>
                <div className="inputCont">
                  <input
                    value={tempContest.topic}
                    className="input"
                    required
                    placeholder="Topic"
                    onChange={(e) =>
                      updatetempContest({
                        ...tempContest,
                        topic: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Yellow threshold</label>
                <div className="inputCont">
                  <input
                    value={tempContest.yellow_threshold}
                    className="input"
                    type="number"
                    required
                    min={1}
                    placeholder="Yellow threshold"
                    onChange={(e) =>
                      updatetempContest({
                        ...tempContest,
                        yellow_threshold: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Green threshold</label>
                <div className="inputCont">
                  <input
                    value={tempContest.green_threshold}
                    className="input"
                    type="number"
                    required
                    min={1}
                    placeholder="Green threshold"
                    onChange={(e) =>
                      updatetempContest({
                        ...tempContest,
                        green_threshold: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Number of problems</label>
                <div className="inputCont">
                  <input
                    value={tempContest.total_problems}
                    className="input"
                    type="number"
                    required
                    min={1}
                    placeholder="Number of problems"
                    onChange={(e) =>
                      updatetempContest({
                        ...tempContest,
                        total_problems: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Week number</label>
                <div className="inputCont">
                  <input
                    value={tempContest.week_number}
                    className="input"
                    type="number"
                    required
                    min={1}
                    placeholder="Week Number"
                    onChange={(e) =>
                      updatetempContest({
                        ...tempContest,
                        week_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Level</label>
                <select
                  type="string"
                  className="w-full p-2 border-2 border-gray-500 rounded"
                  placeholder="Level.."
                  value={tempContest.level_id}
                  required
                  onChange={(e) =>
                    updatetempContest({
                      ...tempContest,
                      level_id:
                        e.target.value === "NULL" ? null : e.target.value,
                    })
                  }
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
                    Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
