import React, { useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { Drawer } from "@mui/material";
import { Store } from "../context/store";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import {
  ADD_CONTESTS,
  ADD_USERS,
  VIEW_RESOURCES,
  VIEW_TRAINEES,
  VIEW_MY_TRANSCRIPT,
  VIEW_ADMINS,
  VIEW_MENTORS,
  UPDATE_CONTESTS,
  DELETE_CONTESTS,
  VIEW_MENTEES,
} from "../permissions/permissions";
import {
  USERS,
  CONTEST,
  RESOURCES,
  TRANSCRIPT,
  USER_ENTRY,
  HOMEPAGE,
  PROFILE,
  LOGIN,
  SIGNUP,
} from "../urls/frontend_urls";

function NavBar() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, seasonID } = state;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const changeSeasonHandler = (newSeason) => {
    ctxDispatch({ type: "SET_SEASON_ID", payload: parseInt(newSeason) });
    sessionStorage.setItem("seasonID", newSeason);
  };

  const list = () => (
    <ul className="text-black flex flex-col p-6 space-y-6 text-xl font-medium w-[80vw] bg-[f7f7f7]">
      {userInfo && userInfo.enrolledSeasons.length ? (
        <select
          value={seasonID}
          onChange={(e) => changeSeasonHandler(e.target.value)}
          type="string"
          placeholder="Level"
          className="input"
        >
          {userInfo?.enrolledSeasons.map(({ season_id, name }) => (
            <option key={season_id} value={season_id}>
              {name}
            </option>
          ))}
        </select>
      ) : null}
      <ul className="flex felx-row justify-between">
        {userInfo ? (
          <li className="nav-item">
            <NavLink
              onClick={toggleDrawer(false)}
              to={HOMEPAGE}
              className={(navData) => (navData.isActive ? "active" : null)}
            >
              Home
            </NavLink>
          </li>
        ) : null}
        <li>
          <CloseIcon onClick={toggleDrawer(false)} sx={{ fontSize: 30 }} />
        </li>
      </ul>
      {userInfo ? (
        <li className="nav-item">
          <NavLink
            to={PROFILE}
            onClick={toggleDrawer(false)}
            className={(navData) => (navData.isActive ? "active" : null)}
          >
            Profile
          </NavLink>
        </li>
      ) : null}

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

      {userInfo?.permissions?.find(
        (perm) =>
          perm === ADD_CONTESTS ||
          perm === UPDATE_CONTESTS ||
          perm === DELETE_CONTESTS
      ) ? (
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
            <span>Users</span>
          </NavLink>
        </li>
      ) : null}
      {userInfo?.permissions?.find((perm) => perm === VIEW_MENTEES) ? (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={USERS}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            <span>Mentees</span>
          </NavLink>
        </li>
      ) : null}
      {userInfo ? (
        <li className="nav-item">
          <NavLink
            to={HOMEPAGE}
            onClick={() => {
              signoutHandler();
              toggleDrawer(false);
            }}
          >
            Sign out
          </NavLink>
        </li>
      ) : null}
      {userInfo ? null : (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={LOGIN}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            Login
          </NavLink>
        </li>
      )}
      {userInfo ? null : (
        <li className="nav-item">
          <NavLink
            onClick={toggleDrawer(false)}
            to={SIGNUP}
            className={(navData) => (navData.isActive ? "active" : "nav-links")}
          >
            Sign Up
          </NavLink>
        </li>
      )}
    </ul>
  );

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    sessionStorage.removeItem("userInfo");
  };

  return (
    <nav className="sticky top-0 z-50">
      {console.log(userInfo)}
      <div className="flex flex-row py-2 justify-between px-4 lg:justify-center items-center bg-white text-black drop-shadow whitespace-nowrap">
        <span className="flex lg:hidden mr-4">
          <img
            src="https://img.icons8.com/ios-filled/50/menu--v6.png"
            onClick={toggleDrawer(true)}
          />
          <Drawer open={open} anchor="left" onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </span>

        <NavLink className="flex flex-row items-center text-3xl" to={HOMEPAGE}>
          <img className="w-10" src="/CPC_logo.png" />
          ASUFE CPC
        </NavLink>
        <ul className="hidden lg:flex flex-row space-x-8 mx-32">
          {userInfo ? (
            <li className="nav-item">
              <NavLink
                to={HOMEPAGE}
                className={(navData) => (navData.isActive ? "active" : null)}
              >
                Home
              </NavLink>
            </li>
          ) : null}
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

          {userInfo?.permissions?.find(
            (perm) =>
              perm === ADD_CONTESTS ||
              perm === UPDATE_CONTESTS ||
              perm === DELETE_CONTESTS
          ) ? (
            <li className="nav-item">
              <NavLink
                end
                to={CONTEST}
                className={(navData) =>
                  navData.isActive ? "active" : "nav-links"
                }
              >
                Contests
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
                <span>Users</span>
              </NavLink>
            </li>
          ) : null}
          {userInfo?.permissions?.find((perm) => perm === VIEW_MENTEES) ? (
            <li className="nav-item">
              <NavLink
                end
                to={USERS}
                className={(navData) =>
                  navData.isActive ? "active" : "nav-links"
                }
              >
                <span>Mentees</span>
              </NavLink>
            </li>
          ) : null}
        </ul>
        {userInfo ? (
          <div className="hidden lg:flex flex-row items-center">
            {userInfo.enrolledSeasons.length ? (
              <select
                value={seasonID}
                onChange={(e) => changeSeasonHandler(e.target.value)}
                type="string"
                placeholder="Season"
                className="inputNavbar mr-4"
              >
                {userInfo?.enrolledSeasons.map(({ season_id, name }) => (
                  <option key={season_id} value={season_id}>
                    {name}
                  </option>
                ))}
              </select>
            ) : null}
            <AccountCircleIcon
              className="cursor-pointer text-violet-800"
              sx={{ fontSize: 30 }}
              onClick={handleClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={openDrop}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  width: 180,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.2,
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 10,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
            >
              <Link to="/profile">
                <MenuItem sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              </Link>

              <Divider />
              <Link to={HOMEPAGE} onClick={signoutHandler}>
                <MenuItem>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Link>
            </Menu>
          </div>
        ) : null}
        {userInfo ? null : (
          <ul className="hidden lg:flex flex-row space-x-8 mx-32">
            <li className="nav-item">
              <NavLink
                end
                to={LOGIN}
                className={(navData) =>
                  navData.isActive ? "active" : "nav-links"
                }
              >
                Log In
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                end
                to={SIGNUP}
                className={(navData) =>
                  navData.isActive ? "active" : "nav-links"
                }
              >
                Sign Up
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
