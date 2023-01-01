function ProgressPerContest (props){

    return (
        <div className="progressPerContest">
            <div className="contestDetails">
                <p>{props.contestItem?.topic}</p>
                <p>week number : {props.contestItem?.week_number}</p>

            </div>
            <div className="progress">
                <p>solved problems: {props.progressItem?.solved_problems}</p>
                <p>zone: {props.progressItem?.zone}</p>
            </div>
        </div>
    );
}

export default ProgressPerContest;