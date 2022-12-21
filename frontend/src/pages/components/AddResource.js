import React from 'react'

const AddResource = (props) =>{

    return (
            <form onSubmit={props.z}>
                <input type="text" value={props.cr} placeholder="Add new resource" onChange={props.y} className="inputresource" />
                <button className="btn btnresource">Add Resource</button>
            </form>
    )
}

export default AddResource