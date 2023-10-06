import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import React, { useState, useEffect, useContext, useReducer } from "react";
import { VIEW_ADMINS, VIEW_MENTORS, EDIT_REGISTRATION_STATUS, VIEW_TRAINEES, VIEW_MENTEES, UPDATE_USERS } from "../permissions/permissions";
import { Store } from "../context/store";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import CircularProgress from "@mui/material/CircularProgress";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";
import AlertDialog from "../components/AlertDialog";
import Edit from "../components/Edit";

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

    case "SHOW_DIALOGUE":
      return { ...state, open: true };
    case "HIDE_DIALOGUE":
      return { ...state, open: false };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, open: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    case "RESET_REQUEST":
      return { ...state, loadingReset: true };
    case "RESET_SUCCESS":
      return { ...state, loadingReset: false };
    case "RESET_FAIL":
      return { ...state, loadingReset: false };

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
  const headers = [
    "Name",
    "VJudgeHandle",
    "Email",
    "Level",
    "Mentor",
    "Enrolled",
  ];

  const { state } = useContext(Store);
  const { seasonID,seasons,levels } = state;

  const subHeaders = ["Name", "VJudgeHandle", "Email"];

  const [userToEdit, setUserToEdit] = useState();
  const [selectedFileAssignMentors, setSelectedFileAssignMentors] = useState("");
  const [selectedFileRegisterUsers, setSelectedFileRegisterUsers] = useState("");
  // const [registrationStatus, setRegistrationStatus]= useState(undefined);

  const handleClose = () => {
    dispatch({ type: "HIDE_DIALOGUE" });
  };

  const initUpdate = (item) => {
    setUserToEdit(item);
    dispatch({ type: "SHOW_DIALOGUE" });
  };

  const { userInfo } = state;
  const [
    {
      loading_trainees,
      loading_mentors,
      loading_admins,
      loadingUpdate,
      loadingDelete,
      loadingReset,
      trainees,
      mentors,
      admins,
      open,
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

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

  const resetPass = async (user_id) => {
    try {
      dispatch({ type: "RESET_REQUEST" });
      await axios.patch(URLS.USERS, JSON.stringify({ user_id }), {
        headers: { "Content-Type": "application/json" },
      });
      dispatch({ type: "RESET_SUCCESS" });
      toast.success("Password is successfully reset");
    } catch (err) {
      dispatch({ type: "RESET_FAIL" });
      console.log(err);
    }
  };

  const deleteHandler = async (email) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(URLS.USERS, {
          params: {
            email: email,
          },
        });
        dispatch({ type: "DELETE_SUCCESS" });
        getData();
        toast.success("User successfully deleted");
      } catch (err) {
        toast.error(err);
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const editHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(
        URLS.PROFILE_ADMIN,
        JSON.stringify({
          userID: userToEdit.user_id,
          name: userToEdit.name,
          vjudgeHandle: userToEdit.vjudge_handle,
          email: userToEdit.email,
          levelID: userToEdit.level_id,
          mentorID: userToEdit.mentor_id,
          enrolled: userToEdit.enrolled,
          seasonID: userToEdit.season_id,
          enrollmentID: userToEdit.enrollment_id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      getData();
      toast.success("Profile updated");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(error.response.data.Error);
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
        <Edit
          user={userToEdit}
          mentors={mentors}
          opened={open}
          levels={levels}
          handleClose={handleClose}
          submitEdit={editHandler}
          updateUser={setUserToEdit}
          loadingUpdate={loadingUpdate}
        />
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
        {userInfo?.permissions?.find((perm) => perm === VIEW_ADMINS) ?
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Admins</p>
            {loading_admins || loadingDelete ? (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            ) : (
              <>
                <TableContainer className="hidden md:flex" component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {subHeaders.map((header) => (
                          <StyledTableCell key={header} align="center">
                            {header}
                          </StyledTableCell>
                        ))}
                        <StyledTableCell align="center">ACTIONS</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {admins?.map((item) => (
                        <StyledTableRow key={item.email}>
                          <StyledTableCell align="center">
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.vjudge_handle}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.email}
                          </StyledTableCell>
                          <StyledTableCell className="space-x-4" align="center">
                            <Tooltip placement="bottom" title="Edit User">
                              <button
                                onClick={() => {
                                  initUpdate(item);
                                }}
                              >
                                <CreateIcon />
                              </button>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Delete User">
                              <button onClick={() => deleteHandler(item.email)}>
                                <DeleteIcon />
                              </button>
                            </Tooltip>
                            {loadingReset ? (
                              <button onClick={() => resetPass(item.user_id)}>
                                <CircularProgress
                                  size={23}
                                  thickness={4}
                                  color="inherit"
                                />
                              </button>
                            ) : (
                              <Tooltip placement="bottom" title="Reset password">
                                <button onClick={() => resetPass(item.user_id)}>
                                  <RestartAltIcon />
                                </button>
                              </Tooltip>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                        // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="sm:hidden flex flex-col mb-4">
                  {admins?.map((item) => (
                    <div className="flex flex-col border-b py-4" key={item.email}>
                      <div>{item.name}</div>
                      <div>{item.vjudge_handle}</div>
                      <div>{item.email}</div>
                      <div>{item.level}</div>
                      <div>{item.mentor_name}</div>
                      <div>{item.enrolled ? <p> Yes </p> : <p> No </p>}</div>
                      <div className="space-x-4">
                        <Tooltip placement="bottom" title="Edit User">

                          <button
                            onClick={() => {
                              initUpdate(item);
                            }}
                          >
                            <CreateIcon />
                          </button>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Delete User">
                          <button onClick={() => deleteHandler(item.email)}>
                            <DeleteIcon />
                          </button>
                        </Tooltip>
                        {loadingReset ? (
                          <button onClick={() => resetPass(item.user_id)}>
                            <CircularProgress
                              size={23}
                              thickness={4}
                              color="inherit"
                            />
                          </button>
                        ) : (
                          <Tooltip placement="bottom" title="Reset password">
                            <button onClick={() => resetPass(item.user_id)}>
                              <RestartAltIcon />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
                  ))}
                </div>
              </>
            )}
          </>
          :
          null
        }

        {userInfo?.permissions?.find((perm) => perm === VIEW_MENTORS) ?
          <>
            <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Mentors</p>
            {loading_mentors || loadingDelete ? (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            ) : (
              <>
                <TableContainer className="hidden md:flex" component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {subHeaders.map((header) => (
                          <StyledTableCell key={header} align="center">
                            {header}
                          </StyledTableCell>
                        ))}
                        <StyledTableCell align="center">ACTIONS</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mentors?.map((item) => (
                        <StyledTableRow key={item.email}>
                          <StyledTableCell align="center">
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.vjudge_handle}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {item.email}
                          </StyledTableCell>
                          <StyledTableCell className="space-x-4" align="center">
                            <Tooltip placement="bottom" title="Edit User">
                              <button
                                onClick={() => {
                                  initUpdate(item);
                                }}
                              >
                                <CreateIcon />
                              </button>
                            </Tooltip>
                            <Tooltip placement="bottom" title="Delete User">
                              <button onClick={() => deleteHandler(item.email)}>
                                <DeleteIcon />
                              </button>
                            </Tooltip>
                            {loadingReset ? (
                              <button onClick={() => resetPass(item.user_id)}>
                                <CircularProgress
                                  size={23}
                                  thickness={4}
                                  color="inherit"
                                />
                              </button>
                            ) : (
                              <Tooltip placement="bottom" title="Reset password">
                                <button onClick={() => resetPass(item.user_id)}>
                                  <RestartAltIcon />
                                </button>
                              </Tooltip>
                            )}
                          </StyledTableCell>
                        </StyledTableRow>
                        // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="sm:hidden flex flex-col mb-4">
                  {mentors?.map((item) => (
                    <div className="flex flex-col border-b py-4" key={item.email}>
                      <div>
                        <strong>Name: </strong>
                        {item.name}
                      </div>
                      <div>{item.vjudge_handle}</div>
                      <div>{item.email}</div>
                      <div>{item.level}</div>
                      <div>{item.mentor_name}</div>
                      <div>{item.enrolled ? <p> Yes </p> : <p> No </p>}</div>
                      <div className="space-x-4">
                        <Tooltip placement="bottom" title="Edit User">
                          <button
                            onClick={() => {
                              initUpdate(item);
                            }}
                          >
                            <CreateIcon />
                          </button>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Delete User">
                          <button onClick={() => deleteHandler(item.email)}>
                            <DeleteIcon />
                          </button>
                        </Tooltip>
                        {loadingReset ? (
                          <button onClick={() => resetPass(item.user_id)}>
                            <CircularProgress
                              size={23}
                              thickness={4}
                              color="inherit"
                            />
                          </button>
                        ) : (
                          <Tooltip placement="bottom" title="Reset password">
                            <button onClick={() => resetPass(item.user_id)}>
                              <RestartAltIcon />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
                  ))}
                </div>
              </>
            )}
          </>
          :
          null
        }


        <p className="text-3xl font-semibold sm:my-10 sm:mb-4">Trainees</p>
        {loading_trainees || loadingDelete ? (
          <div className="flex justify-center py-32">
            <CircularProgress size={50} thickness={4} color="inherit" />
          </div>
        ) : (
          <>
            <TableContainer className="hidden md:flex" component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <StyledTableCell key={header} align="center">
                        {header}
                      </StyledTableCell>
                    ))}
                    <StyledTableCell align="center">ACTIONS</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainees?.map((item) => (
                    <StyledTableRow key={item.email}>
                      <StyledTableCell align="center">
                        {item.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.vjudge_handle}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.level_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.mentor_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.enrolled ? <p> Yes </p> : <p> No </p>}
                      </StyledTableCell>
                      <StyledTableCell className="space-x-4" align="center">
                        <Tooltip placement="bottom" title="Edit User">
                          <button
                            onClick={() => {
                              initUpdate(item);
                            }}
                          >
                            <CreateIcon />
                          </button>
                        </Tooltip>
                        <Tooltip placement="bottom" title="Delete User">
                          <button onClick={() => deleteHandler(item.email)}>
                            <DeleteIcon />
                          </button>
                        </Tooltip>
                        {loadingReset ? (
                          <button onClick={() => resetPass(item.user_id)}>
                            <CircularProgress
                              size={23}
                              thickness={4}
                              color="inherit"
                            />
                          </button>
                        ) : (
                          <Tooltip placement="bottom" title="Reset password">
                            <button onClick={() => resetPass(item.user_id)}>
                              <RestartAltIcon />
                            </button>
                          </Tooltip>
                        )}
                        <Tooltip placement="bottom" title="View Progress">
                          <button>
                            <AlertDialog email={item.email} level_id={item.level_id} season={seasonID} />
                          </button>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                    // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="sm:hidden flex flex-col ">
              {trainees?.map((item) => (
                <div className="flex flex-col border-b py-4" key={item.email}>
                  <div>{item.name}</div>
                  <div>{item.vjudge_handle}</div>
                  <div>{item.email}</div>
                  <div>{item.level}</div>
                  <div>{item.mentor_name}</div>
                  <div>{item.enrolled ? <p> Yes </p> : <p> No </p>}</div>
                  <div className="space-x-4">
                    <Tooltip placement="bottom" title="Edit User">
                      <button
                        onClick={() => {
                          initUpdate(item);
                        }}
                      >
                        <CreateIcon />
                      </button>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Delete User">
                      <button onClick={() => deleteHandler(item.email)}>
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                    {loadingReset ? (
                      <button onClick={() => resetPass(item.user_id)}>
                        <CircularProgress
                          size={23}
                          thickness={4}
                          color="inherit"
                        />
                      </button>
                    ) : (
                      <Tooltip placement="bottom" title="Reset password">
                        <button onClick={() => resetPass(item.user_id)}>
                          <RestartAltIcon />
                        </button>
                      </Tooltip>
                    )}
                    <Tooltip placement="bottom" title="View Progress">
                      <button>
                        <AlertDialog email={item.email} level_id={item.level_id} season={seasonID}/>
                      </button>
                    </Tooltip>
                  </div>
                </div>
                // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
              ))}
            </div>
          </>
        )}
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
