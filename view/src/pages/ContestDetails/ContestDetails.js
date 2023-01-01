import "./ContestDetails.css"
import NavBar from "../NavBar/NavBar";
import React, {useState} from 'react';
import URLS from '../../server_urls.json'
import axios from "../../hooks/axios";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

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
            setSuccess(true)
            setErrMsg('Form Submitted Successfully');
        } catch (error) {
            if (!error?.response) {
                setErrMsg('Internal Server Error');
            } else{
                setErrMsg(error.response.data.Error)
            }
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
        {/* <div md="4" className="gradient-custom auth-form-container">               */}
                <>{
                    success?(
                        <ErrorMessage type="success" message={errMsg}/>
                    ) :
                    (
                       errMsg==""?(<></>) :(<ErrorMessage type="error" message={errMsg}/>)
                    )
                }</>
                <h2 >Add Contest Details</h2>
                <form className="ContestDetails-form" onSubmit={handleSubmit}>
                    
                   <div className="ContestDetails-container" >
                   <div className="ContestDetailsVertical-container" >
                      < div className="ContestDetailsVertical-container" >
                            <label htmlFor="Contest ID">Contest ID*</label>
                            <input value = {contestID} required type="string" placeholder="Contest ID" onChange={(e) => setContestID(e.target.value)} id="Contest ID" name="Contest ID" />
                        </div>
                         <div className="ContestDetailsVertical-container" >
                            <label htmlFor="Number of Problems">Number of Problems*</label>
                            <input type="number" required value = {numOfProblems} placeholder="Number of Problems" onChange={(e) => setNumOfProblems(e.target.value)} id="Number of Problems" name="Number of Problems" />
                         </div>
                         <div className="userEntryHorizontal-container" >
                         <div className="ContestDetailsVertical-container"> 
                            <label htmlFor="Start Date">Start Date*</label>
                            <input type="string"  required value = {startDate} placeholder="DD/MM/YYYY" onChange={(e) => setStartDate(e.target.value)} id="Start Date" name="Start Date"/>
                        </div>  
                        <div className="ContestDetailsVertical-container"> 
                            <label htmlFor="End Date">End Date*</label>
                            <input type="string" required value = {endDate} placeholder="DD/MM/YYYY" onChange={(e) => setEndDate(e.target.value)} id="End Date" name="End Date"/>
                        </div>
                        </div>
                        <div className="ContestDetailsVertical-container"> 
                            <label htmlFor="Topic">Topic*</label>
                            <input id="outlined-multiline-flexible" required value = {topic} label="Topic" onChange={(e) => setTopic(e.target.value)} placeholder="Topic"/>
                        </div>
                        <div className="ContestDetailsVertical-container"> 
                            <label htmlFor="Week Number">Week Number*</label>
                            <input type="number" required value = {weekNum} placeholder="Week Number"onChange={(e) => setWeekNum(e.target.value)}  id="Week Number" name="Week Number"/>
                        </div>    
                    </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
     </div>
    );
}
export default ContestDetails;
