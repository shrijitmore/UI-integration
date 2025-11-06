import React, { useState } from "react";
import { Tabs, Tab, Box, Paper, Typography } from "@mui/material";
import ManageAccess from "./accessControl/manageAccess";
import AddRole from "./addRole/addRole";

import SecurityIcon from "@mui/icons-material/Security";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { tabStyles } from "./config";

function RoleMangement() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 1,
          mt: 1,
        }}
      >
        <Typography
          // variant="h5"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
              lg: "1.3rem",
            },
            color: "#1a237e",
            fontWeight: "bold",
            cursor: "pointer",
            mb: 0,
          }}
        >
          Role Management
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ borderRadius: "10px", overflow: "hidden" }}>
        <Box sx={{ bgcolor: "white" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            <Tab
              icon={
                <SecurityIcon
                  sx={{ color: activeTab === 0 ? "#5C2D91" : "#0D1B2A" }}
                />
              }
              label="Manage Access"
              sx={{
                height: "45px",
                minHeight: "45px",
                padding: "4px 8px",
                fontSize: "0.8rem",
                ...tabStyles,
              }}
            />
            <Tab
              icon={
                <AddCircleIcon
                  sx={{ color: activeTab === 1 ? "#5C2D91" : "#0D1B2A" }}
                />
              }
              label="Add Role"
              sx={{
                height: "45px",
                minHeight: "45px",
                padding: "8px",
                fontSize: "0.8rem",
                ...tabStyles,
              }}
            />
          </Tabs>
        </Box>

        <Box>
          {activeTab === 0 && <ManageAccess />}
          {activeTab === 1 && <AddRole />}
        </Box>
      </Paper>
    </Box>
  );
}

export default RoleMangement;
