import ProgressList from "./ProgressList";
import React, {useEffect, useState} from "react";
import NavBar from "../NavBar/NavBar";
import axios from "../../hooks/axios";
import URLS from '../../server_urls.json'
import useAuth from "../../hooks/useAuth";
import { json } from "react-router-dom";
import './Transcript.css';

function Transcript() {
    const [trainee, setTrainee] = useState()
    const {auth} = useAuth()

    
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
                <p className="name">Name: {trainee?.name}</p>
                <p>Vjudge handle: {trainee?.vjudge_handle}</p>
                <p>email: {trainee?.email}</p>
                
            </div>

            <ProgressList email = {auth.email}/ >
        </div>
    );

}
  
export default Transcript;
