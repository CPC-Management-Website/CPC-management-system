import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import useAuth from '../../hooks/useAuth'
import { ADD_USERS, VIEW_RESOURCES, VIEW_TRAINEES } from "../../permissions";


function NavBar() {
  const { auth } = useAuth();
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink end to="/homepage" className="nav-logo">
            ASUFE CPC 
            <i className="fas fa-code"></i>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                end to="/homepage"
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                end to="/profile"
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink

                end to="/transcript"
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                My Assessment History
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink

                end
                to="/resources"
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Resources
              </NavLink>
            </li>
            <>{
              auth?.permissions?.find(perm => perm === ADD_USERS)
              ?
              <li className="nav-item">
                <NavLink

                  end to="/userentry"
                  className={(navData) => (navData.isActive ? "active" : "nav-links")}
                  onClick={handleClick}
                >
                Add Users
                </NavLink>
              </li>   
              : <></>         
            }
            </>

            <li className="nav-item">
              <NavLink

                end
                to="/contest"
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Add Contest
              </NavLink>
            </li>            
            <>{
              auth?.permissions?.find(perm => perm === VIEW_TRAINEES)
              ?
              <li className="nav-item">
                <NavLink

                  end to="/users"
                  className={(navData) => (navData.isActive ? "active" : "nav-links")}

                  onClick={handleClick}
                >
                View Mentees
                </NavLink>
              </li>
              :
              <></>
            }</>

          </ul>
          <div className="nav-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
