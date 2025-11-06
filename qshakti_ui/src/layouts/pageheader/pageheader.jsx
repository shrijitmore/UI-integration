/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

function Pageheader(props) {
  const { items } = props;

  return (
    <Fragment>
      <div className="page-header d-sm-flex d-block">
        <Breadcrumb className="breadcrumb mb-sm-0 mb-3">
          {items.map((item, index) => (
            <Breadcrumb.Item
              className="breadcrumb-item1"
              key={index}
              active={index === items.length - 1}
              style={{ fontSize: "17px",color: "#1a237e", fontWeight: "bold" }}
            >
              {item}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div className=" ms-auto mt-2 mt-sm-0">
          {/* <Link to="#" className="btn bg-secondary-transparent text-secondary btn-sm"> <OverlayTrigger placement="bottom" overlay={<Tooltip>Rating</Tooltip>}><i className="fa fa-star"></i></OverlayTrigger></Link>
    <Link to={`${import.meta.env.BASE_URL}authentication/lockscreen`} className="btn bg-primary-transparent text-primary mx-2 btn-sm"> <OverlayTrigger placement="bottom" overlay={<Tooltip>lock</Tooltip>}><i className="fa fa-lock"></i></OverlayTrigger></Link>
    <Link to="#" className="btn bg-warning-transparent text-warning btn-sm"> <OverlayTrigger placement="bottom" overlay={<Tooltip>Add New</Tooltip>}><i className="fa fa-plus"></i></OverlayTrigger></Link> */}
        </div>
      </div>
    </Fragment>
  );
}

export default Pageheader;
