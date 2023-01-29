import React, {useState, useEffect} from 'react';
import useAuth from '../../hooks/useAuth';
import { UPDATE_RESOURCES, DELETE_RESOURCES } from '../../permissions';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'

function Resource (props){
    const {auth} = useAuth()
    const [newTopic, setNewTopic] = useState(props.resource.topic)
    const [newLevel, setNewLevel] = useState(props.resource.level)
    const [newLink, setNewLink] = useState(props.resource.link)
    const [edit, setEdit] = useState(false)

    

    const editResource = async() => {
        try {
            let resource_id = props.resource.resource_id
            const response = await axios.patch(URLS.RESOURCES, JSON.stringify({resource_id,newTopic,newLevel,newLink}),
                {
                    headers: {'Content-Type': 'application/json'},
                });
            console.log(response)
           // alert("Form Submitted Successfully")
        } catch (error) {
            console.log(error)
            //return console.log(error)
        }
    }

    const deleteResource = async() =>{
        try{
            const response = await axios.delete(URLS.RESOURCES,{
                params: {
                    "resource_id": props.resource.resource_id
                }
            },
            {
            headers: {'Content-Type': 'application/json'}
            }
            );
            console.log(response)
        }catch(err){
            console.log(err)
        }
        
    }
    
    const toggleState= (e) =>{
        setEdit(!edit)
    }
    const topicChangeHandler = (e) =>{
        setNewTopic(e.target.value)
    }
    const levelChangeHandler = (e) =>{
        setNewLevel(e.target.value)
    }
    const linkChangeHandler = (e) =>{
        setNewLink(e.target.value)
    }
  //deleteResource
    const handleDeleteResource = (e) => {
        e.preventDefault();
        console.log("in delete")
        deleteResource()
        props.setResources(props.resources.filter((e1) => e1.resource_id != props.resource.resource_id))
    }    
    //editResource
    const handleEditResource = (e) =>{
        e.preventDefault();
        editResource()
        props.setResources(
            props.resources.map((item) =>{
                if (item.resource_id === props.resource.resource_id){
                    return {
                        ...Resource, resource_id: props.resource.resource_id, topic: newTopic,level: newLevel, link: newLink
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
            edit?(
                <form onSubmit={handleEditResource} className="updateForm">
                    <label>Topic:</label>
                    <input type="text" value={newTopic} onChange = {topicChangeHandler} className="inputUpdate" />
                    
                    <label>Level:</label>
                    <input type="number" value={newLevel} onChange = {levelChangeHandler} className="inputUpdate" />
                    
                    <label>Link:</label>
                    <input type="text" value={newLink} onChange = {linkChangeHandler} className="inputUpdate" />
                    
                    <button className="btn updatebtn">Update</button>
                </form>
            ) :
            (
                <div className="resourcename">
                    <div className="resource-Horizontal-container" >
                            <label>Topic:</label>
                            <a href={props.resource.link}target="_blank">{props.resource.topic}</a>                   
                            <label>Level:</label>
                            {props.resource.level}

                    <span className= "resource_span"/>
                    <>
                    {
                        auth?.permissions?.find(perm => perm === UPDATE_RESOURCES)
                        ?<button className="btn editbtn" onClick={toggleState}>Edit</button>
                        :
                        <></>
                    }
                    </>
                    <>
                    {
                        auth?.permissions?.find(perm => perm === DELETE_RESOURCES)
                        ?<button className="btn deletebtn" onClick={handleDeleteResource}>Delete</button>
                        :
                        <></>
                    }
                    </>                    
                    
                </div>
                </div>
            )
        }</>
        
    )
}

export default Resource