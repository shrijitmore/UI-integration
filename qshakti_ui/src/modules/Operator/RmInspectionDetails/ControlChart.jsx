import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
} from "@mui/material";
import { Fullscreen, Close } from "@mui/icons-material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
const LeftAlignedLabel = ({ viewBox, value, color }) => {
  const { y } = viewBox;

  return (
    <text x={40} y={y} dy={-8} textAnchor="start" fill={color} fontSize={10}>
      {value}
    </text>
  );
};
const ChartLineLabel = ({ viewBox, value, color = "#000", label = "" }) => {
  const { y } = viewBox;

  return (
    <text x={40} y={y} dy={-6} textAnchor="start" fill={color} fontSize={10}>
      {label ? `${label}: ${value}` : value}
    </text>
  );
};

const ControlChart = ({
  chartData,
  label,
  usl,
  lsl,
  controlLimit,
  width = "100%", // now responsive
  height = "100%", // now responsive
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fullscreen, setFullscreen] = useState(false);
  // Define fixed colors to match the image
  const redColor = "#e64f4fff";
  const greenColor = "#00cc00";
  const blueColor = "#4169e1";
  // let controlLimit = (usl + lsl) / 2;
  const generateTicks = (min, max, step = 5) => {
    const ticks = [];
    const start = min; // Round down
    const end = Math.ceil(max / step) * step; // Round up
    for (let i = start; i <= end; i += step) {
      ticks.push(i);
    }
    return ticks;
  };
  const minY = Math.min(lsl, usl) - 2;
  const maxY = Math.max(lsl, usl) + 5;
  const step = Math.ceil((maxY - minY) / 5);
  const yTicks = generateTicks(minY, maxY, step);
  const renderChart = (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            interval={0}
            height={30}
            tickMargin={4}
          />
          <YAxis
            // tick={{ fontSize: 10 }}
            // width={30}
            // tickMargin={4}
            // domain={[minY, maxY]}
            // ticks={ticks}
            // allowDataOverflow={true}
            // tickSize={7}
            tick={{ fontSize: 10 }}
            width={30}
            tickMargin={4}
            domain={[minY, maxY]}
            ticks={yTicks}
            allowDataOverflow
            tickSize={7}
          />

          <Tooltip />
          {/* <Legend wrapperStyle={{ fontSize: 10, paddingTop: 5 }} /> */}
          <Legend
            wrapperStyle={{ fontSize: 14, fontWeight: 600 }} // <-- Legend font size
          />
          <ReferenceLine
            y={usl}
            stroke={redColor}
            strokeWidth={3}
            // label={<LeftAlignedLabel value="Upper Limit" color={redColor} />}
            label={
              <ChartLineLabel
                value={usl}
                color={redColor}
                label="Upper Specification"
              />
            }
          />

          <ReferenceLine
            y={lsl}
            stroke={redColor}
            strokeWidth={3}
            // label={<LeftAlignedLabel value="Lower Limit" color={redColor} />}
            label={
              <ChartLineLabel
                value={lsl}
                color={redColor}
                label="Lower Specification"
              />
            }
          />

          <ReferenceLine
            y={controlLimit}
            stroke={greenColor}
            strokeWidth={3}
            // label={
            //   <LeftAlignedLabel value="Centered Line" color={greenColor} />
            // }
            label={
              <ChartLineLabel
                value={controlLimit}
                color={greenColor}
                label="Centered Line"
              />
            }
          />

          {/* Actual Data Line */}
          <Line
            // type="monotone"
            type="linear" // <-- straight line between points
            dataKey="value"
            stroke={blueColor}
            strokeWidth={3}
            dot={{ r: 4, fill: blueColor }}
            name="Actual Reading"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width,
          height,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography></Typography>

          <IconButton size="small" onClick={() => setFullscreen(true)}>
            <Fullscreen fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1 }}>{renderChart}</Box>
      </Box>

      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        fullScreen
        PaperProps={{ sx: { p: 2, bgcolor: theme.palette.background.paper } }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          flexWrap="wrap"
          gap={2}
        >
          {/* Title */}
          <Typography fontSize={14} fontWeight={500} color="text.primary">
            Control Chart - {label}
          </Typography>

          {/* Legend */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Upper Spec */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#e64f4fff",
                }}
              />
              <Typography fontSize={13} fontWeight={500} color="#e64f4fff">
                Upper Spec Limit
              </Typography>
            </Box>

            {/* Lower Spec */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "#e64f4fff",
                }}
              />
              <Typography fontSize={13} fontWeight={500} color="#e64f4fff">
                Lower Spec Limit
              </Typography>
            </Box>

            {/* Center Line */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "green",
                }}
              />
              <Typography fontSize={13} fontWeight={500} color="green">
                Center Line
              </Typography>
            </Box>

            {/* Actual Reading */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "blue",
                }}
              />
              <Typography fontSize={13} fontWeight={500} color="blue">
                Actual Reading
              </Typography>
            </Box>
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={() => setFullscreen(false)}
            size="small"
            sx={{ color: "#e64f4fff" }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Chart */}
        <Box sx={{ width: "100%", height: "80vh" }}>{renderChart}</Box>
      </Dialog>
    </>
  );
};

export default ControlChart;
