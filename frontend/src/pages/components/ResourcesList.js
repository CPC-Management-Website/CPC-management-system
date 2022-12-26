import React, {useState, useEffect} from 'react';
import Resource from './Resource';

function ResourcesList (props){
    const [edit, setEdit] = useState(false)

    return(
        <ul>
            {
                props.resources.map((resource) =>(
                    <Resource 
                        edit = {edit}
                        setEdit  = {setEdit}
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