import React, { useEffect, useRef, useState } from "react";
import { CircularProgress, Box } from "@mui/material";

const ButtonLoaderWrapper = ({ loading, button }) => {
  // const [loading1, setLoading1] = useState(loading);
  // const timeoutRef = useRef(null);
  // useEffect(() => {
  //   if (loading === true) {
  //     setLoading1(true);
  //     clearTimeout(timeoutRef.current);
  //     timeoutRef.current = setTimeout(() => {
  //       setLoading1(false);
  //     }, 5000);
  //   }

  //   if (loading === false) {
  //     clearTimeout(timeoutRef.current);
  //     setLoading1(false);
  //   }

  //   return () => clearTimeout(timeoutRef.current);
  // }, [loading]);

  return loading ? (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <Box sx={{ visibility: "hidden" }}>{button}</Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          zIndex: 10,
        }}
      >
        <CircularProgress size={30} thickness={5} color="primary" />
      </Box>
    </Box>
  ) : (
    button
  );
};

export default ButtonLoaderWrapper;
