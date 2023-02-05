import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import React, { useState, useEffect, useContext, useReducer } from "react";
import { VIEW_ADMINS, VIEW_MENTORS } from "../permissions/permissions";
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

  const subHeaders = ["Name", "VJudgeHandle", "Email"];

  const [userToEdit, setUserToEdit] = useState();

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
          level: userToEdit.level,
          mentorID: userToEdit.mentor_id,
          enrolled: userToEdit.enrolled,
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
      toast.error(error);
    }
  };

  const getData = async () => {
    if (userInfo?.permissions?.find((perm) => perm === VIEW_MENTORS)) {
      getMentors();
    }
    if (userInfo?.permissions?.find((perm) => perm === VIEW_ADMINS)) {
      getAdmins();
    }
    getTrainees();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="flex flex-col p-4 sm:p-0 sm:mx-4 sm:mb-4 sm:min-h-screen sm:items-center">
        <Edit
          user={userToEdit}
          mentors={mentors}
          opened={open}
          handleClose={handleClose}
          submitEdit={editHandler}
          updateUser={setUserToEdit}
          loadingUpdate={loadingUpdate}
        />
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
                        <button
                          onClick={() => {
                            initUpdate(item);
                          }}
                        >
                          <CreateIcon />
                        </button>
                        <button onClick={() => deleteHandler(item.email)}>
                          <DeleteIcon />
                        </button>
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
                    <button
                      onClick={() => {
                        initUpdate(item);
                      }}
                    >
                      <CreateIcon />
                    </button>
                    <button onClick={() => deleteHandler(item.email)}>
                      <DeleteIcon />
                    </button>
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
                        <button
                          onClick={() => {
                            initUpdate(item);
                          }}
                        >
                          <CreateIcon />
                        </button>
                        <button onClick={() => deleteHandler(item.email)}>
                          <DeleteIcon />
                        </button>
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
                    <button
                      onClick={() => {
                        initUpdate(item);
                      }}
                    >
                      <CreateIcon />
                    </button>
                    <button onClick={() => deleteHandler(item.email)}>
                      <DeleteIcon />
                    </button>
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
                        {item.level}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.mentor_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.enrolled ? <p> Yes </p> : <p> No </p>}
                      </StyledTableCell>
                      <StyledTableCell className="space-x-4" align="center">
                        <button
                          onClick={() => {
                            initUpdate(item);
                          }}
                        >
                          <CreateIcon />
                        </button>
                        <button onClick={() => deleteHandler(item.email)}>
                          <DeleteIcon />
                        </button>
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
                        <button>
                          <AlertDialog email={item.email} />
                        </button>
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
                    <button
                      onClick={() => {
                        initUpdate(item);
                      }}
                    >
                      <CreateIcon />
                    </button>
                    <button onClick={() => deleteHandler(item.email)}>
                      <DeleteIcon />
                    </button>
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
                    <button>
                      <AlertDialog email={item.email} />
                    </button>
                  </div>
                </div>
                // {edit ? <StyledTableRow>hi</StyledTableRow> : null}
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
