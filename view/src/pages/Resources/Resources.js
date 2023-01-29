import React, { useState, useEffect} from 'react' 
import AddResource from './AddResourceForm'
import ResourcesList from './ResourcesList'
import './Resources.css';
import NavBar from "../NavBar/NavBar";
import useAuth from '../../hooks/useAuth';
import { ADD_RESOURCES } from '../../permissions';
import axios from '../../hooks/axios';
import URLS from '../../server_urls.json'

function Resources (){
  const {auth} = useAuth()
  // const initialResources = [
  //   {name: "Week #1 Session: "},
  //   {name: "Week #2 Session: "},
  //   {name: "Week #3 Session: "}
  // ];

    
    //States
  const [resources, setResources] = useState ([]);
  

  const getResources = async() =>{
    // setResources([])
      try {
        const response = await axios.get(URLS.RESOURCES);
        setResources(response.data.map(({resource_id,topic,level,link}) => ({ resource_id:resource_id, topic: topic, level: level, link: link})))
    } catch (error) {
        console.log(error)
    }
  }

  useEffect ( () => {     // runs once when the browser is refreshed
    getResources()
  },[]);    



  return (
    <div>
      <NavBar/>
      <div className="Resources">
        <h2 className="heading">Resources</h2>
        <>{
          auth?.permissions?.find(perm => perm === ADD_RESOURCES)
          ?
          <AddResource 
            resources = {resources}
            setResources = {setResources}
            />
          : <></>
        }
        </>
            
        <div className="current">
          <p className="currentp">Your Current Resources: </p>
          <ResourcesList 
            setResources={setResources} 
            resources = {resources}
          />

        </div>
        <h3 className="heading3">ASUFE CPC</h3>
      </div>
      </div>

    );
}
export default Resources;
