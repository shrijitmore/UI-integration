import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning ☀️";
  if (hour < 17) return "Good Afternoon 🌤️";
  if (hour < 21) return "Good Evening 🌆 ";
  return "Good Night 🌃";
};

export const motivationalQuotes = [
  "Precision is our power. Every round counts.",
  "Discipline and safety — the backbone of every mission.",
  "In every component, strength and resilience.",
  "You build what defends the nation. Stand proud.",
  "Engineering excellence is the first line of defense.",
];

export const getRandomQuote = () => {
  return motivationalQuotes[
    Math.floor(Math.random() * motivationalQuotes.length)
  ];
};

export const getTypeColor = (type) => {
  switch (type) {
    case "inspection":
      return "primary";
    case "maintenance":
      return "secondary";
    case "alert":
      return "error";
    case "training":
      return "success";
    default:
      return "grey"; // ✅ fixed: avoid 'default'
  }
};

export const getTypeIcon = (type) => {
  switch (type) {
    case "inspection":
      return <AssignmentIcon />;
    case "maintenance":
      return <ScheduleIcon />;
    case "alert":
      return <WarningIcon />;
    case "training":
      return <PersonIcon />;
    default:
      return <InfoIcon />;
  }
};
