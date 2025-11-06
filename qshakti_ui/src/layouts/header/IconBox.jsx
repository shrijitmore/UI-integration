// IconBox.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const IconBox = ({
  withBox = false,
  icon: Icon,
  label,
  gradient,
  iconColor = "#fff",
}) => {
  const boxStyle = withBox
    ? {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 1,
        borderRadius: "8px",
        flexDirection: "column",
        background:
          gradient ||
          "linear-gradient(180deg, #C7A1FF 0%, #8466FF 40%, #2B0A3D 100%)",
      }
    : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      };
  return (
    <Box sx={boxStyle}>
      <Icon sx={{ fontSize: 30, color: iconColor }} />
      <Typography
        variant="caption"
        sx={{ fontSize: 12, mt: 0.5 }}
        className="d-none d-sm-inline"
      >
        {label}
      </Typography>
    </Box>
  );
};

export default IconBox;
