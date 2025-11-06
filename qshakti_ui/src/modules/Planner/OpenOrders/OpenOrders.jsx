import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { showToast } from "../../../common/ShowToast";
import ButtonLoaderWrapper from "../../../../src/common/commonComponent/ButtonLoaderWrapper";
import {
  TEMPLATE_HEADERS,
  transformRMRow,
  transformProductionRow,
} from "./config";
import ExportDropdown from "../../../common/commonComponent/exportComponent/ExportDropdown";
import CommonDataGrid from "../../../common/commonComponent/commonDataGrid/commonDataGrid";
import { useDispatch } from "react-redux";
import {
  uploadMachineMaster,
  uploadParameterMasterList,
  uploadProductionPlannerList,
  uploadRmPlanner,
} from "../../../store/slices/openOrders/openOrdersSlice";
import {
  PRODUCTION_PLANNER_LIST,
  RM_PLANNER_LIST,
} from "../../../utils/endpoints";
import { hasPermission } from "../../../utils/permissions";
import { textAlign, width } from "@mui/system";
import { backgroundColor } from "../../Operator/InprocessInspection/config";

const OpenOrders = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Check permissions
  const hasProductionAccess = hasPermission("production", "view");
  const hasRmAccess = hasPermission("rm", "view");

  const hasProductionUpload = hasPermission("production", "create");
  const hasRmUpload = hasPermission("rm", "create");

  const hasProductionExport = hasPermission("production", "export");
  const hasRmExport = hasPermission("rm", "export");

  // Determine available tabs and default selected tab
  const availableTabs = [];
  if (hasProductionAccess) availableTabs.push("Production");
  if (hasRmAccess) availableTabs.push("RM");

  // Default to "Production" tab if both exist, else first available tab, else null
  const [selectedPlanner, setSelectedPlanner] = useState(() => {
    if (availableTabs.includes("Production")) return "Production";
    if (availableTabs.length > 0) return availableTabs[0];
    return null;
  });

  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dynamicRows, setDynamicRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Map planner to API keys
  const plannerToScreen = {
    Production: "production",
    RM: "rm",
  };
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
  const baseColumns =
    selectedPlanner === "Production"
      ? [
          {
            field: "srNO.",
            headerName: "Sr. No.",
            minWidth: 150,
            flex: 0,
          },
          {
            field: "Prod. Order No.",
            headerName: "Prod. Order No.",
            minWidth: 150,
            flex: 1,
          },

          {
            field: "Lot No.",
            headerName: "Lot No.",
            align: "center",
            headerAlign: "center",
            textAlign: "center",
            justifyContent: "center",
            minWidth: 130,
            flex: 0,
            renderCell: (params) => {
              const randomIndex = Math.floor(Math.random() * colors.length); // Pick a random color
              const color = colors[randomIndex]; // Base color (will be used for border)
              const lightBg = `${color}23`; // Lighter background (33 = 20% opacity)
              const darkBorder = color; // Darker border color

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
            field: "Lot Qty",
            headerName: "Lot Qty",
            minWidth: 80, // Small fixed
            flex: 0,
            align: "center",
            headerAlign: "center",
            textAlign: "center",
          },
          { field: "Item Code", headerName: "Item Code", flex: 1 },
          {
            field: "Item Description",
            headerName: "Item Description",
            flex: 2,
          },
          {
            field: "Targeted Date",
            headerName: "Targeted Date",
            flex: 1,
            valueFormatter: (params) => commonDateFormat(params),
          },
          { field: "Section", headerName: "Section", flex: 1 },
        ]
      : [
          {
            field: "srNO.",
            headerName: "Sr. No.",
            minWidth: 150,
            flex: 0,
          },
          { field: "MIS No.", headerName: "MIS No.", flex: 1 },

          {
            field: "I/O No.",
            headerName: "I/O No.",
            flex: 1,
            align: "center",
            headerAlign: "center",
            textAlign: "center",
            justifyContent: "center",
            renderCell: (params) => {
              const randomIndex = Math.floor(Math.random() * colors.length); // Random color index
              const color = colors[randomIndex]; // Base color
              const lightBg = `${color}33`; // Light background (20% opacity)
              const darkBorder = color; // Border color same as base color

              return (
                <Box
                  sx={{
                    background: lightBg, // Light background
                    // color: "#333", // Dark text
                    color: `${darkBorder}`,
                    px: 2,
                    py: 0.5,
                    borderRadius: "20px",
                    // fontSize: "0.75rem",
                    fontWeight: 500,
                    // display: "inline-block",
                    // minWidth: "60px",
                    textAlign: "center",
                    lineHeight: 1.5,
                    border: `1px solid ${darkBorder}`, // Dark border
                  }}
                >
                  {params.value}
                </Box>
              );
            },
          },
          { field: "Lot Qty", headerName: "Lot Qty", flex: 1 },
          { field: "Item Code", headerName: "Item Code", flex: 1 },
          {
            field: "Item Description",
            headerName: "Item Description",
            flex: 2,
          },
          { field: "Section", headerName: "Section", flex: 1 },
        ];

  // Fetch data on selectedPlanner change
  useEffect(() => {
    if (!selectedPlanner) return;

    const fetchData = async () => {
      setDynamicRows([]);
      try {
        if (selectedPlanner === "Production") {
          let result = await dispatch(
            uploadProductionPlannerList({
              page: paginationModel.page + 1, // your API expects 1-based index
              page_size: paginationModel.pageSize,
            })
          ).unwrap();
          const responseData = result?.data || [];
          setDynamicRows(
            responseData?.map((row, index) =>
              transformProductionRow(row, index + 1)
            )
          );
          setTotalCount(result);
          setSelectedPlanner("Production");
        } else if (selectedPlanner === "RM") {
          let result1 = await dispatch(
            uploadParameterMasterList({
              page: paginationModel.page + 1, // your API expects 1-based index
              page_size: paginationModel.pageSize,
            })
          ).unwrap();
          const responseData = result1?.data || [];

          setDynamicRows(
            responseData.map((row, index) => transformRMRow(row, index + 1))
          );
          setTotalCount(result1);
          setSelectedPlanner("RM");
        }
      } catch (err) {
        console.error("Failed to fetch planner data:", err);
      }
    };
    fetchData();
  }, [selectedPlanner, dispatch, paginationModel]);

  // Handle file upload
  const handleFileUpload = async (e) => {
    setLoading(true);

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setLoading(false);
      return;
    }

    setFile(selectedFile);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      let result;
      if (selectedPlanner === "Production") {
        result = await dispatch(
          uploadMachineMaster({ data: formData })
        ).unwrap();
        let result2 = await dispatch(
          uploadProductionPlannerList({
            page: paginationModel.page + 1, // your API expects 1-based index
            page_size: paginationModel.pageSize,
          })
        ).unwrap();
        const responseData = result2?.data || [];
        setDynamicRows(
          responseData?.map((row, index) =>
            transformProductionRow(row, index + 1)
          )
        );
        setTotalCount(result2);
      } else if (selectedPlanner === "RM") {
        result = await dispatch(uploadRmPlanner({ data: formData })).unwrap();
        let result1 = await dispatch(
          uploadParameterMasterList({
            page: paginationModel.page + 1, // your API expects 1-based index
            page_size: paginationModel.pageSize,
          })
        ).unwrap();
        const responseData = result1.data || [];
        setDynamicRows(
          responseData?.map((row, index) => transformRMRow(row, index + 1))
        );
        setTotalCount(result1);
      }

      showToast(result?.message, "success");
    } catch (error) {
      console.error("Upload failed:", error);
      // setDynamicRows([]);
      showToast(error || "Upload failed. Please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (fileParam) => {
    const uploadFile = fileParam || file;

    if (!uploadFile) {
      showToast("Please select a file before submitting.", "error");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    if (selectedPlanner === "Production") {
      dispatch(uploadMachineMaster(formData));
    } else {
      dispatch(uploadRmPlanner(formData));
    }
  };

  const handleDownloadTemplate = () => {
    const headers = TEMPLATE_HEADERS[selectedPlanner];
    if (!headers) {
      showToast("No template available for this planner.", "error");
      return;
    }
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${selectedPlanner}_Template.xlsx`);
  };

  // Render template preview table
  const renderTemplateTable = () => {
    const headers = TEMPLATE_HEADERS[selectedPlanner];
    if (!headers) return null;

    return (
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((col, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold" }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {headers.map((_, index) => (
              <TableCell key={index}></TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  if (!selectedPlanner) {
    // No access to any planner screen
    return (
      <Typography variant="h6" color="error" align="center" mt={5}>
        You do not have access to view any planners.
      </Typography>
    );
  }
  const commonDateFormat = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return (
    <>
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          width: "100%",
          // mb: 1,
          // mt: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
              lg: "1.3rem",
            },
            color: "#1a237e",
            fontWeight: "bold",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => navigate("/productionorders")}
        >
          Open {selectedPlanner} Planner
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        >
          {/* Tabs */}
          <ToggleButtonGroup
            value={selectedPlanner}
            exclusive
            onChange={(e, value) => {
              if (value) {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                setSelectedPlanner(value);
                setPaginationModel({ page: 0, pageSize: 10 }); // Reset pagination on tab change
              }
            }}
          >
            {availableTabs.map((tab) => (
              <ToggleButton
                key={tab}
                value={tab}
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  p: 0.8,
                  color: "#494949",
                  "&.Mui-selected": {
                    backgroundColor: `${backgroundColor}`,
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: `${backgroundColor}`,
                    },
                  },
                }}
              >
                {tab} Planner
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Upload Button */}
          {((selectedPlanner === "Production" && hasProductionUpload) ||
            (selectedPlanner === "RM" && hasRmUpload)) && (
            <ButtonLoaderWrapper
              loading={loading}
              button={
                <Button
                  // variant="contained"
                  startIcon={<CloudUploadIcon />}
                  component="label"
                  sx={{
                    color: "#28304E",
                    borderRadius: "8px",
                    border: "solid 2px #28304E",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: " #566291ff",
                      color: "#fff",
                    },
                  }}
                >
                  Upload
                  <input
                    hidden
                    type="file"
                    ref={fileInputRef}
                    accept=".xls,.xlsx"
                    onChange={handleFileUpload}
                  />
                </Button>
              }
            />
          )}

          {/* Template Button */}
          {/* {((selectedPlanner === "Production" && hasProductionUpload) ||
            (selectedPlanner === "RM" && hasRmUpload)) && (
            <Button
              startIcon={<InsertDriveFileIcon />}
              onClick={() => setOpenModal(true)}
              sx={{
                color: "#28304E",
                borderRadius: "8px",
                border: "solid 2px #28304E",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: " #566291ff",
                  color: "#fff",
                },
              }}
            >
              Template
            </Button>
          )} */}

          {/* Export Dropdown */}
          {((selectedPlanner === "Production" && hasProductionExport) ||
            (selectedPlanner === "RM" && hasRmExport)) && (
            <ExportDropdown
              fetchUrl={
                selectedPlanner === "Production"
                  ? PRODUCTION_PLANNER_LIST
                  : RM_PLANNER_LIST
              }
              fileName={
                selectedPlanner === "Production"
                  ? "Production Planner Download"
                  : "RM Planner Download"
              }
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
          borderRadius: 1,
          paddingX: 1,
          paddingY: 1,
          height: "97vh",
        }}
      >
        <CommonDataGrid
          rows={dynamicRows.map((item, index) => ({
            ...item,
            "srNO.": index + 1,
          }))}
          columns={baseColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            borderRadius: 2,
            "& .super-app-theme--header": {
              fontWeight: "bold",
              color: "#0033aa",
              backgroundColor: "#f5f7ff",
            },
          }}
          getRowHeight={() => 100}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          rowCount={totalCount?.total || 0}
          paginationMode="server"
          enablePagination={true}
        />
      </Box>
      {/* </Box> */}

      {/* Modal Preview */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 700,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" mb={2}>
              Template Preview: {selectedPlanner}
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {renderTemplateTable()}
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleDownloadTemplate}>
              Download Template
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default OpenOrders;
