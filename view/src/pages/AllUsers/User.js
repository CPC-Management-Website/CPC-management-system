import "./AllUsers.css"

function User(props){

    const resetPass = () =>{
        console.log("in reset pass")
    }
    const deleteUser = () =>{
        props.setUsers(props.users.filter((e1) => e1.user_id != props.user.user_id))
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