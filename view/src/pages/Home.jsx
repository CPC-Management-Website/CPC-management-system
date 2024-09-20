import React, { useContext, useReducer, useEffect } from "react";
import HERO from "../assets/developer.svg";
import { Store } from "../context/store";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CourseContent from "../components/CourseContent";
import { toast } from "react-toastify";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../urls/frontend_urls";

function Home() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, newSeasonWindowOpen } = state;
  const navigate = useNavigate();

  const level1Content = [
    {
      value: "C++ Fundamentals (Intro to C++, Data Types, Control Flow, etc.)",
    },
    { value: "Complexity Analysis and Array Techniques" },
    { value: "Functions and Built-in Functions" },
    { value: "STLs (Vector, Set, Map, Queue, etc.)" },
    { value: "Elementary Number Theory & Sieve of Eratosthenes" },
    { value: "Binary Search" },
  ];

  const level2Content = [
    { value: "Recursion & Backtracking" },
    { value: "Number Theory (Mod Inverse, Fast Power, Combinatorics)" },
    { value: "Bitmasks" },
    { value: "Introduction to Graph Theory" },
    { value: "Graph Traversal" },
    { value: "Graph Shortest Paths" },
    { value: "Introduction to Dynamic Programming" },
  ];

  const registerLevel1 = async () => {
    try {
      dispatch({ type: "REGISTER_REQUEST" });
      const email = userInfo.email;
      const user_id = userInfo.id;
      console.log(email);
      const response = await axios.post(
        URLS.ENROLL,
        JSON.stringify({ user_id, email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: "REGISTER_SUCCESS" });
      ctxDispatch({
        type: "USER_SIGNIN",
        payload: {
          ...userInfo,
          latestEnrollmentSeason: parseInt(
            import.meta.env.VITE_CURRENT_SEASON_ID
          ),
          enrolledSeasons: response.data.enrolledSeasons,
        },
      });
      sessionStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userInfo,
          latestEnrollmentSeason: parseInt(
            import.meta.env.VITE_CURRENT_SEASON_ID
          ),
          enrolledSeasons: response.data.enrolledSeasons,
        })
      );
      ctxDispatch({
        type: "SET_SEASON_ID",
        payload: parseInt(import.meta.env.VITE_CURRENT_SEASON_ID),
      });
      sessionStorage.setItem(
        "seasonID",
        import.meta.env.VITE_CURRENT_SEASON_ID
      );
      // userInfo.latestEnrollmentSeason = import.meta.env.VITE_CURRENT_SEASON_ID
      console.log(userInfo.latestEnrollmentSeason);
      toast.success("Registration Successfull");
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({ type: "REGISTER_FAIL" });
    }
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "REGISTER_REQUEST":
        return { ...state, loadingLevel1: true };
      case "REGISTER_SUCCESS":
        return { ...state, loadingLevel1: false };
      case "REGISTER_FAIL":
        return { ...state, loadingLevel1: false };
      case "GET_REGISTRATION_REQUEST":
        return { ...state, loadingLevel1: true, loadingLevel2: true };
      case "GET_REGISTRATION_SUCCESS":
        return {
          ...state,
          registrationAvailable: action.payload,
          loadingLevel1: false,
          loadingLevel2: false,
        };
      case "GET_REGISTRATION_FAIL":
        return {
          ...state,
          error: action.payload,
          loadingLevel1: false,
          loadingLevel2: false,
        };
      case "GET_REGISTRATION_LEVEL_REQUEST":
        return { ...state, loadingLevel1: true, loadingLevel2: true };
      case "GET_REGISTRATION_LEVEL_SUCCESS":
        return {
          ...state,
          registeredLevel: parseInt(action.payload),
          loadingLevel1: false,
          loadingLevel2: false,
        };
      case "GET_REGISTRATION_LEVEL_FAIL":
        return {
          ...state,
          error: action.payload,
          loadingLevel1: false,
          loadingLevel2: false,
        };
      default:
        return state;
    }
  };
  const [
    { loadingLevel1, loadingLevel2, registrationAvailable, registeredLevel },
    dispatch,
  ] = useReducer(reducer, {
    loadingLevel1: false,
    loadingLevel2: false,
    registrationAvailable: false,
    registeredLevel: 0,
  });

  const registerLevel1Handler = async () => {
    if (userInfo) registerLevel1();
    else {
      toast.warning(
        <div>
          You need to be logged in!
          <br />
          {"Please sign up if you don't have an account."}
        </div>
      );
      navigate(LOGIN);
    }
  };
  const registerLevel2Handler = async () => {
    window.open("https://forms.gle/MAMnhMEfrA1mVvSz5", "_blank");
  };

  const getRegistrationStatus = async () => {
    try {
      dispatch({ type: "GET_REGISTRATION_REQUEST" });
      const response = await axios.get(URLS.REGISTRATION);
      dispatch({
        type: "GET_REGISTRATION_SUCCESS",
        payload: response.data.value == 1 ? true : false,
      });
    } catch (error) {
      dispatch({ type: "GET_REGISTRATION_FAIL" });
      console.log(error);
    }
  };

  const handleClosePopup = () => {
    ctxDispatch({ type: "CLOSE_NEWSEASONWINDOW" });
    sessionStorage.setItem("newSeasonWindowOpen", false);
  };

  useEffect(() => {
    const getRegistrationLevel = async () => {
      try {
        dispatch({ type: "GET_REGISTRATION_LEVEL_REQUEST" });
        const response = await axios.get(
          `/api/users/${userInfo.id}/registration-level`
        );
        dispatch({
          type: "GET_REGISTRATION_LEVEL_SUCCESS",
          payload: response.data,
        });
      } catch (error) {
        dispatch({ type: "GET_REGISTRATION_LEVEL_FAIL" });
        console.log(error);
      }
    };

    dispatch({ type: "GET_REGISTRATION_LEVEL_SUCCESS", payload: 0 });
    getRegistrationStatus();
    {
      userInfo &&
      userInfo.latestEnrollmentSeason == import.meta.env.VITE_CURRENT_SEASON_ID
        ? getRegistrationLevel()
        : null;
    }
  }, [userInfo]);

  return (
    <>
      {console.log(registeredLevel)}
      <div className="flex bg-white justify-center min-h-[5vh]">
        <div className="flex lg:flex-row flex-col items-center justify-center lg:px-32">
          <div className="flex flex-col p-2">
            <div className="text-violet-500 text-4xl lg:text-7xl lg:text-left text-center font-bold pb-5 whitespace-nowrap">
              Welcome back!
            </div>
            <div className="text-xl lg:text-2xl font-medium lg:text-left text-center">
              We will help you keep track of your progress within enrolled
              levels, build a learning community, get connected to your mentor -
              all in one place
            </div>
          </div>
          <div className="md:h-[570px] h-72">
            <img src={HERO} className="w-full h-full" />
          </div>
        </div>
      </div>
      {userInfo &&
      userInfo.latestEnrollmentSeason <
        import.meta.env.VITE_CURRENT_SEASON_ID &&
      registrationAvailable ? (
        <div className="flex flex-col justify-center">
          <div>
            <Dialog
              fullWidth
              open={newSeasonWindowOpen}
              onClose={handleClosePopup}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <CourseContent
                  title={"Level 1 - Spring 2024"}
                  contentList={level1Content}
                  registrationEnabled={registrationAvailable ? true : false}
                  registerHandler={registerLevel1Handler}
                  loading={loadingLevel1}
                  buttonText={registeredLevel == 1 ? "Registered" : "Register"}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
        <p className="text-5xl font-semibold lg:my-10 mb-4 text-center">
          Spring 2024 Training
        </p>
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col  lg:w-[50%] mb-0 lg:mb-4 m-4">
            <div className="flex flex-col sm:text-xl border-2 border-gray-200 rounded-xl p-6">
              <CourseContent
                title={"Level 1"}
                contentList={level1Content}
                registrationEnabled={
                  registrationAvailable
                    ? registeredLevel > 0
                      ? false
                      : true
                    : false
                }
                registerHandler={registerLevel1Handler}
                loading={loadingLevel1}
                buttonText={registeredLevel == 1 ? "Registered" : "Register"}
              />
            </div>
          </div>
          <div className="flex flex-col  lg:w-[50%] mb-0 lg:mb-4 m-4">
            <div className="flex flex-col sm:text-xl border-2 border-gray-200 rounded-xl p-6">
              <CourseContent
                title={"Level 2"}
                contentList={level2Content}
                registrationEnabled={
                  registrationAvailable
                    ? registeredLevel > 0
                      ? false
                      : true
                    : false
                }
                registerHandler={registerLevel2Handler}
                loading={loadingLevel2}
                buttonText={registeredLevel === 2 ? "Registered" : "Register"}
              />
              {/* <p className="text-3xl font-semibold mb-4 text-center">Level 2</p>
                <label className="text-xl font-semibold mb-4">Content:</label>
                <ol className="list-disc list-inside">
                    <li>Recursion & Backtracking</li>
                    <li>Number Theory (Mod Inverse, Fast Power, Combinatorics)</li>
                    <li>Bitmasks</li>
                    <li>Introduction to Graph Theory</li>
                    <li>Graph Traversal</li>
                    <li>Graph Shortest Paths</li>
                    <li>Introduction to Dynamic Programming</li>
                </ol>
                <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4"
                  disabled
                >
                    Register
                </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
