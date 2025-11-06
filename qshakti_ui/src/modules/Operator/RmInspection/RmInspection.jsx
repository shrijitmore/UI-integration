import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Grid, Tabs } from "@mui/material";
import ParameterWiseTable from "./ParameterWiseView";
import { useDispatch } from "react-redux";
import {
  ioOrderList,
  RMInspectionFilter,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import CommonRmSection from "./CommonRmSection";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { AnimatedTab } from "./config";
import { motion, AnimatePresence } from "framer-motion";
import rmimage from "../../../assets/images/media/representation-user-experience-interface-design.jpg";

const RmInspection = () => {
  const [isUpdated, setIsUpdated] = useState(false);

  const [hovered, setHovered] = useState(false);

  const steps = [
    { step: "Step 1", text: "Select Section", color: "#ffebee" },
    { step: "Step 2", text: "Select I/O No - MIS Number", color: "#ffebee" },
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
  const [activeView, setActiveView] = useState(""); // '' | 'parameter' | 'sample'
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const [ioNoValue, setIoNoValue] = useState("");

  const [iodata, setIodata] = useState([]);
  const [sectionOrMisNo, setSectionOrMisNo] = useState("");
  const [operationList, setOperationList] = useState([]);
  const [selectedOperationList, setSelectedOperationList] = useState([]); // dropdown list
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQcMachine, setSelectedQcMachine] = useState(null);
  const [selectedQcMachines, setSelectedQcMachines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poRes = await dispatch(ioOrderList()).unwrap();
        setIodata(poRes?.data);
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
          RMInspectionFilter({
            mis_no: selectedItem?.mis_no,
            io_no: selectedItem?.io_number,
            item_code: selectedItem?.item_code,
            // qc_machine_id: selectedQcMachines?.map((item) => item?.machine_id),
          })
        ).unwrap();

        setOperationList(result?.data || []);
        setSelectedOperationList(result?.data || []);
      } catch (err) {
        console.error("Error fetching inspection filter:", err);
      }
    };

    const hasValidQCMachines =
      Array.isArray(selectedQcMachines) &&
      selectedQcMachines.length > 0 &&
      selectedQcMachines.every((item) => item?.machine_id);

    if (selectedItem?.item_code && selectedItem?.mis_no) {
      fetchData();
    } else {
      setOperationList([]);
    }
  }, [dispatch, selectedItem]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabs = [{ label: "Parameter Wise" }, { label: "Sample Wise" }];

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
      >
        RM Inspection
      </Typography>

      <Grid container spacing={1} alignItems="center">
        {/* Left Section */}
        <Grid item xs={12} md={10}>
          <Card
            elevation={5}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
              flexWrap: "nowrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                gap: 1,
                flex: 1,
              }}
            >
              <CommonRmSection
                selectedQcMachines={selectedQcMachines}
                setSelectedQcMachines={setSelectedQcMachines}
                data={iodata}
                activeView={0}
                ioNoValue={ioNoValue}
                setIoNoValue={setIoNoValue}
                sectionOrMisNo={sectionOrMisNo}
                setSectionOrMisNo={setSectionOrMisNo}
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
                selectedQcMachine={selectedQcMachine}
                setSelectedQcMachine={setSelectedQcMachine}
                activeView1={activeView}
                setActiveView={setActiveView}
                component={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      mt: 0,
                    }}
                  >
                    <Tabs
                      value={selectedTab}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      TabIndicatorProps={{ style: { display: "none" } }}
                      sx={{
                        minHeight: "auto",
                        "& .MuiTab-root": {
                          minHeight: "auto",
                          marginBottom: "8px",
                          marginLeft: 1,
                        },
                      }}
                    >
                      {tabs.map((tab, index) => (
                        <AnimatedTab
                          key={index}
                          disableRipple
                          label={
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                padding: "2px",
                                width: "100%",
                              }}
                            >
                              {selectedTab === index && <ArrowRightAltIcon />}
                              <span
                                className="tab-text"
                                style={{
                                  fontFamily:
                                    '"Roboto", "Helvetica", "Arial", sans-serif',
                                }}
                                data-label={tab.label}
                              >
                                {tab.label}
                              </span>
                            </span>
                          }
                        />
                      ))}
                    </Tabs>
                  </Box>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
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
                      src={rmimage}
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

      {/* Table Section */}
      <ParameterWiseTable
        POIONUMBER={{ io_no: ioNoValue?.io_number }}
        keyName={"RM"}
        LayoutKey={selectedTab === 0 ? "parameter" : "sample"}
        operationList={operationList}
        setActiveView={setActiveView}
        setIsUpdated={setIsUpdated} // now it's valid
      />
    </Box>
  );
};

export default RmInspection;
