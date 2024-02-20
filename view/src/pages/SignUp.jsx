import React, { useState, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../urls/frontend_urls";
import SelectWithOther from "../components/SelectWithOther";

const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP_REQUEST":
      return { ...state, loadingSignUp: true };
    case "SIGNUP_SUCCESS":
      return { ...state, loadingSignUp: false };
    case "SIGNUP_FAIL":
      return { ...state, loadingSignUp: false, error: action.payload };
    case "GET_REGISTRATION_REQUEST":
      return { ...state, loading: true };
    case "GET_REGISTRATION_SUCCESS":
      return { ...state, registration: action.payload, loading: false };
    case "GET_REGISTRATION_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [vjudgeHandle, setVjudgeHandle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [level, setLevel] = useState("");
  const [major, setMajor] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [availDays, setAvailDays] = useState({
    sat: false,
    sun: false,
    mon: false,
    tues: false,
    wed: false,
    thur: false,
  });
  // const days = [
  //   { label: "Saturday", value: "sat" },
  //   { label: "Sunday", value: "sun" },
  //   { label: "Monday", value: "mon" },
  //   { label: "Tuesday", value: "tues" },
  //   { label: "Wednesday", value: "wed" },
  //   { label: "Thursday", value: "thur" },
  // ];
  const levels = [
    { value: "Freshman" },
    { value: "Sophomore" },
    { value: "Junior" },
    { value: "Senior 1" },
    { value: "Senior 2" },
  ];
  const majors = [
    { value: "Freshman" },
    { value: "Architectural Engineering" },
    { value: "Automotive Engineering" },
    { value: "Building Engineering" },
    { value: "Civil Infrastructure Engineerin" },
    { value: "Communication Systems Engineering" },
    { value: "Computer Engineering and Software Systems" },
    { value: "Computer and Systems Engineering" },
    { value: "Design and Production Engineering" },
    { value: "Electrical Power and Machines Engineering" },
    { value: "Electronics and Communications Engineering" },
    { value: "Energy and Renewable Energy Engineering" },
    { value: "Environmental Architecture and Urbanism" },
    { value: "Housing Architecture and Urban Development" },
    { value: "Landscape Architecture" },
    { value: "Manufacturing Engineering" },
    { value: "Materials Engineering" },
    { value: "Mechanical Power Engineering" },
    { value: "Mechatronics Engineering" },
    { value: "Mechatronics Engineering and Automation" },
    { value: "Structural Engineering" },
    { value: "Utilities and Infrastructure" },
    { value: "Water Engineering and Hydraulic Structures" },
  ];

  const universities = [
    { value: "Ain Shams University" },
    { value: "Cairo University" },
    { value: "Helwan University" },
  ];

  const faculties = [{ value: "Engineering" }, { value: "Computer Science" }];

  const [{ loadingSignUp }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // const getRegistrationStatus = async () => {
  //   try {
  //     dispatch({ type: "GET_REGISTRATION_REQUEST" });
  //     const response = await axios.get(URLS.REGISTRATION);
  //     dispatch({
  //       type: "GET_REGISTRATION_SUCCESS",
  //       payload: response.data.value == 1 ? true : false,
  //     });
  //   } catch (error) {
  //     dispatch({ type: "GET_REGISTRATION_FAIL" });
  //     console.log(error);
  //   }
  // };
  const signUp = async () => {
    if (password !== confirmPassword) {
      toast.error("The two passwords aren't the same");
      return;
    }
    try {
      dispatch({ type: "SIGNUP_REQUEST" });
      const response = await axios.post(
        URLS.SIGNUP,
        JSON.stringify({
          fullName,
          email,
          password,
          vjudgeHandle,
          phoneNumber,
          university,
          faculty,
          level,
          major,
          discordHandle,
          availDays,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: "SIGNUP_SUCCESS" });
      navigate(LOGIN);
      toast.success(<div>Sign up successful</div>);
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response.data.Error);
      }
      console.log(error);
      dispatch({ type: "SIGNUP_FAIL" });
      //return console.log(error)
    }
  };

  // function validateCheckboxes() {
  //   for (const day in availDays) {
  //     if (availDays[day]) return true;
  //   }
  //   return false;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    signUp();
    // if (validateCheckboxes()) {
    //   registerUser()
    // } else {
    //   toast.warning("Please select at least one day to attend sessions")
    // }
  };
  // const updateCheckbox = ({ checked, value }) => {
  //   availDays[value] = checked;
  //   setAvailDays({ ...availDays });
  // };

  // useEffect(() => {
  //   getRegistrationStatus()
  // }, []);

  return (
    <div className="flex flex-col p-4 lg:p-0  lg:items-center">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Sign Up</p>
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
          <label className="inputlabel">
            Email* (make sure to write it correctly)
          </label>
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
          <label className="inputlabel">Password*</label>
          <div className="inputCont">
            <input
              placeholder="Password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={8}
              required
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Confirm Password*</label>
          <div className="inputCont">
            <input
              placeholder="Confirm Password"
              className="input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              minLength={8}
              required
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Vjudge Handle (Username)*</label>
          <div className="inputCont">
            <input
              placeholder="Vjudge Handle"
              className="input"
              onChange={(e) => setVjudgeHandle(e.target.value)}
              minLength={2}
              maxLength={16}
              pattern="[a-zA-Z0-9_]*"
              title="Handle contains only digits, letters, or _"
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
          <SelectWithOther
            items={universities}
            setValue={setUniversity}
            placeholder={"University"}
          />
        </div>
        <div className="flex flex-col">
          <label className="inputlabel">Faculty*</label>
          <SelectWithOther
            items={faculties}
            setValue={setFaculty}
            placeholder={"Faculty"}
          />
        </div>
        {console.log(faculty)}
        {faculty === "Engineering" && (
          <div className="flex flex-col">
            <label className="inputlabel">Major*</label>
            <SelectWithOther
              items={majors}
              setValue={setMajor}
              placeholder={"Major"}
            />
          </div>
        )}
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
          <label className="inputlabel">Discord Handle*</label>
          <div className="inputCont">
            <input
              placeholder="username#1234"
              className="input"
              onChange={(e) => setDiscordHandle(e.target.value)}
              required
            />
          </div>
        </div>
        {/* <div className="flex flex-col">
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
        </div> */}
        <div className="flex flex-col mt-4 mb-4">
          {loadingSignUp ? (
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
              Sign Up
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export default SignUp;
