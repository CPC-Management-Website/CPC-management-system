import React, { useState, useReducer, useEffect, useCallback } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../urls/frontend_urls";
import { useSearchParams } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHECK_REQUEST":
      return { ...state, loading: true };
    case "CHECK_SUCCESS":
      return { ...state, loading: false, validToken: true };
    case "CHECK_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "RESET_REQUEST":
      return { ...state, loadingReset: true };
    case "RESET_SUCCESS":
      return { ...state, loadingReset: false };
    case "RESET_FAIL":
      return { ...state, loadingReset: false, error: action.payload };
    default:
      return state;
  }
};

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loading, loadingReset, validToken }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      loadingReset: false,
      validToken: false,
      error: "",
    }
  );

  const checkTokenValidity = useCallback(async () => {
    try {
      dispatch({ type: "CHECK_REQUEST" });
      const params = new URLSearchParams([
        ["token", searchParams.get("token")],
      ]);
      const response = await axios.get(URLS.RESET_PASSWORD, { params });
      console.log(response);
      dispatch({ type: "CHECK_SUCCESS" });
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({ type: "CHECK_FAIL" });
    }
  }, [searchParams]);

  const requestPasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("The two passwords aren't the same");
      return;
    }
    try {
      dispatch({ type: "RESET_REQUEST" });
      const response = await axios.post(
        URLS.RESET_PASSWORD,
        JSON.stringify({
          token: searchParams.get("token"),
          password: newPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      navigate(LOGIN);
      dispatch({ type: "RESET_SUCCESS" });
      toast.success("Password reset successfully");
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data);
      }
      console.log(error);
      dispatch({ type: "RESET_FAIL" });
      //return console.log(error)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    requestPasswordUpdate();
  };

  useEffect(() => {
    checkTokenValidity();
  }, [checkTokenValidity]); // can cause infinite loop

  return (
    <>
      {loading && (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      )}
      {!loading &&
        (validToken === false ? (
          <div className="flex min-h-[90vh] justify-center font-semibold items-center text-3xl lg:text-5xl">
            Invalid or expired link
          </div>
        ) : (
          <div className="flex flex-col p-4 lg:p-0  lg:items-center">
            <p className="text-3xl font-semibold lg:my-10 mb-4">
              Reset Password
            </p>
            <form className="flex flex-col lg:w-[40%]" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="inputlabel">New Password*</label>
                <div className="inputCont">
                  <input
                    className="input"
                    minLength={8}
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Confirm New Password*</label>
                <div className="inputCont">
                  <input
                    className="input"
                    minLength={8}
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col mt-4 mb-4">
                {loadingReset ? (
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
                    Reset Password
                  </button>
                )}
              </div>
            </form>
          </div>
        ))}
    </>
  );
}
export default ResetPassword;
