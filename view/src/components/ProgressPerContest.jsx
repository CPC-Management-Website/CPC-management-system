import React from "react";

function ProgressPerContest(props) {
  let color = "bg-green-300";
  switch (props.progressItem?.zone) {
    case "Red":
      color = "bg-[#ffdddd]";
      break;
    case "Yellow":
      color = "bg-yellow-200";
      break;
    case "Green":
      color = "bg-[#a9f5af]";
      break;
    case "Dark Green":
      color = "bg-[#008000]";
      break;
    default:
      color = "bg-white";
      break;
  }
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between w-full border-2 rounded p-4 ${color}`}
    >
      <div className="flex flex-col">
        <a
          target="_blank"
          href={`https://vjudge.net/contest/${props.progressItem?.contest_id}`}
          className="underline text-blue-900"
          rel="noreferrer"
        >
          {props.progressItem?.topic}
        </a>
        <p>Week number : {props.progressItem?.week_number}</p>
      </div>
      <div className="flex flex-col sm:w-60">
        <p>
          {console.log(props.progressItem)}
          Solved problems: {props.progressItem?.solved_problems} out of{" "}
          {props.progressItem?.total_problems}
        </p>
      </div>
    </div>
  );
}

export default ProgressPerContest;
