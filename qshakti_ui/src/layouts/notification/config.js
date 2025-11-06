import { format, isToday, isYesterday } from "date-fns";

export const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd MMM");
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, "HH:mm");
};

export const getRandomColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};
