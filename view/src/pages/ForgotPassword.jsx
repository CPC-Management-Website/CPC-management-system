import React, { useState, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../urls/frontend_urls";

const reducer = (state, action) => {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true };
    case "SUCCESS":
      return { ...state, loading: false };
    case "FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const requestResetLink = async () => {
    try {
      dispatch({ type: "REQUEST" });
      const response = await axios.post(
        URLS.FORGOT_PASSWORD,
        JSON.stringify({
          email,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: "SUCCESS" });
      navigate(LOGIN);
      toast.success(
        <div>
          If your email is registered, a password reset link will be sent to
          your email
        </div>,
        { autoClose: false }
      );
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({ type: "FAIL" });
      //return console.log(error)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    requestResetLink();
  };

  return (
    <div className="flex flex-col p-4 lg:p-0  lg:items-center">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Forgot Password</p>
      <form className="flex flex-col lg:w-[40%]" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="inputlabel">Email*</label>
          <div className="inputCont">
            <input
              className="input"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="useremail@gmail.com"
              required
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 mb-4">
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
              Send Password Reset Link
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export default ForgotPassword;
