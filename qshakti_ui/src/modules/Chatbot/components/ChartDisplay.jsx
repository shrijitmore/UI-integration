/**
 * ChartDisplay Component
 * Displays charts (line/bar) for data visualization in chat
 * Uses Recharts library for charting
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

/**
 * ChartDisplay component for displaying line or bar charts
 * @param {Object} props - Component props
 * @param {string} props.type - Chart type: 'line' or 'bar'
 * @param {Array} props.data - Chart data array
 * @param {string} props.title - Chart title
 * @param {string} props.xAxisLabel - X-axis label
 * @param {string} props.yAxisLabel - Y-axis label
 * @param {Object} props.refLines - Reference lines (lsl, usl, target)
 * @returns {JSX.Element} Chart component
 */
const ChartDisplay = ({ type, data, title, xAxisLabel, yAxisLabel, refLines }) => {
  return (
    <Card>
      <CardHeader
        title={title}
        subheader={
          type === 'line'
            ? 'Time-series view of parameter readings.'
            : 'Distribution of parameter values.'
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart data={data} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip />
              {/* Reference lines for LSL, USL, Target */}
              {refLines?.lsl !== undefined && (
                <ReferenceLine
                  y={refLines.lsl}
                  stroke="red"
                  strokeDasharray="5 5"
                  label="LSL"
                />
              )}
              {refLines?.usl !== undefined && (
                <ReferenceLine
                  y={refLines.usl}
                  stroke="red"
                  strokeDasharray="5 5"
                  label="USL"
                />
              )}
              {refLines?.target !== undefined && (
                <ReferenceLine
                  y={refLines.target}
                  stroke="green"
                  strokeDasharray="3 3"
                  label="Target"
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="value"
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/**
 * RunChartStats component - displays statistics for run charts
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics object (min, max, avg, count)
 * @returns {JSX.Element} Stats component
 */
export const RunChartStats = ({ stats }) => {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="subtitle1">Parameter Analysis</Typography>}
        action={<TrendingUpIcon color="action" />}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Average
            </Typography>
            <Typography variant="h6">{stats.avg}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Min Reading
            </Typography>
            <Typography variant="h6">{stats.min}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Max Reading
            </Typography>
            <Typography variant="h6">{stats.max}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Data Points
            </Typography>
            <Typography variant="h6">{stats.count}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ChartDisplay;
