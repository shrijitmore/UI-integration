// // import * as XLSX from "xlsx";
// // import dayjs from "dayjs";

// // // --- Formatters reused ---
// // function formatReadings(row, readingsPerRow = 10) {
// //   const vals = row.actualReadings || [];
// //   if (vals.length === 0) return "No Data";

// //   if (row.inspection_type === "Parameter") {
// //     const chunks = [];
// //     for (let i = 0; i < vals.length; i += readingsPerRow) {
// //       const slice = vals
// //         .slice(i, i + readingsPerRow)
// //         .map((val, j) => `${i + j + 1}) ${val}`);
// //       chunks.push(slice.join("    "));
// //     }
// //     return chunks.join(" ");
// //   }

// //   if (row.inspection_type === "Attribute") {
// //     if (row.recording_type === "Summarized") {
// //       return vals
// //         .map((r) =>
// //           typeof r === "object"
// //             ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
// //             : r
// //         )
// //         .join(" | ");
// //     } else {
// //       const chunks = [];
// //       for (let i = 0; i < vals.length; i += readingsPerRow) {
// //         const slice = vals.slice(i, i + readingsPerRow).map((r, j) => {
// //           let valText;
// //           if (r == 1) valText = "ok";
// //           else if (r == 0) valText = "not ok";
// //           else valText = "-";
// //           return `${i + j + 1}) ${valText}`;
// //         });
// //         chunks.push(slice.join("    "));
// //       }
// //       return chunks.join(" ");
// //     }
// //   }

// //   return "No Data";
// // }

// // function formatReadingAnalysis(row) {
// //   const accept = row.accept_count ?? 0;
// //   const reject = row.reject_count ?? 0;
// //   const total = accept + reject;
// //   if (accept === 0 && reject === 0) return "No Data";
// //   return `Accepted: ${accept}, Rejected: ${reject}, Total: ${total}`;
// // }

// // // ==================== EXCEL EXPORT ====================
// // export const downloadInspectionReportExcel = (data, headerData) => {
// //   // ===== Date =====
// //   let dateText = "-";
// //   if (
// //     headerData?.date_range === "custom" &&
// //     headerData?.start_date &&
// //     headerData?.end_date
// //   ) {
// //     dateText = `${dayjs(headerData.start_date).format(
// //       "DD/MM/YYYY HH:mm:ss"
// //     )} - ${dayjs(headerData.end_date).format("DD/MM/YYYY HH:mm:ss")}`;
// //   } else if (headerData?.date_range) {
// //     dateText = headerData.date_range
// //       .split("_")
// //       .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
// //       .join(" ");
// //   }

// //   // ===== Header lines =====
// //   const headerLines = [
// //     [`SECTION NAME: ${headerData?.building_name?.toUpperCase() || "-"}`],
// //     [`PO NUMBER: ${headerData?.order_number || "-"}`],
// //     [`ITEM CODE: ${headerData?.item_code || "-"}`],
// //     [`OPERATION NAME: ${headerData?.operation_name?.toUpperCase() || "-"}`],
// //     [`DATE: ${dateText?.toUpperCase?.() || "-"}`],
// //     [],
// //   ];

// //   // ===== Table header (center Sr) =====
// //   const tableHeader = [
// //     [
// //       "Sr No  ",
// //       "User Name",
// //       "Transaction Date",
// //       "Actual Readings",
// //       "Reading Analysis",
// //     ],
// //   ];

// //   // ===== Group by parameter =====
// //   const groupedData = {};
// //   data.forEach((row) => {
// //     const key = row.inspection_parameter_name || "Unknown Parameter";
// //     if (!groupedData[key]) groupedData[key] = [];
// //     groupedData[key].push(row);
// //   });

// //   const tableBody = [];

// //   Object.keys(groupedData).forEach((paramName, index) => {
// //     // --- Group title row ---
// //     tableBody.push([`${index + 1}. ${paramName}`]);

// //     // --- Header row under each group ---
// //     tableBody.push(tableHeader[0]);

// //     // --- Rows (Sr reset per group) ---
// //     groupedData[paramName].forEach((row, i) => {
// //       tableBody.push([
// //         String(i + 1), // Sr reset here
// //         row.user_name || "-",
// //         row.updated_at
// //           ? dayjs(row.updated_at).format("DD/MM/YYYY HH:mm:ss")
// //           : "-",
// //         formatReadings(row),
// //         formatReadingAnalysis(row),
// //       ]);
// //     });

// //     tableBody.push([]); // spacing between groups
// //   });

// //   // ===== Combine =====
// //   const worksheetData = [...headerLines, ...tableBody];

// //   const ws = XLSX.utils.aoa_to_sheet(worksheetData);
// //   // ===== Column widths =====
// //   ws["!cols"] = [
// //     { wch: 5 }, // Sr
// //     { wch: 20 }, // User Name
// //     { wch: 18 }, // Transaction Date
// //     { wch: 55 }, // Actual Readings
// //     { wch: 40 }, // Reading Analysis
// //   ];

// //   const wb = XLSX.utils.book_new();
// //   XLSX.utils.book_append_sheet(wb, ws, "Inspection Report");
// //   XLSX.writeFile(wb, `${headerData?.report_title || "inspection_report"}.xlsx`);
// // };

// import * as XLSX from "xlsx";
// import dayjs from "dayjs";

// // --- Formatters reused ---
// function formatReadings(row, readingsPerRow = 10) {
//   const vals = row.actualReadings || [];
//   if (vals.length === 0) return "No Data";

//   if (row.inspection_type === "Parameter") {
//     const chunks = [];
//     for (let i = 0; i < vals.length; i += readingsPerRow) {
//       const slice = vals
//         .slice(i, i + readingsPerRow)
//         .map((val, j) => `${i + j + 1}) ${val}`);
//       chunks.push(slice.join("    "));
//     }
//     return chunks.join(" ");
//   }

//   if (row.inspection_type === "Attribute") {
//     if (row.recording_type === "Summarized") {
//       return vals.map((r) =>
//         typeof r === "object"
//           ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
//           : r
//       );
//       // .join(" | ");
//     } else {
//       const chunks = [];
//       for (let i = 0; i < vals.length; i += readingsPerRow) {
//         const slice = vals.slice(i, i + readingsPerRow).map((r, j) => {
//           let valText;
//           if (r == 1) valText = "ok";
//           else if (r == 0) valText = "not ok";
//           else valText = "-";
//           return `${i + j + 1}) ${valText}`;
//         });
//         chunks.push(slice.join("    "));
//       }
//       return chunks.join(" ");
//     }
//   }

//   return "No Data";
// }

// function formatReadingAnalysis(row) {
//   const accept = row.accept_count ?? 0;
//   const reject = row.reject_count ?? 0;
//   const total = accept + reject;
//   if (accept == 0 && reject == 0) return "No Data";
//   return `Accepted: ${accept}, Rejected: ${reject}, Total: ${
//     row?.total_count ?? total
//   }`;
// }

// // ==================== EXCEL EXPORT ====================
// export const downloadInspectionReportExcel = (data, headerData, keyLable) => {
//   // ===== Date =====
//   let dateText = "-";
//   if (
//     headerData?.date_range === "custom" &&
//     headerData?.start_date &&
//     headerData?.end_date
//   ) {
//     dateText = `${dayjs(headerData.start_date).format("DD/MM/YYYY")} - ${dayjs(
//       headerData.end_date
//     ).format("DD/MM/YYYY")}`;
//   } else if (headerData?.date_range) {
//     dateText = headerData.date_range
//       .split("_")
//       .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//       .join(" ");
//   }

//   // ===== Header lines =====
//   const headerLines = [
//     [`SECTION NAME: ${headerData?.building_name?.toUpperCase() || "-"}`],
//     [`PO NUMBER: ${headerData?.order_number || "-"}`],
//     [`ITEM CODE: ${headerData?.item_code || "-"}`],
//     // [`OPERATION NAME: ${headerData?.operation_name?.toUpperCase() || "-"}`],
//     ...(keyLable == false
//       ? [[`OPERATION: ${headerData?.operation_name?.toUpperCase() || "-"}`]]
//       : []),
//     [`DATE: ${dateText?.toUpperCase?.() || "-"}`],
//     [],
//   ];

//   // ===== Table header (center Sr) =====
//   const tableHeader = [
//     [
//       "Sr No  ",
//       "User Name",
//       "Transaction Date",
//       "Actual Readings",
//       "Reading Analysis",
//     ],
//   ];

//   // ===== Group by parameter =====
//   const groupedData = {};
//   data.forEach((row) => {
//     const key = row.inspection_parameter_name || "Unknown Parameter";
//     if (!groupedData[key]) groupedData[key] = [];
//     groupedData[key].push(row);
//   });

//   const tableBody = [];

//   Object.keys(groupedData).forEach((paramName, index) => {
//     // --- Group title row ---
//     tableBody.push([`${index + 1}. ${paramName}`]);

//     // --- Header row under each group ---
//     tableBody.push(tableHeader[0]);

//     // --- Rows (Sr reset per group) ---
//     groupedData[paramName].forEach((row, i) => {
//       tableBody.push([
//         String(i + 1), // Sr reset here
//         row.user_name || "-",
//         row.updated_at ? dayjs(row.updated_at).format("DD/MM/YYYY") : "-",
//         formatReadings(row),
//         formatReadingAnalysis(row),
//       ]);
//     });

//     tableBody.push([]); // spacing between groups
//   });

//   // ===== Combine =====
//   const worksheetData = [...headerLines, ...tableBody];

//   const ws = XLSX.utils.aoa_to_sheet(worksheetData);
//   // ===== Column widths =====
//   ws["!cols"] = [
//     { wch: 5 }, // Sr
//     { wch: 20 }, // User Name
//     { wch: 18 }, // Transaction Date
//     { wch: 55 }, // Actual Readings
//     { wch: 40 }, // Reading Analysis
//   ];

//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Inspection Report");
//   XLSX.writeFile(wb, `${headerData?.report_title || "inspection_report"}.xlsx`);
// };
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  acceptAndReject,
  actualReading,
  OkAndNotOK,
} from "../RmInspection/config";
// --- Formatters reused ---
function formatReadings(row, readingsPerRow = 10) {
  console.log("formatReadings called with row:", row); // Debugging log
  const vals = row.actual_reading || [];
  if (vals.length === 0) return "No Data";
  if (actualReading(row)) {
    const chunks = [];
    for (let i = 0; i < vals.length; i += readingsPerRow) {
      const slice = vals
        .slice(i, i + readingsPerRow)
        .map((val, j) => `${i + j + 1}) ${val}`);
      chunks.push(slice.join("    "));
    }
    return chunks.join(" ");
  }
  // if (row.inspection_type === "Attribute") {
  if (acceptAndReject(row)) {
    return vals.map((r) =>
      typeof r === "object"
        ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
        : r
    );
    // .join(" | ");
  } else if (OkAndNotOK(row)) {
    const chunks = [];
    for (let i = 0; i < vals.length; i += readingsPerRow) {
      const slice = vals.slice(i, i + readingsPerRow).map((r, j) => {
        let valText;
        if (r == 1) valText = "ok";
        else if (r == 0) valText = "not ok";
        else valText = "-";
        return `${i + j + 1}) ${valText}`;
      });
      chunks.push(slice.join("    "));
    }
    return chunks.join(" ");
  }
  // }
  return "No Data";
}
function formatReadingAnalysis(row) {
  const accept = row.accept_count ?? 0;
  const reject = row.reject_count ?? 0;
  const total = accept + reject;
  if (accept == 0 && reject == 0) return "No Data";
  return `Accepted: ${accept}, Rejected: ${reject}, Total: ${
    row?.total_count ?? total
  }`;
}
// ==================== EXCEL EXPORT ====================
export const downloadInspectionReportExcel = (data, headerData, keyLable) => {
  // ===== Date =====
  let dateText = "-";
  if (
    headerData?.date_range === "custom" &&
    headerData?.start_date &&
    headerData?.end_date
  ) {
    dateText = `${dayjs(headerData.start_date).format("DD/MM/YYYY")} - ${dayjs(
      headerData.end_date
    ).format("DD/MM/YYYY")}`;
  } else if (headerData?.date_range) {
    dateText = headerData.date_range
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  // ===== Header lines =====
  const headerLines = [
    [`SECTION NAME: ${headerData?.building_name?.toUpperCase() || "-"}`],
    // [`PO NUMBER: ${headerData?.order_number || "-"}`],
    keyLable == false
      ? [`PO NUMBER: ${headerData?.order_number || "-"}`]
      : [`IO NUMBER: ${headerData?.io_number || "-"}`],
    [`ITEM CODE: ${headerData?.item_code || "-"}`],
    // [`OPERATION NAME: ${headerData?.operation_name?.toUpperCase() || "-"}`],
    ...(keyLable == false
      ? [[`OPERATION: ${headerData?.operation_name?.toUpperCase() || "-"}`]]
      : []),
    [`DATE: ${dateText?.toUpperCase?.() || "-"}`],
    [],
  ];
  // ===== Table header (center Sr) =====
  const tableHeader = [
    [
      "Sr No  ",
      "User Name",
      "Transaction Date",
      "Actual Readings",
      "Reading Analysis",
    ],
  ];
  // ===== Group by parameter =====
  const groupedData = {};
  data.forEach((row) => {
    const key = row.inspection_parameter_name || "Unknown Parameter";
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(row);
  });
  const tableBody = [];
  Object.keys(groupedData).forEach((paramName, index) => {
    // --- Group title row ---
    tableBody.push([`${index + 1}. ${paramName}`]);
    // --- Header row under each group ---
    tableBody.push(tableHeader[0]);
    // --- Rows (Sr reset per group) ---
    groupedData[paramName].forEach((row, i) => {
      tableBody.push([
        String(i + 1), // Sr reset here
        row.user_name || "-",
        row.updated_at ? dayjs(row.updated_at).format("DD/MM/YYYY") : "-",
        formatReadings(row),
        formatReadingAnalysis(row),
      ]);
    });
    tableBody.push([]); // spacing between groups
  });
  // ===== Combine =====
  const worksheetData = [...headerLines, ...tableBody];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  // ===== Column widths =====
  ws["!cols"] = [
    { wch: 5 }, // Sr
    { wch: 20 }, // User Name
    { wch: 18 }, // Transaction Date
    { wch: 55 }, // Actual Readings
    { wch: 40 }, // Reading Analysis
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inspection Report");
  XLSX.writeFile(wb, `${headerData?.report_title || "inspection_report"}.xlsx`);
};
