// src/components/loader/SectionLoader.jsx
import React from "react";
import { CircularProgress, Box } from "@mui/material";

export default function SectionLoader() {
  return (
    <Box
      sx={{
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <CircularProgress color="primary" size={40} />
    </Box>
  );
}
