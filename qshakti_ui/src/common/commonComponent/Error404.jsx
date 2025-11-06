import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <Fragment>
      <div className="page-content">
        <div className="container text-center text-dark">
          <div className="display-1  text-dark mb-2">404</div>
          <p className="h5 fw-normal mb-6 leading-normal">
            Oops! looks like you got lost...
          </p>
          <Link className="btn btn-primary" to={`main`}>
            Back To Home
          </Link>
        </div>
      </div>
    </Fragment>
  );
}
