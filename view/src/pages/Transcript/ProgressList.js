import React from "react";
import ProgressPerContest from "./ProgressPerContest";

function render(contestList, progressList){
    const data = []
    for (let i = 0;  i < contestList.length; i ++){
        data.push(<ProgressPerContest key = {i} progressItem = {progressList[i]} contestItem = {contestList[i]}/>)
    }
    return data
}
function ProgressList(props){
    return (
        render(props.contestList, props.progressList)
    );


}

export default ProgressList;