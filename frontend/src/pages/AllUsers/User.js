function User(props){

    const resetPass = () =>{
        console.log("in reset pass")
    }
    const deleteUser = () =>{
        props.setAdmins(props.admins.filter((e1) => e1.id != props.user.id))
    }
    return(
        <div className="resourcename">
        <span>{props.user.name}</span>
        <button className="btn resetbtn" onClick={resetPass}>Reset Password</button>
        <button className="btn deletebtn" onClick={deleteUser}>Delete</button>
    </div>
    );

}

export default User