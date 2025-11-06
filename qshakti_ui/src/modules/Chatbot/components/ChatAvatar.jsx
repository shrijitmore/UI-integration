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
        width: 36,
        height: 36,
        bgcolor: role === 'bot' ? 'primary.main' : 'secondary.main',
        border: '2px solid',
        borderColor: 'background.paper',
        boxShadow: 1
      }}
    >
      {role === 'bot' ? (
        <SmartToyIcon sx={{ fontSize: 20 }} />
      ) : (
        <PersonIcon sx={{ fontSize: 20 }} />
      )}
    </Avatar>
  );
};

export default ChatAvatar;
