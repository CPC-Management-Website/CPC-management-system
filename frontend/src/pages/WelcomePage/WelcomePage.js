import "./WelcomePage.css"

function WelcomeEntry(){

        // this code causes an error

        //     // Get the container element
        // const menuContainer = document.getElementsByClassName("sidebar");
        // console.log(menuContainer); 
        // // Get all elements with tag="a" inside the container
        // const btns = menuContainer[0].getElementsByTagName("a");

        // // Loop through the elements and add the active class to the current/clicked element
        // for (var i = 0; i < btns.length; i++) {
        // btns[i].addEventListener("click", function() {
        //     var current = document.getElementsByClassName("active");
        //     current[0].className = current[0].className.replace(" active", "");
        //     this.className += " active";
        // });
        // }

  

    return (
       // <div className='WelcomePage'>
       //     <div className="WelcomeHorizontal-container" >
                <div class="sidebar">
                    <a class="active" href="#home" onclick="openPage(event, 'Home')">Home</a>
                    <a href="#profile">My Profile</a>
                    <a href="#overview">My Overview</a>
                    <a href="#assessmenthistory">My Assessment History</a>
                    <a href="#resources">My Resources</a>
                    <a href="#addusers">Add New Users</a>
                    <a href="#mentees">View Mentees</a>            
        
                </div>
    );
}

export default WelcomeEntry;
