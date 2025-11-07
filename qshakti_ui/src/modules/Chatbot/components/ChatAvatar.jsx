/**
 * ChatAvatar Component
 * Displays avatar for bot and user in chat interface
 * Uses Material-UI Avatar component
 */

import React from 'react';
import { Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

/**
 * ChatAvatar component
 * @param {Object} props - Component props
 * @param {string} props.role - 'user' or 'bot'
 * @returns {JSX.Element} Avatar component
 */
const ChatAvatar = ({ role }) => {
  return (
    <Avatar
      sx={{
        width: 42,
        height: 42,
        bgcolor: role === 'bot' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        border: '3px solid',
        borderColor: 'background.paper',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {role === 'bot' ? (
        <SmartToyIcon sx={{ fontSize: 22, color: 'white' }} />
      ) : (
        <PersonIcon sx={{ fontSize: 22, color: 'white' }} />
      )}
    </Avatar>
  );
};

export default ChatAvatar;
