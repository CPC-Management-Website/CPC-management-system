import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "../hooks/axios";
import { toast } from "react-toastify";
import { Store } from "../context/store";
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

export default function MentorProfile() {
  const { state } = useContext(Store);
  const { userInfo, seasonID } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [mentor, setMentor] = useState("");

  useEffect(() => {
    const getMentor = async () => {
      const params = new URLSearchParams([["season_id", seasonID]]);
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await axios.get(`/api/users/${userInfo.id}/mentor`, {
          params,
        });
        setMentor(response.data);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
        toast.error(error);
      }
    };
    getMentor();
  }, [userInfo.id, seasonID]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-24">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-semibold my-4">Assigned Mentor</p>
          <div className="flex flex-col sm:text-xl space-y-4 border-2 border-gray-200 rounded-xl p-6 lg:w-[40%] mb-4">
            {mentor ? (
              <>
                <div className="flex flex-row ">
                  <strong className="mr-2">Name:</strong> {mentor.name}
                </div>
                <div className="flex flex-row ">
                  <strong className="mr-2">E-mail:</strong> {mentor.email}
                </div>
                <div className="flex flex-row ">
                  <strong className="mr-2">Phone:</strong> {mentor.phone_number}
                </div>
                <div className="flex flex-row ">
                  <strong className="mr-2">Vjudge Handle:</strong>
                  {mentor.vjudge_handle}
                </div>
                <div className="flex flex-row ">
                  <strong className="mr-2">Discord Handle:</strong>
                  {mentor.discord_handle}
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <p className="text-3xl font-semibold my-4">
                  No Assigned Mentor
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
