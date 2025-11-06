import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer/footer";
import Rightsidebar from "./rightsidebar/rightsidebar";
import Sidebar from "./sidebar/sidebar";
// import Newsticker from './ticker/newsticker'
import Header2 from "./header/header2";

function Switcherpage() {
  return (
    <Fragment>
      <div className="horizontalMenucontainer">
        <div className="page header-2">
          <div className="page-main">
            <Header2 />
            {/* <Newsticker/> */}
            <Sidebar />
            <div
              className="main-content app-content"
              style={{ marginTop: "30px" }}
            >
              <div className="side-app">
                <div className="main-container container-fluid">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
          <Rightsidebar />
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}

export default Switcherpage;
