import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import React, { useState, useEffect }  from 'react';
import "./Profile.css"
import "../UserEntry/UserEntry.css"
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

          <div className="auth-form-container">
              <h2>Edit your profile</h2>
              <form className="userEntry-form" onSubmit={handleSubmit}>
                  
                  <label htmlFor="Name">Your Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)}type="name" placeholder="Sara Hussein" id="name" name="name" disabled = {!edit}/>
                
                  <label htmlFor="Email">Your Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="useremail@gmail.com" id="email" name="email" disabled = {!edit} />
                
                  <label htmlFor="Vjudge Handle">Vjudge Handle</label>
                  <input value={vjudgeHandle} onChange={(e) => setVjudgeHandle(e.target.value)}type="string" placeholder="Vjudge Handle" id="vjudgeHandle" name="vjudgeHandle" disabled = {!edit} />
                  
                               
                  <label htmlFor="ID">Your ID</label>
                  <input value={ID} onChange={(e) => setID(e.target.value)}type="ID" placeholder="12234" id="ID" name="ID" disabled = {1}/>
                
                             
                  <label htmlFor="Password">Your Password</label>
                  <input value={password} onChange={(e) => setPassword(e.target.value)}type="password" placeholder="*****" id="password" name="password" disabled = {!edit}/>

                 {edit ? (
                 <button type="submit">Save</button>
                  ) : (
                    <button onClick={(e) => editUser(e)}>Edit</button>
                   )}
              </form>



            
          </div>

      </div>

  );


//   return (
// <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
//       <MDBContainer className="py-5 h-100">
//         <MDBRow className="justify-content-center align-items-center h-100">
//           <MDBCol lg="6" className="mb-4 mb-lg-0">
//             <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
//               <MDBRow className="g-0">
//                 <MDBCol md="4" className="gradient-custom text-center text-white"
//                   style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
//                   <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
//                     alt="Avatar" className="my-5" style={{ width: '300px' }} fluid />
//                   <MDBTypography tag="h1">User Name</MDBTypography>

//                   <MDBIcon far icon="edit mb-5" />
//                 </MDBCol>
//                 <MDBCol md="8">
//                   <MDBCardBody className="p-4">

                    
//                     <MDBRow className="pt-1">
//                       <MDBCol size="6" className="mb-3">
//                         <MDBTypography tag="h6">Email</MDBTypography>
//                         <MDBCardText className="text-muted">user@gmail.com</MDBCardText>
//                       </MDBCol>
//                       <MDBCol size="6" className="mb-3">
//                         <MDBTypography tag="h6">Vjudge Handle</MDBTypography>
//                         <MDBCardText className="text-muted">Vjudge Handle</MDBCardText>
//                       </MDBCol>
//                       <MDBCol size="6" className="mb-3">
//                         <MDBTypography tag="h6">ID</MDBTypography>
//                         <MDBCardText className="text-muted">12345</MDBCardText>
//                       </MDBCol>
//                       <MDBCol size="6" className="mb-3">
//                         <MDBTypography tag="h6">Password</MDBTypography>
//                         <MDBCardText className="text-muted">*********</MDBCardText>
//                       </MDBCol>
                      
//                     </MDBRow>
//                   </MDBCardBody>
//                 </MDBCol>
//               </MDBRow>
//             </MDBCard>
//           </MDBCol>
//         </MDBRow>
//       </MDBContainer>
//     </section>
//   );
              }
export default Profile;
