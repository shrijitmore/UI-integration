import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Pageheader from "../pageheader/pageheader";
import { formatDateLabel, formatTime, getRandomColor } from "./config";
import { Button, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  return (
    <Fragment>
      <Pageheader items={["Notifications"]} />

      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
            marginRight: "200px",
          }}
        >
          <Button
            className="cancelButton"
            variant="outlined"
            color="error"
            onClick={() => handleClear()}
          >
            Clear All
          </Button>
        </div>

        <div
          className="notification-scroll-container"
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            marginBottom: "1rem",
            paddingRight: "10px",
          }}
        >
          <ul className="notification">
            {notifications.map((item) => (
              <li key={item.id} style={{ position: "relative" }}>
                <div className="notification-time">
                  <span className="date">
                    {formatDateLabel(item.created_at)}
                  </span>
                  <span className="time">{formatTime(item.created_at)}</span>
                </div>

                <div className="notification-icon">
                  <Link
                    to="#;"
                    style={{
                      borderColor: getRandomColor(),
                    }}
                  />
                </div>

                <div className="notification-time-date mb-2 d-block d-md-none d-inline-flex">
                  <span className="date">
                    {formatDateLabel(item.created_at)}
                  </span>
                  <span className="time ms-2">
                    {formatTime(item.created_at)}
                  </span>
                </div>

                <div className="notification-body">
                  <div className="media mt-0">
                    <div className="media-body d-flex justify-content-between w-100">
                      <div>
                        <p className="mb-0 fs-13 text-dark">
                          {item.notification}
                        </p>
                      </div>
                      <div className="notify-time text-end">
                        <p className="mb-0 text-muted fs-11">
                          {formatTime(item.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <IconButton
                  onClick={() => handleClear(item.id)}
                  sx={{
                    color: "#bb0f0f",
                    position: "absolute",
                    top: 2,
                    right: 190,
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>

        {hasMore && (
          <div className="text-center mb-4">
            <button
              className="btn ripple btn-primary w-md"
              onClick={() => loadMoreNotifications(page)}
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
