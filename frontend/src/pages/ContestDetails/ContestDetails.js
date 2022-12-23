import "./ContestDetails.css"
import React from 'react';
import TextField from '@material-ui/core/TextField'

function ContestDetails(){
    return(
        
    <div >
            
            <div md="4" className="gradient-custom text-center text-white"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
      }}
    >
        <p></p><TextField requiredid="outlined-required" label="Contest ID" defaultValue="" variant="filled" />
        <TextField requiredid="outlined-required"label="Number of problems"defaultValue="" type="number"variant="filled"/>
        <TextField requiredid="outlined-required" label="Start Date"defaultValue="" variant="filled"/>
        <TextField requiredid="outlined-required" label="End Date"defaultValue="" variant="filled"/>
        <TextField id="outlined-multiline-flexible" label="Description" multiline maxRows={4}  variant="filled"/>
        <TextField requiredid="outlined-required" label="Week number"defaultValue=""type="number" variant="filled"/>
        <button style={{height: 50, width: '80px',marginTop: 5, backgroundColor:  'white' ,color: 'salmon'}}>Submit</button><p></p>
    </div>
    
    
    </div>
    );
}
export default ContestDetails;

