import React, { useState, useEffect, useReducer, useContext } from "react";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import {
  DELETE_RESOURCES,
  UPDATE_RESOURCES,
  ADD_RESOURCES,
} from "../permissions/permissions";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, resources: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
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

export default function Resources() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, loadingUpdate, loadingDelete, resources }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [resourceTopic, setResourceTopic] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceLevel, setResourceLevel] = useState("");

  const getResources = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.get(URLS.RESOURCES);
      dispatch({ type: "FETCH_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL" });
      console.log(error);
    }
  };

  const enterResource = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(
        URLS.RESOURCES,
        JSON.stringify({ resourceTopic, resourceLevel, resourceLink }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      getResources();
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      console.log(error);
    }
  };

  const editResource = async (resource) => {
    try {
      let resource_id = resource.resource_id;
      await axios.patch(
        URLS.RESOURCES,
        JSON.stringify({ resource_id, newTopic, newLevel, newLink })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (resource) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(URLS.RESOURCES, {
          params: {
            resource_id: resource.resource_id,
          },
        });
        dispatch({ type: "DELETE_SUCCESS" });
        toast.success("resource successfully deleted");
        getResources();
      } catch (err) {
        toast.error(err);
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  return (
    <div className="flex flex-col lg:items-center p-4 lg:p-0  ">
      <p className="text-3xl font-semibold lg:my-10 mb-4">
        Manage Your Resources
      </p>
      {userInfo?.permissions.find((perm) => perm === ADD_RESOURCES) ? (
        <form
          className="mb-10 flex flex-col lg:flex-row lg:w-[50%] lg:space-x-4 space-y-4 lg:space-y-0"
          onSubmit={enterResource}
        >
          <input
            className="w-full p-2 border-2 border-gray-500 rounded"
            placeholder="Topic.."
            onChange={(e) => setResourceTopic(e.target.value)}
          ></input>
          <input
            className="w-full p-2 border-2 border-gray-500 rounded"
            placeholder="Link.."
            onChange={(e) => setResourceLink(e.target.value)}
          ></input>
          <input
            type="number"
            className="w-full p-2 border-2 border-gray-500 rounded"
            placeholder="Level.."
            onChange={(e) => setResourceLevel(e.target.value)}
          ></input>
          <div className="flex flex-col lg:flex-row">
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
                Add
              </button>
            )}
          </div>
        </form>
      ) : null}

      {loading || loadingDelete ? (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <div className="flex lg:w-[50%] flex-col">
          <div>
            <p className="text-xl font-semibold">Your Current Resources: </p>
          </div>
          <div className="flex-col flex space-y-4 mt-4 ">
            {resources?.map((resource) => (
              <div
                key={resource.resource_id}
                className="flex flex-col lg:flex-row lg:justify-between border-2 rounded-xl p-4 space-y-4 lg:space-y-0"
              >
                <div className="flex flex-col space-y-2">
                  <span>
                    Topic:{" "}
                    <a
                      href={resource.link}
                      target="_blank"
                      className="underline text-blue-800"
                    >
                      {resource.topic}
                    </a>
                  </span>
                  <span className="flex flex-row">Level: {resource.level}</span>
                </div>
                <div className="flex flex-row space-x-4 items-center">
                  {userInfo?.permissions.find(
                    (perm) => perm === UPDATE_RESOURCES
                  ) ? (
                    <button
                      className="bg-violet-800 text-white  hover:bg-violet-500 py-2 px-6 rounded flex h-fit"
                      type="submit"
                      onClick={() => editResource(resource)}
                    >
                      edit
                    </button>
                  ) : null}
                  {userInfo?.permissions.find(
                    (perm) => perm === DELETE_RESOURCES
                  ) ? (
                    <button
                      className="bg-red-800 hover:bg-red-500 text-white py-2 px-6 rounded flex h-fit"
                      type="submit"
                      onClick={() => deleteHandler(resource)}
                    >
                      delete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
