import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Drawer } from "@mui/material";
import { Store } from "../context/store";
import CloseIcon from "@mui/icons-material/Close";
import {
  ADD_CONTESTS,
  ADD_USERS,
  VIEW_RESOURCES,
  VIEW_TRAINEES,
  VIEW_MY_TRANSCRIPT,
  VIEW_ADMINS,
  VIEW_MENTORS,
} from "../permissions/permissions";
import {
  USERS,
  CONTEST,
  RESOURCES,
  TRANSCRIPT,
  USER_ENTRY,
  HOMEPAGE,
  PROFILE,
} from "../urls/frontend_urls";

function NavBar() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { dispatch: ctxDispatch } = useContext(Store);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const list = () => (
    <ul className="text-black flex flex-col p-6 space-y-6 text-xl font-medium w-[80vw] bg-[f7f7f7]">
      <ul className="flex felx-row justify-between">
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to="/"
            className={(navData) => (navData.isActive ? "active" : null)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <CloseIcon onClick={toggleDrawer(false)} sx={{ fontSize: 30 }} />
        </li>
      </ul>
      <li className="nav-item">
        <NavLink
          to={PROFILE}
          onClick={toggleDrawer(false)}
          className={(navData) => (navData.isActive ? "active" : null)}
        >
          Profile
        </NavLink>
      </li>

      {userInfo?.permissions?.find((perm) => perm === VIEW_MY_TRANSCRIPT) ? (
        <li className="nav-item">
          <NavLink
            to={TRANSCRIPT}
            onClick={toggleDrawer(false)}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            My Assessment History
          </NavLink>
        </li>
      ) : null}

      {userInfo?.permissions?.find((perm) => perm === VIEW_RESOURCES) ? (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={RESOURCES}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            Resources
          </NavLink>
        </li>
      ) : null}

      {userInfo?.permissions?.find((perm) => perm === ADD_USERS) ? (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={USER_ENTRY}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            Add Users
          </NavLink>
        </li>
      ) : null}

      {userInfo?.permissions?.find((perm) => perm === ADD_CONTESTS) ? (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={CONTEST}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            Add Contest
          </NavLink>
        </li>
      ) : null}

      {userInfo?.permissions?.find(
        (perm) =>
          perm === VIEW_ADMINS ||
          perm === VIEW_MENTORS ||
          perm === VIEW_TRAINEES
      ) ? (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={USERS}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            {userInfo?.permissions?.find((perm) => perm === VIEW_ADMINS) ? (
              <span>Users</span>
            ) : (
              <span>Mentees</span>
            )}
          </NavLink>
        </li>
      ) : null}

      <li className="nav-item">
        <NavLink
          to="/"
          onClick={() => {
            signoutHandler();
            toggleDrawer(false);
          }}
        >
          Sign out
        </NavLink>
      </li>
    </ul>
  );

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
  };

  return (
    <nav className="sticky top-0 ">
      {userInfo ? (
        <div className="flex flex-row py-2 justify-between px-4 lg:justify-around items-center bg-white text-black drop-shadow ">
          <span className="flex lg:hidden mr-4">
            <img
              src="https://img.icons8.com/ios-filled/30/000000/menu-rounded.png"
              onClick={toggleDrawer(true)}
            />
            <Drawer open={open} anchor="left" onClose={toggleDrawer(false)}>
              {list()}
            </Drawer>
          </span>

          <NavLink className="text-3xl" to={HOMEPAGE}>
            ASUFE CPC
          </NavLink>

          <ul className="hidden lg:flex flex-row space-x-8">
            <li className="nav-item">
              <NavLink
                to={HOMEPAGE}
                className={(navData) => (navData.isActive ? "active" : null)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={PROFILE}
                className={(navData) => (navData.isActive ? "active" : null)}
              >
                Profile
              </NavLink>
            </li>

            {userInfo?.permissions?.find(
              (perm) => perm === VIEW_MY_TRANSCRIPT
            ) ? (
              <li className="nav-item">
                <NavLink
                  end
                  to={TRANSCRIPT}
                  className={(navData) =>
                    navData.isActive ? "active" : "nav-links"
                  }
                >
                  My Assessment History
                </NavLink>
              </li>
            ) : null}

            {userInfo?.permissions?.find((perm) => perm === VIEW_RESOURCES) ? (
              <li className="nav-item">
                <NavLink
                  end
                  to={RESOURCES}
                  className={(navData) =>
                    navData.isActive ? "active" : "nav-links"
                  }
                >
                  Resources
                </NavLink>
              </li>
            ) : null}

            {userInfo?.permissions?.find((perm) => perm === ADD_USERS) ? (
              <li className="nav-item">
                <NavLink
                  end
                  to={USER_ENTRY}
                  className={(navData) =>
                    navData.isActive ? "active" : "nav-links"
                  }
                >
                  Add Users
                </NavLink>
              </li>
            ) : null}

            {userInfo?.permissions?.find((perm) => perm === ADD_CONTESTS) ? (
              <li className="nav-item">
                <NavLink
                  end
                  to={CONTEST}
                  className={(navData) =>
                    navData.isActive ? "active" : "nav-links"
                  }
                >
                  Add Contest
                </NavLink>
              </li>
            ) : null}

            {userInfo?.permissions?.find(
              (perm) =>
                perm === VIEW_ADMINS ||
                perm === VIEW_MENTORS ||
                perm === VIEW_TRAINEES
            ) ? (
              <li className="nav-item">
                <NavLink
                  end
                  to={USERS}
                  className={(navData) =>
                    navData.isActive ? "active" : "nav-links"
                  }
                >
                  {userInfo?.permissions?.find(
                    (perm) => perm === VIEW_ADMINS
                  ) ? (
                    <span>Users</span>
                  ) : (
                    <span>Mentees</span>
                  )}
                </NavLink>
              </li>
            ) : null}

            <li className="flex items-center ml-2">
              <NavLink
                to="/"
                className={
                  "bg-violet-800 text-white rounded px-3 py-1 hover:bg-violet-600"
                }
                onClick={signoutHandler}
              >
                Sign out
              </NavLink>
            </li>
          </ul>
        </div>
      ) : null}
    </nav>
  );
}

export default NavBar;
