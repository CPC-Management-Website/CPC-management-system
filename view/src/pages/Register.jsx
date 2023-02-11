import React, { useState, useEffect, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false};
    case "ADD_FAIL":
      return { ...state, loadingAdd: false, error: action.payload };
    case "ADD_BULK_REQUEST":
      return { ...state, loadingAddBulk: true };
    case "ADD_BULK_SUCCESS":
      return { ...state, loadingAddBulk: false};
    case "ADD_BULK_FAIL":
      return { ...state, loadingAddBulk: false, error: action.payload };
    default:
      return state;
  }
};

function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vjudgeHandle, setVjudgeHandle] = useState("");
  const [phoneNumber, setPhoneNumber]=useState("");
  const [university, setUniversity]=useState("");
  const [faculty, setFaculty]=useState("");
  const [level, setLevel] = useState("");
  const [major, setMajor] = useState("");
  const [trainingLevle, setTrainingLevel] = useState("");
  const [platformRole, setPlatformRole] = useState(2); //2 is the id for Trainee role
  const [selectedFile, setSelectedFile] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [roles, setRoles] = useState([]);
  const days = [
    {
        label: "Saturday",
        value: "sat"
    },
    {
        label: "Sunday",
        value: "sun"
    },
    {
        label: "Monday",
        value: "mon"
    },
    {
        label: "Tuesday",
        value: "tues"
    },
    {
        label: "Wednesday",
        value: "wed"
    },
    {
        label: "Thursday",
        value: "thur"
    }
  ]
  const levels = [
    {
        value: "Freshman"
    },
    {
        value: "Sophomore"
    },
    {
        value: "Junior"
    },
    {
        value: "Senior 1"
    },
    {
        value: "Senior 2"
    }
  ]

  const [{ loading, loadingAdd, loadingAddBulk,error, product, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
    });

  const enterUser = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "ADD_REQUEST" });
      const response = await axios.post(
        URLS.USER_ENTRY,
        JSON.stringify({
          email,
          firstName,
          lastName,
          vjudgeHandle,
          platformRole,
          level,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: "ADD_SUCCESS" });
      toast.success("User added successfully");
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({type: "ADD_FAIL"})
      //return console.log(error)
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className="flex flex-col p-4 lg:p-0  lg:items-center">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Register</p>
      <form className="flex flex-col lg:w-[40%]" onSubmit={enterUser}>
        <div className="flex flex-col">
          <label className="inputlabel">Full Name*</label>
          <div className="inputCont">
            <input
              className="input"
              onChange={(e) => setFirstName(e.target.value)}
              type="string"
              placeholder="Full Name"
              required
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Email* (make sure to write it correctly)</label>
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
        <div className="flex flex-col">
          <label className="inputlabel">Vjudge Handle*</label>
          <div className="inputCont">
            <input
              placeholder="Vjudge Handle"
              className="input"
              onChange={(e) => setVjudgeHandle(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Phone Number*</label>
          <div className="inputCont">
            <input
              placeholder="Phone Number"
              className="input"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">University*</label>
          <div className="inputCont">
            <input
              placeholder="University"
              className="input"
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Faculty*</label>
          <div className="inputCont">
            <input
              placeholder="Faculty"
              className="input"
              onChange={(e) => setFaculty(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
            <label className="inputlabel">Level*</label>
            <div className="inputCont">
                    <select
                      onChange={(e) =>
                        updateLevel(e.target.value === "NULL" ? null : e.target.value)
                      }
                      type="string"
                      placeholder="Level"
                      className="input"
                    >
                      {levels?.map(({ value }) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
            </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Major*</label>
          <div className="inputCont">
            <input
              placeholder="Major"
              className="input"
              onChange={(e) => setMajor(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel"> On which day(s) do you prefer to attend sessions?*</label>
          <div className="inputCont">
            {days.map(({label,value})=>(
                <label key = {value}>
                    <input
                    name="day"
                    type="checkbox"
                    value={value}
                    //   onChange={(e) =>updateUser({})}
                    />{" "}
                {label}
            </label>
            ))}
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
              Register
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export default Register;
