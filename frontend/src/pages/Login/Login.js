import React, { useState }  from 'react';
import "./Login.css"
import { useNavigate } from "react-router-dom";
import axios from '../../services/axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage.js';
import useAuth from '../../hooks/useAuth';
import { HOMEPAGE } from '../../frontend_urls';
import URLS from '../../server_urls.json'


function Login(){
    const {setAuth} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(true);

    const navigate = useNavigate();

    const loginUser = async () => {
        try {
            const response = await axios.post(URLS.LOGIN, JSON.stringify({email, password}),
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
            const permissions = response?.data?.permissions
            setAuth({email, password, permissions})
            setSuccess(true)
            navigate(HOMEPAGE);
            
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

                <h2 className='login-title'>Login</h2>
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