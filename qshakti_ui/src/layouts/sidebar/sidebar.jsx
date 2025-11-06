import React, { Fragment, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/brand/finalLogo.png";
import registerLogo from "../../assets/images/brand/C4i4-Logo - Register.png"; // Replace with actual path to "C4i4-Logo - Register.png"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { filterMenuByPermissions } from "../../utils/filterMenuPermission";
import MenuItems from "./sidebardata";
import icon from "../../assets/images/brand/shortlogoSidebar.png";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedModule } from "../../store/slices/moduleSlice";

const Onhover = () => {
  document.querySelector(".app").classList.contains("sidenav-toggled");
  document.querySelector(".app").classList.add("sidenav-toggled-open");
};
const Outhover = () => {
  document.querySelector(".app").classList.remove("sidenav-toggled-open");
};
let history = [];

export default function Sidebar() {
  let location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedTitle, setExpandedTitle] = useState(null);
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  const permissions = sessionStorage.getItem("permissions");
  const selectedModule = useSelector(selectSelectedModule);

  const [permissionFilteredMenus, setPermissionFilteredMenus] = useState([]);

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    const role = storedRole ? storedRole.toLowerCase() : null;

    if (!role) return;
    const roleFilteredMenus = MenuItems.map((group) => ({
      ...group,
      Items: group.Items.filter((item) => {
        if (item.showOnlyForAdmin) {
          return role === "admin";
        }
        return true;
      }),
    })).filter((group) => group.Items.length > 0);

    const filteredMenus = filterMenuByPermissions(roleFilteredMenus);

    setPermissionFilteredMenus(filteredMenus);
  }, []);

  // Apply module filtering when selectedModule changes
  useEffect(() => {
    if (!permissionFilteredMenus || permissionFilteredMenus.length === 0)
      return;

    if (!selectedModule) {
      // setMenuItems(permissionFilteredMenus);
      setMenuItems([]);
      return;
    }

    // Filter menu items based on selected module
    const filteredMenus = permissionFilteredMenus
      .map((group) => ({
        ...group,
        Items: group.Items.filter(
          (item) => item.module === selectedModule || item.key === "activity"
        ),
        // || item.key === "activity"
      }))
      .filter((group) => group.Items.length > 0);

    setMenuItems(filteredMenus);
  }, [permissionFilteredMenus, selectedModule]);

  useEffect(() => {
    history.push(location.pathname);
    if (history.length > 2) {
      history.shift();
    }
    if (history[0] !== history[1]) {
    }
    let mainContent = document.querySelector(".main-content");
    mainContent.addEventListener("click", mainContentClickFn);
    return () => {
      mainContent.removeEventListener("click", mainContentClickFn);
    };
  }, [location, mainContentClickFn]);

  useEffect(() => {
    const checkSidebarToggle = () => {
      const appElement = document.querySelector(".app");
      if (appElement) {
        setIsSidebarToggled(appElement.classList.contains("sidenav-toggled"));
      }
    };
    // Initial check
    checkSidebarToggle();
    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkSidebarToggle();
        }
      });
    });
    const appElement = document.querySelector(".app");
    if (appElement) {
      observer.observe(appElement, { attributes: true });
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  function mainContentClickFn() {
    if (
      document.body.classList.contains("horizontal") &&
      window.innerWidth >= 992
    ) {
      clearMenuActive();
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function setSidemenu(pathname) {
    if (menuItems) {
      menuItems.filter((mainlevel) => {
        if (mainlevel.Items) {
          mainlevel.Items.filter((items) => {
            items.active = false;
            items.selected = false;
            // if (pathname === "/") {
            //   pathname = "/dashboard/sales";
            // }

            if (
              location.pathname === "/sparic/preview/" ||
              location.pathname === "/sparic/preview"
            ) {
              pathname = "/sparic/preview/dashboard/";
            }
            if (pathname === items.path) {
              items.active = true;
              items.selected = true;
            } else if (items.children) {
              items.children.filter((submenu) => {
                submenu.active = false;
                submenu.selected = false;
                if (pathname == submenu.path) {
                  items.active = true;
                  items.selected = true;
                  submenu.active = true;
                  submenu.selected = true;
                } else if (submenu.children) {
                  submenu.children.filter((submenu1) => {
                    submenu1.active = false;
                    submenu1.selected = false;
                    if (pathname === submenu1.path) {
                      items.active = true;
                      items.selected = true;
                      submenu.active = true;
                      submenu.selected = true;
                      submenu1.active = true;
                      submenu1.selected = true;
                    }
                    return submenu1;
                  });
                }
                return submenu;
              });
            }
            return items;
          });
        }
        setMenuItems((arr) => [...arr]);
        if (document.body.classList.contains("horizontal-hover")) {
          clearMenuActive();
        }
        return mainlevel;
      });
    }
  }

  function clearMenuActive() {
    menuItems.filter((mainlevel) => {
      if (mainlevel.Items) {
        mainlevel.Items.filter((sublevel) => {
          sublevel.active = false;
          if (sublevel.children) {
            sublevel.children.filter((sublevel1) => {
              sublevel1.active = false;
              if (sublevel1.children) {
                sublevel1.children.filter((sublevel2) => {
                  sublevel2.active = false;
                  return sublevel2;
                });
              }
              return sublevel1;
            });
          }
          return sublevel;
        });
      }
      return mainlevel;
    });
    setMenuItems((arr) => [...arr]);
  }

  useEffect(() => {
    const newExpanded = {};

    menuItems.forEach((group) => {
      group.Items.forEach((item) => {
        const hasActiveChild = item.children?.some(
          (child) => child.path === location.pathname
        );

        if (hasActiveChild || item.path === location.pathname) {
          newExpanded[item.title] = true;
        }
      });
    });

    setExpandedItems((prev) => ({ ...prev, ...newExpanded }));
  }, [location.pathname, menuItems]);

  useEffect(() => {
    for (let group of menuItems) {
      for (let item of group.Items) {
        if (item.children?.some((child) => child.path === location.pathname)) {
          setExpandedTitle(item.title);
          return;
        }
      }
    }

    // If no child matched, collapse all
    setExpandedTitle(null);
  }, [location.pathname, menuItems]);

  const handleToggle = (item) => {
    // If already expanded, collapse it
    setExpandedTitle((prev) => (prev === item.title ? null : item.title));
  };

  return (
    <Fragment>
      <div className="sticky">
        <div
          className="app-sidebar"
          onMouseOver={() => Onhover()}
          onMouseOut={() => Outhover()}
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <div
            className="side-header"
            style={{
              paddingBottom: "40px",
              flexShrink: 0,
              marginBottom: "10px",
            }}
          >
            <div className="header-brand1">
              <Link to="main">
                <img
                  src={logo}
                  className="header-brand-img main-logo"
                  alt="QMS logo"
                  style={{ cursor: "pointer" }}
                />
                <img
                  style={{ height: "80px" }}
                  src={icon}
                  className="header-brand-img icon-logo"
                  alt="Sparic logo"
                />
              </Link>
            </div>
          </div>

          {/* Scrollable Menu Area */}
          <div
            className="main-sidemenu"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100vh", // Full height of viewport or container
              overflowY: "auto", // Native vertical scroll
            }}
          >
            <ul className="side-menu">
              {menuItems.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {group.menutitle && (
                    <li className="sub-category">
                      <h3>{group.menutitle}</h3>
                    </li>
                  )}
                  {group.Items.map((item, itemIndex) => {
                    const isExpanded = expandedTitle === item.title;

                    return (
                      <li
                        className={`slide ${isExpanded ? "is-expanded" : ""}`}
                        key={itemIndex}
                      >
                        {item.type === "link" ? (
                          <div className="side-menu__wrapper">
                            <NavLink
                              to={item.path}
                              className={({ isActive }) =>
                                `side-menu__item ${isActive ? "active" : ""}`
                              }
                              
                            >
                              {item.icon}
                              <span className="side-menu__label" style={{marginLeft: "5px"}}>
                                {item.title}
                              </span>
                            </NavLink>
                          </div>
                        ) : (
                          <>
                            <div
                              className={`side-menu__item ${
                                isExpanded ? "active" : ""
                              }`}
                              onClick={() => {
                                handleToggle(item);
                                sessionStorage.removeItem("selectedModule");
                              }}
                            >
                              {item.icon}
                              <span className="side-menu__label">
                                {item.title}
                              </span>
                              <i className="angle fe fe-chevron-right"></i>
                            </div>
                            <ul
                              className="slide-menu"
                              style={{
                                display: isExpanded ? "block" : "none",
                              }}
                            >
                              {item.children.map((child, childIndex) => (
                                <li key={childIndex}>
                                  <NavLink
                                    to={child.path}
                                    className={({ isActive }) =>
                                      `slide-item ${isActive ? "active" : ""}`
                                    }
                                  >
                                    {child.title}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </li>
                    );
                  })}
                </React.Fragment>
              ))}
            </ul>
          </div>

          {/* Fixed Footer with Register Logo and Copyright */}
          {!isSidebarToggled && (
            <div
              className="sidebar-footer"
              style={{
                flexShrink: 0,
                // padding: "108px 0px",
                textAlign: "center",
                marginBottom: "80px",
                fontSize: "10px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {/* Register Logo */}
              <Link to="https://c4i4.org/">
                <div style={{ marginBottom: "15px" }}>
                  <img
                    src={registerLogo}
                    alt="C4i4 Register Logo"
                    style={{
                      maxWidth: "70%",
                      height: "auto",
                      maxHeight: "50px",
                      marginBottom: "0px",
                    }}
                  />
                </div>
              </Link>

              {/* Copyright Text */}
              <div>
                <div style={{ color: "#28304e" }}> Copyright©2025 </div>
                <b>
                  <Link to="dashboard" style={{ color: "#1e77b3" }}>
                    Q-SHAKTI (Quality Management System).
                  </Link>
                </b>
                <br />
                <div to="" style={{ color: "#28304e" }}>
                  Designed by{" "}
                  <b>
                    <a
                      className="footerlogo"
                      href="https://c4i4.org/"
                      style={{ color: "#1e77b3" }}
                    >
                      {" "}
                      C4i4.
                    </a>
                  </b>
                  All rights reserved.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
