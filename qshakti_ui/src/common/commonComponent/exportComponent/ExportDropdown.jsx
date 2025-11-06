// import React, { useEffect, useState } from "react";
// import { Button, Menu, MenuItem, Box, Typography } from "@mui/material";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import DownloadIcon from "@mui/icons-material/Download";
// import { Stack } from "@mui/system";
// import DescriptionIcon from "@mui/icons-material/Description";
// import { Tooltip } from "@mui/material";
// import { filterDataByKeys, FormatDataAndHeaders } from "./FormatDataAndHeaders";
// import { showToast } from "../../ShowToast";
// // import { fetchDataByUrl } from "../../../store/slices/admin/openBidSlice";
// import { useDispatch } from "react-redux";
// import { fetchDataByUrl } from "../../../store/slices/admin/userManagementSlice";
// const ExportDropdown = ({
//   // rawData =[],
//   fileName = "Export",
//   FilterHeaderKey = [],
//   fetchUrl = "",
//   data: passedData = [], // if data is passed directly
// }) => {
//   console.log(fetchUrl, "fetchUrl");
//   console.log(passedData, "passedData");
//   const [rawData, setRawData] = useState([]);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const getData = async () => {
//       if (fetchUrl) {
//         const data = await dispatch(fetchDataByUrl({ url: fetchUrl })).unwrap();
//         let result = (await data?.data) || [];
//         setRawData(result);
//       }
//     };
//     if (fetchUrl) {
//       getData();
//     }
//   }, [fetchUrl]);
//   let rawDataFilter = filterDataByKeys(rawData, FilterHeaderKey);
//   const { data, headers } = FormatDataAndHeaders(rawDataFilter);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);
//   const getFormattedData = () => {
//     return data.map((row) => {
//       const formatted = {};
//       Object.entries(headers).forEach(([key, label]) => {
//         formatted[label] = row[key];
//       });
//       return formatted;
//     });
//   };

//   const exportToPDF = () => {
//     if (data.length > 0) {
//       const doc = new jsPDF({ orientation: "landscape" });
//       const rows = getFormattedData();
//       const head = [Object.values(headers)];
//       const body = rows.map((item) => Object.values(item));
//       autoTable(doc, {
//         head,
//         body,
//         startY: 20,
//         styles: {
//           fontSize: 9,
//           cellPadding: 3,
//         },
//         headStyles: {
//           fillColor: [92, 45, 145],
//           textColor: "#ffffff",
//           fontSize: 10,
//           halign: "center",
//         },
//         theme: "grid",
//         margin: { top: 10, left: 10, right: 10 },
//       });

//       doc.save(`${fileName}.pdf`);
//     } else {
//       showToast("Data Not Avaliable", "error");
//     }
//   };
//   const exportToExcel = () => {
//     if (data.length > 0) {
//       const rows = getFormattedData();
//       const worksheet = XLSX.utils.json_to_sheet(rows);
//       const maxColumnWidths = Object.keys(headers).map((key) => {
//         const max = Math.max(
//           headers[key]?.length || 10,
//           ...rows.map((r) => (r[headers[key]] || "").toString().length)
//         );
//         return { wch: max + 2 };
//       });
//       worksheet["!cols"] = maxColumnWidths;
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const blob = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       saveAs(blob, `${fileName}.xlsx`);
//     } else {
//       showToast("Data Not Avaliable", "error");
//     }
//   };

//   return (
//     <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
//       <Tooltip title={`Download ${fileName}.pdf`} arrow>
//         <Button
//           variant="outlined"
//           onClick={exportToPDF}
//           sx={{
//             px: 1,
//             py: 1,
//             borderColor: "#D32F2F",
//             color: "#D32F2F",
//             "&:hover": {
//               borderColor: "#B71C1C",
//               backgroundColor: "#fceaea",
//             },
//           }}
//         >
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <DownloadIcon sx={{ fontSize: 16 }} />
//             <PictureAsPdfIcon sx={{ color: "#D32F2F", fontSize: 16 }} />
//           </Stack>
//         </Button>
//       </Tooltip>
//       <Tooltip title={`Download ${fileName}.pdf`} arrow>
//         <Button
//           variant="outlined"
//           onClick={exportToExcel}
//           sx={{
//             px: 1,
//             py: 1,
//             borderColor: "#2E7D32",
//             color: "#2E7D32",
//             "&:hover": {
//               borderColor: "#1B5E20",
//               backgroundColor: "#e9f5ec",
//             },
//           }}
//         >
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <DownloadIcon sx={{ fontSize: 16 }} />
//             <DescriptionIcon sx={{ color: "#2E7D32", fontSize: 16 }} />
//           </Stack>
//         </Button>
//       </Tooltip>
//     </Box>
//   );
// };

// export default ExportDropdown;

import React, { useEffect, useState } from "react";
import { Button, Box, Stack, Tooltip } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch } from "react-redux";
import { fetchDataByUrl } from "../../../store/slices/admin/userManagementSlice";
import { filterDataByKeys, FormatDataAndHeaders } from "./FormatDataAndHeaders";
import { showToast } from "../../ShowToast";

const ExportDropdown = ({
  fileName = "Export",
  FilterHeaderKey = [],
  fetchUrl = "",
  data: passedData = [],
}) => {
  const [rawData, setRawData] = useState([]);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false);

  // useEffect(() => {
  //   const getData = async () => {
  //     if (fetchUrl) {
  //       const data = await dispatch(fetchDataByUrl({ url: fetchUrl })).unwrap();
  //       const result = data?.data || [];
  //       setRawData(result);
  //     }
  //   };

  //   // Only fetch if no passedData
  //   if (!passedData.length && fetchUrl) {
  //     getData();
  //   } else if (passedData.length) {
  //     setRawData(passedData);
  //   }
  // }, [fetchUrl,passedData, dispatch]);
  useEffect(() => {
    const getData = async () => {
      if (fetchUrl) {
        const data = await dispatch(fetchDataByUrl({ url: fetchUrl })).unwrap();
        const result = data?.data || [];
        setRawData(result);
      }
    };

    if (!passedData?.length && fetchUrl) {
      getData();
    } else if (passedData?.length) {
      setRawData(passedData);
    }
  }, [fetchUrl, passedData?.length, dispatch]); // only cares if length changes

  // useEffect(() => {
  //   if (passedData && passedData.length > 0) {
  //     setRawData(passedData);
  //   } else if (fetchUrl && !fetched) {
  //     const getData = async () => {
  //       const data = await dispatch(fetchDataByUrl({ url: fetchUrl })).unwrap();
  //       const result = data?.data || [];
  //       setRawData(result);
  //       setFetched(true); // mark as fetched
  //     };
  //     getData();
  //   }
  // }, [passedData, fetchUrl, dispatch, fetched]);

  const rawDataFilter = filterDataByKeys(rawData, FilterHeaderKey);
  const { data, headers } = FormatDataAndHeaders(rawDataFilter);

  // const getFormattedData = () => {
  //   return data.map((row) => {
  //     const formatted = {};
  //     Object.entries(headers).forEach(([key, label]) => {
  //       formatted[label] = row[key];
  //     });
  //     return formatted;
  //   });
  // };
  // const getFormattedData = () => {
  //   return data.map((row) => {
  //     const formatted = {};
  //     Object.entries(headers).forEach(([key, label]) => {
  //       if (key === "operations") {
  //         // join all operation names with comma
  //         formatted[label] = Array.isArray(row[key])
  //           ? row[key].map((op) => op.operation_name).join(", ")
  //           : "";
  //       } else {
  //         formatted[label] = row[key];
  //       }
  //     });
  //     return formatted;
  //   });
  // };
  const getFormattedData = () => {
    return data.map((row) => {
      const formatted = {};
      Object.entries(headers).forEach(([key, label]) => {
        const value = row[key];

        if (Array.isArray(value)) {
          // If array contains objects, join key-value pairs
          formatted[label] = value
            .map((item) => {
              if (typeof item === "object" && item !== null) {
                return Object.values(item).join(":");
              }
              return item;
            })
            .join(", ");
        } else {
          formatted[label] = value;
        }
      });
      return formatted;
    });
  };

  const exportToPDF = () => {
    if (data.length > 0) {
      const doc = new jsPDF({ orientation: "landscape" });
      const rows = getFormattedData();
      const head = [Object.values(headers)];
      const body = rows.map((item) => Object.values(item));
      autoTable(doc, {
        head,
        body,
        startY: 20,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
          fillColor: [92, 45, 145],
          textColor: "#ffffff",
          fontSize: 10,
          halign: "center",
        },
        theme: "grid",
        margin: { top: 10, left: 10, right: 10 },
      });
      doc.save(`${fileName}.pdf`);
    } else {
      showToast("Data Not Available", "error");
    }
  };

  const exportToExcel = () => {
    if (data.length > 0) {
      const rows = getFormattedData();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const maxColumnWidths = Object.keys(headers).map((key) => {
        const max = Math.max(
          headers[key]?.length || 10,
          ...rows.map((r) => (r[headers[key]] || "").toString().length)
        );
        return { wch: max + 2 };
      });
      worksheet["!cols"] = maxColumnWidths;
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${fileName}.xlsx`);
    } else {
      showToast("Data Not Available", "error");
    }
  };

  return (
    <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
      <Tooltip title={`Download ${fileName}.pdf`} arrow>
        <Button
          variant="outlined"
          onClick={exportToPDF}
          sx={{
            px: 1,
            py: 1,
            borderColor: "#D32F2F",
            color: "#D32F2F",
            "&:hover": { borderColor: "#B71C1C", backgroundColor: "#fceaea" },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <DownloadIcon sx={{ fontSize: 16 }} />
            <PictureAsPdfIcon sx={{ color: "#D32F2F", fontSize: 16 }} />
          </Stack>
        </Button>
      </Tooltip>

      <Tooltip title={`Download ${fileName}.xlsx`} arrow>
        <Button
          variant="outlined"
          onClick={exportToExcel}
          sx={{
            px: 1,
            py: 1,
            borderColor: "#2E7D32",
            color: "#2E7D32",
            "&:hover": { borderColor: "#1B5E20", backgroundColor: "#e9f5ec" },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <DownloadIcon sx={{ fontSize: 16 }} />
            <DescriptionIcon sx={{ color: "#2E7D32", fontSize: 16 }} />
          </Stack>
        </Button>
      </Tooltip>
    </Box>
  );
};

export default ExportDropdown;
