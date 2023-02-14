import React, { useState, useEffect, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { LOGIN } from "../urls/frontend_urls";

const reducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_REQUEST":
      return { ...state, loadingRegister: true };
    case "REGISTER_SUCCESS":
      return { ...state, loadingRegister: false };
    case "REGISTER_FAIL":
      return { ...state, loadingRegister: false, error: action.payload };
    default:
      return state;
  }
};

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [vjudgeHandle, setVjudgeHandle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [level, setLevel] = useState("");
  const [major, setMajor] = useState("");
  const [availDays, setAvailDays] = useState(
    {
      sat: false,
      sun: false,
      mon: false,
      tues: false,
      wed: false,
      thur: false
    }
  );
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
  const majors = [
    {
      value: "Freshman"
    },
    {
      value: "General Electrical"
    },
    {
      value: "General Mechanical"
    },
    {
      value: "CSE (Computer and Systems Engineering)"
    },
    {
      value: "ECE (Electronics and Communications Engineering)"
    },
    {
      value: "EPM (Electrical Power and Machines)"
    },
    {
      value: "CESS (Computer Engineering Software Systems)"
    },
    {
      value: "CIS (Computer and Information Science)"
    },
    {
      value: "Mechatronics"
    },
    {
      value: "Other"
    }
  ]

  const [{ loadingRegister }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
    });

  const registerUser = async (e) => {
    try {
      dispatch({ type: "REGISTER_REQUEST" });
      const response = await axios.post(
        URLS.REGISTER,
        JSON.stringify({
          fullName,
          email,
          vjudgeHandle,
          phoneNumber,
          university,
          faculty,
          level,
          major,
          availDays,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: "REGISTER_SUCCESS" });
      navigate(LOGIN);
      toast.success("Registration Successfull");
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({ type: "REGISTER_FAIL" })
      //return console.log(error)
    }
  };

  function validateCheckboxes() {
    for (const day in availDays) {
      if (availDays[day]) return true;
    }
    return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateCheckboxes()) {
      registerUser()
    } else {
      toast.warning("Please select at least one day to attend sessions")
    }
  };
  const updateCheckbox = ({ checked, value }) => {
    availDays[value] = checked
    setAvailDays({ ...availDays })
  };

  useEffect(() => {

  }, []);

  return (
    <div className="flex flex-col p-4 lg:p-0  lg:items-center">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Register</p>
      <form className="flex flex-col lg:w-[40%]" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="inputlabel">Full Name*</label>
          <div className="inputCont">
            <input
              className="input"
              onChange={(e) => setFullName(e.target.value)}
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
              required
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Phone Number*</label>
          <div className="inputCont">
            <input
              placeholder="Phone Number"
              className="input"
              type="tel"
              // pattern="^01[0-2,5][0-9]{8}$"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
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
              required
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
              required
            />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label className="inputlabel">Level*</label>
          <div className="inputCont">
            <select
              onChange={(e) =>
                setLevel(e.target.value === "NULL" ? null : e.target.value)
              }
              type="string"
              placeholder="Level"
              className="input"
              required
            >
              <option key={null} value={undefined}>
                {""}
              </option>
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
            <select
              onChange={(e) =>
                setMajor(e.target.value === "NULL" ? null : e.target.value)
              }
              type="string"
              placeholder="Major"
              className="input"
              required
            >
              <option key={null} value={undefined}>
                {""}
              </option>
              {majors?.map(({ value }) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel"> On which day(s) do you prefer to attend sessions?*</label>
          <div className="inputCont" required>
            {days.map(({ label, value }) => (
              <label key={value}>
                <input
                  name="day"
                  type="checkbox"
                  value={value}
                  onChange={(e) => updateCheckbox(e.target)}
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-4">
          {loadingRegister ? (
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
