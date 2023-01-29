import React, {useState}from 'react'
import ErrorMessage from '../ErrorMessage/ErrorMessage.js';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'

const AddResource = (props) =>{
    const [errMsg, setErrMsg] = useState('');
    const [newResource, setNewResource] = useState("")
    const [success, setSuccess] = useState(false);
    const [resourceTopic, setresourceTopic] = useState("")
    const [resourceLink, setresourceLink] = useState("")
    const [resourceLevel, setresourceLevel] = useState("")
    //AddNewResource

    const enterResource = async() => {
        try {
            const response = await axios.post(URLS.RESOURCES, JSON.stringify({resourceTopic, resourceLevel, resourceLink}),
                {
                    headers: {'Content-Type': 'application/json'},
                });
            console.log(response)
            setSuccess(true)
            setErrMsg('Form Submitted Successfully');
           // alert("Form Submitted Successfully")
        } catch (error) {
            if (!error?.response) {
                setErrMsg('Internal Server Error');
            } else{
                setErrMsg(error.response.data.Error)
            }
            console.log(error)
            //return console.log(error)
        }
    }
    
    const addNewResource = (e) => {
        e.preventDefault();
        enterResource()
        props.setResources([
            ...props.resources, // that contains all the old items
            {name: resourceTopic,
            id : Math.random() *100}
        ]); 
        setNewResource ("");  
        setresourceTopic('')
        setresourceLink('')
        setresourceLevel('')
    }
    const topic_inputHandler = (e) =>{
        setresourceTopic(e.target.value)
    }
    const link_inputHandler = (e) =>{
        setresourceLink(e.target.value)
    }
    const level_inputHandler = (e) =>{
        setresourceLevel(e.target.value)
    }
    return (
        <div className='resourceEntryPage'>
            <div className="auth-form-container">
            <>{
                    success?(
                        <ErrorMessage type="success" message={errMsg}/>
                    ) :
                    (
                       errMsg==""?(<></>) :(<ErrorMessage type="error" message={errMsg}/>)
                    )
                }</>
                <form className="resourceEntry-form"onSubmit={addNewResource}>

                    <label htmlFor="Topic">Topic</label>
                    <input type="text" required value={resourceTopic} placeholder="Topic" onChange={topic_inputHandler} className="topicInput" />
                    
                    <label htmlFor="Link">Link</label>
                    <input type="text" required value={resourceLink} placeholder="Link" onChange={link_inputHandler} className="linkInput" />
                    
                    <label htmlFor="Level">Level</label>
                    <input type="number" required value={resourceLevel} placeholder="Level" onChange={level_inputHandler} className="levelInput" />

                    <button className="btn btnresource">Add Resource</button>

                </form>
            </div>
        </div>

    );
}

export default AddResource