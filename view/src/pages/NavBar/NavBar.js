import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import useAuth from '../../hooks/useAuth'
import { ADD_CONTESTS, ADD_USERS, VIEW_RESOURCES, VIEW_TRAINEES, VIEW_MY_TRANSCRIPT, VIEW_ADMINS, VIEW_MENTORS } from "../../permissions";
import {USERS, CONTEST, HOMEPAGE, PROFILE, RESOURCES, TRANSCRIPT, USER_ENTRY} from '../../frontend_urls'


function NavBar() {
  const { auth } = useAuth();
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink end to={HOMEPAGE} className="nav-logo">
            ASUFE CPC 
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                end to={HOMEPAGE} 
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                end to={PROFILE}
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Profile
              </NavLink>
            </li>
            <>{
              auth?.permissions?.find(perm => perm === VIEW_MY_TRANSCRIPT)
              ?
            <li className="nav-item">
              <NavLink

                end to={TRANSCRIPT}
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                My Assessment History
              </NavLink>
            </li>
            :
            <></>
            }
            </>


            <>{
              auth?.permissions?.find(perm => perm === VIEW_RESOURCES)
              ?
              <li className="nav-item">
              <NavLink

                end
                to={RESOURCES}
                className={(navData) => (navData.isActive ? "active" : "nav-links")}
                onClick={handleClick}
              >
                Resources
              </NavLink>
            </li>
            :
            <></>
            }
            </>


            <>{
              auth?.permissions?.find(perm => perm === ADD_USERS)
              ?
              <li className="nav-item">
                <NavLink

                  end to={USER_ENTRY}
                  className={(navData) => (navData.isActive ? "active" : "nav-links")}
                  onClick={handleClick}
                >
                Add Users
                </NavLink>
              </li>   
              : <></>         
            }
            </>
            <>{
              auth?.permissions?.find(perm => perm === ADD_CONTESTS)
              ?
              <li className="nav-item">
                <NavLink

                  end
                  to={CONTEST}
                  className={(navData) => (navData.isActive ? "active" : "nav-links")}
                  onClick={handleClick}
                >
                  Add Contest
                </NavLink>
              </li>            
              : <> </>
            }
            </>

            <>{
              auth?.permissions?.find(perm => perm === VIEW_ADMINS || perm === VIEW_MENTORS || perm === VIEW_TRAINEES)
              ?
              <li className="nav-item">
                <NavLink

                  end to={USERS}
                  className={(navData) => (navData.isActive ? "active" : "nav-links")}

                  onClick={handleClick}
                >
                  <>{
                    auth?.permissions?.find(perm => perm === VIEW_ADMINS)
                    ? <span>Users</span>
                    :<span>Mentees</span>
                  }
                  </>
                
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
