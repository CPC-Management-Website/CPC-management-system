import React, { useState }  from 'react';
import "./UserEntry.css"
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { HOMEPAGE } from '../../frontend_urls';
import ErrorMessage from '../ErrorMessage/ErrorMessage.js';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'

function UserEntry(){
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vjudgeHandle, setVjudgeHandle] = useState('');
    const [platformRole, setPlatformRole] = useState('Trainee');
    const [selectedFile, setSelectedFile] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const enterUser = async() => {
        try {
            const response = await axios.post(URLS.USER_ENTRY, JSON.stringify({email, firstName, lastName, vjudgeHandle, platformRole}),
                {
                    headers: {'Content-Type': 'application/json'},
                });
            console.log(response)
            setSuccess(true)
            setErrMsg('Form Submitted Successfully');
           // alert("Form Submitted Successfully")
           // navigate(HOMEPAGE);
        } catch (error) {
            if (!error?.response) {
                setErrMsg('Internal Server Error');
            } else{
                setErrMsg(error.response.data.Error)
            }
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
            setSuccess(true)
            setErrMsg('Form Submitted Successfully');
          //  alert("Form Submitted Successfully")
        } catch (error) {
            if (!error?.response) {
                setErrMsg('Internal Server Error');
            } else{
                setErrMsg(error.response.data.Error)
            }
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
        setPlatformRole('Trainee')
        
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
            <>{
                    success?(
                        <ErrorMessage type="success" message={errMsg}/>
                    ) :
                    (
                       errMsg==""?(<></>) :(<ErrorMessage type="error" message={errMsg}/>)
                    )
                }</>
                <h2>Add New User</h2>
                <form className="userEntry-form" onSubmit={handleSubmit}>
                    <label htmlFor="Email">User Email*</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="useremail@gmail.com" id="email" name="email" required/>
                    <div className="userEntryHorizontal-container" >
                         <div className="userEntryVertical-container" >
                            <label htmlFor="First Name">First Name*</label>
                            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="string" placeholder="First Name" id="firstName" name="firstName"  required/>
                         </div>  
                        <div className="userEntryVertical-container"> 
                            <label htmlFor="Last Name">Last Name*</label>
                            <input value={lastName} onChange={(e) => setLastName(e.target.value)}type="string" placeholder="Last Name" id="lastName" name="lastName" required />
                        </div>
                    </div>
                    <label htmlFor="Vjudge Handle">Vjudge Handle*</label>
                    <input value={vjudgeHandle} onChange={(e) => setVjudgeHandle(e.target.value)}type="string" placeholder="Vjudge Handle" id="vjudgeHandle" name="vjudgeHandle" required/>
                    
                    <label htmlFor="Platform Role">Platform Role*</label>
                    <select value={platformRole} onChange={(e) => setPlatformRole(e.target.value)}type="string" placeholder="Platform Role" id="platformRole" name="platformRole">
                        <option>Trainee</option>
                        <option>Mentor</option>
                        <option>Mentor Head</option>
                        <option>Admin</option>
                    </select>
                    
                    <button type="submit">Add User</button>
                </form>
                <form className="userEntry-file" onSubmit={handleSubmitFile}>
                    <input
                        type="file"
                        //value={selectedFile}
                        accept=".xls,.xlsx"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        required
                    />
                    <button type="submit">Add Users from file</button>
                </form>
            </div>

        </div>
        </div>
    );
}
export default UserEntry;
