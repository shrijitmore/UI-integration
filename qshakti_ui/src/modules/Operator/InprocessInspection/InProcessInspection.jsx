import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  Collapse,
  IconButton,
} from "@mui/material";
import ParameterWiseTable from "../RmInspection/ParameterWiseView";
import CommonInprocessInspection from "./CommonInprocessInspection";
import { useDispatch } from "react-redux";
import {
  inProcessInspectionFilter,
  poOrderList,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import NoDataFound from "../../../common/NoDataFound";
import { showToast } from "../../../common/ShowToast";
import imageKeyboard from "../../../assets/images/media/qualityControl.jpg";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { hasPermission } from "../../../utils/permissions";
import { motion, AnimatePresence } from "framer-motion";

const InProcessInspection = () => {
  const [hovered, setHovered] = useState(false);

  const steps = [
    { step: "Step 1", text: "Select Section", color: "#ffebee" },
    { step: "Step 2", text: "Select Production Order", color: "#ffebee" },
    { step: "Step 3", text: "Choose QC Machines", color: "#e3f2fd" },
    {
      step: "Step 4",
      text: "Pick View (Parameter wise/ Sample wise)",
      color: "#e8f5e9",
    },
    { step: "Step 5", text: "Review Operations", color: "#fff3e0" },
    { step: "Step 6", text: "Add Operations Readings", color: "#fff3e0" },
    { step: "Step 7", text: "Submit Inspection Readings", color: "#f3e5f5" },
  ];
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [selectedQcMachines, setSelectedQcMachines] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState(null);
  const [ioNo, setIoNo] = useState("");
  const [podata, setPodata] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [operationId, setOperationId] = useState(null);
  const [selectedProductionMachine, setSelectedProductionMachine] =
    useState(null);
  const [selectedQcMachine, setSelectedQcMachine] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sectionOrMisNo, setSectionOrMisNo] = useState("");
  const [selectedOperationValue, setSelectedOperationValue] = useState(null);
  const [selectedOperationList, setSelectedOperationList] = useState([]);
  const [indexData, setIntexData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poRes = await dispatch(poOrderList()).unwrap();
        setPodata(poRes?.data);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          inProcessInspectionFilter({
            section_name: sectionOrMisNo,
            item_code: selectedItem?.item_code,
            po_no: ioNo,
            // production_machine_id: selectedMachines?.map(
            //   (item) => item?.machine_id
            // ),
            // qc_machine_id: selectedQcMachines?.map((item) => item?.machine_id),
          })
        ).unwrap();

        setOperationList(result?.data || []);
        setSelectedOperationList(result?.data || []);
      } catch (err) {
        console.error("Error fetching inspection filter:", err);
      }
    };

    const hasValidQCMachines = true;
    // Array.isArray(selectedQcMachines) &&
    // selectedQcMachines.length > 0 &&
    // selectedQcMachines.every((item) => item?.machine_id);

    if (selectedItem?.item_code && sectionOrMisNo && hasValidQCMachines) {
      fetchData();
    } else {
      setOperationList([]);
    }
  }, [
    dispatch,
    selectedItem,
    sectionOrMisNo,
    ioNo,
    selectedQcMachines,
    activeView,
  ]);
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  //  const [openIndex, setOpenIndex] = useState(null);

  const toggleRow = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <Box>
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
          mt: 1,
          mb: 1,
        }}
        onClick={() => navigate("/productionorders")}
      >
        In Process Inspection - {""}
        {activeView === null
          ? "Capture Readings"
          : activeView === 0
          ? "Parameter wise"
          : "Sample wise"}
      </Typography>

      <Grid container spacing={2} alignItems={"center"}>
        <Grid item xs={12} md={9}>
          <Card elevation={2} sx={{ p: 2 }}>
            <CommonInprocessInspection
              selectedQcMachines={selectedQcMachines}
              setSelectedQcMachines={setSelectedQcMachines}
              selectedMachines={selectedMachines}
              setSelectedMachines={setSelectedMachines}
              selectedProductionMachine={selectedProductionMachine}
              setSelectedProductionMachine={setSelectedProductionMachine}
              data={podata}
              activeView={
                activeView === 0 ? 1 : activeView === 1 ? 1 : activeView
              }
              selectedQcMachine={selectedQcMachine}
              setSelectedQcMachine={setSelectedQcMachine}
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              sectionOrMisNo={sectionOrMisNo}
              setSectionOrMisNo={setSectionOrMisNo}
              selectedOperationValue={selectedOperationValue}
              setSelectedOperationValue={setSelectedOperationValue}
              selectedOperationList={selectedOperationList}
              setSelectedOperationList={setSelectedOperationList}
              keyName={"test"}
              ioNo={ioNo}
              setIoNo={setIoNo}
              disable={activeView !== null}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <Card
              sx={{
                p: 0.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #c155ec83, #adb2d1da)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                color: "white",
                cursor: "pointer",
                height: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait">
                {!hovered ? (
                  // 🔹 Show Image by Default
                  <motion.div
                    key="image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Box
                      component="img"
                      src={imageKeyboard}
                      alt="QC Process"
                      sx={{
                        borderRadius: "8px",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </motion.div>
                ) : (
                  // 🔹 Show Steps on Hover
                  <motion.div
                    key="steps"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100%", height: "100%", overflowY: "auto" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        mb: 1,
                        color: "#1a237e",
                      }}
                    >
                      Process Steps
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        pr: 0.5,
                      }}
                    >
                      {steps.map((card, idx) => (
                        <Card
                          key={idx}
                          sx={{
                            p: 0.5,
                            backgroundColor: card.color,
                            borderRadius: "10px",
                            boxShadow: "0 3px 5px rgba(0,0,0,0.15)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", color: "#1a237e" }}
                          >
                            {card.step}
                          </Typography>
                          <Typography variant="body2">{card.text}</Typography>
                        </Card>
                      ))}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
      {activeView === null && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8eaf6" }}>
                  <TableCell />
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#1a237e",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Sr. No.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#1a237e",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Operations
                  </TableCell>
                  {hasPermission("inprocessInspection", "create") && (
                    <TableCell
                      sx={{
                        pl: "25px",
                        fontWeight: "bold",
                        color: "#1a237e",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Action
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {operationList.length > 0 ? (
                  operationList?.map((param, index) => (
                    <React.Fragment key={index}>
                      {/* MAIN ROW */}
                      <TableRow
                        hover
                        sx={{
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                          "&:hover": { backgroundColor: "#f9f9f9" },
                        }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell sx={{ px: 2, py: 1 }}>{index + 1}</TableCell>
                        <TableCell sx={{ px: 2, py: 1 }}>
                          {param?.operation}
                          <IconButton
                            size="small"
                            onClick={() =>
                              setOpenIndex(openIndex === index ? null : index)
                            }
                            sx={{
                              marginLeft: 4,
                              transform:
                                openIndex === index
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          >
                            <KeyboardArrowDown />
                          </IconButton>
                        </TableCell>

                        {hasPermission("inprocessInspection", "create") && (
                          <TableCell sx={{ px: 2, py: 1 }}>
                            <Button
                              data-testid={`button-parameter-${param?.operation}`}
                              variant="text"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOperationValue(param);
                                setActiveView(0);
                                setIntexData(index);
                              }}
                              sx={{ mr: 2, textTransform: "none" }}
                            >
                              Parameter wise
                            </Button>
                            <Button
                              data-testid={`button-sample-${param?.operation}`}
                              variant="text"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOperationValue(param);
                                setActiveView(1);
                                setIntexData(index);
                              }}
                              sx={{ textTransform: "none" }}
                            >
                              Sample wise
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>

                      {/* COLLAPSE ROW */}
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={4}
                        >
                          <Collapse
                            in={
                              openIndex === index &&
                              param?.inspection_type?.length > 0
                            }
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                m: 2,
                                borderRadius: 2,
                                boxShadow: 2,
                                bgcolor: "background.paper",
                                maxHeight: 400,
                                overflowY: "auto",
                                "&::-webkit-scrollbar": { width: 6 },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "#bdbdbd",
                                  borderRadius: 3,
                                },
                              }}
                            >
                              <Table size="small" stickyHeader>
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                                    <TableCell
                                      sx={{ fontWeight: "bold", fontSize: 13 }}
                                    >
                                      Parameter
                                    </TableCell>
                                    <TableCell
                                      sx={{ fontWeight: "bold", fontSize: 13 }}
                                    >
                                      Sample Size
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {param?.inspection_type?.map((type, idx) => (
                                    <TableRow
                                      key={type.id}
                                      sx={{
                                        backgroundColor:
                                          idx % 2 === 0 ? "#fafafa" : "#fff",
                                        "&:hover": {
                                          backgroundColor: "#e3f2fd",
                                        },
                                      }}
                                    >
                                      <TableCell sx={{ fontSize: 13 }}>
                                        {`${String.fromCharCode(97 + idx)}) `}
                                        <Typography
                                          component="span"
                                          sx={{
                                            fontWeight: 500,
                                            color: "text.secondary",
                                          }}
                                        >
                                          {type?.inspection_parameter_name}
                                        </Typography>{" "}
                                        {/* strength */}
                                      </TableCell>
                                      <TableCell sx={{ fontSize: 13 }}>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            px: 1,
                                            py: 0.5,
                                            bgcolor: "#e8f5e9",
                                            borderRadius: 1,
                                            display: "inline-block",
                                            fontWeight: 500,
                                            color: "#2e7d32",
                                          }}
                                        >
                                          {type?.sample_size || "N/A"}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <NoDataFound />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeView != null && (
        <ParameterWiseTable
          POIONUMBER={{ po_no: ioNo }}
          keyName={"inprocess"}
          LayoutKey={activeView == 0 ? "parameter" : "sample"}
          setActiveView={setActiveView}
          operationList={operationList[indexData]?.inspection_type}
          activeView={activeView}
          operation_id={operationList[indexData]?.operation_id}
          setIsUpdated={setIsUpdated} // now it's valid
        />
      )}
    </Box>
  );
};

export default InProcessInspection;
