/** @jsxImportSource @emotion/react */
import React from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import NoDataImage from "../assets/bidsSvg/Nodata.svg";

// Define marquee animation
const marquee = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const NoDataFound = ({
  message = "No Data Found",
  height = "60vh",
  messagePosition = "center", // 'top' | 'center' | 'bottom'
}) => {
  const alignMap = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end",
  };

  return (
    <Box
      sx={{
        height,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: alignMap[messagePosition] || "center",
        padding: 2,
        textAlign: "center",
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={NoDataImage}
        alt="No Data"
        sx={{
          maxWidth: "60%",
          maxHeight: "60%",
          objectFit: "contain",
          mb: 2,
        }}
      />

      {/* Animated Message */}
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            whiteSpace: "nowrap",
            // animation: `${marquee} 0s linear infinite`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#5C2D91",
              px: 2,
              py: 1,
              fontSize: "1.1rem",
              display: "inline-block",
            }}
          >
            {message}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NoDataFound;
