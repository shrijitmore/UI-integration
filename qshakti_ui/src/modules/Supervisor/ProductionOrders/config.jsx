import { Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow"; // Start
import PauseIcon from "@mui/icons-material/Pause"; // Stop
import StopCircleIcon from "@mui/icons-material/StopCircle"; // Complete
import CancelIcon from "@mui/icons-material/Cancel"; // Close
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

// For Dialog confirmation
import {
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { hasPermission } from "../../../utils/permissions";
import { Box } from "@mui/system";
const colors = [
  "#e74c3c", // red
  "#3498db", // blue
  "#2ecc71", // green
  "#9b59b6", // purple
  "#f39c12", // orange
  "#1abc9c", // teal
  "#d35400", // dark orange
  "#7f8c8d", // gray
  "#2980b9", // strong blue
  "#16a085", // strong teal
  "#c0392b", // strong red
];
const commonDateFormat = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
// export const columns = (handleStart) =>
//   [
//     {
//       field: "srNo",
//       headerName: "Sr. No.",
//       width: 80,
//     },

//     { field: "order_number", headerName: "Production Order", width: 100 },
//     { field: "section", headerName: "Section", width: 90 },

//     {
//       field: "lot_number",
//       headerName: "Lot No",
//       width: 130,
//       align: "center",
//       headerAlign: "center",
//       textAlign: "center",
//       justifyContent: "center",
//       renderCell: (params) => {
//         const randomIndex = Math.floor(Math.random() * colors.length); // Pick random color
//         const color = colors[randomIndex]; // Base color
//         const lightBg = `${color}23`; // Light background (20% opacity)
//         const darkBorder = color; // Border color same as base color

//         return (
//           <Box
//             sx={{
//               background: lightBg, // Light background
//               // color: "#333", // Dark text
//               color: `${darkBorder}`,
//               px: 2,
//               py: 0.5,
//               borderRadius: "20px",
//               // fontSize: "0.75rem",
//               fontWeight: 500,
//               // display: "inline-block",
//               // minWidth: "60px",
//               textAlign: "center",
//               lineHeight: 1.5,
//               border: `1px solid ${darkBorder}`, // Dark border
//               // boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
//             }}
//           >
//             {params.value}
//           </Box>
//         );
//       },
//     },
//     { field: "lot_qty", headerName: "Lot Qty", width: 90 },
//     { field: "item_code", headerName: "Item Code", width: 90 },
//     { field: "item_desc", headerName: "Item Description", width: 90 },
//     {
//       field: "start_date",
//       headerName: "Start Date",
//       width: 95,

//       valueFormatter: (params) => commonDateFormat(params),
//     },
//     {
//       field: "target_date",
//       headerName: "Targeted Date",
//       width: 90,

//       valueFormatter: (params) => commonDateFormat(params),
//     },

//     // ✅ Only add "Action" column if user has permission
//     (hasPermission("productionOrders", "edit") ||
//       hasPermission("productionOrders", "create")) && {
//       field: "action",
//       headerName: "Action",
//       width: 140,
//       sortable: false,
//       align: "center",
//       headerAlign: "center",
//       textAlign: "center",
//       justifyContent: "center",
//       // renderCell: (params) => {
//       //   const isStarted = params.row.status === "Start";

//       //   return (
//       //     <Button
//       //       size="small"
//       //       startIcon={isStarted ? <PauseIcon /> : <PlayArrowIcon />}
//       //       onClick={() =>
//       //         handleStart({
//       //           status: isStarted ? "stop" : "start",
//       //           row: params.row,
//       //         })
//       //       }
//       //       sx={{
//       //         minWidth: 80,
//       //         borderRadius: 10,
//       //         fontWeight: 500,
//       //         textTransform: "capitalize",
//       //         px: 2,
//       //         py: 0.5,
//       //         backgroundColor: isStarted ? "#ffebee" : "#e8f5e9", // Light red / light green
//       //         color: isStarted ? "#c62828" : "#2e7d32", // Darker text color for contrast
//       //         border: `1px solid ${isStarted ? "#f8bbbb" : "#b3e2b1"}`,
//       //         "&:hover": {
//       //           backgroundColor: isStarted ? "#ffcdd2" : "#c8e6c9",
//       //         },
//       //       }}
//       //     >
//       //       {isStarted ? "Stop" : "Start"}
//       //     </Button>
//       //   );
//       // },
//       renderCell: (params) => {
//         const currentStatus = params.row.status?.toLowerCase();

//         let nextAction = "";
//         let buttonIcon = null;
//         let buttonBg = "";
//         let buttonColor = "";

//         switch (currentStatus) {
//           case "stop":
//             nextAction = "start";
//             buttonIcon = <PlayArrowIcon fontSize="small" />;
//             buttonBg = "#e3f2fd"; // light blue
//             buttonColor = "#1976d2";
//             break;
//           case "start":
//             nextAction = "close";
//             buttonIcon = <StopCircleIcon fontSize="small" />;
//             buttonBg = "#fff3e0"; // light orange
//             buttonColor = "#fb8c00";
//             break;
//           case "close":
//             nextAction = "complete";
//             buttonIcon = <HourglassEmptyIcon fontSize="small" />;
//             buttonBg = "#e8f5e9"; // light green
//             buttonColor = "#388e3c";
//             break;
//           default:
//             nextAction = "Done";
//             buttonIcon = <CheckCircleIcon fontSize="small" />;
//             buttonBg = "#e3f2fd";
//             buttonColor = "#1976d2";
//         }

//         const isDisabled = currentStatus === "complete";

//         return (
//           <Button
//             variant="contained"
//             size="small"
//             startIcon={buttonIcon}
//             disabled={isDisabled}
//             onClick={() =>
//               handleStart({
//                 status: nextAction,
//                 row: params.row,
//               })
//             }
//             sx={{
//               minWidth: 100,
//               fontSize: "0.75rem",
//               fontWeight: 600,
//               textTransform: "none",
//               backgroundColor: buttonBg,
//               color: buttonColor,
//               "&:hover": {
//                 backgroundColor: buttonBg,
//               },
//               "&.Mui-disabled": {
//                 backgroundColor: "#e8ecf5ff",
//                 color: "#626c63ff",
//               },
//             }}
//           >
//             {nextAction.charAt(0).toUpperCase() + nextAction.slice(1)}
//           </Button>
//         );
//       },
//     },
//   ].filter(Boolean);

export const columns = (handleStart) =>
  [
    {
      field: "srNo",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 70,
    },
    {
      field: "order_number",
      headerName: "Production Order",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "section",
      headerName: "Section",
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: "lot_number",
      headerName: "Lot No",
      flex: 1,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        const color = colors[randomIndex];
        const lightBg = `${color}23`;
        const darkBorder = color;

        return (
          <Box
            sx={{
              background: `{${params.value} ? lightBg : "gray"}`,
              color: `${params.value ? darkBorder : "gray"}`,
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontWeight: 500,
              textAlign: "center",
              lineHeight: 1.5,
              border: `1px solid ${params.value ? darkBorder : "gray"}`,
            }}
          >
            {params.value ? params.value : "NA"}
          </Box>
        );
      },
    },
    {
      field: "lot_qty",
      headerName: "Lot Qty",
      flex: 0.7,
      minWidth: 90,
    },
    {
      field: "item_code",
      headerName: "Item Code",
      flex: 0.9,
      minWidth: 100,
    },
    {
      field: "item_desc",
      headerName: "Item Description",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => commonDateFormat(params),
    },
    {
      field: "target_date",
      headerName: "Targeted Date",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => commonDateFormat(params),
    },
    (hasPermission("productionOrders", "edit") ||
      hasPermission("productionOrders", "create")) && {
      field: "action",
      headerName: "Action",
      flex: 1.2,
      minWidth: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const currentStatus = params.row.status?.toLowerCase();
        let nextAction = "";
        let buttonIcon = null;
        let buttonBg = "";
        let buttonColor = "";

        switch (currentStatus) {
          case "stop":
            nextAction = "start";
            buttonIcon = <PlayArrowIcon fontSize="small" />;
            buttonBg = "#e3f2fd";
            buttonColor = "#1976d2";
            break;
          case "start":
            nextAction = "close";
            buttonIcon = <StopCircleIcon fontSize="small" />;
            buttonBg = "#fff3e0";
            buttonColor = "#fb8c00";
            break;
          case "close":
            nextAction = "complete";
            buttonIcon = <HourglassEmptyIcon fontSize="small" />;
            buttonBg = "#e8f5e9";
            buttonColor = "#388e3c";
            break;
          default:
            nextAction = "Done";
            buttonIcon = <CheckCircleIcon fontSize="small" />;
            buttonBg = "#e3f2fd";
            buttonColor = "#1976d2";
        }

        const isDisabled = currentStatus === "complete";

        return (
          <Button
            variant="contained"
            size="small"
            startIcon={buttonIcon}
            disabled={isDisabled}
            onClick={() =>
              handleStart({
                status: nextAction,
                row: params.row,
              })
            }
            sx={{
              minWidth: 100,
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: buttonBg,
              color: buttonColor,
              "&:hover": { backgroundColor: buttonBg },
              "&.Mui-disabled": {
                backgroundColor: "#e8ecf5ff",
                color: "#626c63ff",
              },
            }}
          >
            {nextAction.charAt(0).toUpperCase() + nextAction.slice(1)}
          </Button>
        );
      },
    },
  ].filter(Boolean);

export const rows = [
  {
    id: 1,
    prodOrder: "1234",
    lotNo: "101",
    lotQty: 3,
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
    startDate: "--",
    targetedDate: "07/07/25",
    status: "idle",
  },
  {
    id: 2,
    prodOrder: "1234",
    lotNo: "101",
    lotQty: 3,
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
    startDate: "03/07/25",
    targetedDate: "07/07/25",
    status: "running",
  },
  {
    id: 3,
    prodOrder: "1234",
    lotNo: "101",
    lotQty: 3,
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
    startDate: "--",
    targetedDate: "07/07/25",
    status: "idle",
  },
];
