import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedModule } from "../../store/slices/moduleSlice";
import { logOut } from "../../store/slices/auth/authSlice";
import { showToast } from "../../common/ShowToast";
import { clearSession } from "../../utils/sessionHandler";
import { Box, Button, ListItemText, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import RuleFolderIcon from "@mui/icons-material/RuleFolder";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SummarizeIcon from "@mui/icons-material/Summarize";

import {
  CardBox,
  DashboardContainer,
  IconWrapper,
  LogoutWrapper,
  StyledList,
} from "./config";

const cardData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    screen: ["dashboard", "activity", "dashboard2"],
    adminRoute: "/activitylog",
    userRoute: "/dashboard",
  },
  {
    title: "Master Data Management (MDM)",
    icon: <StorageIcon />,
    screen: ["uploadFile", "activity"],
    adminRoute: "/activitylog",
    userRoute: "/uploadFile",
  },
  {
    title: "Order Management",
    icon: <ContentPasteGoIcon />,
    screen: [
      "production",
      "rm",
      "orderDetails",
      "productionOrders",
      "activity",
      "orderManagement",
    ],
    adminRoute: "/activitylog",
    userRoute: "/openorders",
    alwaysUseUserRouteIfAnyScreenAccessible: true,
  },

  {
    title: "RM Management",
    icon: <ContentPasteSearchOutlinedIcon />,
    screen: ["rmInspection", "rmInspectionDetails", "activity"],
    adminRoute: "/activitylog",
    userRoute: "/rminspection",
  },
  {
    title: "Inprocess Management",
    icon: <PrecisionManufacturingIcon />,
    screen: ["inprocessInspection", "inprocessInspectionDetails", "activity"],
    adminRoute: "/activitylog",
    userRoute: "/inprocessinspection",
  },
  {
    title: "Final Acceptance Inspection",
    icon: <RuleFolderIcon />,
    screen: ["faiInspection", "activity", "faiInspectionDetails"],
    adminRoute: "/activitylog",
    userRoute: "/faiInspection",
  },
  {
    title: "User & Security Management",
    icon: <SecurityIcon />,
    screen: ["roleManagement", "activity"],
    adminRoute: "/activitylog",
    userRoute: "/roleManagement",
  },
  {
    title: "Report Management",
    icon: <SummarizeIcon />,
    screen: ["inprocessReport", "rmReport", "faiReport"],
    adminRoute: "/inprocessReport",
    userRoute: "/inprocessReport",
  },
];

const ModulePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permissions, setPermissions] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  const userRole = sessionStorage.getItem("role");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const loadPermissions = () => {
      try {
        const data = JSON.parse(sessionStorage.getItem("permissions") || "[]");
        setPermissions(data);
      } catch (error) {
        console.error("Error loading permissions:", error);
      }
    };
    loadPermissions();
  }, []);

  useEffect(() => {
    if (!permissions.length) return;
    const filtered = cardData.filter((card) =>
      card.screen.some((screenName) =>
        permissions.some((perm) => perm.screen === screenName && perm.view)
      )
    );
    setFilteredCards(filtered);
  }, [permissions]);

  const handleSignout = async () => {
    try {
      const result = await dispatch(logOut())?.unwrap();
      if (result) {
        showToast(result?.message, "success");
        clearSession();
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      showToast(err, "error");
    }
  };

  return (
    <DashboardContainer>
      <LogoutWrapper onClick={handleSignout}>
        <LogoutIcon />
        <Button style={{ color: "whitesmoke" }}>Sign Out</Button>
      </LogoutWrapper>

      <StyledList>
        {filteredCards.length > 0 ? (
          filteredCards.map((card, index) => (
            <CardBox
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              onClick={() => {
                dispatch(setSelectedModule(card.title));

                let routeToNavigate = null;

                if (isAdmin) {
                  routeToNavigate = card.adminRoute;
                } else {
                  // Step 1: Check if the user has access to either "rm" or "production"
                  const priorityScreens = ["rm", "production"];
                  const hasPriorityAccess = priorityScreens.some((screen) =>
                    permissions.some(
                      (perm) => perm.screen === screen && perm.view
                    )
                  );

                  if (hasPriorityAccess) {
                    // Navigate to default route if rm or production is accessible
                    routeToNavigate = card.userRoute;
                  } else {
                    // Step 2: Find the first accessible screen from the full list
                    const accessibleScreen = card.screen.find((screenName) =>
                      permissions.some(
                        (perm) => perm.screen === screenName && perm.view
                      )
                    );

                    if (accessibleScreen) {
                      routeToNavigate = `/${accessibleScreen.toLowerCase()}`;
                    }
                  }
                }

                if (routeToNavigate) {
                  localStorage.setItem("lastVisitedRoute", routeToNavigate);
                  navigate(routeToNavigate);
                } else {
                  showToast("You do not have access to this module.", "error");
                }
              }}
            >
              <ArrowRightAltIcon
                className="arrow-icon"
                sx={{
                  position: "absolute",
                  left: -30,
                  color: "white",
                  opacity: 0,
                  fontSize: 28,
                  transition: "all 0.3s ease",
                  transform: "translateX(-10px)",
                  pointerEvents: "none",
                }}
              />
              <IconWrapper>{card.icon}</IconWrapper>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {card.title}
                  </Typography>
                }
              />
            </CardBox>
          ))
        ) : (
          <Box
            sx={{
              padding: 4,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: 3,
              color: "white",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              mt: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Access Denied!
            </Typography>
            <Typography variant="body1">
              Please contact the Administrator for access.
            </Typography>
          </Box>
        )}
      </StyledList>
    </DashboardContainer>
  );
};

export default ModulePage;
