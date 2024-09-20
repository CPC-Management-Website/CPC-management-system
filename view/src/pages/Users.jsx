import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import React, { useEffect, useContext, useReducer, useCallback } from "react";
import {
  VIEW_ADMINS,
  VIEW_MENTORS,
  EDIT_REGISTRATION_STATUS,
  VIEW_TRAINEES,
  VIEW_MENTEES,
  UPDATE_USERS,
} from "../permissions/permissions";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import UsersTable from "../components/UsersTable";
import FileInput from "../components/FileInput";

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
      return { ...state, loadingAssignMentors: false };
    case "ASSIGN_MENTORS_FAIL":
      return { ...state, loadingAssignMentors: false, error: action.payload };

    case "REGISTER_USERS_REQUEST":
      return { ...state, loadingRegisterUsers: true };
    case "REGISTER_USERS_SUCCESS":
      return { ...state, loadingRegisterUsers: false };
    case "REGISTER_USERS_FAIL":
      return { ...state, loadingRegisterUsers: false, error: action.payload };
    default:
      return state;
  }
};

export default function User() {
  const { state } = useContext(Store);
  const { seasonID, levels } = state;

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
      loadingRegisterUsers,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    open: false,
    error: "",
  });

  const getTrainees = useCallback(async () => {
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
  }, [seasonID]);

  const getMentees = useCallback(
    async (mentor_id) => {
      try {
        dispatch({ type: "FETCH_REQUEST_trainees" });
        const response = await axios.get(`/api/mentors/${mentor_id}/mentees`, {
          params: {
            season: seasonID,
          },
        });
        dispatch({ type: "FETCH_SUCCESS_trainees", payload: response.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
        console.log(err);
      }
    },
    [seasonID]
  );

  const getMentors = useCallback(async () => {
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
  }, [seasonID]);

  const getAdmins = useCallback(async () => {
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
  }, [seasonID]);

  const getRegistrationStatus = useCallback(async () => {
    try {
      dispatch({ type: "GET_REGISTRATION_REQUEST" });
      const response = await axios.get(URLS.REGISTRATION);
      dispatch({
        type: "GET_REGISTRATION_SUCCESS",
        payload: response.data.value == 1 ? true : false,
      });
      {
        console.log(registration);
      }
    } catch (error) {
      dispatch({ type: "GET_REGISTRATION_FAIL" });
      console.log(error);
    }
  }, [registration]);

  const getData = useCallback(async () => {
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
    if (
      userInfo?.permissions?.find((perm) => perm === EDIT_REGISTRATION_STATUS)
    ) {
      getRegistrationStatus();
    }
  }, [
    getAdmins,
    getMentees,
    getMentors,
    getRegistrationStatus,
    getTrainees,
    userInfo.id,
    userInfo?.permissions,
  ]);

  const handleRegistrationSwitch = async () => {
    try {
      await axios.put(
        "/api/admin/registration-status",
        JSON.stringify({
          registration: registration ? false : true,
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
  };

  const assignMentorsFile = async (file) => {
    try {
      dispatch({ type: "ASSIGN_MENTORS_REQUEST" });
      const data = new FormData();
      data.append("excel-file", file, "file.xlsx");
      const response = await axios.post(URLS.ASSIGN_MENTORS, data);
      console.log(response);
      dispatch({ type: "ASSIGN_MENTORS_SUCCESS" });
      toast.success("Mentors assigned successfully");
      getData();
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.warning(error.response.data.Error, { autoClose: false });
      }
      dispatch({ type: "ASSIGN_MENTORS_FAIL" });
      console.log(error);
    }
  };

  const registerUsersFile = async (file) => {
    try {
      dispatch({ type: "REGISTER_USERS_REQUEST" });
      const data = new FormData();
      data.append("excel-file", file, "file.xlsx");
      const response = await axios.post("/api/admin/enrollments", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      dispatch({ type: "REGISTER_USERS_SUCCESS" });
      toast.success("Users registered successfully");
      getData();
    } catch (error) {
      if (!error?.response) {
        toast.error("Internal Server Error");
      } else {
        toast.warning(error.response.data.Error, { autoClose: false });
      }
      dispatch({ type: "REGISTER_USERS_FAIL" });
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <div className="flex flex-col p-4 sm:p-0 sm:mx-4 sm:mb-4 sm:min-h-screen sm:items-center">
        {userInfo?.permissions?.find(
          (perm) => perm === EDIT_REGISTRATION_STATUS
        ) ? (
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
        ) : null}
        {userInfo?.permissions?.find((perm) => perm === VIEW_ADMINS) && (
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Admins</p>
            {loading_admins && (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            )}
            {!loading_admins && (
              <UsersTable
                users={admins}
                mentors={mentors}
                levels={levels}
                seasonID={seasonID}
                getData={getAdmins}
              />
            )}
          </>
        )}
        {userInfo?.permissions?.find((perm) => perm === VIEW_MENTORS) && (
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Mentors</p>
            {loading_mentors && (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            )}
            {!loading_mentors && (
              <UsersTable
                users={mentors}
                mentors={mentors}
                levels={levels}
                seasonID={seasonID}
                getData={getMentors}
              />
            )}
          </>
        )}
        {userInfo?.permissions?.find((perm) => perm === VIEW_TRAINEES) && (
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Trainees</p>
            {loading_trainees && (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            )}
            {!loading_trainees && (
              <UsersTable
                users={trainees}
                mentors={mentors}
                levels={levels}
                seasonID={seasonID}
                getData={getTrainees}
              />
            )}
          </>
        )}
        {userInfo?.permissions?.find((perm) => perm === VIEW_MENTEES) && (
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Mentees</p>
            {loading_trainees && (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            )}
            {!loading_trainees && (
              <UsersTable
                users={trainees}
                mentors={mentors}
                levels={levels}
                seasonID={seasonID}
                getData={getMentees}
              />
            )}
          </>
        )}
        {userInfo?.permissions?.find((perm) => perm === UPDATE_USERS) ? (
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4 mt-4 mb-4">
              Assign Mentors
            </p>
            <FileInput
              identifier={"assignMentors"}
              title={"Assign Mentors"}
              loading={loadingAssignMentors}
              submitHandler={assignMentorsFile}
            />
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4 mt-4 mb-4">
              Register Users
            </p>
            <FileInput
              identifier={"registerUsers"}
              title={"Register Users"}
              loading={loadingRegisterUsers}
              submitHandler={registerUsersFile}
            />
          </>
        ) : null}
      </div>
    </>
  );
}
