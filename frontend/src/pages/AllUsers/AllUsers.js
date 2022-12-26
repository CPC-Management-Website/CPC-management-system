import React, { useState, useEffect }  from 'react';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'
import NavBar from '../NavBar/NavBar';
import User from './User';

function AllUsers(){
    const [trainees, setTrainees] = useState ([
        {name: "Hanya", id : 4567},
        {name: "Sara", id : 4167},
        {name: "Mohamed", id : 8765}
    ]);
    const [mentors, setMentors] = useState ([
        {name: "Sama", id : 122},
        {name: "Basmalla", id : 3211},
        {name: "Mohamed 2", id : 9765}
    ]);
    const [admins, setAdmins] = useState([
        {name: "Hanya 2", id : 653},
        {name: "Sara 2", id : 8641},
        {name: "Sama 2", id : 8165}
    ]);
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
        // getTrainees()
        // getMentors()
        // getAdmins()
        // getMentorHeads()
    },[]);

    return(
        <div>
            <NavBar />
            <section className = "Admins Section">
                <div>Admins</div>
                {
                    admins.map((user) => (
                        <User 
                        user = {user}
                        admins = {admins}
                        setAdmins = {setAdmins}
                        />
                    ))
                }
            </section>
            ALL USERS COMPONENT
        </div>
    )
}

export default AllUsers