import "./AllUsers.css"
import axios from '../../hooks/axios';
// import User from './User';
import URLS from '../../server_urls.json'
function User(props){

    const resetPass = async () =>{
        console.log("in reset pass")
        try{
            let email = props.user.email
            const response = await axios.patch(URLS.USERS, JSON.stringify({email}),
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
        }catch(err){
            console.log(err)
        }
    }

    const deleteUser = async() =>{
        try{
            let email = props.user.email
            const response = await axios.delete(URLS.USERS,{
                params: {
                    "email": email
                }
            },
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
            props.setUsers(props.users.filter((e1) => e1.user_id != props.user.user_id))
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div className="user">
            <span className="userName">{props.user.name}</span>
            <div className="btns">
                <button className="resetbtn" onClick={resetPass}>Reset Password</button>
                <button className="deletebtn" onClick={deleteUser}>Delete</button>
            </div>
        </div>
    );

}

export default User