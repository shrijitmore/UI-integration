// import { Box, Typography, Chip } from "@mui/material";

// export function renderFormattedReadings(row, readingsPerRow = 10) {
//   const vals = row.actualReadings || [];
//   if (vals.length === 0) {
//     return (
//       <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
//         No Data
//       </Typography>
//     );
//   }

//   if (row.inspection_type === "Parameter") {
//     // Parameter type readings (numbers list)
//     return (
//       <Box display="flex" flexWrap="wrap" gap={1}>
//         {vals.map((val, i) => (
//           <Typography key={i} variant="body2" sx={{ fontSize: "0.75rem" }}>
//             {`${i + 1}) ${val}`}
//           </Typography>
//         ))}
//       </Box>
//     );
//   }

//   if (row.inspection_type === "Attribute") {
//     if (row.recording_type === "Summarized") {
//       return (
//         <Box display="flex" flexDirection="column" gap={0.5}>
//           {vals.map((r, i) => (
//             <Typography key={i} variant="body2" sx={{ fontSize: "0.75rem" }}>
//               {typeof r === "object"
//                 ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
//                 : r}
//             </Typography>
//           ))}
//         </Box>
//       );
//     } else {
//       return (
//         <Box display="flex" flexWrap="wrap" gap={0.5}>
//           {vals.map((r, i) => {
//             let valText;
//             if (r == 1) valText = "OK";
//             else if (r == 0) valText = "Not OK";
//             else valText = "-";

//             return (
//               <Typography key={i} variant="body2" sx={{ fontSize: "0.75rem" }}>
//                 {`${i + 1}) ${valText}`}
//               </Typography>
//             );
//           })}
//         </Box>
//       );
//     }
//   }

//   return <Typography sx={{ fontSize: "0.75rem" }}>No Data</Typography>;
// }
import { Box, Typography, Chip } from "@mui/material";
import {
  acceptAndReject,
  actualReading,
  OkAndNotOK,
} from "../RmInspection/config";
export function renderFormattedReadings(row, readingsPerRow = 10) {
  const vals = row.actual_reading || [];
  console.log("vals", vals);
  if (vals.length === 0) {
    return (
      <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
        No Data
      </Typography>
    );
  }
  if (actualReading(row)) {
    // Parameter type readings (numbers list)
    return (
      <Box display="flex" flexWrap="wrap" gap={1}>
        {/* {vals} */}
        {vals.map((val, i) => (
          <Typography key={i} variant="body2" sx={{ fontSize: "0.75rem" }}>
            {`${i + 1}) ${val}`}
          </Typography>
        ))}
      </Box>
    );
  }
  // if (row.inspection_type === "Attribute") {
  // if(actualReading(row)){
  if (acceptAndReject(row)) {
    return (
      <Box display="flex" flexDirection="column" gap={0.5}>
        {vals.map((r, i) => (
          <Typography key={i} variant="body2" sx={{ fontSize: "0.75rem" }}>
            {typeof r === "object"
              ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
              : r}
          </Typography>
        ))}
      </Box>
    );
  } else if (OkAndNotOK(row)) {
    {
      return (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {vals.map((r, i) => {
            let valText;
            if (r == 1) valText = "OK";
            else if (r == 0) valText = "Not OK";
            else valText = "-";
            return (
              <Typography key={i} variant="body2" sx={{ fontSize: "0.75rem" }}>
                {`${i + 1}) ${valText}`}
              </Typography>
            );
          })}
        </Box>
      );
    }
  }
  return <Typography sx={{ fontSize: "0.75rem" }}>No Data</Typography>;
}
