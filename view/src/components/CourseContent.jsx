import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function RegisterButton({ loading, registerHandler, enabled, buttonText }) {
  {
    console.log(enabled);
  }
  if (loading) {
    return (
      <button className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4">
        <CircularProgress size={23} thickness={4} color="inherit" />
      </button>
    );
  } else if (!enabled) {
    return (
      <button
        className="bg-slate-300 text-white py-2 px-6 rounded block m-auto mt-4"
        onClick={() => registerHandler()}
        disabled={!enabled}
      >
        {buttonText}
      </button>
    );
  } else {
    return (
      <button
        className="bg-violet-800 hover:bg-violet-500 text-white py-2 px-6 rounded block m-auto mt-4"
        onClick={() => registerHandler()}
        disabled={!enabled}
      >
        {buttonText}
      </button>
    );
  }
}

export default function CourseContent({
  contentList,
  title,
  registrationEnabled,
  registerHandler,
  loading,
  buttonText,
}) {
  return (
    <>
      {console.log(registrationEnabled)}
      <p className="text-3xl font-semibold mb-4 text-center">{title}</p>
      <label className="text-xl font-semibold mb-4">Content:</label>
      <ol className="list-disc list-inside">
        {contentList?.map((item, index) => (
          <li key={index}>{item.value}</li>
        ))}
      </ol>
      <RegisterButton
        loading={loading}
        registerHandler={registerHandler}
        enabled={registrationEnabled}
        buttonText={buttonText}
      />
    </>
  );
}
