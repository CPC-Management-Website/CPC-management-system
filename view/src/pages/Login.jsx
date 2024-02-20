import React from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useReducer } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Store } from "../context/store";
import { HOMEPAGE, FORGOT_PASSWORD } from "../urls/frontend_urls";
import LOGIN from "../assets/login.jpg";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false };
    case "LOGIN_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function SignIn() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : HOMEPAGE;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOGIN_REQUEST" });
      const { data } = await axios.post(URLS.LOGIN, {
        email,
        password,
      });
      // const seasons = await axios.get(URLS.SEASONS);
      ctxDispatch({ type: "GET_SEASONS", payload: data.seasons });
      sessionStorage.setItem("seasons", JSON.stringify(data.seasons));

      // const levels = await axios.get(URLS.LEVELS);
      ctxDispatch({ type: "GET_LEVELS", payload: data.levels });
      sessionStorage.setItem("levels", JSON.stringify(data.levels));

      ctxDispatch({
        type: "SET_SEASON_ID",
        payload: parseInt(data.userInfo.latestEnrollmentSeason),
      });
      sessionStorage.setItem("seasonID", data.userInfo.latestEnrollmentSeason);

      ctxDispatch({ type: "USER_SIGNIN", payload: data.userInfo });
      sessionStorage.setItem("userInfo", JSON.stringify(data.userInfo));

      ctxDispatch({
        type: "GET_REGISTRATIONAVAILABLE",
        payload: parseInt(data.registrationAvailable.value),
      });
      sessionStorage.setItem(
        "registrationAvailable",
        data.registrationAvailable.value
      );
      console.log(data);

      dispatch({ type: "LOGIN_SUCCESS" });
      navigate(redirect || HOMEPAGE);
    } catch (err) {
      dispatch({ type: "LOGIN_FAIL" });
      const errmsg = err.response?.data;
      if (!err?.response) {
        toast.error("Internal server error");
      } else {
        toast.error(errmsg["Error"]);
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-row items-center md:space-x-32 w-full justify-center">
        <div className="md:flex hidden flex-col items-center">
          <img src={LOGIN} className="w-[500px]" />
        </div>

        <form onSubmit={submitHandler} className="w-[70%] md:w-[30%]">
          <p className="text-5xl font-bold text-gray-400 mb-10">LOG IN</p>
          <div className="flex flex-col">
            <label className="inputlabel">E-mail</label>
            <div className="inputCont">
              <input
                placeholder="E-mail"
                className="input"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="inputCont justify-between">
              <label className="inputlabel">Password</label>
              <input
                className="input"
                placeholder="********"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Link to={FORGOT_PASSWORD}>Forgot password?</Link>
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
                Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
