import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
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

export default function EditProfile() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [vjudgeHandle, setVjudgeHandle] = useState("");
  const [password, setPassword] = useState(userInfo.password);

  const displayProfile = async () => {
    const params = new URLSearchParams([["email", userInfo.email]]);
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.get(URLS.PROFILE, {
        params,
      });
      setUserID(response.data.id);
      setName(response.data.name);
      setEmail(response.data.email);
      setVjudgeHandle(response.data.vjudge_handle);
      // setPassword(response.data.password);
      dispatch({ type: "FETCH_SUCCESS" });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL" });
      toast.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(
        URLS.PROFILE,
        JSON.stringify({ userID, email, name, password, vjudgeHandle }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Profile updated");
      displayProfile();
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(error);
    }
  };

  useEffect(() => {
    displayProfile();
  }, []);

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Profile</p>
      {loading ? (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <form className="flex flex-col lg:w-[40%]" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="inputlabel">Name</label>
            <div className="inputCont">
              <input
                value={name}
                className="input"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">E-mail</label>
            <div className="inputCont">
              <input
                value={email}
                className="input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">VjudgeHandle</label>
            <div className="inputCont">
              <input
                value={vjudgeHandle}
                className="input"
                onChange={(e) => setVjudgeHandle(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="inputlabel">Password</label>
            <div className="inputCont">
              <input
                placeholder="*******"
                className="input"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
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
                Update
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
