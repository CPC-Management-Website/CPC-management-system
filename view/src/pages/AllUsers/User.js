import "./AllUsers.css"
import axios from '../../hooks/axios';
// import User from './User';
import URLS from '../../server_urls.json'
import ProgressList from "../../sharedComponents/ProgressList";
import React, { useState, useEffect }  from 'react';
import useAuth from '../../hooks/useAuth';
import { DELETE_USERS, UPDATE_USERS, VIEW_ADMINS, VIEW_ALL_TRANSCRIPTS, VIEW_MENTORS, VIEW_TRAINEES } from '../../permissions';

function User(props){
    const {auth} = useAuth()
    const [isShown, setIsShown] = useState(false);

    const resetPass = async () =>{
        console.log("in reset pass")
        try{
            let email = props.user.email
            const response = await axios.patch(URLS.USERS, JSON.stringify({email}),
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
        }catch(err){
            console.log(err)
        }
    }

    const deleteUser = async() =>{
        try{
            let email = props.user.email
            const response = await axios.delete(URLS.USERS,{
                params: {
                    "email": email
                }
            },
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
            props.setUsers(props.users.filter((e1) => e1.user_id != props.user.user_id))
        }catch(err){
            console.log(err)
        }
    }
    const handleClick = (e) =>{
        console.log('clicked')
        setIsShown(!isShown)
        
    }
    useEffect ( () => {     // runs once when the browser is refreshed
        console.log(props.role)
    },[]);

    return(
        <div className="page">
            <div className="user">
            <>{
                
                props.role === "trainee" && auth?.permissions?.find(perm => perm === VIEW_ALL_TRANSCRIPTS)?
                    <span onClick={handleClick} className="userName">{props.user.name}</span>
                    :
                    
                    <span className="userName">{props.user.name}</span>

                
                    }</>
            <div className="btns">
                <>
                {
                    auth?.permissions?.find(perm => perm === UPDATE_USERS)
                    ? <button className="resetbtn" onClick={resetPass}>Reset Password</button>
                    :
                    <></>
                }
                </>

                <>
                {
                    auth?.permissions?.find(perm => perm === DELETE_USERS)
                    ?<button className="deletebtn" onClick={deleteUser}>Delete</button>
                    :
                    <></>
                }
                </>                
            </div>
                
            </div>
            {isShown && (
                <ProgressList email = {props.user.email}/> 
            )}
            
        </div>
    );

}

export default User