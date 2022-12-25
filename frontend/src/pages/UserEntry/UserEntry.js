import React, { useState }  from 'react';
import "./UserEntry.css"
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { HOMEPAGE } from '../../frontend_urls';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'

function UserEntry(){
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vjudgeHandle, setVjudgeHandle] = useState('');
    const [platformRole, setPlatformRole] = useState('');
    const [selectedFile, setSelectedFile] = useState('');

    const navigate = useNavigate();

    const enterUser = async() => {
        try {
            const response = await axios.post(URLS.USER_ENTRY, JSON.stringify({email, firstName, lastName, vjudgeHandle, platformRole}),
                {
                    headers: {'Content-Type': 'application/json'},
                });
            console.log(response)
            navigate(HOMEPAGE);
        } catch (error) {
            console.log(error)
            //return console.log(error)
        }
    }
    const enterFile = async () =>{
        try {
            const data = new FormData();
            data.append('excel-file', selectedFile, 'file.xlsx');
            const response = await axios.post(URLS.USER_ENTRY_FILE, data);  
            console.log(response) 
        } catch (error) {
            console.log(error)
        }
    }  

    const handleSubmit = (e) => {
        e.preventDefault();
        enterUser()
        setEmail('')
        setFirstName('')
        setLastName('')
        setVjudgeHandle('')
        setPlatformRole('')
        
    }

    const handleSubmitFile = (e) => {
        e.preventDefault();
        enterFile()
        setSelectedFile()
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
                        accept=".xls,.xlsx"
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
