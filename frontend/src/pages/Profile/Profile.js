import React, { useState, useEffect }  from 'react';
import "./Profile.css"
import NavBar from "../NavBar/NavBar";
import axios from '../../hooks/axios';
import useAuth from '../../hooks/useAuth';
import URLS from '../../server_urls.json'

function Profile() {

  const { auth } = useAuth();
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [vjudgeHandle, setVjudgeHandle] = useState('');
  const [password, setPassword] = useState('');
  const [ID, setID] = useState('');

  const editUser = (e) => {
    e.preventDefault();
    //stuffs you wanna do for editing
    setEdit(true);
  };


  const enterProfile = async() =>{
    try {
        const response = axios.post(URLS.PROFILE, JSON.stringify({email, name, vjudgeHandle, password}),
        {
            headers: {'Content-Type': 'application/json'},
        });
        console.log(response)
    } catch (error) {
        console.log(error)
        //return console.log(error)
    }
}

// // const params = new URLSearchParams([['email', email]])
let params = {
   email: email
  }
const displayProfile = async() =>{
    try {
        const response = await axios.get(URLS.PROFILE, {params});
        console.log(response)
 
        setName(response.name)
        setEmail(response.email)
        setVjudgeHandle(response.vjudgeHandle)
        setPassword(response.password)
        setID(response.user_id)
    } catch (error) {
        console.log(error)
        //return console.log(error)
    }
}

//     const displayProfile = async() =>{
//     try {
//         const response = await axios.get(URLS.PROFILE, {    
//             params: {
//              "email": "user2@gmail.com"
//             // "email" : JSON.stringify(email)
//             }
//         },);
//         console.log(response)
//         setName(response.name)
//         setEmail(response.email)
//         setVjudgeHandle(response.vjudgeHandle)
//         setPassword(response.password)
//         setID(response.user_id)

//      //   const val = response?.data?.email
//     } catch (error) {
//         console.log(error)
//         //return console.log(error)
//     }
// }



  const handleSubmit = (e) => {
      e.preventDefault();
      setEdit(false);
      const res = enterProfile()
      console.log(res)
  }

  useEffect(() => {}, [edit]);

  useEffect ( () => {
    console.log("called")
    setEmail(auth?.email)
    displayProfile()
},[]);


  return (
      <div>
      <NavBar/>

          <div md="4" className="gradient-custom auth-form-container">
          <h1><img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="Avatar" className="my-5" style={{alignItems: 'center', width: '300px' }} fluid /></h1>
              
              <form className="profile-form" onSubmit={handleSubmit}>
                  
                  <label htmlFor="Name">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)}type="name" placeholder="Sara Hussein" id="name" name="name" disabled = {!edit}/>
                
                  <label htmlFor="Email">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="useremail@gmail.com" id="email" name="email" disabled = {!edit} />
                
                  <label htmlFor="Vjudge Handle">Vjudge Handle</label>
                  <input value={vjudgeHandle} onChange={(e) => setVjudgeHandle(e.target.value)}type="string" placeholder="Vjudge Handle" id="vjudgeHandle" name="vjudgeHandle" disabled = {!edit} />
                  
                               
                  <label htmlFor="ID">ID</label>
                  <input value={ID} onChange={(e) => setID(e.target.value)}type="ID" placeholder="12234" id="ID" name="ID" disabled = {1}/>
                
                             
                  <label htmlFor="Password">Password</label>
                  <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="*****" id="password" name="password" disabled = {!edit}/>

                 {edit ? (
                 <h1><button style={{color: 'salmon'}} type="submit">Save</button></h1>
                  ) : (
                    <h1><button style={{color: 'salmon'}} onClick={(e) => editUser(e)}>Edit</button></h1>
                   )}
              </form>            
          </div>
      </div>
  );
}
export default Profile;
