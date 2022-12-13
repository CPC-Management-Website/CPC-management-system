import React, { useState }  from 'react';
import "./UserEntry.css"
import APIService from '../../services/APIService';
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

function UserEntry(){
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vjudgeHandle, setVjudgeHandle] = useState('');
    const [platformRole, setPlatformRole] = useState('');
    const [selectedFile, setSelectedFile] = useState('');

    const navigate = useNavigate();
    const enterUser = () =>{
        APIService.enterUser({email, firstName, lastName, vjudgeHandle, platformRole})
        .catch(error => console.log('error',error))
    }
    const enterFile = () =>{
        APIService.enterFile(selectedFile)
        .catch(error => console.log('error',error))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const res = enterUser()
        setEmail('')
        setFirstName('')
        setLastName('')
        setVjudgeHandle('')
        setPlatformRole('')
        console.log(res)
        navigate('/homepage');
    }

    const handleSubmitFile = (e) => {
        e.preventDefault();
        const res = enterFile()
        setSelectedFile()
        console.log(res)
        //navigate('/homepage');
    }

    return (
        <div>
        <NavBar/>

        <div className='userEntryPage'>
            <div className="auth-form-container">
                <h2>Add New User</h2>
                <form className="userEntry-form" onSubmit={handleSubmit}>
                    <label htmlFor="Email">User Email*</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="useremail@gmail.com" id="email" name="email" />
                    <div className="userEntryHorizontal-container" >
                         <div className="userEntryVertical-container" >
                            <label htmlFor="First Name">First Name*</label>
                            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="string" placeholder="First Name" id="firstName" name="firstName" />
                         </div>  
                        <div className="userEntryVertical-container"> 
                            <label htmlFor="Last Name">Last Name*</label>
                            <input value={lastName} onChange={(e) => setLastName(e.target.value)}type="string" placeholder="Last Name" id="lastName" name="lastName" />
                        </div>
                    </div>
                    <label htmlFor="Vjudge Handle">Vjudge Handle*</label>
                    <input value={vjudgeHandle} onChange={(e) => setVjudgeHandle(e.target.value)}type="string" placeholder="Vjudge Handle" id="vjudgeHandle" name="vjudgeHandle" />
                    
                    <label htmlFor="Platform Role">Platform Role*</label>
                    <select value={platformRole} onChange={(e) => setPlatformRole(e.target.value)}type="string" placeholder="Platform Role" id="platformRole" name="platformRole">
                        <option>Admin</option>
                        <option>Trainee</option>
                        <option>Mentor</option>
                        <option>Mentor Head</option>
                    </select>
                    
                    <button type="submit">Add User</button>
                </form>
                <form className="userEntry-file" onSubmit={handleSubmitFile}>
                    <input
                        type="file"
                        //value={selectedFile}
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <button type="submit">Add Users from file</button>
                </form>
            </div>

        </div>
        </div>

    );
}

export default UserEntry;