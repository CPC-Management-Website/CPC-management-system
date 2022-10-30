import React, { useState }  from 'react';
import "./Login.css"
import APIService from '../../services/APIService';

function Login(){
    const [email, setEmail] = useState('');

    const loginUser = () =>{
        APIService.loginUser({email})
        .catch(error => console.log('error',error))
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser()
        setEmail('')
    }

    return (
    <div className="auth-form-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <button type="submit">Log In</button>
        </form>
    </div>
    );
}

export default Login;