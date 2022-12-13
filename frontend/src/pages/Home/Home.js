import React from "react";
import NavBar from "../NavBar/NavBar";
import "./Home.css" 
function Home(){
    return (
    <div>
        <NavBar/>

        <div className="WelcomeText-container">
        <label className="WelcomeLabel">Welcome Back! </label>
        </div>

    </div>
    );
}

export default Home;