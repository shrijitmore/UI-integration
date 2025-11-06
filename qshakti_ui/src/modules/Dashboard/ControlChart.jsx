import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Dialog,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CardActions,
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

const sanitizeLabel = (key) => {
  if (!key) return "";
  return key
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getTicks = (min, max, count = 5) => {
  if (min === undefined || max === undefined) return [];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(min + i * step));
};

const ChartLineLabel = ({ viewBox, value, color = "#000", label = "" }) => {
  const { y, x } = viewBox;
  return (
    <text
      x={x + 10}
      y={y}
      dy={-6}
      textAnchor="start"
      fill={color}
      fontSize={12}
      fontWeight={600}
    >
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
  upper_lable = "UCL",
  lower_lable = "LCL",
  center_lable = "Overall Mean",
  footer_lable = "Subgroup Means ",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fullscreen, setFullscreen] = useState(false);

  const redColor = "#e64f4f";
  const greenColor = "#00cc00";
  const blueColor = "#00ACCD";

  // ✅ domain padding
  const minY = lsl - 2;
  const maxY = usl + 2;
  const yTicks = getTicks(minY, maxY, 5);

  const renderChart = (
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
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#333" }}
          interval={0}
          angle={isMobile ? -30 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 50 : 30}
        />

        <YAxis
          domain={[minY, maxY]}
          ticks={yTicks}
          tick={{ fontSize: 12, fill: "#333" }}
          tickLine={{ stroke: "#888", strokeWidth: 1 }}
          axisLine={{ stroke: "#666" }}
          tickSize={7}
          tickMargin={10}
          allowDataOverflow
        />

        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 13, paddingTop: 10 }} />

        <ReferenceLine
          y={usl}
          stroke={redColor}
          strokeWidth={2}
          label={
            <ChartLineLabel value={usl} color={redColor} label={upper_lable} />
          }
        />
        <ReferenceLine
          y={lsl}
          stroke={redColor}
          strokeWidth={2}
          label={
            <ChartLineLabel value={lsl} color={redColor} label={lower_lable} />
          }
        />
        <ReferenceLine
          y={controlLimit}
          stroke={greenColor}
          strokeWidth={2}
          label={
            <ChartLineLabel
              value={controlLimit}
              color={greenColor}
              label={center_lable}
            />
          }
        />

        <Line
          type="linear"
          dataKey="value"
          stroke={blueColor}
          strokeWidth={2}
          dot={{ r: 3, fill: blueColor }}
          name={sanitizeLabel(footer_lable)}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderLegend = () => (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: redColor }}
        />
        <Typography
          fontSize={13}
          fontWeight={500}
          color={redColor}
          sx={{
            whiteSpace: "normal", 
            wordBreak: "break-word", 
          }}
        >
          {sanitizeLabel(upper_lable)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: redColor }}
        />
        <Typography fontSize={13} fontWeight={500} color={redColor}>
          {sanitizeLabel(lower_lable)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: greenColor,
          }}
        />
        <Typography fontSize={13} fontWeight={500} color={greenColor}>
          {sanitizeLabel(center_lable)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: blueColor,
          }}
        />
        <Typography fontSize={13} fontWeight={500} color={blueColor}>
          {sanitizeLabel(footer_lable)}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: 320,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <CardHeader
          title={
            <Typography
              fontSize={14}
              fontWeight={600}
              sx={{
                whiteSpace: "normal", 
                wordBreak: "break-word", 
              }}
            >
              {sanitizeLabel(label)}
            </Typography>
          }
          // subheader={
          //   <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          //     {renderLegend()}
          //   </Box>
          // }
          action={
            <IconButton
              size="small"
              color="red"
              onClick={() => setFullscreen(true)}
            >
              <Fullscreen fontSize="small" />
            </IconButton>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ flex: 1, p: 1 }}>
          <Box sx={{ width: "100%", height: "100%" }}>{renderChart}</Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", pt: 0 }}>
          <Typography fontSize={12} color="text.secondary">
            {renderLegend()}
          </Typography>
        </CardActions>
      </Card>

      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        fullScreen
        PaperProps={{ sx: { p: 2 } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            fontSize={16}
            fontWeight={600}
            sx={{
              whiteSpace: "normal", 
              wordBreak: "break-word", 
            }}
          >
            {sanitizeLabel(label)}
          </Typography>
          {/* {renderLegend()} */}
          <IconButton onClick={() => setFullscreen(false)}>
            <Close color="error" />
          </IconButton>
        </Box>
        <Box sx={{ width: "100%", height: "85vh" }}>{renderChart}</Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography fontSize={12} color="text.secondary">
            {renderLegend()}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
};

export default ControlChart;
