import React, {useState}from 'react'

const AddResource = (props) =>{
    const [newResource, setNewResource] = useState("")

    //AddNewResource
    const addNewResource = (e) => {
        e.preventDefault();

        props.setResources([
            ...props.resources, // that contains all the old items
            {name: newResource,
            id : Math.random() *100}
        ]); 
        setNewResource ("");  
    }
    const inputHandler = (e) =>{
        setNewResource(e.target.value)
    }
    return (
        <form onSubmit={addNewResource}>
            <input type="text" value={newResource} placeholder="Add new resource" onChange={inputHandler} className="inputresource" />
            <button className="btn btnresource">Add Resource</button>
        </form>
    );
}

export default AddResource