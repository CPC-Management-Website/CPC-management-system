import React, { useState, useEffect, useReducer } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
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

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

function UserEntry() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vjudgeHandle, setVjudgeHandle] = useState("");
  const [platformRole, setPlatformRole] = useState(2); //2 is the id for Trainee role
  const [selectedFile, setSelectedFile] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [roles, setRoles] = useState([]);
  const [level, setLevel] = useState("");

  const [{ loading, error, product, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
    });

  const enterUser = async (e) => {
    e.preventDefault();
    try {
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
      setSuccess(true);
      setErrMsg("Form Submitted Successfully");
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Internal Server Error");
      } else {
        setErrMsg(error.response.data.Error);
      }
      console.log(error);
      //return console.log(error)
    }
  };

  const enterFile = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("excel-file", selectedFile, "file.xlsx");
      const response = await axios.post(URLS.USER_ENTRY_FILE, data);
      console.log(response);
      setSuccess(true);
      setErrMsg("Form Submitted Successfully");
      //  alert("Form Submitted Successfully")
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Internal Server Error");
      } else {
        setErrMsg(error.response.data.Error);
      }
      console.log(error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(URLS.USER_ENTRY);
      setRoles(
        response.data.map(({ role_id, user_role }) => ({
          platformRole: user_role,
          role_id: role_id,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <div className="flex flex-col p-4 lg:p-0  lg:items-center">
      <p className="text-3xl font-semibold lg:my-10 mb-4">Add New Users</p>
      <form className="flex flex-col lg:w-[40%]" onSubmit={enterUser}>
        <div className="flex flex-col">
          <label className="inputlabel">User Email*</label>
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
          <label className="inputlabel">Name*</label>
          <div className="inputCont">
            <input
              className="input"
              onChange={(e) => setFirstName(e.target.value)}
              type="string"
              placeholder="First Name"
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
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col w-full">
            <label className="inputlabel">Platform Role*</label>
            <select
              value={platformRole}
              onChange={(e) => setPlatformRole(e.target.value)}
              type="string"
              placeholder="Platform Role"
              className="input"
            >
              {roles.map(({ platformRole, role_id }) => (
                <option key={role_id} value={role_id}>
                  {platformRole}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="inputlabel">Level*</label>
            <input
              type="number"
              required
              value={level}
              placeholder="Level"
              min={1}
              max={2}
              onChange={(e) => setLevel(e.target.value)}
              className="input"
            />
          </div>
        </div>
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
              Add User
            </button>
          )}
        </div>
        <p className="flex text-lg font-semibold justify-center py-6">OR</p>
      </form>
      <form className="flex flex-col lg:w-[40%]" onSubmit={enterFile}>
        <div className="flex flex-col">
          <p className="inputlabel">Upload file</p>
          <div className="flex flex-col">
            <label
              className="flex flex-row text-xl w-full justify-center items-center text-white py-1 px-6 bg-green-800 hover:bg-green-700 rounded mb-4 cursor-pointer"
              htmlFor="Image"
            >
              <div className="flex mr-4">
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/ms-excel.png" />
              </div>
              Add Excel File
            </label>
            <input
              id="Image"
              style={{ display: "none" }}
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              required
            />
          </div>
          {selectedFile?.length === 0 ? (
            <strong>No files added</strong>
          ) : (
            <div className="flex">
              <strong>{selectedFile?.name}</strong>
            </div>
          )}
        </div>
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
              Add Users
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export default UserEntry;
