import React, { useState, useContext, useReducer } from "react";
import { Store } from "../context/store";
import axios from "../hooks/axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ResourceEdit({
  resource,
  isOpened,
  setIsOpened,
  refreshResources,
}) {
  const [tempResource, updatetempResource] = useState(resource);
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const { state } = useContext(Store);
  const { levels } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const request = await axios.patch(
        `/api/admin/resources/${tempResource.resource_id}`,
        JSON.stringify({ ...tempResource }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(request);
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Resource updated successfully");
      setIsOpened(false);
      refreshResources();
    } catch (error) {
      console.log(error);
      toast.error("Error updating resource");
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <div>
      <Dialog
        fullWidth
        open={isOpened}
        onClose={() => setIsOpened(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="flex flex-col lg:items-center p-4">
            <p className="text-3xl font-semibold lg:mb-10 mb-4">
              Resource Details
            </p>
            <form className="flex flex-col" onSubmit={submitHandler}>
              <div className="flex flex-col">
                <label className="inputlabel">Topic</label>
                <div className="inputCont">
                  <input
                    value={tempResource.topic}
                    className="input"
                    placeholder="Topic"
                    required
                    onChange={(e) =>
                      updatetempResource({
                        ...tempResource,
                        topic: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Link</label>
                <div className="inputCont">
                  <input
                    value={tempResource.link}
                    className="input"
                    type="url"
                    placeholder="Link"
                    required
                    onChange={(e) =>
                      updatetempResource({
                        ...tempResource,
                        link: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="inputlabel">Level</label>
                <select
                  type="string"
                  className="w-full p-2 border-2 border-gray-500 rounded"
                  placeholder="Level.."
                  value={tempResource.level_id}
                  required
                  onChange={(e) =>
                    updatetempResource({
                      ...tempResource,
                      level_id:
                        e.target.value === "NULL" ? null : e.target.value,
                    })
                  }
                >
                  <option key={null} value={undefined}>
                    {""}
                  </option>
                  {levels?.map(({ level_id, name }) => (
                    <option key={level_id} value={level_id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col mt-4">
                {loadingUpdate ? (
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
