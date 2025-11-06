import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Box, List } from "@mui/material";
import BackgroundImg from "../../assets/images/bg/hdhandbg.png";

export const DashboardContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  backgroundImage:
    "linear-gradient(312deg, rgba(92, 45, 145, 1) 1%, rgba(0, 172, 205, 1) 95%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  padding: "40px",
  position: "relative",
  overflowY: "auto",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "20px",
    height: "auto",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "75%",
    height: "100%",
    backgroundImage: `url(${BackgroundImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "right center",
    zIndex: 0,
    opacity: 0.8,
    pointerEvents: "none",

    [theme.breakpoints.down("md")]: {
      position: "relative",
      width: "100%",
      height: "auto",
      minHeight: "300px",
      backgroundPosition: "center",
      marginTop: "20px",
      order: 2,
    },
  },
}));

export const StyledList = styled(List)(({ theme }) => ({
  width: "100%",
  maxWidth: 450,
  borderRadius: theme.shape.borderRadius * 3,
  backdropFilter: "blur(14px)",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    marginTop: "20px",
    order: 1,
  },
}));

export const LogoutWrapper = styled("div")({
  position: "absolute",
  top: 12,
  right: 24,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "rgba(255,255,255,0.1)",
  padding: "2px 5px",
  borderRadius: "5px",
  backdropFilter: "blur(8px)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.3s ease",

  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    boxShadow: "0 12px 40px rgba(92, 45, 145, 0.5)",
    transform: "translateX(12px) scale(1.03)",
    color: "#5C2D91",
  },
});

export const CardBox = styled(motion.div)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(3),
  padding: "7px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "white",
  position: "relative",
  overflow: "visible",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    boxShadow: "0 12px 40px rgba(92, 45, 145, 0.5)",
    transform: "translateX(12px) scale(1.03)",
    color: "#5C2D91",
  },
  "&:hover .arrow-icon": {
    opacity: 1,
    transform: "translateX(0)",
  },
}));

export const IconWrapper = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: "12px",
  background:
    "linear-gradient(312deg, rgba(92, 78, 165, 1) 1%, rgba(0, 172, 205, 1) 95%)",
  borderRadius: theme.shape.borderRadius * 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: 26,
  boxShadow: "0 4px 12px rgba(92,45,145,0.5)",
  flexShrink: 0,
  zIndex: 1,
}));
