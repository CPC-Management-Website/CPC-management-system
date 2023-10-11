import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import React, { useState, useEffect, useContext, useReducer } from "react";
import { VIEW_ADMINS, VIEW_MENTORS, EDIT_REGISTRATION_STATUS, VIEW_TRAINEES, VIEW_MENTEES, UPDATE_USERS } from "../permissions/permissions";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";
import UsersTable from "../components/UsersTable";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST_trainees":
      return { ...state, loading_trainees: true };
    case "FETCH_REQUEST_mentors":
      return { ...state, loading_mentors: true };
    case "FETCH_REQUEST_admins":
      return { ...state, loading_admins: true };

    case "FETCH_SUCCESS_trainees":
      return { ...state, trainees: action.payload, loading_trainees: false };
    case "FETCH_SUCCESS_mentors":
      return { ...state, mentors: action.payload, loading_mentors: false };
    case "FETCH_SUCCESS_admins":
      return { ...state, admins: action.payload, loading_admins: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "GET_REGISTRATION_REQUEST":
      return { ...state };
    case "GET_REGISTRATION_SUCCESS":
      return { ...state, registration: action.payload };
    case "GET_REGISTRATION_FAIL":
      return { ...state, error: action.payload };
    case "UPDATE_REGISTRATION_STATUS":
      return { ...state, registration: action.payload };

    case "SET_REGISTRATION_FAIL":
      return { ...state, error: action.payload };

    case "ASSIGN_MENTORS_REQUEST":
      return { ...state, loadingAssignMentors: true };
    case "ASSIGN_MENTORS_SUCCESS":
      return { ...state, loadingAssignMentors: false};
    case "ASSIGN_MENTORS_FAIL":
      return { ...state, loadingAssignMentors: false, error: action.payload };
    
    case "REGISTER_USERS_REQUEST":
      return { ...state, loadingRegisterUsers: true };
    case "REGISTER_USERS_SUCCESS":
      return { ...state, loadingRegisterUsers: false};
    case "REGISTER_USERS_FAIL":
      return { ...state, loadingRegisterUsers: false, error: action.payload };
    default:
      return state;
  }
};

export default function User() {
  const { state } = useContext(Store);
  const { seasonID,levels } = state;

  const [selectedFileAssignMentors, setSelectedFileAssignMentors] = useState("");
  const [selectedFileRegisterUsers, setSelectedFileRegisterUsers] = useState("");

  const { userInfo } = state;
  const [
    {
      loading_trainees,
      loading_mentors,
      loading_admins,
      trainees,
      mentors,
      admins,
      registration,
      loadingAssignMentors,
      loadingRegisterUsers
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    open: false,
    error: "",
  });

  const getTrainees = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST_trainees" });
      const response = await axios.get(URLS.USERS, {
        params: {
          role: "Trainee",
          season: seasonID,
        },
      });
      dispatch({ type: "FETCH_SUCCESS_trainees", payload: response.data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL" });
      console.log(err);
    }
  };

  const getMentees = async (mentor_id) => {
    try {
      dispatch({ type: "FETCH_REQUEST_trainees" });
      const response = await axios.get(URLS.MENTEES, {
        params: {
          mentor_id,
          season: seasonID,
        },
      });
      dispatch({ type: "FETCH_SUCCESS_trainees", payload: response.data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL" });
      console.log(err);
    }
  };

  const getMentors = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST_mentors" });
      const response = await axios.get(URLS.USERS, {
        params: {
          role: "Mentor",
          season: seasonID,
        },
      });
      dispatch({ type: "FETCH_SUCCESS_mentors", payload: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  const getAdmins = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST_admins" });
      const response = await axios.get(URLS.USERS, {
        params: {
          role: "Admin",
          season: seasonID,
        },
      });
      dispatch({ type: "FETCH_SUCCESS_admins", payload: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  const getRegistrationStatus = async () => {
    try {
      dispatch({ type: "GET_REGISTRATION_REQUEST" });
      const response = await axios.get(URLS.REGISTRATION);
      dispatch({ type: "GET_REGISTRATION_SUCCESS", payload: response.data.value == 1 ? true : false });
      { console.log(registration) }
    } catch (error) {
      dispatch({ type: "GET_REGISTRATION_FAIL" });
      console.log(error);
    }
  };

  const getData = async () => {
    if (userInfo?.permissions?.find((perm) => perm === VIEW_MENTORS)) {
      getMentors();
    }
    if (userInfo?.permissions?.find((perm) => perm === VIEW_ADMINS)) {
      getAdmins();
    }
    if (userInfo?.permissions?.find((perm) => perm === VIEW_MENTEES)) {
      getMentees(userInfo.id);
    } else {
      //the user must be an admin
      getTrainees();
    }
    if (userInfo?.permissions?.find((perm) => perm === EDIT_REGISTRATION_STATUS)) {
      getRegistrationStatus();
    }
  };

  const handleRegistrationSwitch = async () => {
    try {
      await axios.post(
        URLS.REGISTRATION,
        JSON.stringify({
          registration: registration ? false : true
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Registration status updated");
      dispatch({ type: "UPDATE_REGISTRATION_STATUS", payload: !registration });
    } catch (error) {
      toast.error(error.response.data.Error);
    }
  }

  const enterAssignMentorsFile = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "ASSIGN_MENTORS_REQUEST" });
      const data = new FormData();
      data.append("excel-file", selectedFileAssignMentors, "file.xlsx");
      const response = await axios.post(URLS.ASSIGN_MENTORS, data);
      console.log(response);
      dispatch({ type: "ASSIGN_MENTORS_SUCCESS" });
      toast.success("Mentors assigned successfully");
      getData();
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.warning(error.response.data.Error,{autoClose:false});
      }
      dispatch({ type: "ASSIGN_MENTORS_FAIL" });
      console.log(error);
    }
  };

  const enterRegisterUsersFile = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "REGISTER_USERS_REQUEST" });
      const data = new FormData();
      data.append("excel-file", selectedFileRegisterUsers, "file.xlsx");
      const response = await axios.post(URLS.USER_REGISTER_FILE, data);
      console.log(response);
      dispatch({ type: "REGISTER_USERS_SUCCESS" });
      toast.success("Users registered successfully");
      getData();
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.warning(error.response.data.Error,{autoClose:false});
      }
      dispatch({ type: "REGISTER_USERS_FAIL" });
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [seasonID]);

  return (
    <>
      <div className="flex flex-col p-4 sm:p-0 sm:mx-4 sm:mb-4 sm:min-h-screen sm:items-center">
        {userInfo?.permissions?.find((perm) => perm === EDIT_REGISTRATION_STATUS) ?
          (
            <div className="mt-4">
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={registration || false} />}
                  disabled={registration === undefined ? true : false}
                  label="Registration"
                  labelPlacement="top"
                  onChange={() => handleRegistrationSwitch()}
                />
              </FormGroup>
              {console.log(registration)}
            </div>
          ) :
          null
        }
        {userInfo?.permissions?.find((perm) => perm === VIEW_ADMINS) &&
          <>
          <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Admins</p>
          {loading_admins && 
            <div className="flex justify-center py-32">
              <CircularProgress size={50} thickness={4} color="inherit" />
            </div>
          }
          {!loading_admins && <UsersTable users={admins} mentors={mentors} levels={levels} seasonID={seasonID} getData={getAdmins}/>}
          </>
        }
        {userInfo?.permissions?.find((perm) => perm === VIEW_MENTORS) &&
          <>
          <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Mentors</p>
          {loading_mentors && 
            <div className="flex justify-center py-32">
              <CircularProgress size={50} thickness={4} color="inherit" />
            </div>
          }
          {!loading_mentors && <UsersTable users={mentors} mentors={mentors} levels={levels} seasonID={seasonID} getData={getMentors}/>}
          </>
        }
        {userInfo?.permissions?.find((perm) => perm === VIEW_TRAINEES) &&
          <>
          <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Trainees</p>
          {loading_trainees && 
            <div className="flex justify-center py-32">
              <CircularProgress size={50} thickness={4} color="inherit" />
            </div>
          }
          {!loading_trainees && <UsersTable users={trainees} mentors={mentors} levels={levels} seasonID={seasonID} getData={getTrainees}/>}
          </>
        }
        {userInfo?.permissions?.find((perm) => perm === VIEW_MENTEES) &&
          <>
          <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Mentees</p>
          {loading_trainees && 
            <div className="flex justify-center py-32">
              <CircularProgress size={50} thickness={4} color="inherit" />
            </div>
          }
          {!loading_trainees && <UsersTable users={trainees} mentors={mentors} levels={levels} seasonID={seasonID} getData={getMentees}/>}
          </>
        }
        {userInfo?.permissions?.find((perm) => perm === UPDATE_USERS) ?(
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4 mt-4 mb-4">Assign Mentors</p>
            <form className="flex flex-col lg:w-[40%]" onSubmit={enterAssignMentorsFile}>
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
                    onChange={(e) => setSelectedFileAssignMentors(e.target.files[0])}
                    required
                  />
                </div>
                {selectedFileAssignMentors?.length === 0 ? (
                  <strong>No files added</strong>
                ) : (
                  <div className="flex">
                    <strong>{selectedFileAssignMentors?.name}</strong>
                  </div>
                )}
                {console.log(selectedFileAssignMentors?.name)}
              </div>
              <div className="flex flex-col mt-4 mb-4">
                {loadingAssignMentors ? (
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
                    Assign Mentors
                  </button>
                )}
              </div>
            </form>

            <p className="text-3xl font-semibold sm:my-10 sm:mb-4 mt-4 mb-4">Register Users</p>
            <form className="flex flex-col lg:w-[40%]" onSubmit={enterRegisterUsersFile}>
              <div className="flex flex-col">
                <p className="inputlabel">Upload file</p>
                <div className="flex flex-col">
                  <label
                    className="flex flex-row text-xl w-full justify-center items-center text-white py-1 px-6 bg-green-800 hover:bg-green-700 rounded mb-4 cursor-pointer"
                    htmlFor="Image1"
                  >
                    <div className="flex mr-4">
                      <img src="https://img.icons8.com/ios-glyphs/30/ffffff/ms-excel.png" />
                    </div>
                    Add Excel File
                  </label>
                  <input
                    id="Image1"
                    style={{ display: "none" }}
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={(e) => setSelectedFileRegisterUsers(e.target.files[0])}
                    required
                  />
                </div>
                {selectedFileRegisterUsers?.length === 0 ? (
                  <strong>No files added</strong>
                ) : (
                  <div className="flex">
                    <strong>{selectedFileRegisterUsers?.name}</strong>
                  </div>
                )}
                {console.log(selectedFileRegisterUsers?.name)}
              </div>
              <div className="flex flex-col mt-4 mb-4">
                {loadingRegisterUsers ? (
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
                    Register Users
                  </button>
                )}
              </div>
            </form>
          </>
          ):
          null
          }
        
      </div>
      
    </>
  );
}
