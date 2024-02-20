import React, { useState } from "react";

export default function SelectWithOther({ items, setValue, placeholder }) {
  const [viewOther, setViewOther] = useState(false);

  const changeHandler = (e) => {
    setValue(e.target.value === "NULL" ? null : e.target.value);
    setViewOther(e.target.value == "Other" ? true : false);
  };

  return (
    <>
      <div className="inputCont">
        <select
          onChange={changeHandler}
          type="string"
          className="input"
          placeholder={placeholder}
          required
        >
          <option key={null} value={undefined}></option>
          {items?.map(({ value }) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
          <option key={"Other"} value={"Other"}>
            Other
          </option>
        </select>
      </div>

      {viewOther && (
        <div className="flex flex-col">
          <label className="inputlabel">Please Specify {placeholder}*</label>
          <div className="inputCont">
            <input
              placeholder={placeholder}
              className="input"
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        </div>
      )}
    </>
  );
}
