/**
 * ChatMessages Component
 * Displays all chat messages with auto-scroll functionality
 * Shows bot and user messages with appropriate styling
 */

import React, { useEffect, useRef } from 'react';
import { Box, keyframes } from '@mui/material';
import ChatAvatar from './ChatAvatar';
import BotCard from './BotCard';

// Typing animation keyframes
const typingDot = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
`;

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
        position: 'relative',
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 1.5,
                  }}
                >
                  {/* Animated typing dots */}
                  {[0, 1, 2].map((index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: `${typingDot} 1.4s infinite ease-in-out`,
                        animationDelay: `${index * 0.2}s`,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  ))}
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
