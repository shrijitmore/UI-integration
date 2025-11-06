/**
 * Chatbot Main Page Component
 * This is the main page component that wraps the ChatInterface
 * It provides the layout and container for the chatbot
 * 
 * Converted from Next.js to React for qshakti_ui integration
 */

import React from 'react';
import { Box, Card, Typography, Divider } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import SmartToyIcon from '@mui/icons-material/SmartToy';

/**
 * Main Chatbot page component
 * This component serves as the full-page container for the chatbot interface
 */
const Chatbot = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 100px)', // Adjust for header/footer
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header Section */}
      <Card
        sx={{
          borderRadius: 0,
          boxShadow: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Quality Insights Chatbot
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Ask me about production orders, inspections, and quality parameters
            </Typography>
          </Box>
        </Box>
      </Card>

      <Divider />

      {/* Chat Interface Section */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <ChatInterface />
      </Box>

      {/* Footer Section (Optional) */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          💡 Tip: You can type option numbers directly or click the buttons to interact with the
          chatbot
        </Typography>
      </Box>
    </Box>
  );
};

export default Chatbot;
