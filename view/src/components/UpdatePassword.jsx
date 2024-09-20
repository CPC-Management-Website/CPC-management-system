import * as React from "react";
import { useState, useReducer } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "../hooks/axios";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_SUCCESS":
      return { ...state, loading: false };
    case "UPDATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function UpdatePassword({ user_id, isOpened, setIsOpened }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("The two passwords aren't the same");
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${user_id}/password`,
        JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Password updated");
      setIsOpened(false);
    } catch (error) {
      console.log(error);
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(error.response.data);
    }
  };

  return (
    <div>
      {/* <CreateIcon onClick={handleClickOpen} /> */}
      <Dialog
        fullWidth
        open={isOpened}
        onClose={() => {
          setIsOpened(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col lg:items-center p-4">
            <p className="text-3xl font-semibold lg:mb-10 mb-4">
              Update Password
            </p>
            <form className="flex flex-col" onSubmit={submitHandler}>
              <div className="flex flex-col">
                <label className="inputlabel">Old Password*</label>
                <div className="inputCont">
                  <input
                    className="input"
                    type="password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">New Password*</label>
                <div className="inputCont">
                  <input
                    className="input"
                    minLength={8}
                    type="password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Confirm New Password*</label>
                <div className="inputCont">
                  <input
                    className="input"
                    minLength={8}
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
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
                    Update Password
                  </button>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
