import React, { Fragment, useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Dropdown, Form, InputGroup, Navbar } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import MenuItems from "../sidebar/sidebardata";
import AccountModelDialog from "../../modules/auth/myAccount";
import { useDispatch, useSelector } from "react-redux";
import {
  logOut,
  myProfileAcc,
  setAuthToken,
} from "../../store/slices/auth/authSlice";
import { showToast } from "../../common/ShowToast";
import { Badge } from "react-bootstrap";

import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer } from "react-toastify";
import NavbarLinks from "./NavbarLinks";
import logo from "../../assets/images/brand/whiteLogo (1).png";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Tooltip } from "@mui/material";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import { Box } from "@mui/system";
import IconBox from "./IconBox";
import { clearSession } from "../../utils/sessionHandler";
import HomeIcon from "@mui/icons-material/Home";
import config from "../../config";
import profileimg from "../../assets/images/bg/profile.jpg";
const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const BASE_URL = config.apiUrl;
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrentTime = (date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatCurrentDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // e.g., "11 Aug 2025"
  };

  useEffect(() => {
    let res = dispatch(myProfileAcc()).unwrap();
  }, [dispatch]);

  document.addEventListener("click", function () {
    document.querySelector(".search-result")?.classList.add("d-none");
  });

  const { profileData, success, error, loading } = useSelector(
    (state) => state.auth
  );
  // FuScreen-start
  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  const [showHeaderImage, setShowHeaderImage] = useState(false);

  useEffect(() => {
    if (showHeaderImage) {
      const timer = setTimeout(() => {
        setShowHeaderImage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showHeaderImage]);

  const SideMenuIcon = () => {
    setShowHeaderImage(true);
    document.querySelector(".app").classList.toggle("sidenav-toggled");
  };

  const handleAccount = () => {
    setIsAccountOpen(true);
  };

  const handleClose = () => {
    setIsAccountOpen(false);
  };

  const handleLogOut = async () => {
    try {
      const result = await dispatch(logOut())?.unwrap();
      if (result) {
        navigate(`/`);
        showToast(result?.detail || result?.message, "success");
        clearSession();
      }
    } catch (err) {
      showToast(err, "error");
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      <div
        className="app-header header sticky"
        style={{ marginBottom: "-70.7812px" }}
      >
        <Container fluid className=" main-container">
          <div className="d-flex">
            <Link
              aria-label="Hide Sidebar"
              className="app-sidebar__toggle"
              data-bs-toggle="sidebar"
              onClick={() => {
                SideMenuIcon(); // keep your existing logic
              }}
              to="#"
            />

            {/* {showHeaderImage && (
              <img
                src={logo}
                style={{ width: "10%", marginLeft: "auto" }}
                alt="Sidebar Toggled"
              />
            )} */}

            <Navbar
              className="d-flex order-lg-2 ms-auto header-right-icons px-0"
              expand="lg"
              gap="10px"
            >
              <div className="d-flex align-items-center ms-auto px-0">
                <div className="d-flex align-items-center ">
                  <Link
                    to="/main"
                    className="menu-item nav-link d-flex flex-column align-items-center "
                    style={{
                      textDecoration: "none",
                      color: "white",
                      borderRadius: "15px",
                    }}
                  >
                    <HomeIcon style={{ fontSize: 25 }} />
                    <span
                      className="d-none d-sm-inline"
                      style={{ fontSize: 12 }}
                    >
                      Home
                    </span>
                  </Link>
                  <Link
                    className="menu-item nav-link d-flex flex-column align-items-center "
                    onClick={Fullscreen}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <FullscreenExitOutlinedIcon style={{ fontSize: 25 }} />
                    <span
                      className="d-none d-sm-inline"
                      style={{ fontSize: 12 }}
                    >
                      Full Screen
                    </span>
                    {/* <IconBox
                      icon={FullscreenExitOutlinedIcon}
                      label={"Full Screen"}
                    /> */}
                  </Link>
                  <Link
                    to="/activitylog"
                    className="menu-item nav-link d-flex flex-column align-items-center"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {/* test */}
                    <DescriptionOutlinedIcon style={{ fontSize: 25 }} />
                    <span
                      className="d-none d-sm-inline"
                      style={{ fontSize: 12 }}
                    >
                      Activity
                    </span>
                    {/* <IconBox
                      icon={DescriptionOutlinedIcon}
                      label={"Activity"}
                    /> */}
                  </Link>
                  <Link
                    className="menu-item nav-link d-flex flex-column align-items-center "
                    // onClick={Fullscreen}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {/* <IconBox
                      icon={CalendarTodayIcon}
                      label={formatCurrentDate(currentTime)}
                    /> */}

                    <CalendarTodayIcon style={{ fontSize: 25 }} />

                    <span
                      className="d-none d-sm-inline"
                      style={{ fontSize: 12 }}
                    >
                      {" "}
                      {formatCurrentDate(currentTime)}
                    </span>
                  </Link>
                  <Link
                    className="menu-item nav-link d-flex flex-column align-items-center "
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <AccessTimeIcon style={{ fontSize: 25 }} />

                    <span
                      className="d-none d-sm-inline"
                      style={{ fontSize: 12 }}
                    >
                      {formatCurrentTime(currentTime)}
                    </span>
                    {/* <IconBox
                      icon={AccessTimeIcon}
                      label={formatCurrentTime(currentTime)}
                    /> */}
                  </Link>

                  {/* Full Screen */}
                  <Link
                    className="menu-item nav-link d-flex flex-column align-items-center "
                    // onClick={Fullscreen}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <PermIdentityOutlinedIcon style={{ fontSize: "30px" }} />
                    <span className="text-light fs-12">
                      {profileData?.role
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>

                    {/* <IconBox
                      icon={PermIdentityOutlinedIcon}
                      label={profileData?.role
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    /> */}
                  </Link>
                </div>

                <Dropdown className="dropdown d-flex profile-1 mt-2">
                  <Dropdown.Toggle
                    as="div"
                    variant=""
                    className="d-flex align-items-center cursor-pointer"
                    style={{ cursor: "pointer", gap: "30px" }}
                  >
                    <div
                      className="d-flex align-items-center gap-2"
                      style={{ marginBottom: "10px" }}
                    >
                      <div className="d-flex flex-column align-items-center">
                        <Box
                          sx={{
                            width: 30,
                            height: 100,
                            borderRadius: "50%",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            border: "2px solid #ccc",
                          }}
                        >
                          <img
                            src={
                              profileData?.user_image !== null &&
                              profileData?.user_image !== undefined &&
                              profileData?.user_image !== ""
                                ? `${BASE_URL}${profileData.user_image}`
                                : profileimg
                            }
                            loading="lazy"
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <span className="text-light fs-12">
                          {profileData?.first_name
                            ?.split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </span>
                      </div>

                      {/* ▼ Arrow styled with border-top and color */}
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "5px solid transparent",
                          borderRight: "5px solid transparent",
                          borderTop: "6px solid #828994", // Your color here
                        }}
                      />
                    </div>
                  </Dropdown.Toggle>

                  {/* Dropdown Menu */}
                  <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <Dropdown.Item
                      className="text-dark fw-semibold"
                      onClick={handleAccount}
                    >
                      <i className="dropdown-icon fe fe-user"></i> My Profile
                    </Dropdown.Item>
                    {isAccountOpen && (
                      <AccountModelDialog
                        open={isAccountOpen}
                        onClose={handleClose}
                        data={profileData}
                      />
                    )}

                    <Dropdown.Item
                      className="text-dark fw-semibold"
                      onClick={handleLogOut}
                      disabled={loading}
                    >
                      <i className="dropdown-icon fe fe-log-out"></i> Sign out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Navbar>
          </div>
        </Container>
      </div>
      <div className="jumps-prevent" style={{ paddingTop: "37.7812px" }}></div>
    </Fragment>
  );
};
export default Header;
