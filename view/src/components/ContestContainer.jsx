import React, { useReducer, useState, useContext } from "react";
import { DELETE_CONTESTS, UPDATE_CONTESTS } from "../permissions/permissions";
import { Store } from "../context/store";
import axios from "../hooks/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import ContestEdit from "./ContestEdit";

const reducer = (state, action) => {
  switch (action.type) {
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function ContestContainer({
  contest,
  permissions,
  refreshContests,
}) {
  const { state } = useContext(Store);
  const { levels } = state;

  const [{ loadingDelete }, dispatch] = useReducer(reducer, {
    loadingDelete: false,
  });

  const [editWindowOpened, setEditWindowOpened] = useState(false);

  const deleteHandler = async (contest) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        console.log("here");
        const response = await axios.delete(
          `/api/admin/contests/${contest.contest_id}`
        );
        console.log(response);
        dispatch({ type: "DELETE_SUCCESS" });
        toast.success("Contest deleted successfully");
        refreshContests();
      } catch (err) {
        toast.error("Couldn't delete contest");
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div className="flex-col flex space-y-4">
      <div className="flex flex-col lg:flex-row lg:justify-between border-2 rounded-xl p-4 space-y-4 lg:space-y-0">
        <div className="flex flex-col space-y-2">
          <span>
            Topic:{" "}
            <a
              target="_blank"
              href={`https://vjudge.net/contest/${contest.contest_id}`}
              className="underline text-blue-900"
              rel="noreferrer"
            >
              {contest.topic}
            </a>
          </span>
          <div className="flex flex-row space-x-4 items-center">
            <span>Level: {contest.level}</span>
            {console.log(levels)}
            <span>Week number: {contest.week_number}</span>
          </div>
          <div className="flex flex-row space-x-4 items-center">
            <span>Yellow: {contest.yellow_threshold}</span>
            <span>Green: {contest.green_threshold}</span>
            <span>Total: {contest.total_problems}</span>
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-center">
          {permissions.find((perm) => perm === UPDATE_CONTESTS) ? (
            <>
              <button
                className="bg-violet-800 text-white  hover:bg-violet-500 py-2 px-6 rounded flex h-fit"
                type="submit"
                onClick={() => setEditWindowOpened(true)}
              >
                Edit
              </button>
              {editWindowOpened && (
                <ContestEdit
                  contest={contest}
                  isOpened={editWindowOpened}
                  setIsOpened={setEditWindowOpened}
                  refreshContests={refreshContests}
                />
              )}
            </>
          ) : null}
          {permissions.find((perm) => perm === DELETE_CONTESTS) ? (
            <>
              {loadingDelete ? (
                <button
                  className="bg-red-300 text-white py-2 px-6 rounded flex h-fit"
                  type="submit"
                >
                  <CircularProgress size={23} thickness={4} color="inherit">
                    Delete
                  </CircularProgress>
                </button>
              ) : (
                <button
                  className="bg-red-800 hover:bg-red-500 text-white py-2 px-6 rounded flex h-fit"
                  type="submit"
                  onClick={() => deleteHandler(contest)}
                >
                  Delete
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
