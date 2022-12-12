import React, { useState, useContext }  from 'react';
import "./Login.css"
import APIService from '../../services/APIService';
import { useNavigate } from "react-router-dom";
import axios from '../../services/axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage.js';
import AuthContext from '../../context/AuthProvider';


const LOGIN_URL = '/login'

function Login(){
    const {setAuth} = useContext(AuthContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(true);

    const navigate = useNavigate();

    const loginUser = async () => {
        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({email, password}),
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            const permissions = response?.data?.permissions
            setAuth({email, password, permissions})
            console.log(response)
            setSuccess(true)
            navigate('/homepage');
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('Internal Server Error');
            } else{
                setErrMsg(err.response.data.Error)
            }
            console.log(err)
            setSuccess(false)
            
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser()
        setEmail('')
        setPassword('')
    }

    return (
        <div className='loginPage'>
            <div className="auth-form-container">
                <>{
                    success?(
                        <></>
                    ) :
                    (
                        <ErrorMessage type="error" message={errMsg}/>
                    )
                }</>

                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        onClick = {() => setSuccess(true)}
                        type="email" 
                        placeholder="youremail@gmail.com" 
                        id="email" name="email" 
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        onClick = {() => setSuccess(true)}
                        type="password" 
                        placeholder="**********" 
                        id="password" name="password" 
                        required
                    />
                    <button type="submit">Log In</button>
                </form>
            </div>

        </div>
    );
}

export default Login;