import React, {Component, useState, useEffect} from 'react' 
import AddResource from '../components/AddResource'
import ResourcesList from '../components/ResourcesList'
import './Resources.css';
import NavBar from "../NavBar/NavBar";

function Resources ()
// extends Component 
{
    const initialResources = [
      {name: "Week #1 Session: "},
      {name: "Week #2 Session: "},
     {name: "Week #3 Session: "}
    ];

    
    //States
    const [Resources, setResources] = useState ([]);
    //const [Resources, setResources] = useState(initialResources);
   
    const [current, setCurrent] =  useState("");
  
  //updateResource (track the new typed resource)
  const updateResource = (e) =>{
    e.preventDefault();

    setCurrent({current: e.target.value }) //input value
  }


  //AddNewResource
  const addNewResource = (e) => {
    e.preventDefault();
  let crr = current;
  setResources([
       ...Resources, // that contains all the old items
          {name: crr}
         ]); 
   setCurrent ("");  
}

  //deleteResource
const deleteResource = (i) => {
    let skls = Resources;
    skls.splice(i, 1); //remove
    setResources(skls);
  }

  //editResource
const editResource = (i, newval) =>{
    let sklls = Resources;

    let skl = sklls[i];
    skl['name']= newval;
    setResources(skl)
  }

    return (
      <div>
      <NavBar/>
      <div className="Resources">
        <h2 className="heading"><span className="fas fa-bahai awsome"></span> Manage Your Resources</h2>
        <form onSubmit={addNewResource}>
                <input type="text" placeholder="Add new resource"  value={current} onChange={(e) => setCurrent(e.target.value)} className="inputresource" />
                <button className="btn btnresource">Add Resource</button>
            </form>
            
        <div className="current">
          <p className="currentp">Your Current Resources: </p>
          <ul className="resourceList">{Resources.map((resource, i) => (
        <ResourcesList x={resource} key={i} index={i} del={deleteResource} editt={editResource}/>))}</ul>

        </div>
        <h3 className="heading3">ASUFE CPC</h3>
      </div>
      </div>

    );
  }export default Resources;
