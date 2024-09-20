import React, { useReducer, useState } from "react";
import { DELETE_RESOURCES, UPDATE_RESOURCES } from "../permissions/permissions";
import axios from "../hooks/axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import ResourceEdit from "./ResourceEdit";

const reducer = (state, action) => {
  switch (action.type) {
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

export default function ResourceContainer({
  resource,
  permissions,
  refreshResources,
}) {
  const [{ loadingDelete }, dispatch] = useReducer(reducer, {
    loadingDelete: false,
  });

  const [editWindowOpened, setEditWindowOpened] = useState(false);

  const deleteHandler = async (resource) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        console.log("here");
        let response = await axios.delete(
          `/api/admin/resources/${resource.resource_id}`
        );
        console.log(response);
        dispatch({ type: "DELETE_SUCCESS" });
        toast.success("Resource deleted successfully");
        refreshResources();
      } catch (err) {
        toast.error(err);
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  return (
    <div className="flex-col flex space-y-4">
      {console.log(permissions)}
      {console.log(resource)}
      <div className="flex flex-col lg:flex-row lg:justify-between border-2 rounded-xl p-4 space-y-4 lg:space-y-0">
        <div className="flex flex-col space-y-2">
          <span>
            Topic:{" "}
            <a
              href={resource.link}
              target="_blank"
              className="underline text-blue-800"
              rel="noreferrer"
            >
              {resource.topic}
            </a>
          </span>
          <span className="flex flex-row">Level: {resource.level}</span>
        </div>
        <div className="flex flex-row space-x-4 items-center">
          {permissions.find((perm) => perm === UPDATE_RESOURCES) ? (
            <>
              <button
                className="bg-violet-800 text-white  hover:bg-violet-500 py-2 px-6 rounded flex h-fit"
                type="submit"
                onClick={() => setEditWindowOpened(true)}
              >
                Edit
              </button>
              {editWindowOpened && (
                <ResourceEdit
                  resource={resource}
                  isOpened={editWindowOpened}
                  setIsOpened={setEditWindowOpened}
                  refreshResources={refreshResources}
                />
              )}
            </>
          ) : null}
          {permissions.find((perm) => perm === DELETE_RESOURCES) ? (
            <>
              {loadingDelete ? (
                <button
                  className="bg-red-300 text-white py-2 px-6 rounded flex h-fit"
                  type="submit"
                >
                  <CircularProgress size={23} thickness={4} color="inherit">
                    Delete
                  </CircularProgress>
                </button>
              ) : (
                <button
                  className="bg-red-800 hover:bg-red-500 text-white py-2 px-6 rounded flex h-fit"
                  type="submit"
                  onClick={() => deleteHandler(resource)}
                >
                  Delete
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
