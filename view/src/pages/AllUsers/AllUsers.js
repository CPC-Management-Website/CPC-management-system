import React, { useState, useEffect }  from 'react';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'
import NavBar from '../NavBar/NavBar';
import User from './User';
import "./AllUsers.css"
import useAuth from '../../hooks/useAuth';
import { VIEW_ADMINS, VIEW_MENTORS, VIEW_TRAINEES } from '../../permissions';

function AllUsers(){
    const {auth} = useAuth()
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

            if (auth?.permissions?.find(perm => perm === VIEW_MENTORS)){
                getMentors()
            }


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
            if (auth?.permissions?.find(perm => perm === VIEW_ADMINS)){
                getAdmins()
            }            
            

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
            <>{
            auth?.permissions?.find(perm => perm === VIEW_ADMINS)
            ?
            <section className = "section">
                <div className='titles'>Admins</div>
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
                    :
                    <></>
            }
            </>


            <>{
            auth?.permissions?.find(perm => perm === VIEW_MENTORS)
            ?
            <section className = "section">
                <div className='titles'>Mentors</div>
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
                    :
                    <></>
            }
            </>


            <>{
            auth?.permissions?.find(perm => perm === VIEW_TRAINEES)
            ?
            <section className = "section">
                <div className='titles'>Trainees</div>
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
                    :
                    <></>
            }
            </>         
        </div>
    );
}

export default AllUsers