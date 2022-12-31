import ProgressList from "./ProgressList";
import React, {useEffect, useState} from "react";
import NavBar from "../NavBar/NavBar";
import axios from "../../hooks/axios";
import URLS from '../../server_urls.json'
import useAuth from "../../hooks/useAuth";
import { json } from "react-router-dom";
import './Transcript.css';

function Transcript() {

    const [progressList, setProgressList] = useState ([]);
    const [contestList, setContestList] = useState ([]);
    const [trainee, setTrainee] = useState()
    const {auth} = useAuth()

    const getProgressList = async() =>{
        const params = new URLSearchParams([['email' , auth.email]])
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
    const getTrainee = async () =>{
        const params = new URLSearchParams([['email' , auth.email]])
        try{
            const response = await axios.get(URLS.PROFILE, {params},
            {
                headers: {'Content-Type': 'application/json'}
            }
            )
            setTrainee(response.data)
            console.log(response)
            getProgressList()

        }catch(err){
            console.log(err)
        }        

    }

    useEffect ( () => {
        getTrainee()
    },[]);


    return (
        <div>
            <NavBar/>
            <h2 className="heading">Transcript</h2>
            <div className="traineeDetails">
                <h3>{trainee?.name}</h3>
                <p>{trainee?.vjudge_handle}</p>
                <p>{trainee?.email}</p>
                
            </div>

            <ProgressList progressList = {progressList} contestList = {contestList}/ >
        </div>
    );

}
  
export default Transcript;
