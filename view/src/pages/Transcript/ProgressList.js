import React from "react";
import ProgressPerContest from "./ProgressPerContest";

function ProgressList(props){
    return (
        <div>
            In List Component
            <ul>
                {
                props.progressList.map((progressItem) =>(
                <ProgressPerContest progressItem = {progressItem}/>
                ))
                }
            </ul>

        </div>
    );


}

export default ProgressList;