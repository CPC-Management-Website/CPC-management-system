import React, {Component} from 'react' 
import AddResource from '../components/AddResource'
import ResourcesList from '../components/ResourcesList'
import './Resources.css';
import NavBar from "../NavBar/NavBar";

class Resources extends Component {

  
  constructor() {
    super();
    this.state = JSON.parse(window.localStorage.getItem('state')) || {
    resources:[
      {name: "Week #1 Session: "},
      {name: "Week #2 Session: "},
      {name: "Week #3 Session: "}
    ],
    }
  }
  setState(state) {
    window.localStorage.setItem('state', JSON.stringify(state));
    super.setState(state);
  }

  // state={
  //   resources:[
  //     {name: "Week #1 Session: "},
  //     {name: "Week #2 Session: "},
  //     {name: "Week #3 Session: "}
  //   ],
  //   current: ''
  // }

  //updateResource (track the new typed resource)
  updateResource = (e) =>{
    e.preventDefault();
    this.setState({
        current: e.target.value //input value
      })
  }

  //AddNewResource
  addNewResource = (e) => {
    e.preventDefault();
   let crr = this.state.current;
   let sk = this.state.resources;
   sk.push({name:crr})
   this.setState({
    resources: sk,
    current: ''
   })
  }

  //deleteResource

  deleteResource = (i) => {
    let skls = this.state.resources;
    skls.splice(i, 1); //remove
    this.setState({
      resources: skls
    })
  }

  //editResource
  editResource = (i, newval) =>{
    let sklls = this.state.resources;
    let skl = sklls[i];
    skl['name']= newval;
    this.setState({
      resources: sklls
    })
  }


  render(){
    const resourcesList = this.state.resources.map((resource, i) => {
      return <ResourcesList x={resource} key={i} index={i} del={this.deleteResource} editt={this.editResource}/>
    })
    
    return (
      <div>
      <NavBar/>
      <div className="Resources">
        <h2 className="heading"><span className="fas fa-bahai awsome"></span> Manage Your Resources</h2>
        <AddResource y={this.updateResource} z={this.addNewResource} cr={this.state.current}/>
        <div className="current">
          <p className="currentp">Your Current Resources: </p>
          <ul className="resourceList">{resourcesList}</ul>
        </div>
        <h3 className="heading3">ASUFE CPC</h3>

      </div>
      </div>

    );
  }
}

export default Resources;
