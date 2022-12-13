import React from "react";
import NavBar from "../NavBar/NavBar";
import { ReactComponent as Logo } from './developer.svg';
import "./Home.css" 
function Home(){
    return (
    <div>
        <NavBar/>

        <div className="welcome-page-horizontal-container" >
        <div className="welcome-page-vertical-container" >
        <label className="WelcomeLabel">Welcome back! </label>
        <label className="welcome-label-description"> Create resources, manage enrollment, track the performance of each trainee and build learning community — all in one place</label>
        </div>
        <Logo width = "600" height = "600"/>

        </div>
    </div>
    );
}

export default Home;