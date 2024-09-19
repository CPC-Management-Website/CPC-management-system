import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from "react";
import axios from "../hooks/axios";
import { toast } from "react-toastify";
import { Store } from "../context/store";
import CircularProgress from "@mui/material/CircularProgress";
import MentorProfile from "../components/MentorProfile";
import UpdatePassword from "../components/UpdatePassword";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
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

export default function EditProfile() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [vjudgeHandle, setVjudgeHandle] = useState("");
  const [updatePasswordWindowOpened, setUpdatePasswordWindowOpened] =
    useState(false);

  const displayProfile = useCallback(async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const response = await axios.get(`/api/users/${userInfo.id}`);
      setUserID(response.data.id);
      setName(response.data.name);
      setEmail(response.data.email);
      setVjudgeHandle(response.data.vjudge_handle);
      // setPassword(response.data.password);
      dispatch({ type: "FETCH_SUCCESS" });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL" });
      toast.error(error);
    }
  }, [userInfo.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/users/${userID}`,
        JSON.stringify({ email, name, vjudgeHandle }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Profile updated");
      displayProfile();
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(error.response.data.Error);
    }
  };

  useEffect(() => {
    displayProfile();
  }, [displayProfile]);

  return (
    <>
      {updatePasswordWindowOpened && (
        <UpdatePassword
          user_id={userInfo.id}
          isOpened={updatePasswordWindowOpened}
          setIsOpened={setUpdatePasswordWindowOpened}
        />
      )}
      <div className="flex flex-col lg:items-center p-4 lg:p-0 ">
        <p className="text-3xl font-semibold lg:my-10 my-4">Profile</p>
        {loading ? (
          <div className="flex justify-center py-32">
            <CircularProgress size={50} thickness={4} color="inherit" />
          </div>
        ) : (
          <form
            className="flex flex-col lg:w-[40%] border-2 border-gray-200 rounded-xl p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label className="inputlabel">Name</label>
              <div className="inputCont">
                <input
                  value={name}
                  className="input"
                  required
                  minLength={4}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="inputlabel">E-mail</label>
              <div className="inputCont">
                <input
                  value={email}
                  required
                  className="input"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="inputlabel">Vjudge Handle</label>
              <div className="inputCont">
                <input
                  value={vjudgeHandle}
                  className="input"
                  required
                  minLength={4}
                  onChange={(e) => setVjudgeHandle(e.target.value)}
                />
              </div>
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
                  Update Profile
                </button>
              )}
            </div>
            <div className="flex flex-col mt-4">
              <button
                className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded"
                type="button"
                onClick={() => setUpdatePasswordWindowOpened(true)}
              >
                Update Password
              </button>
            </div>
          </form>
        )}
        <MentorProfile />
      </div>
    </>
  );
}
