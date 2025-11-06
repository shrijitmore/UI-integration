import React, { useRef, useEffect, useState } from "react";
import { TextField, Tooltip, Box } from "@mui/material";

export const AutoWidthTextField = ({ value }) => {
  const spanRef = useRef(null);
  const [width, setWidth] = useState(30); // Minimum width

  useEffect(() => {
    if (spanRef.current) {
      const measuredWidth = spanRef.current.offsetWidth + 20; // Add buffer
      setWidth(measuredWidth < 30 ? 30 : measuredWidth);
    }
  }, [value]);

  return (
    <>
      {/* Hidden span for measuring content width */}
      {/* <span
        ref={spanRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          fontSize: "14px",
          fontFamily: "Roboto",
          padding: "6px 10px", // match TextField padding
          border: "1px solid transparent",
        }}
      >
        {value}
      </span> */}

      {/* TextField with dynamic width and full text shown */}
      <Tooltip title={value || ""}>
        <TextField
          value={value}
          size="small"
          disabled
          sx={{ width: `${width}px` }}
          inputProps={{
            style: {
              whiteSpace: "pre", // ensures no word wrap or scroll
              overflow: "visible",
            //   padding: "6px 14px",
              cursor: "default",
            },
          }}
        />
      </Tooltip>
    </>
  );
};
