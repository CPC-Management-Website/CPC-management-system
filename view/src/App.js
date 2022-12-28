import './App.css';
import Login from './pages/Login/Login.js'
import UserEntry from './pages/UserEntry/UserEntry.js'
import Resources from './pages/Resources/Resources.js'
import Profile from './pages/Profile/Profile.js'
import Home from './pages/Home/Home';
import Unauthorized from './pages/Unauthorized/unauthorized'
import React,{ useState, useEffect }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Transcript from './pages/Transcript/Transcript';
import Layout from './Layout';
import {HOMEPAGE, TRANSCRIPT, UNAUTHORIZED, USER_ENTRY, RESOURCES, PROFILE, CONTEST, ALL_USERS} from './frontend_urls'
import RequireAuth from './requireAuth';
import { VIEW_TRANSCRIPT, ADD_USERS, VIEW_RESOURCES} from './permissions';
import ContestDetails from './pages/ContestDetails/ContestDetails';
import AllUsers from './pages/AllUsers/AllUsers';


function App() {

  const [data, setdata] = useState({
    x : ""
  });

  useEffect(() => {
    // Fetching the API endpoint from the flask server
    fetch("http://127.0.0.1:5000/data",{
      'methods':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
    .then(function (res){
      res.json()
      .then(function (data) {
        setdata({
          x : data.X
        });
        console.log(data)
      });
    });
  }, []);
  return (
    <Routes>
      <Route path = "/" element = {<Layout />}>

        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path={UNAUTHORIZED} element={<Unauthorized />} />
          
          
        {/* routes that can be accessed only if you're logged in*/}
        <Route element = {<RequireAuth />}>
          <Route path={HOMEPAGE} element={<Home />} />
          <Route path={PROFILE} element={<Profile/>} />
        </Route>

        {/* routes that can be accessed with specific permissions*/}
        <Route element = {<RequireAuth requiredPermissions = {[ADD_USERS]} />}>
          <Route path= {USER_ENTRY} element={<UserEntry />} />
        </Route>

        <Route element = {<RequireAuth requiredPermissions = {[VIEW_RESOURCES]} />}>
          <Route path= {RESOURCES} element={<Resources />} />
        </Route> 

        <Route element = {<RequireAuth requiredPermissions = {[VIEW_TRANSCRIPT]} />}>
          <Route path={TRANSCRIPT} element={<Transcript/>} />
        </Route> 

        <Route path={CONTEST} element={<ContestDetails/>} />
        <Route path={ALL_USERS} element={<AllUsers/>} />
        
        

      </Route>
    </Routes>
  );
}

export default App;
