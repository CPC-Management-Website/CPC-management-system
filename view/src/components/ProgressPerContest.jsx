function ProgressPerContest(props) {
  let x = "bg-green-300"
  switch(props.progressItem?.zone){
    case "Red":
      x = "bg-[#ffdddd]"
      break;
    case "Yellow":
      x = "bg-yellow-200"
      break;
    case "Green":
      x = "bg-[#a9f5af]"
      break;
    case "Dark Green":
      x = "bg-green-500"
      break;
    default:
      x = "bg-white"
      break;

  }
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between w-full border-2 rounded p-4 ${x}`} >
      <div className="flex flex-col">
        <a
          target="_blank"
          href={`https://vjudge.net/contest/${props.progressItem?.contest_id}`}
          className="underline text-blue-900"
        >
          {props.progressItem?.topic}
        </a>
        <p>week number : {props.progressItem?.week_number}</p>
      </div>
      <div className="flex flex-col sm:w-60">
        <p>
          {console.log(props.progressItem)}
          solved problems: {props.progressItem?.solved_problems} out of{" "}
          {props.progressItem?.total_problems}
        </p>
      </div>
    </div>
  );
}

export default ProgressPerContest;
