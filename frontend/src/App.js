import './App.css';
import Login from './pages/Login/Login.js'
import UserEntry from './pages/UserEntry/UserEntry.js'
import Home from './pages/Home/Home';

import React,{ useState, useEffect }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Transcript from './pages/Transcript/Transcript';
import Layout from './Layout';
import {HOMEPAGE, TRANSCRIPT, USER_ENTRY} from './frontend_urls'


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
        {/* <Route path="unauthorized" element={<Unauthorized />} /> */}

        <Route path= {USER_ENTRY} element={<UserEntry />} />
        <Route path={HOMEPAGE} element={<Home />} />
        <Route path={TRANSCRIPT} element={<Transcript/>} />

      </Route>
    </Routes>
  );
}

export default App;
