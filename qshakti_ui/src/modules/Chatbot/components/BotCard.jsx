/**
 * BotCard Component
 * Card wrapper for bot messages
 * Uses Material-UI Card component
 */

import React from 'react';
import { Card, CardContent, Box } from '@mui/material';

/**
 * BotCard component - wrapper for bot messages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.className - Optional CSS class
 * @returns {JSX.Element} Card component
 */
const BotCard = ({ children, className }) => {
  return (
    <Card
      className={className}
      elevation={0}
      sx={{
        maxWidth: '100%',
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
        },
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -8,
          top: 20,
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid',
          borderRightColor: 'background.paper',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'text.primary' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BotCard;
