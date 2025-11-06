// // // import dayjs from "dayjs";
// // // import jsPDF from "jspdf";
// // // import autoTable from "jspdf-autotable";
// // // function formatString(str) {
// // //   return str
// // //     .split("_")
// // //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// // //     .join(" ");
// // // }
// // // export const downloadInspectionReport = (data, headerData) => {
// // //   const doc = new jsPDF("l", "mm", "a4");
// // //   doc.setFontSize(10);
// // //   doc.text(headerData?.report_title || "Inspection Report", 14, 15);
// // //   let currentY = 22;
// // //   doc.setFontSize(8);
// // //   const pageWidth = doc.internal.pageSize.getWidth();
// // //   const margin = 8;
// // //   const usableWidth = pageWidth - margin * 2;
// // //   const cols = 5;
// // //   const colWidth = usableWidth / cols;
// // //   let dateText = "-";
// // //   if (headerData?.date_range !== "custom")
// // //     dateText = formatString(headerData?.date_range);
// // //   if (
// // //     headerData?.date_range == "custom" &&
// // //     headerData?.start_date &&
// // //     headerData?.end_date
// // //   ) {
// // //     dateText = `${dayjs(headerData.start_date).format("DD/MM/YYYY")} - ${dayjs(
// // //       headerData.end_date
// // //     ).format("DD/MM/YYYY")}`;
// // //   }
// // //   const headers = [
// // //     `SECTION NAME: ${headerData?.building_name?.toUpperCase() || "-"}`,
// // //     `PO NUMBER: ${headerData?.order_number || "-"}`,
// // //     `ITEM CODE: ${headerData?.item_code || "-"}`,
// // //     `OPERATION NAME: ${headerData?.operation_name?.toUpperCase() || "-"}`,
// // //     `DATE: ${
// // //       headerData?.date_range !== "custom" ? dateText?.toUpperCase() : dateText
// // //     }`,
// // //   ];
// // //   let maxHeight = 0;
// // //   headers.forEach((text, i) => {
// // //     const x = margin + i * colWidth + colWidth / 2;
// // //     const lines = doc.splitTextToSize(text, colWidth - 2);
// // //     doc.text(lines, x, currentY, { align: "center" });
// // //     const lineHeight = 2;
// // //     const textHeight = lines.length * lineHeight;
// // //     if (textHeight > maxHeight) maxHeight = textHeight;
// // //   });
// // //   currentY += maxHeight + 1;
// // //   doc.line(margin, currentY, pageWidth - margin, currentY);
// // //   const head = [
// // //     [
// // //       "Sr",
// // //       "User Name",
// // //       "Created Date",
// // //       "Updated Date",
// // //       "Inspection Parameter Name",
// // //       "Actual Readings",
// // //     ],
// // //   ];
// // //   const readingsPerRow = 10;
// // //   const body = data.map((row, index) => {
// // //     let readings = "No Data";
// // //     if (row.inspection_type === "Parameter") {
// // //       const vals = row.actualReadings || [];
// // //       const chunks = [];
// // //       for (let i = 0; i < vals.length; i += readingsPerRow) {
// // //         const slice = vals
// // //           .slice(i, i + readingsPerRow)
// // //           .map((val, j) => `${i + j + 1}) ${val}`);
// // //         chunks.push(slice.join("    "));
// // //       }
// // //       readings = chunks.join("\n");
// // //     } else if (
// // //       row.inspection_type === "Attribute" &&
// // //       row.recording_type !== "Summarized"
// // //     ) {
// // //       const vals = row.actualReadings || [];
// // //       const chunks = [];
// // //       for (let i = 0; i < vals.length; i += readingsPerRow) {
// // //         const slice = vals.slice(i, i + readingsPerRow).map((r, j) => {
// // //           let valText;
// // //           if (r == 1) valText = "ok";
// // //           else if (r == 0) valText = "not ok";
// // //           else valText = "-";
// // //           return `${i + j + 1}) ${valText}`;
// // //         });
// // //         chunks.push(slice.join("    "));
// // //       }
// // //       readings = chunks.join("\n");
// // //     } else if (
// // //       row.inspection_type === "Attribute" &&
// // //       row.recording_type === "Summarized"
// // //     ) {
// // //       readings = (row.actualReadings || []).map((r) =>
// // //         typeof r === "object"
// // //           ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
// // //           : r
// // //       );
// // //       // .join(" | ");
// // //     }
// // //     return [
// // //       index + 1,
// // //       row.user_name,
// // //       new Date(row.created_at).toLocaleDateString(),
// // //       new Date(row.updated_at).toLocaleDateString(),
// // //       row.inspection_parameter_name,
// // //       readings || "No Data",
// // //     ];
// // //   });

// // //   autoTable(doc, {
// // //     startY: currentY + 8,
// // //     head,
// // //     body,
// // //     styles: {
// // //       fontSize: 9,
// // //       cellPadding: 3,
// // //       valign: "middle",
// // //       overflow: "linebreak",
// // //       lineColor: [200, 200, 200],
// // //       lineWidth: 0.1,
// // //     },
// // //     headStyles: {
// // //       fillColor: [240, 240, 240],
// // //       textColor: 20,
// // //       fontStyle: "bold",
// // //       halign: "center",
// // //     },
// // //     columnStyles: {
// // //       0: { halign: "center", cellWidth: 10 },
// // //       1: { cellWidth: 35 },
// // //       2: { halign: "center", cellWidth: 25 },
// // //       3: { halign: "center", cellWidth: 25 },
// // //       4: { cellWidth: 80 },
// // //       5: { cellWidth: 100 },
// // //     },
// // //     bodyStyles: {
// // //       valign: "top",
// // //     },
// // //   });
// // //   doc.save(headerData?.report_title || "inspection_report.pdf");
// // // };
// // // import dayjs from "dayjs";
// // // import jsPDF from "jspdf";
// // // import autoTable from "jspdf-autotable";

// // // function formatString(str) {
// // //   return str
// // //     .split("_")
// // //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// // //     .join(" ");
// // // }

// // // export const downloadInspectionReport = (data, headerData) => {
// // //   const doc = new jsPDF("l", "mm", "a4");

// // //   // Destructure headerData for cleaner access
// // //   const {
// // //     report_title,
// // //     building_name,
// // //     order_number,
// // //     item_code,
// // //     operation_name,
// // //     date_range,
// // //     start_date,
// // //     end_date,
// // //   } = headerData;

// // //   // --- Report Title and Header Section ---
// // //   doc.setFontSize(10);
// // //   doc.text(report_title ?? "Inspection Report", 14, 15);

// // //   let currentY = 22;
// // //   doc.setFontSize(8);

// // //   const pageWidth = doc.internal.pageSize.getWidth();
// // //   const margin = 8;
// // //   const usableWidth = pageWidth - margin * 2;
// // //   const cols = 5;
// // //   const colWidth = usableWidth / cols;

// // //   let dateText = "-";
// // //   if (date_range === "custom" && start_date && end_date) {
// // //     dateText = `${dayjs(start_date).format("DD/MM/YYYY")} - ${dayjs(
// // //       end_date
// // //     ).format("DD/MM/YYYY")}`;
// // //   } else {
// // //     dateText = formatString(date_range ?? "N/A");
// // //   }

// // //   const headerItems = [
// // //     `SECTION NAME: ${building_name?.toUpperCase() ?? "-"}`,
// // //     `PO NUMBER: ${order_number ?? "-"}`,
// // //     `ITEM CODE: ${item_code ?? "-"}`,
// // //     `OPERATION NAME: ${operation_name?.toUpperCase() ?? "-"}`,
// // //     `DATE: ${date_range === "custom" ? dateText : dateText?.toUpperCase()}`,
// // //   ];

// // //   let maxHeaderHeight = 0;
// // //   headerItems.forEach((text, i) => {
// // //     const x = margin + i * colWidth + colWidth / 2;
// // //     // `splitTextToSize` returns an array of lines
// // //     const lines = doc.splitTextToSize(text, colWidth - 2);
// // //     doc.text(lines, x, currentY, { align: "center" });

// // //     const lineHeight = doc.getLineHeight(); // Use a dynamic line height for better accuracy
// // //     const textHeight = lines.length * lineHeight;
// // //     if (textHeight > maxHeaderHeight) {
// // //       maxHeaderHeight = textHeight;
// // //     }
// // //   });

// // //   currentY += maxHeaderHeight + 1;
// // //   doc.line(margin, currentY, pageWidth - margin, currentY);

// // //   // --- Table Data Preparation ---
// // //   const head = [
// // //     [
// // //       "Sr",
// // //       "User Name",
// // //       "Created Date",
// // //       "Updated Date",
// // //       "Inspection Parameter Name",
// // //       "Actual Readings",
// // //     ],
// // //   ];

// // //   const readingsPerRow = 10;
// // //   const body = data.map((row, index) => {
// // //     let readings = "No Data";
// // //     const actualReadings = row.actualReadings ?? [];

// // //     switch (row.inspection_type) {
// // //       case "Parameter": {
// // //         const chunks = [];
// // //         for (let i = 0; i < actualReadings.length; i += readingsPerRow) {
// // //           const slice = actualReadings
// // //             .slice(i, i + readingsPerRow)
// // //             .map((val, j) => `${i + j + 1}) ${val}`);
// // //           chunks.push(slice.join("    "));
// // //         }
// // //         readings = chunks.join("\n");
// // //         break;
// // //       }
// // //       case "Attribute": {
// // //         if (row.recording_type === "Summarized") {
// // //           readings = actualReadings
// // //             .map((r) =>
// // //               typeof r === "object"
// // //                 ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
// // //                 : r
// // //             )
// // //             .join(" | ");
// // //         } else {
// // //           const chunks = [];
// // //           for (let i = 0; i < actualReadings.length; i += readingsPerRow) {
// // //             const slice = actualReadings
// // //               .slice(i, i + readingsPerRow)
// // //               .map((r, j) => {
// // //                 let valText;
// // //                 if (r == 1) valText = "ok";
// // //                 else if (r == 0) valText = "not ok";
// // //                 else valText = "-";
// // //                 return `${i + j + 1}) ${valText}`;
// // //               });
// // //             chunks.push(slice.join("    "));
// // //           }
// // //           readings = chunks.join("\n");
// // //         }
// // //         break;
// // //       }
// // //       default:
// // //         readings = "No Data";
// // //     }

// // //     // Format dates to be more readable
// // //     const createdAt = row.created_at
// // //       ? dayjs(row.created_at).format("DD/MM/YYYY")
// // //       : "-";
// // //     const updatedAt = row.updated_at
// // //       ? dayjs(row.updated_at).format("DD/MM/YYYY")
// // //       : "-";

// // //     return [
// // //       index + 1,
// // //       row.user_name ?? "-",
// // //       createdAt,
// // //       updatedAt,
// // //       row.inspection_parameter_name ?? "-",
// // //       readings,
// // //     ];
// // //   });

// // //   // --- Table Generation with autoTable ---
// // //   autoTable(doc, {
// // //     startY: currentY + 8,
// // //     head,
// // //     body,
// // //     styles: {
// // //       fontSize: 9,
// // //       cellPadding: 3,
// // //       valign: "middle",
// // //       overflow: "linebreak",
// // //       lineColor: [200, 200, 200],
// // //       lineWidth: 0.1,
// // //     },
// // //     headStyles: {
// // //       fillColor: [240, 240, 240],
// // //       textColor: 20,
// // //       fontStyle: "bold",
// // //       halign: "center",
// // //     },
// // //     columnStyles: {
// // //       0: { halign: "center", cellWidth: 10 },
// // //       1: { cellWidth: 35 },
// // //       2: { halign: "center", cellWidth: 25 },
// // //       3: { halign: "center", cellWidth: 25 },
// // //       4: { cellWidth: 80 },
// // //       5: { cellWidth: 100 },
// // //     },
// // //     bodyStyles: {
// // //       valign: "top",
// // //     },
// // //   });

// // //   doc.save(report_title ?? "inspection_report.pdf");
// // // };

// // import dayjs from "dayjs";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";

// // // Capitalize and format strings
// // function formatString(str) {
// //   return str
// //     .split("_")
// //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
// //     .join(" ");
// // }

// // // Format actual readings based on inspection type
// // function formatReadings(row, readingsPerRow = 10) {
// //   const vals = row.actualReadings || [];
// //   if (vals.length === 0) return "No Data";

// //   if (row.inspection_type === "Parameter") {
// //     // Parameter type readings
// //     const chunks = [];
// //     for (let i = 0; i < vals.length; i += readingsPerRow) {
// //       const slice = vals
// //         .slice(i, i + readingsPerRow)
// //         .map((val, j) => `${i + j + 1}) ${val}`);
// //       chunks.push(slice.join("    "));
// //     }
// //     return chunks.join("\n");
// //   }

// //   if (row.inspection_type === "Attribute") {
// //     if (row.recording_type === "Summarized") {
// //       return vals.map((r) =>
// //         typeof r === "object"
// //           ? `Accepted: ${r.accepted}, Rejected: ${r.rejected}`
// //           : r
// //       );
// //       // .join(" | ");
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
// //       return chunks.join("\n");
// //     }
// //   }

// //   return "No Data";
// // }
// // function formatReadingAnalysis(row, doc, maxWidth = 60) {
// //   const accept = row.accept_count ?? 0;
// //   const reject = row.reject_count ?? 0;
// //   const total = accept + reject;

// //   if (accept === 0 && reject === 0) {
// //     return "No Data";
// //   }

// //   const text = `Accepted: ${accept}\n  Rejected: ${reject}\n Total: ${total}`;
// //   return doc.splitTextToSize(text, maxWidth);
// // }
// // export const downloadInspectionReport = (data, headerData) => {
// //   const doc = new jsPDF("l", "mm", "a4");
// //   const pageWidth = doc.internal.pageSize.getWidth();
// //   const margin = 8;
// //   const usableWidth = pageWidth - margin * 2;
// //   doc.setFontSize(10);
// //   doc.text(headerData?.report_title || "Inspection Report", margin, 15);
// //   doc.setFontSize(8);
// //   let currentY = 22;
// //   let dateText = "-";
// //   if (headerData?.date_range !== "custom")
// //     dateText = formatString(headerData?.date_range);
// //   if (
// //     headerData?.date_range === "custom" &&
// //     headerData?.start_date &&
// //     headerData?.end_date
// //   ) {
// //     dateText = `${dayjs(headerData.start_date).format("DD/MM/YYYY")} - ${dayjs(
// //       headerData.end_date
// //     ).format("DD/MM/YYYY")}`;
// //   }
// //   const headers = [
// //     `SECTION NAME: ${headerData?.building_name?.toUpperCase() || "-"}`,
// //     `PO NUMBER: ${headerData?.order_number || "-"}`,
// //     `ITEM CODE: ${headerData?.item_code || "-"}`,
// //     `OPERATION NAME: ${headerData?.operation_name?.toUpperCase() || "-"}`,
// //     `DATE: ${
// //       headerData?.date_range !== "custom" ? dateText?.toUpperCase() : dateText
// //     }`,
// //   ];
// //   const maxColsPerRow = 5;
// //   const headerRows = [];
// //   for (let i = 0; i < headers.length; i += maxColsPerRow) {
// //     headerRows.push(headers.slice(i, i + maxColsPerRow));
// //   }
// //   const lineHeight = 2;
// //   headerRows.forEach((row) => {
// //     let maxHeight = 0;
// //     row.forEach((text, i) => {
// //       const colWidth = usableWidth / row.length;
// //       const x = margin + i * colWidth + colWidth / 2;
// //       const lines = doc.splitTextToSize(text, colWidth - 2);
// //       doc.text(lines, x, currentY, { align: "center" });
// //       maxHeight = Math.max(maxHeight, lines.length * lineHeight);
// //     });
// //     currentY += maxHeight + 2;
// //   });
// //   doc.line(margin, currentY, pageWidth - margin, currentY);
// //   const head = [
// //     [
// //       "Sr",
// //       "User Name",
// //       //   "Created Date",
// //       "Transaction Date",
// //       "Inspection Parameter Name",
// //       "Actual Readings",
// //       "Reading Analysis ",
// //     ],
// //   ];
// //   const body = data.map((row, index) => [
// //     index + 1,
// //     row.user_name,
// //     // new Date(row.created_at).toLocaleDateString(),
// //     new Date(row.updated_at).toLocaleDateString(),
// //     row.inspection_parameter_name,
// //     formatReadings(row),
// //     formatReadingAnalysis(row, doc, 60),
// //   ]);

// //   const totalFlex = 10 + 30 + 25 + 25 + 60 + 80 + 50; // = 280
// //   const scale = usableWidth / totalFlex;

// //   autoTable(doc, {
// //     startY: currentY + 8,
// //     head,
// //     body,
// //     styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
// //     // headStyles: { fillColor: [240, 240, 240], halign: "center" },
// //     headStyles: {
// //       fillColor: [240, 240, 240],
// //       textColor: 20,
// //       fontStyle: "bold",
// //       halign: "center",
// //     },
// //     columnStyles: {
// //       0: { halign: "center", cellWidth: 10 * scale },
// //       1: { cellWidth: 30 * scale },
// //       2: { halign: "center", cellWidth: 25 * scale },
// //       3: { halign: "center", cellWidth: 25 * scale },
// //       4: { cellWidth: 60 * scale },
// //       5: { cellWidth: 80 * scale },
// //       6: { cellWidth: 50 * scale },
// //     },
// //   });
// //   doc.save(headerData?.report_title || "inspection_report.pdf");
// // };

// import dayjs from "dayjs";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// function formatString(str) {
//   return str
//     .split("_")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }

// // Format actual readings
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
//     return chunks.join("\n");
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
//       return chunks.join("\n");
//     }
//   }

//   return "No Data";
// }

// function formatReadingAnalysis(row, doc, maxWidth = 60) {
//   const accept = row.accept_count ?? 0;
//   const reject = row.reject_count ?? 0;
//   const total = accept + reject;
//   if (accept == 0 && reject == 0) return "No Data";
//   const text = `Accepted: ${accept}\nRejected: ${reject}\nTotal: ${
//     row?.total_count ?? total
//   }`;
//   return doc.splitTextToSize(text, maxWidth);
// }

// export const downloadInspectionReport = (data, headerData, keyLable) => {
//   const doc = new jsPDF("l", "mm", "a4");
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const margin = 8;
//   const usableWidth = pageWidth - margin * 2;

//   // --- Report Title ---
//   doc.setFontSize(14);
//   doc.setFont(undefined, "bold");
//   doc.text(headerData?.report_title || "Inspection Report", pageWidth / 2, 15, {
//     align: "center",
//   });
//   doc.setFont(undefined, "normal");

//   doc.setFontSize(9);
//   let currentY = 22;

//   // --- Date handling ---
//   let dateText = "-";
//   if (
//     headerData?.date_range === "custom" &&
//     headerData?.start_date &&
//     headerData?.end_date
//   ) {
//     dateText = `${dayjs(headerData.start_date).format("DD/MM/YYYY")} - ${dayjs(
//       headerData.end_date
//     ).format("DD/MM/YYYY")}`;
//   } else {
//     dateText = formatString(headerData?.date_range ?? "N/A");
//   }

//   // --- Header info (2 rows, full-width) ---
//   const headerGroups = [
//     [
//       `SECTION: ${headerData?.building_name?.toUpperCase() || "-"}`,
//       `PO NUMBER: ${headerData?.order_number || "-"}`,
//       `ITEM CODE: ${headerData?.item_code || "-"}`,
//       // `OPERATION: ${headerData?.operation_name?.toUpperCase() || "-"}`,
//       ...(keyLable == false
//         ? [`OPERATION: ${headerData?.operation_name?.toUpperCase() || "-"}`]
//         : []),
//       `DATE: ${dateText}`,
//     ],
//   ];

//   headerGroups.forEach((row) => {
//     const colWidth = usableWidth / row.length;
//     let maxHeight = 0;
//     row.forEach((text, i) => {
//       const lines = doc.splitTextToSize(text, colWidth - 4);
//       const x = margin + i * colWidth + colWidth / 2;
//       doc.text(lines, x, currentY, { align: "center" });
//       maxHeight = Math.max(maxHeight, lines.length * 4);
//     });
//     currentY += maxHeight + 3;
//   });

//   // Divider line
//   doc.setDrawColor(150);
//   doc.line(margin, currentY, pageWidth - margin, currentY);

//   // --- Group data by parameter ---
//   const groupedData = {};
//   data.forEach((row) => {
//     const key = row.inspection_parameter_name || "Unknown Parameter";
//     if (!groupedData[key]) groupedData[key] = [];
//     groupedData[key].push(row);
//   });

//   let srCounter = 1;
//   let paramIndex = 1;
//   Object.keys(groupedData).forEach((paramName) => {
//     const rows = groupedData[paramName];
//     currentY += 6;
//     doc.setFillColor(210, 225, 245);
//     doc.rect(margin, currentY - 4, usableWidth, 6, "F");
//     doc.setFontSize(8);
//     doc.setFont(undefined, "bold");
//     doc.text(`${paramIndex}. Parameter: ${paramName}`, margin + 2, currentY);
//     doc.setFont(undefined, "normal");
//     currentY += 2;
//     paramIndex++;
//     // --- Table ---
//     const head = [
//       [
//         "Sr",
//         "User Name",
//         "Transaction Date",
//         "Actual Readings",
//         "Reading Analysis",
//       ],
//     ];

//     const body = rows.map((row) => [
//       srCounter++,
//       row.user_name ?? "-",
//       row.updated_at ? row.updated_at : "-",
//       formatReadings(row),
//       formatReadingAnalysis(row, doc, 60),
//     ]);

//     autoTable(doc, {
//       startY: currentY + 3,
//       head,
//       body,
//       styles: {
//         fontSize: 8,
//         cellPadding: { top: 1, right: 2, bottom: 1, left: 2 },
//         overflow: "linebreak",
//         valign: "middle",
//       },
//       headStyles: {
//         fillColor: [220, 220, 220],
//         textColor: 20,
//         fontStyle: "bold",
//         halign: "center",
//         lineWidth: 0.2,
//         lineColor: [150, 150, 150],
//       },
//       bodyStyles: {
//         lineWidth: 0.1,
//         lineColor: [200, 200, 200],
//       },
//       margin: { left: margin, right: margin },
//       tableWidth: usableWidth,
//       columnStyles: {
//         0: { halign: "center", cellWidth: 0.05 * usableWidth }, // 5%
//         1: { cellWidth: 0.2 * usableWidth }, // 20%
//         2: { halign: "center", cellWidth: 0.15 * usableWidth }, // 15%
//         3: { cellWidth: 0.35 * usableWidth }, // 35%
//         4: { cellWidth: 0.25 * usableWidth }, // 25%
//       },
//       didDrawPage: (data) => {
//         currentY = data.cursor.y;
//       },
//     });
//   });

//   doc.save(headerData?.report_title || "inspection_report.pdf");
// };
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  acceptAndReject,
  actualReading,
  OkAndNotOK,
} from "../RmInspection/config";
function formatString(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
// Format actual readings
function formatReadings(row, readingsPerRow = 10) {
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
    return chunks.join("\n");
  }
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
    return chunks.join("\n");
  }
  return "No Data";
}
function formatReadingAnalysis(row, doc, maxWidth = 60) {
  const accept = row.accept_count ?? 0;
  const reject = row.reject_count ?? 0;
  const total = accept + reject;
  if (accept == 0 && reject == 0) return "No Data";
  const text = `Accepted: ${accept}\nRejected: ${reject}\nTotal: ${
    row?.total_count ?? total
  }`;
  return doc.splitTextToSize(text, maxWidth);
}
export const downloadInspectionReport = (data, headerData, keyLable) => {
  const doc = new jsPDF("l", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 8;
  const usableWidth = pageWidth - margin * 2;
  // --- Report Title ---
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(headerData?.report_title || "Inspection Report", pageWidth / 2, 15, {
    align: "center",
  });
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  let currentY = 22;
  // --- Date handling ---
  let dateText = "-";
  if (
    headerData?.date_range === "custom" &&
    headerData?.start_date &&
    headerData?.end_date
  ) {
    dateText = `${dayjs(headerData.start_date).format("DD/MM/YYYY")} - ${dayjs(
      headerData.end_date
    ).format("DD/MM/YYYY")}`;
  } else {
    dateText = formatString(headerData?.date_range ?? "N/A");
  }
  // --- Header info (2 rows, full-width) ---
  const headerGroups = [
    [
      `SECTION: ${headerData?.building_name?.toUpperCase() || "-"}`,
      // `PO NUMBER: ${headerData?.order_number || "-"}`,
      keyLable == false
        ? `PO NUMBER: ${headerData?.order_number || "-"}`
        : `IO NUMBER: ${headerData?.io_number || "-"}`,
      `ITEM CODE: ${headerData?.item_code || "-"}`,
      // `OPERATION: ${headerData?.operation_name?.toUpperCase() || "-"}`,
      ...(keyLable == false
        ? [`OPERATION: ${headerData?.operation_name?.toUpperCase() || "-"}`]
        : []),
      `DATE: ${dateText}`,
    ],
  ];
  headerGroups.forEach((row) => {
    const colWidth = usableWidth / row.length;
    let maxHeight = 0;
    row.forEach((text, i) => {
      const lines = doc.splitTextToSize(text, colWidth - 4);
      const x = margin + i * colWidth + colWidth / 2;
      doc.text(lines, x, currentY, { align: "center" });
      maxHeight = Math.max(maxHeight, lines.length * 4);
    });
    currentY += maxHeight + 3;
  });
  // Divider line
  doc.setDrawColor(150);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  // --- Group data by parameter ---
  const groupedData = {};
  data.forEach((row) => {
    const key = row.inspection_parameter_name || "Unknown Parameter";
    if (!groupedData[key]) groupedData[key] = [];
    groupedData[key].push(row);
  });
  let srCounter = 1;
  let paramIndex = 1;
  Object.keys(groupedData).forEach((paramName) => {
    const rows = groupedData[paramName];
    currentY += 6;
    doc.setFillColor(210, 225, 245);
    doc.rect(margin, currentY - 4, usableWidth, 6, "F");
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text(`${paramIndex}. Parameter: ${paramName}`, margin + 2, currentY);
    doc.setFont(undefined, "normal");
    currentY += 2;
    paramIndex++;
    // --- Table ---
    const head = [
      [
        "Sr",
        "User Name",
        "Transaction Date",
        "Actual Readings",
        "Reading Analysis",
      ],
    ];
    const body = rows.map((row) => [
      srCounter++,
      row.user_name ?? "-",
      row.updated_at ? row.updated_at : "-",
      formatReadings(row),
      formatReadingAnalysis(row, doc, 60),
    ]);
    autoTable(doc, {
      startY: currentY + 3,
      head,
      body,
      styles: {
        fontSize: 8,
        cellPadding: { top: 1, right: 2, bottom: 1, left: 2 },
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 20,
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.2,
        lineColor: [150, 150, 150],
      },
      bodyStyles: {
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },
      margin: { left: margin, right: margin },
      tableWidth: usableWidth,
      columnStyles: {
        0: { halign: "center", cellWidth: 0.05 * usableWidth }, // 5%
        1: { cellWidth: 0.2 * usableWidth }, // 20%
        2: { halign: "center", cellWidth: 0.15 * usableWidth }, // 15%
        3: { cellWidth: 0.35 * usableWidth }, // 35%
        4: { cellWidth: 0.25 * usableWidth }, // 25%
      },
      didDrawPage: (data) => {
        currentY = data.cursor.y;
      },
    });
  });
  doc.save(headerData?.report_title || "inspection_report.pdf");
};
