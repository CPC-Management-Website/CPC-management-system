import React, { useState, useEffect }  from 'react';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'
import NavBar from '../NavBar/NavBar';


function AllUsers(){
    const [trainees, setTrainees] = useState ([]);
    const [mentors, setMentors] = useState ([]);
    const [admins, setAdmins] = useState([]);
    const [mentorHeads, setMentorHeads] = useState([]);
    const role = 'trainee'
    const getTrainees = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "trainee"
                }
            },
            {
                headers: {'Content-Type': 'application/json'}
                }
                )
            setTrainees(response.data)
            console.log(response)

        }catch(err){
            console.log(err)
        }
    }
    const getMentors = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "trainee"
                }
            },)
            setMentors(response.data)
            console.log(response)

        }catch(err){
            console.log(err)
        }
    }
    const getAdmins = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "trainee"
                }
            },)
            setAdmins(response.data)
            console.log(response)

        }catch(err){
            console.log(err)
        }
    }
    const getMentorHeads = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "trainee"
                }
            },)
            setMentorHeads(response.data)
            console.log(response.data)

        }catch(err){
            console.log(err)
        }
    }            

    useEffect ( () => {     // runs once when the browser is refreshed
        getTrainees()
        getMentors()
        getAdmins()
        getMentorHeads()
    },[]);

    return(
        <div>
            <NavBar />

            ALL USERS COMPONENT
        </div>
    )
}

export default AllUsers