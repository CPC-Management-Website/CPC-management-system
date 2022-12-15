import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/homepage" className="nav-logo">
            ASUFE CPC 
            <i className="fas fa-code"></i>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/homepage"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/profile"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/overview"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Overview
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink

                exact
                to="/transcript"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                My Assessment History
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink

                exact
                to="/resources"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Resources
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink

                exact
                to="/userentry"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
              Add Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink

                exact
                to="/mentees"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
              View Mentees
              </NavLink>
            </li>

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