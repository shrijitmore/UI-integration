import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/brand/logo.png";
import logolight from "../../assets/images/brand/logo-light.png";
import {
  Button,
  Container,
  Dropdown,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Nav,
  Navbar,
} from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { imagesData } from "../../common/commomimages/imagedata";
import MenuItems from "../sidebar/sidebardata";

function Header() {
  //Search functionality
  const [show1, setShow1] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState(false);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  let myfunction = (inputvalue) => {
    let i = [];
    let allElement2 = [];

    MenuItems.map((mainlevel) => {
      if (mainlevel.Items) {
        setShow1(true);
        mainlevel.Items.map((sublevel) => {
          if (sublevel.children) {
            sublevel.children.map((sublevel1) => {
              i.push(sublevel1);
              if (sublevel1.children) {
                sublevel1.children.map((sublevel2) => {
                  i.push(sublevel2);
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
    for (let allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (
          allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
        ) {
          setShow2(true);
          allElement2.push(allElement);
        }
      }
    }
    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);
  };

  const Darkmode = () => {
    if (document.querySelector(".app").classList.contains("dark-mode")) {
      document.querySelector(".app").classList.remove("dark-mode");
      let DarkMenu1 = document.querySelector("#myonoffswitch1");
      DarkMenu1.checked = true;
    } else {
      document.querySelector(".app").classList.add("dark-mode");
      let DarkMenu1 = document.querySelector("#myonoffswitch2");
      DarkMenu1.checked = true;
    }
  };

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
  // FullScreen-end

  // rightsiderbar
  const OPenfunction = () => {
    document.querySelector(".sidebar-right").classList.toggle("sidebar-open");
  };
  //

  const SideMenuIcon = () => {
    //leftsidemenu
    document.querySelector(".app").classList.toggle("sidenav-toggled");
  };

  return (
    <Fragment>
      <div
        className="app-header header sticky  "
        style={{ marginBottom: "-70.7812px" }}
      >
        <Container fluid className=" main-container">
          <div className="d-flex">
            <Link
              aria-label="Hide Sidebar"
              className="app-sidebar__toggle"
              data-bs-toggle="sidebar"
              onClick={() => SideMenuIcon()}
              to="#"
            ></Link>

            <Link
              className="logo-horizontal"
              to={`${import.meta.env.BASE_URL}vendorRegistration`}
            >
              <img
                src={logo}
                className="header-brand-img main-logo"
                alt="Sparic logo"
              />
              <img
                src={logolight}
                className="header-brand-img darklogo"
                alt="Sparic logo"
              />
            </Link>

            <div className="main-header-center ms-3 d-none d-lg-block">
              <Form.Control
                type="text"
                defaultValue={InputValue}
                id="typehead"
                placeholder="Search for results..."
                autoComplete="off"
                onChange={(ele) => {
                  myfunction(ele.target.value);
                  setInputValue(ele.target.value);
                }}
              />
              <Button variant="" className="btn px-2 ">
                <i className="fe fe-search" aria-hidden="true"></i>
              </Button>
              {show1 ? (
                <div className="card search-result position-absolute z-index-9 search-fix  border mt-1">
                  <div className="card-header">
                    <h4 className="card-title me-2 text-break">
                      Search result of {InputValue}
                    </h4>
                  </div>
                  <ListGroup className="mt-2">
                    {show2 ? (
                      NavData.map((e) => (
                        <ListGroup.Item key={Math.random()} className="">
                          <Link
                            to={`${e.path}/`}
                            className="search-result-item"
                            onClick={() => {
                              setShow1(false), setInputValue("");
                            }}
                          >
                            {e.title}
                          </Link>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <b className={`${searchcolor} `}>{searchval}</b>
                    )}
                  </ListGroup>
                </div>
              ) : (
                ""
              )}
            </div>
            <Navbar
              className="d-flex order-lg-2 ms-auto header-right-icons px-0"
              expand="lg"
            >
              <Dropdown className="d-none">
                <Dropdown.Toggle
                  as="a"
                  href="#"
                  variant="light"
                  className="no-caret nav-link icon "
                >
                  <i className="fe fe-search"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className=" header-search dropdown-menu-start">
                  <InputGroup className=" w-100 p-2">
                    <Form.Control type="text" placeholder="Search...." />
                    <InputGroup.Text
                      variant="primary"
                      className=" btn btn-primary me-2"
                    >
                      <i className="fe fe-search" aria-hidden="true"></i>
                    </InputGroup.Text>
                  </InputGroup>
                </Dropdown.Menu>
              </Dropdown>

              <Navbar.Toggle
                className="navbar-toggler navresponsive-toggler d-lg-none ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent-4"
                aria-controls="navbarSupportedContent-4"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon fe fe-more-vertical"></span>
              </Navbar.Toggle>
              <div className="navbar responsive-navbar p-0">
                <Navbar.Collapse className="" id="navbarSupportedContent-4">
                  <div className="d-flex order-lg-2">
                    <Dropdown className=" d-lg-none d-flex">
                      <Dropdown.Toggle
                        as="a"
                        to="#"
                        className=" no-caret nav-link icon"
                        data-bs-toggle="dropdown"
                      >
                        <i className="fe fe-search"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className=" header-search dropdown-menu-start">
                        <InputGroup className="w-100 p-2">
                          <Form.Control type="text" placeholder="Search...." />
                          <InputGroup.Text className="input-group-text btn btn-primary">
                            <i className="fa fa-search" aria-hidden="true"></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="dropdown d-flex country">
                      <Dropdown.Toggle
                        as="a"
                        variant=""
                        className="no-caret nav-link icon text-center"
                      >
                        <i className="ri-global-line"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading border-bottom">
                          <h6 className="mt-1 mb-0 fs-14 fw-semibold text-dark">
                            {" "}
                            Choose Language
                          </h6>
                        </div>
                        <Dropdown.Item
                          className="d-flex align-items-center"
                          to="#"
                        >
                          <img
                            src={imagesData("flagimage3")}
                            alt="img"
                            className="me-2 country language-img"
                          />{" "}
                          <span className="fs-13 text-wrap text-dark fw-semibold">
                            {" "}
                            Germany
                          </span>{" "}
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="d-flex align-items-center"
                          to="#"
                        >
                          <img
                            src={imagesData("flagimage5")}
                            alt="img"
                            className="me-2 country language-img"
                          />{" "}
                          <span className="fs-13 text-wrap text-dark fw-semibold">
                            {" "}
                            Russia
                          </span>{" "}
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="d-flex align-items-center"
                          to="#"
                        >
                          <img
                            src={imagesData("flagimage6")}
                            alt="img"
                            className="me-2 country language-img"
                          />{" "}
                          <span className="fs-13 text-wrap text-dark fw-semibold">
                            {" "}
                            United Kingdom
                          </span>{" "}
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="d-flex align-items-center"
                          to="#"
                        >
                          <img
                            src={imagesData("flagimage2")}
                            alt="img"
                            className=" me-2 country language-img"
                          />{" "}
                          <span className="fs-13 text-wrap text-dark fw-semibold">
                            {" "}
                            Canada
                          </span>{" "}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <div className="d-flex country" onClick={() => Darkmode()}>
                      <Link
                        to="#"
                        className="nav-link icon theme-layout nav-link-bg layout-setting"
                      >
                        <span className="dark-layout mt-1">
                          <i className="ri-moon-clear-line"></i>
                        </span>
                        <span className="light-layout mt-1">
                          <i className="ri-sun-line"></i>
                        </span>
                      </Link>
                    </div>

                    <Dropdown className=" d-flex shopping-cart">
                      <Dropdown.Toggle
                        as="a"
                        className="no-caret nav-link icon text-center"
                      >
                        <i className="ri-shopping-bag-line"></i>
                        <span className="badge bg-secondary header-badge">
                          4
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading border-bottom">
                          <h6 className="mt-1 mb-0 fs-14 fw-semibold text-dark">
                            {" "}
                            My Shopping Cart
                          </h6>
                        </div>
                        <div className="header-dropdown-list message-menu">
                          <PerfectScrollbar>
                            <Dropdown.Item
                              className="d-flex "
                              href={`${
                                import.meta.env.BASE_URL
                              }ecommerce/shoppingcart`}
                            >
                              <img
                                className="avatar avatar-lg br-7 me-3 align-self-center cover-image"
                                alt="product-image"
                                src={imagesData("product7")}
                              />

                              <div className="wd-50p d-flex flex-column">
                                <span className="p-0 h6 text-dark fw-semibold mb-0">
                                  Flower pot home decores
                                </span>
                                <span>Qty: 1</span>
                                <span>
                                  Status:{" "}
                                  <span className="text-success">In Stock</span>
                                </span>
                              </div>
                              <div className="my-auto ms-auto text-end">
                                <p className="fs-16 fw-semibold text-dark d-none d-sm-block px-3 mb-0">
                                  $438
                                </p>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }ecommerce/shoppingcart`}
                            >
                              <img
                                className="avatar avatar-lg br-7 me-3 align-self-center cover-image"
                                alt="product-image"
                                src={imagesData("product4")}
                              />

                              <div className="wd-50p d-flex flex-column">
                                <span className="p-0 h6 text-dark fw-semibold mb-0">
                                  Smart watch
                                </span>
                                <span>Qty: 3</span>
                                <span>
                                  Status:{" "}
                                  <span className="text-danger">Out Stock</span>
                                </span>
                              </div>
                              <div className="my-auto ms-auto text-end">
                                <p className="fs-16 fw-semibold text-dark d-none d-sm-block px-3 mb-0">
                                  $323
                                </p>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }ecommerce/shoppingcart`}
                            >
                              <img
                                className="avatar avatar-lg br-7 me-3 align-self-center cover-image"
                                alt="product-image"
                                src={imagesData("product5")}
                              />

                              <div className="wd-50p d-flex flex-column">
                                <span className="p-0 h6 text-dark fw-semibold mb-0">
                                  Headphones
                                </span>
                                <span>Qty: 2</span>
                                <span>
                                  Status:{" "}
                                  <span className="text-success">In Stock</span>
                                </span>
                              </div>
                              <div className="my-auto ms-auto text-end">
                                <p className="fs-16 fw-semibold text-dark d-none d-sm-block px-3 mb-0">
                                  $867
                                </p>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }ecommerce/shoppingcart`}
                            >
                              <img
                                className="avatar avatar-lg br-7 me-3 align-self-center cover-image"
                                alt="product-image"
                                src={imagesData("product30")}
                              />

                              <div className="wd-50p d-flex flex-column">
                                <span className="p-0 h6 text-dark fw-semibold mb-0">
                                  Furniture (chair)
                                </span>
                                <span>Qty: 1</span>
                                <span>
                                  Status:{" "}
                                  <span className="text-success">In Stock</span>
                                </span>
                              </div>
                              <div className="my-auto ms-auto text-end">
                                <p className="fs-16 fw-semibold text-dark d-none d-sm-block px-3 mb-0">
                                  $456
                                </p>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex border-bottom-0"
                              href={`${
                                import.meta.env.BASE_URL
                              }ecommerce/shoppingcart`}
                            >
                              <img
                                className="avatar avatar-lg br-7 me-3 align-self-center cover-image"
                                alt="product-image"
                                src={imagesData("product8")}
                              />

                              <div className="wd-50p d-flex flex-column">
                                <span className="p-0 h6 text-dark fw-semibold mb-0">
                                  Running Shoes
                                </span>
                                <span>Qty: 4</span>
                                <span>
                                  Status:{" "}
                                  <span className="text-danger">In Stock</span>
                                </span>
                              </div>
                              <div className="my-auto ms-auto text-end">
                                <p className="fs-16 fw-semibold text-dark d-none d-sm-block px-3 mb-0">
                                  $438
                                </p>
                              </div>
                            </Dropdown.Item>
                          </PerfectScrollbar>
                        </div>
                        <div className="dropdown-divider m-0"></div>
                        <div className="dropdown-footer d-felx justify-content-between align-items-center">
                          <Link
                            className="btn btn-primary btn-pill btn-sm"
                            to={`${import.meta.env.BASE_URL}ecommerce/checkout`}
                          >
                            <i className="fe fe-check-circle me-1"></i>
                            CHECKOUT
                          </Link>
                          <span className="float-end fs-17 fw-semibold text-dark">
                            <span className="text-muted-dark">Total:</span>{" "}
                            $4206
                          </span>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>

                    <div className="dropdown d-flex">
                      <Link
                        className="nav-link icon full-screen-link"
                        id="fullscreen-button"
                        onClick={Fullscreen}
                      >
                        <i className="ri-fullscreen-exit-line fullscreen-button"></i>
                      </Link>
                    </div>

                    <Dropdown className="dropdown d-flex notifications">
                      <Dropdown.Toggle
                        as="a"
                        variant=""
                        className="no-caret nav-link icon text-center"
                      >
                        <i className="ri-notification-line"></i>
                        <span className=" pulse"></span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-arrow ">
                        <div className="drop-heading border-bottom">
                          <h6 className="mt-1 mb-0 fs-14 text-dark fw-semibold">
                            Notifications
                          </h6>
                        </div>
                        <div className="notifications-menu header-dropdown-scroll">
                          <PerfectScrollbar>
                            <Dropdown.Item
                              className="border-bottom d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }pages/notificationslist`}
                            >
                              <div>
                                <span className="avatar avatar-md fs-20 brround fw-semibold text-center bg-primary-transparent">
                                  <i className="fe fe-message-square text-primary"></i>
                                </span>
                              </div>
                              <div className="wd-80p ms-3 my-auto">
                                <h5 className="text-dark mb-0 fw-semibold">
                                  Gladys Dare{" "}
                                  <span className="text-muted">
                                    commented on
                                  </span>
                                  Ecosystems
                                </h5>
                                <span className="notification-subtext">
                                  2m ago
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }pages/notificationslist`}
                            >
                              <div>
                                <span className="avatar avatar-md fs-20 brround fw-semibold text-danger bg-danger-transparent">
                                  <i className="fe fe-user"></i>
                                </span>
                              </div>
                              <div className="wd-80p ms-3 my-auto">
                                <h5 className="text-dark mb-0 fw-semibold">
                                  Jackson Wisky
                                  <span className="text-muted">
                                    {" "}
                                    followed you
                                  </span>
                                </h5>
                                <span className="notification-subtext">
                                  15 min ago
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }pages/notificationslist`}
                            >
                              <span className="avatar avatar-md fs-20 brround fw-semibold text-center bg-success-transparent">
                                <i className="fe fe-check text-success"></i>
                              </span>
                              <div className="wd-80p ms-3 my-auto">
                                <h5 className="text-muted fw-semibold mb-0">
                                  You swapped exactly
                                  <span className="text-dark fw-bold">
                                    2.054 BTC
                                  </span>{" "}
                                  for
                                  <span className="text-dark fw-bold">
                                    14,124.00
                                  </span>
                                </h5>
                                <span className="notification-subtext">
                                  1 day ago
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }pages/notificationslist`}
                            >
                              <div>
                                <span className="avatar avatar-md fs-20 brround fw-semibold text-center bg-warning-transparent">
                                  <i className="fe fe-dollar-sign text-warning"></i>
                                </span>
                              </div>
                              <div className="wd-80p ms-3 my-auto">
                                <h5 className="text-dark mb-0 fw-semibold">
                                  Laurel{" "}
                                  <span className="text-muted">donated</span>{" "}
                                  <span className="text-success fw-semibold">
                                    $100
                                  </span>{" "}
                                  <span className="text-muted">for</span> carbon
                                  removal
                                </h5>
                                <span className="notification-subtext">
                                  15 min ago
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex"
                              href={`${
                                import.meta.env.BASE_URL
                              }pages/notificationslist`}
                            >
                              <div>
                                <span className="avatar avatar-md fs-20 brround fw-semibold text-center bg-info-transparent">
                                  <i className="fe fe-thumbs-up text-info"></i>
                                </span>
                              </div>
                              <div className="wd-80p ms-3 my-auto">
                                <h5 className="text-dark mb-0 fw-semibold">
                                  Sunny Grahm{" "}
                                  <span className="text-muted">voted for</span>{" "}
                                  carbon capture
                                </h5>
                                <span className="notification-subtext">
                                  2 hors ago
                                </span>
                              </div>
                            </Dropdown.Item>
                          </PerfectScrollbar>
                        </div>
                        <div className="text-center dropdown-footer">
                          <Link
                            className="btn btn-primary btn-sm btn-block text-center"
                            to={`${
                              import.meta.env.BASE_URL
                            }pages/notificationslist`}
                          >
                            VIEW ALL NOTIFICATIONS
                          </Link>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="dropdown d-flex message">
                      <Dropdown.Toggle
                        as="a"
                        variant=""
                        className="no-caret nav-link icon text-center"
                      >
                        <i className="ri-chat-1-line"></i>
                        <span className="pulse-danger"></span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <div className="drop-heading border-bottom">
                          <h6 className="mt-1 mb-0 fs-14 fw-semibold text-dark">
                            You have 5 Messages
                          </h6>
                        </div>
                        <div className="message-menu message-menu-scroll">
                          <PerfectScrollbar>
                            <Dropdown.Item
                              className="border-bottom d-flex align-items-center"
                              href={`${import.meta.env.BASE_URL}apps/chat`}
                            >
                              <img
                                className="avatar avatar-md brround cover-image"
                                src={imagesData("male28")}
                                alt="person-image"
                              />
                              <div className="wd-90p ms-2">
                                <div className="d-flex">
                                  <h5 className="mb-0 text-dark fw-semibold ">
                                    Madeleine
                                  </h5>
                                  <small className="text-muted ms-auto">
                                    2 min ago
                                  </small>
                                </div>
                                <span className="fw-semibold mb-0">
                                  Just completed{" "}
                                  <span className="text-info">Project</span>
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom d-flex align-items-center"
                              href={`${import.meta.env.BASE_URL}apps/chat`}
                            >
                              <img
                                className="avatar avatar-md brround me-3 align-self-center cover-image"
                                src={imagesData("male32")}
                                alt="person-image"
                              />
                              <div className="wd-90p">
                                <div className="d-flex">
                                  <h5 className="mb-0 text-dark fw-semibold ">
                                    Anthony
                                  </h5>
                                  <small className="text-muted ms-auto text-end">
                                    1 hour ago
                                  </small>
                                </div>
                                <span className="fw-semibold">
                                  Updates the new{" "}
                                  <span className="text-info">Task Names</span>
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom d-flex align-items-center"
                              href={`${import.meta.env.BASE_URL}apps/chat`}
                            >
                              <img
                                className="avatar avatar-md brround me-3 cover-image"
                                src={imagesData("female21")}
                                alt="person-image"
                              />
                              <div className="wd-90p">
                                <div className="d-flex">
                                  <h5 className="mb-0 text-dark fw-semibold ">
                                    Olivia
                                  </h5>
                                  <small className="text-muted ms-auto text-end">
                                    1 hour ago
                                  </small>
                                </div>
                                <span className="fw-semibold">
                                  Added a file into{" "}
                                  <span className="text-info">
                                    Project Name
                                  </span>
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="d-flex align-items-center"
                              href={`${import.meta.env.BASE_URL}apps/chat`}
                            >
                              <img
                                className="avatar avatar-md brround me-3 cover-image"
                                src={imagesData("male33")}
                                alt="person-image"
                              />
                              <div className="wd-90p">
                                <div className="d-flex">
                                  <h5 className="mb-0 text-dark fw-semibold ">
                                    Sanderson
                                  </h5>
                                  <small className="text-muted ms-auto text-end">
                                    1 days ago
                                  </small>
                                </div>
                                <span className="fw-semibold">
                                  Assigned 9 Upcoming{" "}
                                  <span className="text-info">Projects</span>
                                </span>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom d-flex align-items-center border-bottom-0"
                              href={`${import.meta.env.BASE_URL}apps/chat`}
                            >
                              <img
                                className="avatar avatar-md brround cover-image"
                                src={imagesData("male8")}
                                alt="person-image"
                              />
                              <div className="wd-90p ms-2">
                                <div className="d-flex">
                                  <h5 className="mb-0 text-dark fw-semibold ">
                                    Madeleine
                                  </h5>
                                  <small className="text-muted ms-auto">
                                    2 min ago
                                  </small>
                                </div>
                                <span className="fw-semibold mb-0">
                                  Just completed{" "}
                                  <span className="text-info">Project</span>
                                </span>
                              </div>
                            </Dropdown.Item>
                          </PerfectScrollbar>
                        </div>
                        <div className="dropdown-divider m-0"></div>
                        <div className="text-center dropdown-footer">
                          <Link
                            className="btn btn-primary btn-sm btn-block text-center"
                            to={`${import.meta.env.BASE_URL}apps/chat`}
                          >
                            MARK ALL AS READ
                          </Link>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>

                    <div
                      className="dropdown d-flex header-settings"
                      onClick={() => OPenfunction()}
                    >
                      <Link className=" nav-link icon siderbar-link">
                        <i className="ri-menu-fold-fill"></i>
                      </Link>
                    </div>

                    <Dropdown className="dropdown d-flex profile-1">
                      <Dropdown.Toggle
                        as="a"
                        variant=""
                        className="no-caret nav-link leading-none d-flex"
                      >
                        <img
                          src={imagesData("male15")}
                          alt="profile-user"
                          className="avatar  profile-user brround cover-image"
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end dropdown-menu-arrow"
                        data-bs-popper="none"
                      >
                        <div className="drop-heading">
                          <div className="text-center">
                            <h5 className="text-dark mb-0 fw-semibold">
                              Alison
                            </h5>
                            <span className="text-muted fs-12">
                              Administrator
                            </span>
                          </div>
                        </div>
                        <Dropdown.Item
                          className="text-dark fw-semibold border-top"
                          href={`${import.meta.env.BASE_URL}pages/profile`}
                        >
                          <i className="dropdown-icon fe fe-user"></i> Profile
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-dark fw-semibold"
                          href={`${import.meta.env.BASE_URL}pages/mailinbox`}
                        >
                          <i className="dropdown-icon fe fe-mail"></i> Inbox
                          <span className="badge bg-success float-end">3</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-dark fw-semibold"
                          href={`${
                            import.meta.env.BASE_URL
                          }pages/extension/settings`}
                        >
                          <i className="dropdown-icon fe fe-settings"></i>{" "}
                          Settings
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-dark fw-semibold"
                          href={`${
                            import.meta.env.BASE_URL
                          }pages/extension/faqs`}
                        >
                          <i className="dropdown-icon fe fe-alert-triangle"></i>
                          Support ?
                        </Dropdown.Item>
                        <Dropdown.Item
                          className="text-dark fw-semibold"
                          href={`${import.meta.env.BASE_URL}authlogin`}
                        >
                          <i className="dropdown-icon fe fe-log-out"></i> Sign
                          out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Navbar.Collapse>
              </div>
            </Navbar>
          </div>
        </Container>
      </div>
      <div className="jumps-prevent" style={{ paddingTop: "70.7812px" }}></div>
    </Fragment>
  );
}
export default Header;
