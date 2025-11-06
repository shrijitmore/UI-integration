import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  TextField,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { backgroundColor } from "../Operator/InprocessInspection/config";
import CustomAutocomplete from "../Operator/InprocessInspection/CustomAutocomplete";
import DateFilter from "./DateFilter";
import { useDispatch } from "react-redux";
import ControlChart from "./ControlChart";
import BarChartComponent from "./BarChartComponent";
import NoDataFound from "../../common/NoDataFound";
import {
  fetchBarGraphData,
  fetchDashboardData,
  fetchLineGraphData,
} from "./apicalldashboard";
import { transformBarData, transformInspectionResults } from "./config";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("inprocess");
  const [formData, setFormData] = useState({
    sectionName: "Section 1",
    itemCode: [],
    fromDate: null,
    toDate: null,
    productionMachine: "",
    qcMachine: "",
    operation: "",
    inspectionParameters: [],
  });
  const [sectionData, setSectionData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [itemCodes, setItemCodes] = useState([]);
  const [operations, setOperations] = useState([]);
  const [qcMachines, setQcMachines] = useState([]);
  const [inspectionParameters, setInspectionParameters] = useState([]);
  const [barGraphData, setBarGraphData] = useState([]);
  const [lineGraphData, setLineGraphData] = useState([]);
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
    setSelectedSection(null);
    setItemCodes([]);
    setQcMachines([]);
    setInspectionParameters([]);
    setBarGraphData([]);
    setLineGraphData([]);
    setFormData({
      sectionName: "",
      itemCode: [],
      fromDate: null,
      toDate: null,
      productionMachine: "",
      qcMachine: "",
      operation: "",
      inspectionParameters: [],
    });
  };
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchDashboardData(dispatch, formData, selectedSection?.id, viewMode)
      .then((res) => {
        const machines =
          res?.operations?.flatMap(
            (op) =>
              op.parameters?.flatMap((param) => param.machines || []) || []
          ) || [];
        const parameters =
          res?.operations?.flatMap((op) => op.parameters || []) || [];
        setSectionData((prev) =>
          JSON.stringify(prev) !== JSON.stringify(res?.sections || [])
            ? res?.sections || []
            : prev
        );
        if (!selectedSection && res?.sections?.length > 0) {
          setSelectedSection(res.sections[0]);
        }
        setItemCodes((prev) =>
          JSON.stringify(prev) !== JSON.stringify(res?.items || [])
            ? res?.items || []
            : prev
        );
        setOperations((prev) =>
          JSON.stringify(prev) !== JSON.stringify(res?.operations || [])
            ? res?.operations || []
            : prev
        );
        setQcMachines((prev) =>
          JSON.stringify(prev) !== JSON.stringify(machines) ? machines : prev
        );
        setInspectionParameters((prev) =>
          JSON.stringify(prev) !== JSON.stringify(parameters)
            ? parameters
            : prev
        );
        if (!formData.itemCode?.length) {
          handleFormChange(
            "itemCode",
            res?.items?.length ? [res?.items[0]] : []
          );
        }
        if (!formData.operation) {
          handleFormChange(
            "operation",
            res?.operations?.length ? res.operations[0] : ""
          );
        }
        if (!formData.qcMachine?.length) {
          handleFormChange("qcMachine", machines?.length ? [machines[0]] : []);
        }
        if (!formData.inspectionParameters?.length) {
          handleFormChange(
            "inspectionParameters",
            parameters?.length ? [parameters[0]] : []
          );
        }
        if (viewMode === "rm") {
          const machines =
            res?.parameters?.flatMap((param) => param.machines || []) || [];
          const uniqueMachines = machines.filter(
            (m, idx, arr) => idx === arr.findIndex((x) => x.id === m.id)
          );
          setQcMachines(uniqueMachines);

          setInspectionParameters(res?.parameters || []);
          if (!formData.qcMachine?.length) {
            handleFormChange(
              "qcMachine",
              uniqueMachines?.length ? [uniqueMachines[0]] : []
            );
          }
          if (!formData.inspectionParameters?.length) {
            handleFormChange(
              "inspectionParameters",
              res?.parameters?.length ? [res?.parameters[0]] : []
            );
          }
        } else {
          setOperations(res?.operations || []);

          const machines =
            res?.operations?.flatMap((op) =>
              op.parameters?.flatMap((param) => param.machines || [])
            ) || [];
          const uniqueMachines = machines.filter(
            (m, idx, arr) => idx === arr.findIndex((x) => x.id === m.id)
          );
          setQcMachines(uniqueMachines);

          const inspectionParams =
            res?.operations?.flatMap((op) => op.parameters || []) || [];
          setInspectionParameters(inspectionParams);
        }
      })
      .catch(console.error);
  }, [
    dispatch,
    selectedSection,
    formData.fromDate,
    formData.toDate,
    JSON.stringify(formData?.itemCode),
    viewMode,
  ]);

  // Fetch Bar Graph
  useEffect(() => {
    if (viewMode !== "rm" && !formData.operation) return;
    fetchBarGraphData(
      dispatch,
      formData,
      selectedSection?.id,
      selectedSection,
      viewMode
    )
      .then((res) => setBarGraphData(res))
      .catch(console.error);
  }, [dispatch, selectedSection, formData, viewMode]);

  // Fetch Line Graph
  useEffect(() => {
    if (
      !selectedSection ||
      !formData.itemCode.length ||
      !formData.inspectionParameters.length
    )
      return;
    fetchLineGraphData(
      dispatch,
      formData,
      selectedSection.id,
      selectedSection,
      viewMode
    )
      .then((res) => setLineGraphData(res))
      .catch(console.error);
  }, [dispatch, selectedSection, formData, viewMode]);
  const showInitialMessage =
    !selectedSection ||
    (formData.itemCode?.length || 0) === 0 ||
    (viewMode !== "rm" && !formData.operation);
  const hasBarGraphData =
    barGraphData &&
    (Object.keys(barGraphData?.operation_wise || {}).length > 0 ||
      Object.keys(barGraphData?.parameter_wise || {}).length > 0 ||
      (viewMode === "rm" &&
        (barGraphData?.combined ||
          Object.keys(barGraphData?.with_parameter || {}).length > 0)));

  const hasLineGraphData =
    lineGraphData &&
    (viewMode === "inprocess" || viewMode === "fai"
      ? lineGraphData?.inprocess_results &&
        Object.keys(lineGraphData.inprocess_results).length > 0
      : lineGraphData?.rm_inspection_results &&
        Object.keys(lineGraphData.rm_inspection_results).length > 0);
  const hasChartData = hasBarGraphData || hasLineGraphData;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          mt: 0,
          px: 1,
          py: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="div"
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
          }}
        >
          Dashboard
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          sx={{
            bgcolor: "#f5f5f5",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "& .MuiToggleButton-root": {
              px: 3,
              p: 0.8,
              fontWeight: "bold",
              textTransform: "none",
              color: "#494949",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
              "&.Mui-selected": {
                bgcolor: backgroundColor,
                color: "white",
                "&:hover": {
                  bgcolor: backgroundColor,
                },
              },
            },
          }}
        >
          <ToggleButton value="inprocess">Inprocess</ToggleButton>
          <ToggleButton value="rm">Raw Material</ToggleButton>
          <ToggleButton value="fai">FAI</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Grid sx={{ mt: 1 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomAutocomplete
                label="Section Name"
                options={sectionData}
                getOptionLabel={(option) => option?.name || ""}
                value={selectedSection || null}
                onChange={(e, newValue) => {
                  setSelectedSection(newValue);
                  handleFormChange("itemCode", []);
                  setBarGraphData([]);
                  setLineGraphData([]);
                  handleFormChange("operation", "");
                  handleFormChange("qcMachine", []);
                  handleFormChange("inspectionParameters", []);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomAutocomplete
                multiple
                sx={{
                  minWidth: 150,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                }}
                label="Item Code"
                options={itemCodes || []}
                getOptionLabel={(option) => option?.code || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                value={formData.itemCode || []}
                onChange={(event, newValue) => {
                  handleFormChange("itemCode", newValue);
                  if (!newValue || newValue.length === 0) {
                    handleFormChange("operation", "");
                    handleFormChange("qcMachine", []);
                    handleFormChange("inspectionParameters", []);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DateFilter setFormData={setFormData} formData={formData} />
            </Grid>
            {viewMode !== "rm" && (
              <Grid item xs={12} sm={6} md={4}>
                <CustomAutocomplete
                  sx={{ minWidth: 150 }}
                  label="Operation"
                  options={operations || []}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  } // 👈 FIX
                  value={formData.operation || null}
                  onChange={(event, newValue) => {
                    handleFormChange("operation", newValue || null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Operation"
                      placeholder="Select"
                      required
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <CustomAutocomplete
                multiple
                sx={{
                  minWidth: 150,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                }}
                label="Inspection Parameters"
                options={inspectionParameters || []}
                value={formData.inspectionParameters || []}
                onChange={(event, newValue) =>
                  handleFormChange("inspectionParameters", newValue)
                }
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Inspection Parameters"
                    placeholder="Select"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomAutocomplete
                multiple
                sx={{ minWidth: 150 }}
                label="QC-Machine"
                options={qcMachines || []}
                value={formData.qcMachine || []}
                onChange={(event, newValue) =>
                  handleFormChange("qcMachine", newValue)
                }
                required={false}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="QC-Machine"
                    placeholder="Select"
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2}>
          {showInitialMessage ? (
            <NoDataFound
              message={`Your dashboard is waiting! Choose a Section, Item Code${
                viewMode === "rm" ? "" : " and Operation"
              } to get started.`}
            />
          ) : !hasChartData ? (
            <NoDataFound message="No data found for your selection." />
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
              gap={2}
              width="100%"
              marginLeft={3}
              marginTop={2}
            >
              <>
                <>
                  {Object.entries(barGraphData?.operation_wise || {}).map(
                    ([category, item]) => {
                      if (
                        Array.isArray(item?.inspection_ids) &&
                        item.inspection_ids.length
                      ) {
                        return (
                          <BarChartComponent
                            key={`operation-${item.inspection_ids[0]}`}
                            data={transformBarData(item.total_bins)}
                            label={`Operation Wise - ${category}`}
                          />
                        );
                      }
                      return null;
                    }
                  )}

                  {Object.entries(barGraphData?.parameter_wise || {}).map(
                    ([category, itemOrParams]) =>
                      Object.entries(itemOrParams || {}).map(
                        ([paramName, item]) => {
                          if (
                            Array.isArray(item?.inspection_ids) &&
                            item.inspection_ids.length
                          ) {
                            return (
                              <BarChartComponent
                                key={`parameter-${item.inspection_ids[0]}`}
                                data={transformBarData(item.total_bins)}
                                label={`Parameter Wise - ${category} - ${paramName}`}
                              />
                            );
                          }
                          return null;
                        }
                      )
                  )}
                  {viewMode === "rm" && (
                    <>
                      {barGraphData?.combined &&
                        Array.isArray(barGraphData.combined.inspection_ids) &&
                        barGraphData.combined.inspection_ids.length > 0 && (
                          <BarChartComponent
                            key={`combined-${barGraphData.combined.inspection_ids[0]}`}
                            data={transformBarData(
                              barGraphData.combined.total_bins
                            )}
                            label="Combined"
                          />
                        )}

                      {Object.entries(barGraphData?.with_parameter || {}).map(
                        ([paramName, item]) => {
                          if (
                            Array.isArray(item?.inspection_ids) &&
                            item.inspection_ids.length
                          ) {
                            return (
                              <BarChartComponent
                                key={`withparam-${item.inspection_ids[0]}`}
                                data={transformBarData(item.total_bins)}
                                label={`With Parameter - ${paramName}`}
                              />
                            );
                          }
                          return null;
                        }
                      )}
                    </>
                  )}
                </>

                {transformInspectionResults(
                  viewMode === "inprocess" || viewMode === "fai"
                    ? lineGraphData?.inprocess_results
                    : lineGraphData?.rm_inspection_results,
                  viewMode
                ).map((chart) => (
                  <ControlChart
                    key={chart.schedule_id}
                    chartData={chart.chartData}
                    label={
                      viewMode === "inprocess" || viewMode === "fai"
                        ? `${chart.itemCode} - ${chart.inspectionType} - ${chart.paramName}`
                        : `${chart.itemCode} - ${chart.paramName}`
                    }
                    lsl={chart.lsl}
                    usl={chart.usl}
                    controlLimit={chart.controlLimit}
                  />
                ))}
              </>
            </Box>
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Dashboard;
