import React, { useState, useEffect }  from 'react';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'
import NavBar from '../NavBar/NavBar';
import User from './User';
import "./AllUsers.css"

function AllUsers(){
    const [trainees, setTrainees] = useState ([]);
    const [mentors, setMentors] = useState ([]);
    const [admins, setAdmins] = useState([]);
    const getTrainees = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "Trainee"
                }
            },
            {
                headers: {'Content-Type': 'application/json'}
                }
                )
            setTrainees(response.data)
            console.log(response)
            getMentors()

        }catch(err){
            console.log(err)
        }
    }
    const getMentors = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "Mentor"
                }
            },)
            setMentors(response.data)
            console.log(response)
            getAdmins()

        }catch(err){
            console.log(err)
        }
    }
    const getAdmins = async () =>{
        try{
            const response = await axios.get(URLS.USERS, {    
                params: {
                    "role": "Admin"
                }
            },)
            setAdmins(response.data)
            console.log(response)

        }catch(err){
            console.log(err)
        }
    }


    useEffect ( () => {     // runs once when the browser is refreshed
        getTrainees()
    },[]);

    return(
        <div>
            <NavBar />
            <div className='titles'>Admins</div>
            <section className = "section">
                {
                    admins.map((user) => (
                        <User 
                        user = {user}
                        users = {admins}
                        setUsers = {setAdmins}
                        role = {"admin"}
                        />
                    ))
                }
            </section>
            <div className='titles'>Trainees</div>
            <section className = "section">
                {
                    trainees.map((user) => (
                        <User 
                        user = {user}
                        users = {trainees}
                        setUsers = {setTrainees}
                        role = {"trainee"}
                        />
                    ))
                }
            </section>  
            <div className='titles'>Mentors</div>
            <section className = "section">
                {
                    mentors.map((user) => (
                        <User 
                        user = {user}
                        users = {mentors}
                        setUsers = {setMentors}
                        role = {"mentor"}
                        />
                    ))
                }
            </section>                        
        </div>
    )
}

export default AllUsers