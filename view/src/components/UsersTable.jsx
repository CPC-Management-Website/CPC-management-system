import axios from "../hooks/axios";
import React, { useState, useContext, useReducer } from "react";
import {
  UPDATE_USERS,
  DELETE_USERS,
  VIEW_ALL_TRANSCRIPTS,
} from "../permissions/permissions";
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
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import AlertDialog from "../components/AlertDialog";
import Edit from "../components/Edit";

function UserRow({ user, seasonID, editUser, refresh }) {
  const reducer = (state, action) => {
    switch (action.type) {
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

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loadingDelete }, dispatch] = useReducer(reducer, {
    error: "",
    loadingDelete: false,
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

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure that you want to delete this user?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/admin/users/${id}`);
        dispatch({ type: "DELETE_SUCCESS" });
        refresh();
        toast.success("User successfully deleted");
      } catch (err) {
        toast.error(err);
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <StyledTableRow key={user.email}>
      <StyledTableCell align="center">{user.name}</StyledTableCell>
      <StyledTableCell align="center">{user.vjudge_handle}</StyledTableCell>
      <StyledTableCell align="center">{user.email}</StyledTableCell>
      <StyledTableCell align="center">{user.level_name}</StyledTableCell>
      <StyledTableCell align="center">{user.mentor_name}</StyledTableCell>
      <StyledTableCell align="center">
        {user.enrolled ? <p> Yes </p> : <p> No </p>}
      </StyledTableCell>
      <StyledTableCell className="space-x-4 text-center p-4" align="center">
        <div className="flex flex-row justify-between">
          {userInfo.permissions.find((perm) => perm === UPDATE_USERS) && (
            <>
              <Tooltip placement="bottom" title="Edit User">
                <button onClick={() => editUser(user)}>
                  <CreateIcon />
                </button>
              </Tooltip>
            </>
          )}
          {userInfo.permissions.find((perm) => perm === DELETE_USERS) && (
            <>
              {loadingDelete ? (
                <button>
                  <CircularProgress size={23} thickness={4} color="inherit" />
                </button>
              ) : (
                <Tooltip placement="bottom" title="Delete User">
                  <button onClick={() => deleteHandler(user.user_id)}>
                    <DeleteIcon />
                  </button>
                </Tooltip>
              )}
            </>
          )}
          {userInfo.permissions.find(
            (perm) => perm === VIEW_ALL_TRANSCRIPTS
          ) && (
            <>
              <Tooltip placement="bottom" title="View Progress">
                <button>
                  <AlertDialog
                    user_id={user.user_id}
                    level_id={user.level_id}
                    season={seasonID}
                  />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default function UsersTable({
  users,
  mentors,
  levels,
  getData,
  seasonID,
}) {
  const headers = [
    "Name",
    "VJudgeHandle",
    "Email",
    "Level",
    "Mentor",
    "Enrolled",
  ];

  const [editWindowOpened, setEditWindowOpened] = useState(false);
  const [userToEdit, setUserToEdit] = useState("");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <>
      {editWindowOpened && (
        <Edit
          user={userToEdit}
          mentors={mentors}
          levels={levels}
          isOpened={editWindowOpened}
          setIsOpened={setEditWindowOpened}
          refresh={getData}
        />
      )}
      <TableContainer className="flex my-4" component={Paper}>
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
            {users?.map((user) => (
              <UserRow
                key={user.email}
                user={user}
                seasonID={seasonID}
                refresh={getData}
                editUser={(user) => {
                  setUserToEdit(user);
                  setEditWindowOpened(true);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
