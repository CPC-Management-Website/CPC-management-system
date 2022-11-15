import React, { useState }  from 'react';
import "./UserEntry.css"
import APIService from '../../services/APIService';
import { useNavigate } from "react-router-dom";

function UserEntry(){
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vjudgeHandle, setVjudgeHandle] = useState('');

    const navigate = useNavigate();
    const enterUser = () =>{
        APIService.enterUser({email, firstName, lastName, vjudgeHandle})
        .catch(error => console.log('error',error))
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const res = enterUser()
        setEmail('')
        setFirstName('')
        setLastName('')
        setVjudgeHandle('')
        console.log(res)
        navigate('/homepage');
    }

    return (
        <div className='userEntryPage'>
            <div className="auth-form-container">
                <h2>Add New User</h2>
                <form className="userEntryVertical-form" onSubmit={handleSubmit}>
                    <label htmlFor="Email">User Email*</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="useremail@gmail.com" id="email" name="email" />
                    <form className="userEntryHorizontal-form" >
                         <form className="userEntryVertical-form" >
                            <label htmlFor="First Name">First Name*</label>
                            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="string" placeholder="First Name" id="firstName" name="firstName" />
                         </form>  
                        <form className="userEntryVertical-form"> 
                            <label htmlFor="Last Name">Last Name*</label>
                            <input value={lastName} onChange={(e) => setLastName(e.target.value)}type="string" placeholder="Last Name" id="lastName" name="lastName" />
                        </form>
                    </form>
                    <label htmlFor="Vjudge Handle">VjudgeHandle*</label>
                    <input value={vjudgeHandle} onChange={(e) => setVjudgeHandle(e.target.value)}type="string" placeholder="Vjudge Handle" id="vjudgeHandle" name="vjudgeHandle" />
                    <button type="submit">Log In</button>
                </form>
            </div>

        </div>
    );
}

export default UserEntry;