/**
 * ChatMessages Component
 * Displays all chat messages with auto-scroll functionality
 * Shows bot and user messages with appropriate styling
 */

import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ChatAvatar from './ChatAvatar';
import BotCard from './BotCard';

/**
 * ChatMessages component - renders all messages in the chat
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isBotTyping - Whether bot is currently typing
 * @param {string} props.className - Optional CSS class
 * @returns {JSX.Element} Chat messages component
 */
const ChatMessages = ({ messages, isBotTyping, className }) => {
  const scrollAreaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  return (
    <Box
      ref={scrollAreaRef}
      className={className}
      sx={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        bgcolor: 'background.default',
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          bgcolor: 'action.hover',
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'action.selected',
          borderRadius: '4px',
        },
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {/* Bot avatar on left side */}
              {message.role === 'bot' && <ChatAvatar role="bot" />}

              {/* Message content */}
              <Box
                sx={{
                  maxWidth: { xs: '85%', lg: '70%' },
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.role === 'bot' ? (
                  <BotCard>{message.content}</BotCard>
                ) : (
                  <Box
                    sx={{
                      borderRadius: 3,
                      bgcolor: 'primary.main',
                      px: 2,
                      py: 1.5,
                      fontSize: '0.875rem',
                      color: 'primary.contrastText',
                      boxShadow: 2,
                    }}
                  >
                    {message.content}
                  </Box>
                )}
              </Box>

              {/* User avatar on right side */}
              {message.role === 'user' && <ChatAvatar role="user" />}
            </Box>
          ))}

          {/* Bot typing indicator */}
          {isBotTyping && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <ChatAvatar role="bot" />
              <BotCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                  <CircularProgress size={12} />
                  <CircularProgress size={12} sx={{ animationDelay: '0.15s' }} />
                  <CircularProgress size={12} sx={{ animationDelay: '0.3s' }} />
                </Box>
              </BotCard>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessages;
