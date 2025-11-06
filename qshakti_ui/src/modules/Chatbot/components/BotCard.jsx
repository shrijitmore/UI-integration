/**
 * BotCard Component
 * Card wrapper for bot messages
 * Uses Material-UI Card component
 */

import React from 'react';
import { Card, CardContent } from '@mui/material';

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
      sx={{
        maxWidth: '100%',
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default BotCard;
