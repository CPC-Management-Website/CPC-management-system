import React, {useState, useEffect} from 'react';

function Resource (props){
    const [newName, setNewName] = useState(props.resource.name)
    
    const toggleState= (e) =>{
        props.setEdit(!props.edit)
    }
    const nameChangeHandler = (e) =>{
        setNewName(e.target.value)
    }
  //deleteResource
    const deleteResource = (e) => {
        e.preventDefault();
        props.setResources(props.resources.filter((e1) => e1.id != props.resources.id))
    }    
    //editResource
    const editResource = (e) =>{
        e.preventDefault();
        props.setResources(
            props.resources.map((item) =>{
                if (item.id === props.resource.id){
                    return {
                        ...Resource, name: newName
                    };
                }
                return item
            }
            )
        );
        toggleState()
    }    
    return( 
        <>{
            props.edit?(
                <form onSubmit={editResource} className="updateForm">
                <input type="text" value={newName} onChange = {nameChangeHandler} className="inputUpdate" />
                <button className="btn updatebtn">Update</button>
            </form>
            ) :
            (
                <div className="resourcename">
                    <span>{props.resource.name}</span>
                    <button className="btn editbtn" onClick={toggleState}>Edit</button>
                    <button className="btn deletebtn" onClick={deleteResource}>Delete</button>
                </div>
            )
        }</>
        
    )
}

export default Resource