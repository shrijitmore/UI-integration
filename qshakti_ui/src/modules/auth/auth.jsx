import React from "react";
import { Outlet } from "react-router-dom";
import "../../layouts/styles/bulletQualityAuth.css";

function Auth() {
  document.body.classList.add("bg-account");
  return (
    <>
      <div className="page h-100">
        <Outlet />
      </div>
    </>
  );
}

export default Auth;
