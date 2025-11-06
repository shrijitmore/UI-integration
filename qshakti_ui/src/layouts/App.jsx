import React, { Fragment, lazy, Suspense } from "react";

import { Outlet } from "react-router-dom";

import Footer from "./footer/footer";
import Header from "./header/header";
import Rightsidebar from "./rightsidebar/rightsidebar";
import Switcher from "./switcher/switcher";
import Sidebar from "./sidebar/sidebar";
import { Provider } from "react-redux";
import store from "../store/store";
// import Newsticker from "./ticker/newsticker";
import BacktoTop from "./backtotop/backtotop";
import SectionLoader from "../common/SectionLoader";
import AmmoTargetLoader from "./loader/customeLoder";
const Togglefuction = () => {
  document.querySelector(".app")?.classList.remove("sidenav-toggled");
  //rightsidebar
  document.querySelector(".sidebar-right").classList.remove("sidebar-open");
  document.querySelector(".demo_changer").classList.remove("active");
  document.querySelector(".demo_changer").style.right = "-275px";
};

function App() {
  document.body.classList.remove("bg-account");
  return (
    <Fragment>
      <Provider store={store}>
        <div className="horizontalMenucontainer">
          <Switcher />
          <div className="page">
            <div className="page-main">
              <Header />
              {/* <Newsticker /> */}
              <Sidebar />
              <div
                className="main-content app-content"
                onClick={() => Togglefuction()}
                style={{ marginTop: "30px" }}
              >
                {/* <div className="side-app">
                  <div className="main-container container-fluid">
                    {/* <Suspense fallback={<SectionLoader />}> */}
                {/* <Suspense fallback={<AmmoTargetLoader />}> */}
                {/* <Outlet />
                    </Suspense>
                  </div>
                </div> */}{" "}
                <div className="side-app">
                  <div
                    className="main-container container-fluid"
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "calc(100vh - 30px)", // optional if header present
                    }}
                  >
                    <Suspense
                      fallback={
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ transform: "translateY(-80px)" }}>
                            <AmmoTargetLoader />
                          </div>
                        </div>
                      }
                    >
                      <Outlet />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
            <Rightsidebar />
            {/* <Footer /> */}
          </div>
        </div>

        <BacktoTop />
      </Provider>
    </Fragment>
  );
}

export default React.memo(App);
