import ProgressPerContest from "./ProgressPerContest";
import React, {useEffect, useState} from "react";
import axios from "../../hooks/axios";
import URLS from '../../server_urls.json'

function render(contestList, progressList){

    const data = []
    for (let i = 0;  i < contestList.length; i ++){
        data.push(<ProgressPerContest key = {i} progressItem = {progressList[i]} contestItem = {contestList[i]}/>)
    }
    return data
}
function ProgressList(props){
    const [progressList, setProgressList] = useState ([]);
    const [contestList, setContestList] = useState ([]);
    
    useEffect ( () => {
        setTimeout(() => getProgressList(), 1000)
    },[]);
    const getProgressList = async() =>{
        const params = new URLSearchParams([['email' , props.email]])
        try {
            const response = await axios.get(URLS.TRANSCRIPT,{params},
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
            setProgressList(response.data.progress)
            setContestList(response.data.contests)
            
        } catch (err) {
            console.log(err)
            
        }

    }

    return (
        render(contestList, progressList)
    );


}

export default ProgressList;