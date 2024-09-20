import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
} from "react";
import axios from "../hooks/axios";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import {
  DELETE_RESOURCES,
  UPDATE_RESOURCES,
  ADD_RESOURCES,
} from "../permissions/permissions";
import ResourceContainer from "../components/ResourceContainer";

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_RESOURCES_REQUEST":
      return { ...state, loading: true };
    case "GET_RESOURCES_SUCCESS":
      return { ...state, resources: action.payload, loading: false };
    case "GET_RESOURCES_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "ADD_REQUEST":
      return { ...state, loadingAdd: true };
    case "ADD_SUCCESS":
      return { ...state, loadingAdd: false };
    case "ADD_FAIL":
      return { ...state, loadingAdd: false };
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
  const { userInfo, levels, seasonID } = state;
  const [{ loading, loadingAdd, resources }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [resourceTopic, setResourceTopic] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [resourceLevel, setResourceLevel] = useState("");

  const getMyResources = useCallback(async () => {
    try {
      const params = new URLSearchParams([["season", seasonID]]);
      dispatch({ type: "GET_RESOURCES_REQUEST" });
      const response = await axios.get(`/api/users/${userInfo.id}/resources`, {
        params,
      });
      dispatch({ type: "GET_RESOURCES_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "GET_RESOURCES_FAIL" });
      console.log(error);
    }
  }, [seasonID, userInfo.id]);
  const getAllResources = useCallback(async () => {
    try {
      const params = new URLSearchParams([["season", seasonID]]);
      dispatch({ type: "GET_RESOURCES_REQUEST" });
      const response = await axios.get("/api/admin/resources", { params });
      dispatch({ type: "GET_RESOURCES_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "GET_RESOURCES_FAIL" });
      console.log(error);
    }
  }, [seasonID]);

  const enterResource = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "ADD_REQUEST" });
      await axios.post(
        "/api/admin/resources",
        JSON.stringify({
          resourceTopic,
          resourceLevel,
          resourceLink,
          seasonID,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "ADD_SUCCESS" });
      toast.success("Resource added successfully");
      getAllResources();
    } catch (error) {
      toast.error("Failed to add resource");
      dispatch({ type: "ADD_FAIL" });
      console.log(error);
    }
  };

  // const editResource = async (resource) => {
  //   e.preventDefault();
  //   try {
  //     let resource_id = resource.resource_id;
  //     dispatch({ type: "UPDATE_REQUEST" });
  //     await axios.patch(
  //       URLS.RESOURCES,
  //       JSON.stringify({ resource_id, newTopic, newLevel, newLink }),
  //     );
  //     dispatch({ type: "UPDATE_SUCCESS" });
  //   } catch (error) {
  //     console.log(error);
  //     dispatch({ type: "UPDATE_FAIL" });
  //   }
  // };

  useEffect(() => {
    userInfo?.permissions.find(
      (perm) => perm === (ADD_RESOURCES || UPDATE_RESOURCES || DELETE_RESOURCES)
    )
      ? getAllResources()
      : getMyResources();
  }, [getAllResources, getMyResources, userInfo?.permissions]);

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
            required
            onChange={(e) => setResourceTopic(e.target.value)}
          ></input>
          <input
            className="w-full p-2 border-2 border-gray-500 rounded"
            placeholder="Link.."
            type="url"
            required
            onChange={(e) => setResourceLink(e.target.value)}
          ></input>
          <select
            type="string"
            className="w-full p-2 border-2 border-gray-500 rounded"
            placeholder="Level.."
            required
            onChange={(e) =>
              setResourceLevel(
                e.target.value === "NULL" ? null : e.target.value
              )
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
          <div className="flex flex-col lg:flex-row">
            {loadingAdd ? (
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

      {loading ? (
        <div className="flex justify-center py-32">
          <CircularProgress size={50} thickness={4} color="inherit" />
        </div>
      ) : (
        <div className="flex lg:w-[50%] flex-col mb-5">
          <div>
            <p className="text-xl font-semibold">Your Current Resources: </p>
          </div>
          <div className="flex-col flex space-y-4 mt-4 ">
            {resources?.map((resource) => (
              <ResourceContainer
                key={resource.resource_id}
                resource={resource}
                permissions={userInfo.permissions}
                refreshResources={getAllResources}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
