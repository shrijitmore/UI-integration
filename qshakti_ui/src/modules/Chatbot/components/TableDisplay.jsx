/**
 * TableDisplay Component
 * Displays data in a table format within bot messages
 * Uses Material-UI Table components
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

/**
 * TableDisplay component for showing tabular data in chat
 * @param {Object} props - Component props
 * @param {string} props.title - Table title
 * @param {Array<string>} props.headers - Array of header labels
 * @param {Array<Array<string|number>>} props.rows - 2D array of row data
 * @returns {JSX.Element} Table component
 */
const TableDisplay = ({ title, headers, rows }) => {
  return (
    <Card sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ p: 0 }}>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: 'bold',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                >
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TableDisplay;
