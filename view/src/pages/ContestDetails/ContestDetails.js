import "./ContestDetails.css"
import NavBar from "../NavBar/NavBar";
import React from 'react';

function ContestDetails(){
    return(
    <div>
        <NavBar/>

        <div className='ContestDetailsPage'>
            <div className="auth-form-container">
                <h2>Add Contest Details</h2>
                <form className="ContestDetails-form" >
                    
                   <div className="ContestDetails-container" >
                   <div className="userEntryVertical-container" >
                      < div className="ContestDetails-container" >
                            <label htmlFor="Contest ID">Contest ID*</label>
                            <input type="string" placeholder="Contest ID" id="Contest ID" name="Contest ID" />
                        </div>
                         <div className="ContestDetails-container" >
                            <label htmlFor="Number of Problems">Number of Problems*</label>
                            <input type="number" placeholder="Number of Problems" id="Number of Problems" name="Number of Problems" />
                         </div>
                         <div className="ContestDetails-container"> 
                            <label htmlFor="Start Date">Start Date*</label>
                            <input type="string"  placeholder="DD/MM/YYYY" id="Start Date" name="Start Date"/>
                        </div>  
                        <div className="ContestDetails-container"> 
                            <label htmlFor="End Date">End Date*</label>
                            <input type="string" placeholder="DD/MM/YYYY" id="End Date" name="End Date"/>
                        </div>
                        <div className="ContestDetails-container"> 
                            <label htmlFor="Topic">Topic*</label>
                            <input id="outlined-multiline-flexible" label="Topic"placeholder="Topic" multiline maxRows={4}/>
                        </div>
                        <div className="ContestDetails-container"> 
                            <label htmlFor="Week Number">Week Number*</label>
                            <input type="number" placeholder="Week Number" id="Week Number" name="Week Number"/>
                        </div>    
                    </div>
                    </div>
                    <button style={{color: 'salmon'}}type="submit">Submit</button>
                </form>
            </div>
        </div>
        </div>
    );
}
export default ContestDetails;
