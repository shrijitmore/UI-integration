import React, { lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Routingdata } from "../common/routingdata";
const App = lazy(() => import("../layouts/App"));
const Auth = lazy(() => import("../modules/auth/auth"));
const Authlogin = lazy(() => import("../modules/auth/authloginNew"));

const Signup = lazy(() => import("../modules/auth/signup"));
const ForgotPassword = lazy(() => import("../modules/auth/forgotpassword"));
const ResetPassword = lazy(() => import("../modules/auth/resetPassword"));
import PrivateRoute from "../common/privateRoute";
import PublicRoute from "../common/publicRoute";
import ProtectedRouteWrapper from "../utils/ProtectedRouteWrapper";
import ModulePage from "../modules/modules/modulesPage";

const Routers = () => {
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const roleId = sessionStorage.getItem("role");
    const filteredRoutesData = Routingdata.filter(
      (route) => !route.allowedRoles || route.allowedRoles.includes(roleId)
    );
    setFilteredRoutes(filteredRoutesData);
  }, [location?.pathname]);

  return (
    <Routes>
      <Route path={`/`} element={<Auth />}>
        <Route index element={<Authlogin />} />

        <Route path={`signup`} element={<Signup />} />
      </Route>

      <Route
        path="/main"
        element={
          <PrivateRoute>
            <Auth />
          </PrivateRoute>
        }
      >
        <Route index element={<ModulePage />} />
      </Route>


      <Route path={`forgotpassword`} element={<ForgotPassword />} />

      <Route
        path={`auth/reset-password/:id/:token/`}
        element={<ResetPassword />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      >
        {filteredRoutes.map(({ path, element, permission }, index) => (
          <Route
            key={index}
            path={path}
            element={
              permission ? (
                <ProtectedRouteWrapper
                  screen={permission.screens ?? permission.screen}
                  action={permission.action}
                >
                  {element}
                </ProtectedRouteWrapper>
              ) : (
                element
              )
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Routers;
