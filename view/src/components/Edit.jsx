import React from "react";
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

export default function Edit({
  user,
  mentors,
  levels,
  isOpened,
  setIsOpened,
  refresh,
}) {
  const [tempUser, updateTempUser] = useState(user);

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const editHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/users/${tempUser.user_id}`,
        JSON.stringify({
          name: tempUser.name,
          vjudgeHandle: tempUser.vjudge_handle,
          email: tempUser.email,
          levelID: tempUser.level_id,
          mentorID: tempUser.mentor_id,
          enrolled: tempUser.enrolled,
          seasonID: tempUser.season_id,
          enrollmentID: tempUser.enrollment_id,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Profile updated");
      refresh();
      setIsOpened(false);
    } catch (error) {
      console.log(error);
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(error.response.data.Error);
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
            <p className="text-3xl font-semibold lg:mb-10 mb-4">Profile</p>
            <form className="flex flex-col" onSubmit={editHandler}>
              <div className="flex flex-col">
                <label className="inputlabel">Name</label>
                <div className="inputCont">
                  <input
                    value={tempUser.name}
                    className="input"
                    onChange={(e) =>
                      updateTempUser({ ...tempUser, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Vjudge Handle</label>
                <div className="inputCont">
                  <input
                    value={tempUser.vjudge_handle}
                    className="input"
                    onChange={(e) =>
                      updateTempUser({
                        ...tempUser,
                        vjudge_handle: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Email</label>
                <div className="inputCont">
                  <input
                    value={tempUser.email}
                    className="input"
                    onChange={(e) =>
                      updateTempUser({ ...tempUser, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Level</label>
                <div className="inputCont">
                  <select
                    value={tempUser.level_id}
                    onChange={(e) =>
                      updateTempUser({
                        ...tempUser,
                        level_id:
                          e.target.value === "NULL" ? null : e.target.value,
                      })
                    }
                    type="string"
                    placeholder="Level"
                    className="input"
                  >
                    {user?.level_id ? null : (
                      <option key={null} value={undefined}>
                        NULL
                      </option>
                    )}
                    {levels?.map(({ name, level_id }) => (
                      <option key={level_id} value={level_id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Mentor</label>
                <div className="inputCont">
                  <select
                    value={tempUser.mentor_id ? tempUser.mentor_id : undefined}
                    onChange={(e) =>
                      updateTempUser({
                        ...tempUser,
                        mentor_id:
                          e.target.value === "NULL" ? null : e.target.value,
                      })
                    }
                    type="string"
                    placeholder="Mentor"
                    className="input"
                  >
                    <option key={null} value={undefined}>
                      NULL
                    </option>
                    {mentors?.map(({ name, user_id }) => (
                      <option key={user_id} value={user_id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Enrolled</label>
                <div className="inputCont">
                  <div className="flex flex-col">
                    <div className="radio">
                      <label>
                        <input
                          name="enrolled"
                          type="radio"
                          value={1}
                          checked={tempUser.enrolled === 1}
                          onChange={(e) =>
                            updateTempUser({
                              ...tempUser,
                              enrolled: Number(e.target.value),
                            })
                          }
                        />{" "}
                        Yes
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          name="enrolled"
                          type="radio"
                          value={0}
                          checked={tempUser.enrolled === 0}
                          onChange={(e) =>
                            updateTempUser({
                              ...tempUser,
                              enrolled: Number(e.target.value),
                            })
                          }
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>
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
                    Update
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
