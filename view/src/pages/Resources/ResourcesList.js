import React, {useState, useEffect} from 'react';
import Resource from './Resource';

function ResourcesList (props){
    

    return(
        <ul>
            {
                props.resources.map((resource) =>(
                    <Resource 
                        resource = {resource}
                        key = {resource.id}
                        setResources = {props.setResources}
                        resources = {props.resources}
                    />
                ))
            }
        </ul>
    )

}

export default ResourcesList