import React, { Fragment, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
// const ScrollToTop = lazy(() => import("./layouts/scrollTop/scrollTop"));
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import store from "./store/store";
import Routers from "./routers/Routers";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AmmoLoader from "./layouts/loader/customeLoder";
import AmmoTargetLoader from "./layouts/loader/customeLoder";

const Loaderimage = lazy(() => import("./layouts/loader/loader"));
ReactDOM.createRoot(document.getElementById("root")).render(
  <Fragment>
    {/* <Suspense fallback={<Loaderimage />}> */}
    <Suspense fallback={<AmmoTargetLoader />}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          {/* <ScrollToTop /> */}
          <Routers />
        </BrowserRouter>
      </Provider>
    </Suspense>
  </Fragment>
);
