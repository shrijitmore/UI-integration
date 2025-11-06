import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Dialog,
  Box,
  Typography,
} from "@mui/material";
import { Fullscreen, Close } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const BarChartComponent = ({ data, label }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const renderChart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 30, bottom: 40 }}
        barCategoryGap="0%"
        barGap={0}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="1" x2="1" y2="0">
            <stop
              offset="1%"
              stopColor="rgba(92, 78, 165, 1)"
              stopOpacity={1}
            />
            <stop
              offset="95%"
              stopColor="rgba(0, 172, 205, 1)"
              stopOpacity={1}
            />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

        <XAxis
          dataKey="range"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#666" }}
          tickLine={false}
        >
          <Label value="LSL / USL" offset={-25} position="insideBottom" />
        </XAxis>

        <YAxis
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#666" }}
          tickLine={false}
        >
          <Label
            value="No. of counts"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>

        <Tooltip
          contentStyle={{
            fontSize: 12,
            borderRadius: 4,
          }}
        />

        <Bar
          dataKey="count"
          fill="url(#barGradient)"
          stroke="#1e3a8a"
          strokeWidth={1}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
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
              {label}
            </Typography>
          }
          action={
            <IconButton size="small" onClick={() => setFullscreen(true)}>
              <Fullscreen fontSize="small" />
            </IconButton>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ flex: 1, p: 1 }}>
          <Box sx={{ width: "100%", height: "100%" }}>{renderChart}</Box>
        </CardContent>
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
            {label}
          </Typography>
          <IconButton onClick={() => setFullscreen(false)}>
            <Close color="error" />
          </IconButton>
        </Box>
        <Box sx={{ width: "100%", height: "85vh" }}>{renderChart}</Box>
      </Dialog>
    </>
  );
};

export default BarChartComponent;
