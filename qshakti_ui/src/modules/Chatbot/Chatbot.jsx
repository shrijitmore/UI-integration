/**
 * Chatbot Main Page Component
 * This is the main page component that wraps the ChatInterface
 * It provides the layout and container for the chatbot
 * 
 * Converted from Next.js to React for qshakti_ui integration
 */

import React from 'react';
import { Box, Card, Typography, Divider, Chip } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
        overflow: 'hidden', // Prevent page scrolling
        position: 'relative',
      }}
    >
      {/* Header Section with Gradient */}
      <Card
        elevation={4}
        sx={{
          borderRadius: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
            px: 3,
            py: 2.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <SmartToyIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ color: 'white' }}>
                Quality Insights Chatbot
              </Typography>
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                label="AI Assistant"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                  height: 24,
                  fontSize: '0.7rem',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
              Ask me about production orders, inspections, and quality parameters
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Chat Interface Section */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          bgcolor: 'background.default',
          position: 'relative',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
        }}
      >
        <ChatInterface />
      </Box>

      {/* Footer Section with Modern Design */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.5,
                  transform: 'scale(1.2)',
                },
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            💡 Tip: You can type option numbers directly or click the buttons to interact
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
