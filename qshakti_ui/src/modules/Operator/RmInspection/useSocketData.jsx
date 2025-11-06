// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// /**
//  * @param {string|number|null} topicId - Dynamic topic or row ID
//  * @param {string} baseUrl - Socket server URL (default: localhost:3000)
//  * @param {string} eventName - Optional event name (default: same as topicId)
//  */
// export const useSocketData = (
//   topicId,
//   baseUrl = "http://172.21.0.162:5001",
//   eventName
// ) => {
//   const [messages, setMessages] = useState([]);
//   console.log("receved data", messages);
//   const socketRef = useRef(null);
//   useEffect(() => {
//     if (!topicId) {
//       // Disconnect if topicId is not provided
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//       return;
//     }

//     // Create a new socket connection
//     const socket = io(baseUrl, {
//       transports: ["websocket"],
//       query: { topic: topicId },
//     });

//     socketRef.current = socket;
//     const topic = eventName || topicId; // use topic name or fallback to rowId

//     console.log(`🔌 Subscribed to topic: ${topic}`);

//     socket.on(topic, (data) => {
//       try {
//         const parsed = typeof data === "string" ? JSON.parse(data) : data;
//         setMessages([parsed]); // replace with latest message
//       } catch (err) {
//         console.error("❌ Error parsing socket data:", err);
//       }
//     });

//     // socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
//     // socket.on("disconnect", () => console.log("❌ Socket disconnected"));

//     // Cleanup when topicId changes or component unmounts
//     return () => {
//       console.log(`🛑 Unsubscribing from topic: ${topic}`);
//       socket.off(topic);
//       socket.disconnect();
//       // setMessages([])
//     };
//   }, [topicId, baseUrl, eventName]);

//   return { messages };
// };

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocketData = (
  topicId,
  baseUrl = "http://172.21.0.197:5001",
  eventName
) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const listenersRef = useRef({}); // store listeners to clean up properly

  useEffect(() => {
    // Disconnect previous socket if exists
    if (socketRef.current) {
      Object.entries(listenersRef.current).forEach(([topic, listener]) => {
        socketRef.current.off(topic, listener);
      });
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setMessages([]); // clear previous messages
      listenersRef.current = {};
      console.log("🛑 Disconnected previous socket");
    }

    if (!topicId) return;

    // Create a new socket connection
    const socket = io(baseUrl, {
      transports: ["websocket"],
      query: { topic: topicId },
    });

    socketRef.current = socket;
    const topics = Array.isArray(topicId) ? topicId : [topicId];

    topics.forEach((topicItem) => {
      const topic =
        eventName ||
        (typeof topicItem === "object" ? topicItem.machine_id : topicItem);
      console.log(`🔌 Subscribed to topic: ${topic}`);

      const listener = (data) => {
        try {
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          setMessages([parsed]); // append messages instead of replacing
        } catch (err) {
          console.error("❌ Error parsing socket data:", err);
        }
      };

      listenersRef.current[topic] = listener;
      socket.on(topic, listener);
    });

    // Cleanup on unmount or topic change
    return () => {
      console.log(`🛑 Cleaning up socket listeners`);
      if (socketRef.current) {
        Object.entries(listenersRef.current).forEach(([topic, listener]) => {
          socketRef.current.off(topic, listener);
        });
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setMessages([]);
      listenersRef.current = {};
    };
  }, [topicId, baseUrl, eventName]);

  return { messages };
};
