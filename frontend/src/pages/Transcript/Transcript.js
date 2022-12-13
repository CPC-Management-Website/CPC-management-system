import ProgressList from "./ProgressList";
import React, {useEffect, useState} from "react";
import NavBar from "../NavBar/NavBar";

function Transcript() {

    const [progressList, setProgressList] = useState ([]);
    const getProgressList = async() =>{

        // do get request to backend
        /*
        RESPONSE FORMAT

        Contest week no.
        Contest topic
        no. of problems in contest
        no. of problems solved by trainee
        Trainee's zone in contest

        */
        // call setProgressList

    }

    useEffect ( () => {
        getProgressList()
    },[]);


    return (
        <div>
            <NavBar/>
            <header>
                <div>Transcript</div>
                <div>
                    <div>Trainee's name</div>
                    <div>Mentor's name</div>
                </div>
            </header>

            <ProgressList
            progressList = {progressList}
            / >
        </div>
    );

}
  
export default Transcript;