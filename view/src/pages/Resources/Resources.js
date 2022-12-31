import React, { useState, useEffect} from 'react' 
import AddResource from './AddResourceForm'
import ResourcesList from './ResourcesList'
import './Resources.css';
import NavBar from "../NavBar/NavBar";

function Resources (){
  const initialResources = [
    {name: "Week #1 Session: "},
    {name: "Week #2 Session: "},
    {name: "Week #3 Session: "}
  ];

    
    //States
  const [resources, setResources] = useState ([]);
  

  const getResources = () =>{
    setResources([])
  }

  useEffect ( () => {     // runs once when the browser is refreshed
    getResources()
  },[]);    



  return (
    <div>
      <NavBar/>
      <div className="Resources">
        <h2 className="heading">Manage Your Resources</h2>

        <AddResource 
          resources = {resources}
          setResources = {setResources}
          />
            
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
