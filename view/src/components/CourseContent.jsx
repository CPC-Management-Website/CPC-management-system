import React, { useContext, useReducer } from "react";
import { Store } from "../context/store";
import { toast } from "react-toastify";
import axios from "../hooks/axios";
import URLS from "../urls/server_urls.json";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../urls/frontend_urls";

function RegisterButton({ loading, userInfo, registerHandler, enabled, buttonText }){
  {console.log(enabled)}
  if(loading){
    return (
      <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4">
        <CircularProgress size={23} thickness={4} color="inherit" />
      </button>
    );
  }else if (!enabled){
    return(
      <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4"
        onClick={()=>registerHandler()}
        disabled = {!enabled}
      >
          {buttonText}
      </button>
    );
  }else{
    return(
      <button className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded block m-auto mt-4"
        onClick={()=>registerHandler()}
        disabled = {!enabled}
      >
          {buttonText}
      </button>
    );
  }
}
//   else if((!userInfo || (userInfo && userInfo.latestEnrollmentSeason < import.meta.env.VITE_CURRENT_SEASON_ID))){
//     return(
//       <button className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded block m-auto mt-4"
//         onClick={()=>registerHandler()}
//       >
//           Register
//       </button>
//     );
//   } else{
//     return(
//       <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4"
//         onClick={()=>registerHandler()}
//         disabled
//       >
//           Registered
//       </button>
//     );
//   }
// }

export default function CourseContent({ contentList, title, registrationEnabled, registerHandler, loading, buttonText }){
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo, seasons, registrationAvailable } = state;

    return (
        <>
        {console.log(registrationEnabled)}
        <p className="text-3xl font-semibold mb-4 text-center">{title}</p>
        <label className="text-xl font-semibold mb-4">Content:</label>
        <ol className="list-disc list-inside">
          {contentList?.map(( item, index ) => (
            <li key={index}>{item.value}</li>
          ))}
        </ol>
        <RegisterButton loading={loading} registerHandler={registerHandler} userInfo={userInfo} enabled={registrationEnabled} buttonText={buttonText}/>
        </>
    );}