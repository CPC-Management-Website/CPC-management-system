function ProgressPerContest (props){

    return (
        <div className="progressPerContest">
            <div className="contestDetails">
                {props.contestItem.topic}
                week number : {props.contestItem.week_number}

            </div>
            <div className="progress">
                solved problems: {props.progressItem.solved_problems}
                zone: {props.progressItem.zone}
            </div>
        </div>
    );
}

export default ProgressPerContest;