import React, { useRef, useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Box, IconButton, Link } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const navItems = [
  { label: "UPLOAD FILE", to: "/uploadcomponent" },
  { label: "ROLE MANAGEMENT", to: "/roleManagement" },
  { label: "USER MANAGEMENT", to: "/userManagement" },
  { label: "OPEN ORDERS", to: "/openorders" },
  { label: "PRODUCTION ORDERS", to: "/productionorders" },
  { label: "IN PROCESS INSPECTION", to: "/inprocessinspection" },
  { label: "RM INSPECTION", to: "/rminspection" },
];

const NavbarLinks = () => {
  const location = useLocation();
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth);
    };

    const el = scrollRef.current;
    if (el) {
      handleScroll(); // Initial check
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollByAmount = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      {showLeft && (
        <IconButton
          onClick={() => scrollByAmount(-150)}
          sx={{ position: "absolute", left: 0, zIndex: 2 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          gap: 2,
          px: 4,
          py: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.to}
              underline="none"
              sx={{
                color: isActive ? "primary.main" : "#000",
                fontWeight: 600,
                fontSize: "0.95rem",
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                flexShrink: 0,
                transition: "background 0.3s",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Box>

      {showRight && (
        <IconButton
          onClick={() => scrollByAmount(150)}
          sx={{ position: "absolute", right: 0, zIndex: 2 }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default NavbarLinks;
