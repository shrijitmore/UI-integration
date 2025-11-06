import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Fragment>
      <footer className="footer">
        <div className="container">
          <Row className="row align-items-center flex-row-reverse">
            <Col lg={12} sm={12} className="text-center">
              Copyright © 2025{" "}
              <Link to="#">Q-SHAKTI(Quality Management System)</Link>. Designed
              by <Link to="https://c4i4.org/">C4i4</Link> All rights reserved.
            </Col>
          </Row>
        </div>
      </footer>
    </Fragment>
  );
}
