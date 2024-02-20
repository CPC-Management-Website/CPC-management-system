import React, { useState } from "react";
import { CircularProgress } from "@mui/material";

export default function FileInput({
  title,
  loading,
  submitHandler,
  identifier,
}) {
  const [selectedFile, setSelectedFile] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler(selectedFile);
  };

  return (
    <>
      <form className="flex flex-col lg:w-[40%]" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <p className="inputlabel">Upload file</p>
          <div className="flex flex-col">
            <label
              className="flex flex-row text-xl w-full justify-center items-center text-white py-1 px-6 bg-green-800 hover:bg-green-700 rounded mb-4 cursor-pointer"
              htmlFor={identifier}
            >
              <div className="flex mr-4">
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/ms-excel.png" />
              </div>
              Add Excel File
            </label>
            <input
              id={identifier}
              style={{ display: "none" }}
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              required
            />
          </div>
          {selectedFile?.length === 0 ? (
            <strong>No files added</strong>
          ) : (
            <div className="flex">
              <strong>{selectedFile?.name}</strong>
            </div>
          )}
          {console.log(selectedFile?.name)}
        </div>
        <div className="flex flex-col mt-4 mb-4">
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
              {title}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
