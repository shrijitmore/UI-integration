import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { showToast } from "../../../common/ShowToast";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../store/slices/uploadFile/uploadFileSlice";
import { UPLOADFILE } from "../../../utils/endpoints";
import { validateExcelHeaders } from "./validateExcelHeaders";
import bgimage from "../../../assets/images/bg/keyboard.jpg";
import { tabStyles } from "./config";
import CustomTable from "./CustomTable";
import useApiData from "./useApiData";
import CustomAutocomplete from "../../Operator/InprocessInspection/CustomAutocomplete";
const UploadProductionPlan = () => {
  // const [page, setPage] = useState(1);
  const { profileData } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const TABS = [
    {
      label: "Plant Master",
      endpoint: UPLOADFILE?.planMaster,
      header: ["sr.no", "dataname1", "plan"],
    },
    {
      label: "Building Section",
      endpoint: UPLOADFILE?.buildingSection,
      header: ["building_id", "building_name", "plant"],
    },
    {
      label: "Machine Master",
      endpoint: UPLOADFILE?.machinMaster,
      header: ["sr.no", "dataname1", "machine"],
    },
    {
      label: "Item Master",
      endpoint: UPLOADFILE?.itemMaster,
      header: ["sr.no", "dataname1", "item"],
    },
    {
      label: "Parameter Master",
      endpoint: UPLOADFILE?.parameterMaster,
      header: ["sr.no", "dataname1", "parameter"],
    },
    {
      label: "Operation Master",
      endpoint: UPLOADFILE?.operationMaster,
      header: ["sr.no", "dataname1", "parameter"],
    },
    {
      label: "Inspection Scheduling Master",
      endpoint: UPLOADFILE?.inspectionMasterScheduling,
      header: ["sr.no", "dataname1", "parameter"],
    },
    {
      label: "Fai Item",
      endpoint: UPLOADFILE?.faiItem,
      header: ["sr.no", "dataname1", "parameter"],
    },
    {
      label: "Fai Operation",
      endpoint: UPLOADFILE?.faiOperation,
      header: ["sr.no", "dataname1", "parameter"],
    },
    {
      label: "Fai Schedule",
      endpoint: UPLOADFILE?.faiSchedule,
      header: ["sr.no", "dataname1", "parameter"],
    },
  ];
  const dispatch = useDispatch();
  const {
    data: plantData,
    loading: plantLoading,
    error: plantError,
  } = useApiData(UPLOADFILE?.planMaster);

  const {
    data,
    loading: apiLoading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
  } = useApiData(TABS[selectedTab].endpoint);

  const [modifiedData, setModifiedData] = useState([]);

  useEffect(() => {
    if (data) {
      const cleanedData = data.map(({ id, ...rest }) => rest);
      setModifiedData(cleanedData);
    }
  }, [data]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(1);
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await dispatch(
        uploadFile({ data: formData, UPLOADFILE: TABS[selectedTab].endpoint })
      ).unwrap();
      showToast(result?.message, "success");
    } catch (error) {
      console.error(error);
      showToast(error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid
        item
        xs={12}
        container
        justifyContent="space-between"
        mb={1}
        mt={1}
        alignItems="center"
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
              lg: "1.3rem",
            },
            color: "#1A237E",
            fontWeight: "bold",
            cursor: "pointer",
            mb: 0,
          }}
        >
          Upload Master File
        </Typography>
        {/* :point_down: Align autocomplete + button to the right */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {TABS[selectedTab].label !== "Plant Master" && (
            <CustomAutocomplete
              sx={{
                width: "auto",
                minWidth: 300, // so it doesn’t collapse too much
                maxWidth: "100%", // optional: prevent overflow in container
              }}
              disabled={plantData?.length === 1}
              label="Plant"
              options={plantData || []}
              getOptionLabel={(option) => option?.plant_name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id} // match by id
              value={
                plantData.find((item) => item.id === profileData?.plant?.id) ||
                null
              }
              onChange={(event, newValue) => {
                // Map to your profileData structure if needed
                // handleFormChange("plant", newValue ? { id: newValue.id, name: newValue.plant_name } : null);
              }}
            />
          )}
          <Button
            variant="contained"
            component="label"
            startIcon={!loading && <CloudUploadIcon />}
            disabled={loading}
            sx={{
              backgroundColor: "#28304E",
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
              px: 5,
              py: 1.5,
              "&:hover": {
                backgroundColor: "#3C64C0",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Upload"
            )}
            <input
              type="file"
              hidden
              accept=".xls,.xlsx"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      </Grid>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `linear-gradient(rgba(40, 48, 78, 0.85), rgba(40, 48, 78, 0.85)), url(${bgimage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          px: 2,
          py: 6,
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              flexGrow: 1,
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTabs-scrollButtons": {
                color: "white", // Make scroll buttons white
              },
              "& .Mui-disabled": {
                opacity: 0.3, // Optional: adjust opacity when disabled
              },
            }}
          >
            {TABS.map((tab, index) => (
              <Tab key={index} label={tab.label} sx={tabStyles} />
            ))}
          </Tabs>
        </Box>
        {/* Upload Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            mt: 4,
          }}
        >
          {/* <CustomTable data={data} setPage={setPage} page={page} /> */}
          <CustomTable
            data={modifiedData}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalRecords={totalRecords}
            totalPages={totalPages}
          />
          {/* <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
              maxWidth: 600,
              width: "100%",
              borderRadius: 3,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "#28304E" }}
            >
              Upload {TABS[selectedTab].label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Please upload the Excel file as per the required format.
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={!loading && <CloudUploadIcon />}
              disabled={loading}
              sx={{
                backgroundColor: "#28304E",
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "none",
                px: 5,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#3C64C0",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Upload"
              )}
              <input
                type="file"
                hidden
                accept=".xls,.xlsx"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </Button>
          </Paper> */}
        </Box>
      </Box>
    </>
  );
};
export default UploadProductionPlan;
