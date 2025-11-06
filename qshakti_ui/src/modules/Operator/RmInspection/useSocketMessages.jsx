// hooks/useSocketMessages.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocketMessages = (url = "http://localhost:3000") => {
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    const socket = io(url, { transports: ["websocket"] });

    socket.on("natsMessage", (data) => {
      try {
        const parsed = JSON.parse(data);
        setMessages([parsed]);
        
      } catch (err) {
        console.error("Invalid socket data", err);
      }
    });

    return () => socket.disconnect();
  }, [url]);

  return messages;
};
