import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useContext, useEffect, useState } from "react";
import { MdMessage } from "react-icons/md";
import { TbMessageDown } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import uesrImageDefault from "../../Assets/profilePic.png";
import Logo from "../../Assets/skilltera_logo1.png";
import { userContext } from "../../Context/userContextState";
import { selectHomeItemSelection } from "../../Redux/Reducer/homeItemSelectionSlice";
import { selectSidebarMenuSelection } from "../../Redux/Reducer/sidebarMenuSelectionSlice";
import "./navBarNew.css";

export default function NavBarNew() {
  const ItemSelection = useSelector((state) => {
    return state.homeItemSelection;
  });
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (newValue === 0) {
      dispatch(selectHomeItemSelection("candidate"));

      document.documentElement.style.setProperty(
        "--list-item-color",
        "#FF8C04"
      );
      document.documentElement.style.setProperty(
        "--list-box-shadow",
        "rgba(255, 110, 4, 0.18)"
      );
    }
    if (newValue === 1) {
      dispatch(selectHomeItemSelection("refer"));

      document.documentElement.style.setProperty(
        "--list-item-color",
        "#750887"
      );
      document.documentElement.style.setProperty(
        "--list-box-shadow",
        "rgba(36, 109, 162, 0.2)"
      );
    }
    if (newValue === 2) {
      dispatch(selectHomeItemSelection("client"));

      document.documentElement.style.setProperty(
        "--list-item-color",
        "#246DA2"
      );
      document.documentElement.style.setProperty(
        "--list-box-shadow",
        "rgba(36, 109, 162, 0.2)"
      );
    }
    if (newValue === 3) {
      dispatch(selectHomeItemSelection("blog"));
      document.documentElement.style.setProperty(
        "--list-item-color",
        "#750887"
      );
      document.documentElement.style.setProperty(
        "--list-box-shadow",
        "rgba(36, 109, 162, 0.2)"
      );
    }

    if (newValue === 4) {
      dispatch(selectHomeItemSelection("all_Job"));
      document.documentElement.style.setProperty(
        "--list-item-color",
        "#FF8C04"
      );
      document.documentElement.style.setProperty(
        "--list-box-shadow",
        "rgba(255, 110, 4, 0.18)"
      );
    }

    if (newValue === 5) {
      dispatch(selectHomeItemSelection("our-services"));
      document.documentElement.style.setProperty(
        "--list-item-color",
        "#FF8C04"
      );
      document.documentElement.style.setProperty(
        "--list-box-shadow",
        "rgba(255, 110, 4, 0.18)"
      );
    }
  };

  const { notificationStatus } = useContext(userContext);

  const [candidateData, setCandidateData] = useState(false);
  const [adminData, setAdminData] = useState(false);
  const [companyData, setCompanyData] = useState(false);
  const [candidateDataRef, setCandidateDataRef] = useState(false);
  const [candidateAndReferal, setCandidateAndReferal] = useState(false);

  const logout = () => {
    window.location.pathname = "/";
    sessionStorage.clear();
  };
  const menuSelectionRedux = useSelector(
    (state) => state.sidebarMenuSelectionReducer
  );

  const activeClassName = (data) => {
    dispatch(selectSidebarMenuSelection(data));
  };

  useEffect(() => {
    if (sessionStorage.getItem("candidate_data") != null) {
      setCandidateData(true);
    }
    if (sessionStorage.getItem("ADMIN") != null) {
      setAdminData(true);
    }
    if (sessionStorage.getItem("company_loggedin_user_data") != null) {
      setCompanyData(true);
    }
    if (sessionStorage.getItem("candidate_data_ref") != null) {
      setCandidateDataRef(true);

      const candidateRefData = JSON.parse(
        sessionStorage.getItem("candidate_data_ref")
      );
      const candidatue = candidateRefData.candidate.candidature;
      setCandidateAndReferal(candidatue);
    }
  }, []);

  return (
    <>
      {sessionStorage.getItem("login") ? (
        <>
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <span className="navbar-brand">
                <img src={Logo} alt="logo" className="img-fluid" />
              </span>
              <div className="toggle-bar-new">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                >
                  <i className="fa fa-bars" aria-hidden="true"></i>
                </button>
              </div>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                {candidateData && (
                  <ul className="navbar-nav">
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "profile"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      <NavLink exact to="/userProfile">
                        <button
                          className="nav-link"
                          onClick={() => activeClassName("profile")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("profile")}
                          role="button"
                          tabIndex="0"
                        >
                          Profile 
                        </button>
                      </NavLink>
                    </li>
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "referral"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      <NavLink exact to="/userReferal">
                      <button
                          className="nav-link"
                          onClick={() => activeClassName("referral")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("referral")}
                          role="button"
                          tabIndex="0"
                        >
                          Referral
                        </button>
                      </NavLink>
                    </li>
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "all_jobs"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      <NavLink exact to="/jobs">
                      <button
                          className="nav-link"
                          onClick={() => activeClassName("all_jobs")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("all_jobs")}
                          role="button"
                          tabIndex="0"
                        >
                          All Jobs
                        </button>
                      </NavLink>
                    </li>
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "jobStatus"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      <NavLink exact to="/status">
                      <button
                          className="nav-link"
                          onClick={() => activeClassName("jobStatus")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("jobStatus")}
                          role="button"
                          tabIndex="0"
                        >
                          Status
                        </button>
                      </NavLink>
                    </li>
                  </ul>
                )}

                {candidateDataRef && (
                  <ul className="navbar-nav">
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "referral"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      <NavLink exact to="/refered">
                      <button
                          className="nav-link"
                          onClick={() => activeClassName("referral")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("referral")}
                          role="button"
                          tabIndex="0"
                        >
                          Referral
                        </button>
                      </NavLink>
                    </li>
                    {candidateAndReferal && (
                      <li
                        className={
                          menuSelectionRedux.menuSelection == "profile"
                            ? "nav-item class_li itemActive"
                            : "nav-item class_li"
                        }
                      >
                        <NavLink exact to="/userProfile">
                        <button
                            className="nav-link"
                            onClick={() => activeClassName("profile")}
                            onKeyDown={(e) => e.key === 'Enter' && activeClassName("profile")}
                            role="button"
                            tabIndex="0"
                          >
                            Profile
                          </button>
                        </NavLink>
                      </li>
                    )}

                    {candidateAndReferal && (
                      <li
                        className={
                          menuSelectionRedux.menuSelection == "all_jobs"
                            ? "nav-item class_li itemActive"
                            : "nav-item class_li"
                        }
                      >
                         <button
                          className="nav-link"
                          onClick={() => activeClassName("all_jobs")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("all_jobs")}
                          role="button"
                          tabIndex="0"
                        >
                          All Jobs
                        </button>
                      </li>
                    )}
                    {candidateAndReferal && (
                      <li
                        className={
                          menuSelectionRedux.menuSelection == "recommended_jobs"
                            ? "nav-item class_li itemActive"
                            : "nav-item class_li"
                        }
                      >
                        <button
                          className="nav-link"
                          onClick={() => activeClassName("recommended_jobs")}
                          onKeyDown={(e) => e.key === 'Enter' && activeClassName("recommended_jobs")}
                          role="button"
                          tabIndex="0"
                        >
                          Recommended Jobs
                        </button>
                      </li>
                    )}
                    {!candidateAndReferal && (
                      <li
                        className={
                          menuSelectionRedux.menuSelection == "about"
                            ? "nav-item class_li itemActive"
                            : "nav-item class_li"
                        }
                      >
                        <Link exact to="/about">
                        <button
                            className="nav-link"
                            onClick={() => activeClassName("about")}
                            onKeyDown={(e) => e.key === 'Enter' && activeClassName("about")}
                            role="button"
                            tabIndex="0"
                          >
                            About Us
                          </button>
                        </Link>
                      </li>
                    )}
                    {!candidateAndReferal && (
                      <li
                        className={
                          menuSelectionRedux.menuSelection == "contact"
                            ? "nav-item class_li itemActive"
                            : "nav-item class_li"
                        }
                      >
                        <Link exact to="/contact">
                          <span
                            className="nav-link"
                            onClick={() => activeClassName("contact")}
                          >
                            Contact Us
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                )}

                <ul className="navbar-nav ms-auto">
                  {(candidateData || companyData || candidateAndReferal) && (
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "messages"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      {/* <span className="nav-link">Messages</span> */}
                      <NavLink exact to="/chat">
                        <span
                          className="nav-link font-styling"
                          onClick={() => activeClassName("messages")}
                        >
                          {notificationStatus === true ? (
                            <TbMessageDown size={20} />
                          ) : (
                            <MdMessage size={20} />
                          )}
                        </span>
                      </NavLink>
                    </li>
                  )}
                  {(candidateData || companyData || candidateAndReferal) && (
                    <li
                      className={
                        menuSelectionRedux.menuSelection == "notification"
                          ? "nav-item class_li itemActive"
                          : "nav-item class_li"
                      }
                    >
                      <span
                        className="nav-link font-styling"
                        onClick={() => activeClassName("notification")}
                      >
                        <i className="fa fa-bell" aria-hidden="true"></i>
                      </span>
                    </li>
                  )}
                  <li className="nav-item class_li">
                    <span
                      className="nav-link dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <img
                        src={uesrImageDefault}
                        className="img-fluid rounded-circle"
                        alt="uesrImageDefault"
                        style={{ width: "32px", height: "32px" }}
                      />
                    </span>
                    <div className="dropdown-menu">
                      <span
                        className="dropdown-item"
                        onClick={logout}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className="fa fa-sign-out me-2"
                          aria-hidden="true"
                        ></i>
                        <span>Logout</span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="right-side-items"></div>
            </div>
          </nav>
        </>
      ) : (
        <div className="navBar-new-bg-color">
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <span className="navbar-brand">
                <img src={Logo} alt="logo" className="img-fluid" />
              </span>
              <div
                className="navbar-collapse justify-content-end"
                id="navbarSupportedContent"
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons={false}
                  aria-label="scrollable prevent tabs example"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor:
                        value === 0
                          ? "orange"
                          : value === 1
                          ? "purple"
                          : value === 2
                          ? "#246DA2"
                          : value === 3
                          ? "orange"
                          : "#6610f2",
                    },
                  }}
                >
                  <Tab
                    label="Rise and Shine"
                    sx={{
                      "&.Mui-selected": {
                        color:
                          value === 0
                            ? "orange"
                            : value === 1
                            ? "purple"
                            : value === 2
                            ? "#246DA2"
                            : value === 3
                            ? "orange"
                            : "#6610f2",
                      },
                    }}
                  />
                  <Tab
                    label="Refer and Earn"
                    sx={{
                      "&.Mui-selected": {
                        color:
                          value === 0
                            ? "orange"
                            : value === 1
                            ? "purple"
                            : value === 2
                            ? "#246DA2"
                            : value === 3
                            ? "orange"
                            : "#6610f2",
                      },
                    }}
                  />
                  <Tab
                    label="Client"
                    sx={{
                      "&.Mui-selected": {
                        color:
                          value === 0
                            ? "orange"
                            : value === 1
                            ? "purple"
                            : value === 2
                            ? "#246DA2"
                            : value === 3
                            ? "orange"
                            : "#6610f2",
                      },
                    }}
                  />
                  <Tab
                    label="Blog"
                    sx={{
                      "&.Mui-selected": {
                        color:
                          value === 0
                            ? "orange"
                            : value === 1
                            ? "purple"
                            : value === 2
                            ? "#246DA2"
                            : value === 3
                            ? "orange"
                            : "#6610f2",
                      },
                    }}
                  />
                  <Tab
                    label="All Jobs"
                    sx={{
                      "&.Mui-selected": {
                        color:
                          value === 0
                            ? "orange"
                            : value === 1
                            ? "purple"
                            : value === 2
                            ? "#246DA2"
                            : value === 3
                            ? "orange"
                            : "#6610f2",
                      },
                    }}
                  />
                  <Tab
                    label="Our Services"
                    sx={{
                      "&.Mui-selected": {
                        color:
                          value === 0
                            ? "orange"
                            : value === 1
                            ? "purple"
                            : value === 2
                            ? "#246DA2"
                            : value === 3
                            ? "orange"
                            : "#6610f2",
                      },
                    }}
                  />
                </Tabs>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
