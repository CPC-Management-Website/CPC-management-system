import React, { useState, useEffect }  from 'react';
import "./Profile.css"
import APIService from '../../services/APIService';
import NavBar from "../NavBar/NavBar";

function Profile() {
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

  const enterProfile = () =>{
      APIService.enterProfile({email, name, vjudgeHandle, password})
      .catch(error => console.log('error',error))
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      setEdit(false);
      const res = enterProfile()
      console.log(res)
  }

  useEffect(() => {}, [edit]);


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
