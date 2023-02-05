import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";

export default function Edit(props) {
  let isOpened = props.opened;
  let user = props.user;
  let mentors = props.mentors;
  let loadingUpdate = props.loadingUpdate;
  let loading = false;

  const updateUser = props.updateUser;
  const submitEdit = props.submitEdit;
  const handleClose = props.handleClose;

  const handleSubmit = async (e) => {
    submitEdit(e);
  };

  return (
    <div>
      {/* <CreateIcon onClick={handleClickOpen} /> */}
      <Dialog
        fullWidth
        open={isOpened}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col lg:items-center p-4">
            <p className="text-3xl font-semibold lg:mb-10 mb-4">Profile</p>
            {loading ? (
              <div className="flex justify-center py-32">
                <CircularProgress size={50} thickness={4} color="inherit" />
              </div>
            ) : (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="inputlabel">Name</label>
                  <div className="inputCont">
                    <input
                      value={user?.name}
                      className="input"
                      onChange={(e) =>
                        updateUser({ ...user, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="inputlabel">VjudgeHandle</label>
                  <div className="inputCont">
                    <input
                      value={user?.vjudge_handle}
                      className="input"
                      onChange={(e) =>
                        updateUser({ ...user, vjudge_handle: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="inputlabel">Email</label>
                  <div className="inputCont">
                    <input
                      value={user?.email}
                      className="input"
                      onChange={(e) =>
                        updateUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="inputlabel">Level</label>
                  <div className="inputCont">
                    <input
                      value={user?.level}
                      type="number"
                      className="input"
                      onChange={(e) =>
                        updateUser({ ...user, level: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="inputlabel">Mentor</label>
                  <div className="inputCont">
                    <select
                      value={user?.mentor_id ? user.mentor_id : undefined}
                      onChange={(e) =>
                        updateUser({
                          ...user,
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
                            checked={user?.enrolled === 1}
                            onChange={(e) =>
                              updateUser({
                                ...user,
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
                            checked={user?.enrolled === 0}
                            onChange={(e) =>
                              updateUser({
                                ...user,
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
                  {loadingUpdate ? (
                    <button
                      className="bg-slate-300 text-white py-2 px-6 rounded flex justify-center items-center"
                      type="submit"
                    >
                      <CircularProgress
                        size={23}
                        thickness={4}
                        color="inherit"
                      />
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
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
