import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { format, formatDistanceToNowStrict, parse } from "date-fns";
import {
  EmojiObjects as LightbulbIcon,
  Star as StarIcon,
  FlashOn as FlashIcon,
  Build as BuildIcon,
  Extension as ExtensionIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { motion } from "framer-motion"; 
import { useDispatch } from "react-redux";
import { getACtivityLog } from "../../store/slices/activityLog/activityLogSlice";
import { getTypeColor, getTypeIcon } from "./config";

const lightColors = ["#AEDFF7", "#FCE1A8", "#D1F7C4", "#F7D1D1", "#E8D1F7"];
const randomIcons = [
  <LightbulbIcon />,
  <StarIcon />,
  <FlashIcon />,
  <BuildIcon />,
  <ExtensionIcon />,
];
const getRandomInt = (max) => Math.floor(Math.random() * max);

const ActivityLog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [dispatch]);

  const fetchActivity = async () => {
    try {
      const result = await dispatch(getACtivityLog()).unwrap();
      const transformed = result.data.map((item) => {
        const formattedUser = item.name
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");

        return {
          id: item.id,
          title: item.module_options ?? "No Title",
          description: item.activity ?? "No Description",
          user: `Performed By ${formattedUser}`,
          userAvatar: item.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          timestamp: parse(item.last_update, "dd/MM/yyyy, hh:mm a", new Date()),
          details: {
            user: item.name,
            activity: item.activity,
            lastUpdate: item.last_update,
          },
        };
      });

      setActivities(transformed);
    } catch (error) {
      console.error("Failed to fetch activity log:", error);
    }
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setDetailModalOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchActivity();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const ActivityCard = ({ activity }) => {
    const randomIndex = getRandomInt(lightColors.length);
    const bgColor = lightColors[randomIndex];
    const icon = randomIcons[randomIndex];

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.49)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ margin: "15px" }}
        onClick={() => handleViewDetails(activity)}
      >
        <Card
          sx={{
            borderRadius: 2.5,
            p: 0.5,
            cursor: "pointer",
            background: "linear-gradient(135deg, #fafafa, #fefefe)",
          }}
        >
          <CardContent sx={{ height: "75px" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* Left section */}
              <Box display="flex" gap={2} alignItems="center">
                <Avatar sx={{ bgcolor: bgColor, color: "#000000de" }}>
                  {icon}
                </Avatar>
                <Box>
                  <Typography
                    sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}
                  >
                    {activity.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                    <PersonIcon fontSize="small" sx={{ color: "#777" }} />
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.85rem", color: "#555" }}
                    >
                      {activity.user}&nbsp;— {activity.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right section: time */}
              <Box textAlign="right">
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 0.5,
                    color: "#026e64",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  <AccessTimeIcon fontSize="small" sx={{ color: "gray" }} />
                  {formatDistanceToNowStrict(activity?.timestamp, {
                    addSuffix: true,
                  })}
                </Typography>
                <Typography
                  sx={{
                    color: "#7B1FA2",
                    fontSize: "0.75rem",
                  }}
                >
                  {format(activity?.timestamp, "dd MMM yyyy, hh:mm a")}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const ActivityDetailModal = () => (
    <Dialog
      open={detailModalOpen}
      onClose={() => setDetailModalOpen(false)}
      maxWidth="md"
      fullWidth
      TransitionComponent={motion.div}
      transition={{ duration: 0.4 }}
    >
      <DialogTitle>
        <Box display="flex" gap={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor:
                theme.palette[getTypeColor(selectedActivity?.type)]?.main ||
                theme.palette.grey[500],
            }}
          >
            {getTypeIcon(selectedActivity?.type)}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{selectedActivity?.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedActivity?.description}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {selectedActivity &&
            Object.entries(selectedActivity.details || {}).map(
              ([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="caption" color="text.secondary">
                    {key.replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <Typography variant="body2">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </Typography>
                </Grid>
              )
            )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailModalOpen(false)}>Close</Button>
        <Button variant="contained" startIcon={<DownloadIcon />}>
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {/* Header */}
      <Grid
        item
        xs={12}
        container
        justifyContent="space-between"
        mb={1}
        mt={1}
        alignItems="center"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: "#1a237e",
              fontWeight: "bold",
            }}
          >
            Activity Log
          </Typography>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </motion.div>
      </Grid>

      {/* Activities */}
      <Box>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card
              sx={{
                mt: 2,
                p: 4,
                minHeight: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                backgroundColor: "#f9f9f9",
                border: "1px dashed #ccc",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No activity data available.
              </Typography>
            </Card>
          </motion.div>
        )}
      </Box>

      <ActivityDetailModal />
    </Box>
  );
};

export default ActivityLog;
