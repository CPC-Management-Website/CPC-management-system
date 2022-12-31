import "./ContestDetails.css"
import NavBar from "../NavBar/NavBar";
import React, {useState} from 'react';
import URLS from '../../server_urls.json'
import axios from "../../hooks/axios";

function ContestDetails(){

    const[contestID, setContestID] = useState("")
    const[numOfProblems, setNumOfProblems] = useState("")
    const[startDate, setStartDate] = useState("")
    const[endDate, setEndDate] = useState("")
    const [topic, setTopic] = useState("")
    const [weekNum, setWeekNum] = useState("")

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const addContest = async () =>{
        try {
            const response = await axios.post(URLS.CONTEST, JSON.stringify({contestID, numOfProblems, 
                startDate, endDate, topic, weekNum}),
                {
                    headers: {'Content-Type': 'application/json'},
                });
            console.log(response)
        } catch (error) {
            console.log(error)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addContest()
        setContestID("")
        setEndDate("")
        setNumOfProblems("")
        setStartDate("")
        setTopic("")
        setWeekNum("")
        
    }    

    return(
    <div>
        <NavBar/>

        <div className='ContestDetailsPage'>
            <div className="auth-form-container">
                <h2>Add Contest Details</h2>
                <form className="ContestDetails-form" onSubmit={handleSubmit}>
                    
                   <div className="ContestDetails-container" >
                   <div className="userEntryVertical-container" >
                      < div className="ContestDetails-container" >
                            <label htmlFor="Contest ID">Contest ID*</label>
                            <input value = {contestID} type="string" placeholder="Contest ID" onChange={(e) => setContestID(e.target.value)} id="Contest ID" name="Contest ID" />
                        </div>
                         <div className="ContestDetails-container" >
                            <label htmlFor="Number of Problems">Number of Problems*</label>
                            <input type="number" value = {numOfProblems} placeholder="Number of Problems" onChange={(e) => setNumOfProblems(e.target.value)} id="Number of Problems" name="Number of Problems" />
                         </div>
                         <div className="ContestDetails-container"> 
                            <label htmlFor="Start Date">Start Date*</label>
                            <input type="string"  value = {startDate} placeholder="DD/MM/YYYY" onChange={(e) => setStartDate(e.target.value)} id="Start Date" name="Start Date"/>
                        </div>  
                        <div className="ContestDetails-container"> 
                            <label htmlFor="End Date">End Date*</label>
                            <input type="string" value = {endDate} placeholder="DD/MM/YYYY" onChange={(e) => setEndDate(e.target.value)} id="End Date" name="End Date"/>
                        </div>
                        <div className="ContestDetails-container"> 
                            <label htmlFor="Topic">Topic*</label>
                            <input id="outlined-multiline-flexible" value = {topic} label="Topic" onChange={(e) => setTopic(e.target.value)} placeholder="Topic"/>
                        </div>
                        <div className="ContestDetails-container"> 
                            <label htmlFor="Week Number">Week Number*</label>
                            <input type="number" value = {weekNum} placeholder="Week Number"onChange={(e) => setWeekNum(e.target.value)}  id="Week Number" name="Week Number"/>
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
