import React, {Component, Fragment} from 'react';

class ResourcesList extends Component{

    state={
        isEdit : false
    }
    renderResource = () =>{
        return(
        <li className="resourcename">
            <span>{this.props.x.name}</span>
            <button className="btn editbtn" onClick={() => {this.toggleState()}}>Edit</button>
            <button className="btn deletebtn" onClick={() => {this.props.del(this.props.index)}}>Delete</button>
         </li>
        )

    }
    
    //toggle 
    toggleState = () =>{
        let {isEdit} = this.state;
        this.setState({
            isEdit: !isEdit
        })
    }
    updateResourceItem = (e) =>{
        e.preventDefault();
        this.props.editt(this.props.index, this.input.value);
        this.toggleState();
    }
    //updateForm
    renderUpdateFrom = () =>{
        return(
            <form onSubmit={this.updateResourceItem} className="updateForm">
                <input type="text" ref={(v) => {this.input = v}} defaultValue={this.props.x.name} className="inputUpdate" />
                <button className="btn updatebtn">Update</button>
            </form>
        )
    }
    render(){
        let {isEdit} = this.state
        return (
            <Fragment> 
                {isEdit ? this.renderUpdateFrom(): this.renderResource()}
            </Fragment>
          );
    }
  
}


export default ResourcesList