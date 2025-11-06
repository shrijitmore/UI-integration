import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Autocomplete,
  TextField,
  Paper,
  Modal,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Tooltip,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import {
  OPERATION_DETAILS,
  ORDER_DETAILSlIST,
  // GET_OPERATION_DETAILS,
} from "../../../store/slices/openOrders/openOrdersSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomAutocomplete from "../../Operator/InprocessInspection/CustomAutocomplete";
import {
  purpleOutlinedInputFieldStyles,
  purpleOutlinedTextFieldStyles,
} from "../../Operator/InprocessInspection/config";
import NoDataFound from "../../../common/NoDataFound";

// Arrow component
const FlowArrow = ({ direction }) => {
  const iconStyle = { fontSize: 30, color: "black" };
  if (direction === "right")
    return (
      <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
        <ArrowRightAltIcon sx={iconStyle} />
      </Box>
    );
  if (direction === "left")
    return (
      <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
        <ArrowRightAltIcon sx={{ ...iconStyle, transform: "rotate(180deg)" }} />
      </Box>
    );
  if (direction === "down")
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <ArrowRightAltIcon sx={{ ...iconStyle, transform: "rotate(90deg)" }} />
      </Box>
    );
  return null;
};

// Status chip
const statusChip = (status) => {
  if (status === "completed")
    return (
      <Chip
        size="small"
        color="success"
        icon={<CheckCircleIcon />}
        label="Completed"
      />
    );
  if (status === "ongoing")
    return (
      <Chip
        size="small"
        color="primary"
        icon={<HourglassBottomIcon />}
        label="Ongoing"
      />
    );
  return (
    <Chip
      size="small"
      color="default"
      icon={<RadioButtonUncheckedIcon />}
      label="Pending"
    />
  );
};

// Section item
const SectionItem = ({ active, text, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "relative",
      bgcolor: active ? "#0d47a1" : "#8080801f",
      color: active ? "#f4f5f7" : "#1e293b",
      px: 2.5,
      py: 1,
      mb: 1,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 700,
      display: "inline-block",
      minWidth: 150,
      textAlign: "center",
      boxShadow: active
        ? "0 3px 8px rgba(13,71,161,.35)"
        : "0 1px 3px rgba(0,0,0,.12)",
      "&:hover": { bgcolor: active ? "#0c3f90" : "#0d47a136" },
      clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
      transition: "background-color 0.3s, color 0.3s",
    }}
  >
    {text}
  </Box>
);

// Operation card
const OperationCard = ({ op, onClick, index }) => (
  <Paper
    elevation={3}
    sx={{
      p: 1,
      borderRadius: 1.5,
      cursor: "default",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      bgcolor: "#ffffff",
      border: "1px solid #e0e0e0",
      transition: "all 0.25s ease-in-out",
      position: "relative",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        borderColor: "#90caf9",
        // width: "calc(25% - 8px)",
      },
    }}
  >
    <Tooltip title={op.title} placement="top">
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 15,
          mb: 2,
          color: "#0d47a1",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Operation or step {index + 1}.
      </Typography>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 15,
          mb: 2,
          color: "#0d47a1",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {op.title}
      </Typography>
    </Tooltip>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mt: "auto",
      }}
    >
      <Box
        sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
      >
        {statusChip(op.status)}
        <Chip
          size="small"
          variant="outlined"
          label={`${op.params.length} parameters`}
          sx={{ borderColor: "#90caf9", fontSize: 12, fontWeight: 500 }}
        />
      </Box>
      <IconButton
        size="small"
        sx={{ color: "#0d47a1", "&:hover": { bgcolor: "#e3f2fd" } }}
        onClick={onClick}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    </Box>
  </Paper>
);

// Mock data (for operation details)
const mockOperationDetails = {
  1234: [
    {
      id: 1,
      title: "Operation 1 : Cleaning",
      status: "ongoing",
      params: [
        { name: "Sulphuric Acid strength", count: 5 },
        { name: "Soap solution strength", count: 215 },
      ],
    },
    {
      id: 2,
      title: "Operation 2 : Draw & Trimming",
      status: "pending",
      params: [{ name: "Wall thickness", count: 6 }],
    },
    {
      id: 3,
      title: "Operation 3 : Body Annealing",
      status: "pending",
      params: [{ name: "Temperature", count: null }],
    },
    {
      id: 4,
      title: "Operation 4 : Finishing",
      status: "pending",
      params: [{ name: "Surface roughness", count: 3 }],
    },
    {
      id: 5,
      title: "Operation 5 : Inspection",
      status: "completed",
      params: [{ name: "Dimensional check", count: 12 }],
    },
  ],
};

export default function OrderDetails() {
  const dispatch = useDispatch();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSection, setActiveSection] = useState("Bullet/409");
  const [modalOperation, setModalOperation] = useState(null);
  const [loadingOperations, setLoadingOperations] = useState(false);
  const [operationDetails, setOperationDetails] = useState([]);

  const [sectionList, setSectionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // This function encapsulates the asynchronous data fetch logic
    const fetchSectionList = async () => {
      try {
        // Dispatch the action and await the result (assuming it returns a Promise)
        let res = await dispatch(ORDER_DETAILSlIST());
        // Correctly call the state setter function with the data
        setSectionList(res.payload.data);
      } catch (err) {
        console.error("Failed to fetch section list:", err);
        setError("Failed to load sections.");
      } finally {
        // Always set loading to false, regardless of success or failure
        setLoading(false);
      }
    };
    fetchSectionList();
  }, [dispatch]);

  // Update selectedOrder when activeSection changes or sectionList loads

  // Fetch operation details when selectedOrder changes
  useEffect(() => {
    const fetchOperations = async () => {
      if (selectedOrder) {
        setLoadingOperations(true);
        try {
          // Replace with your actual API call and parameter
          const res = await dispatch(
            OPERATION_DETAILS({ order_id: selectedOrder?.id })
          );
          const rawData = res.payload.data;

          // --- Data Transformation Logic ---
          const operationsMap = new Map();

          rawData.forEach((item) => {
            const opId = item.operation.id;
            const opName = item.operation.operation_name;

            if (!operationsMap.has(opId)) {
              operationsMap.set(opId, {
                id: opId,
                title: opName,
                status: "pending", // Initial status, you would determine this dynamically
                params: [],
              });
            }

            operationsMap.get(opId).params.push({
              name: item.inspection_parameter.inspection_parameter,
              // You can add more details here if needed
              LSL: item.LSL,
              USL: item.USL,
              target_value: item.target_value,
              likely_defects_classification: item.likely_defects_classification,
            });
          });

          // Convert the map back to an array
          const transformedData = Array.from(operationsMap.values());

          // Sort the operations by their ID or a logical sequence
          transformedData.sort((a, b) => a.id - b.id);

          setOperationDetails(
            transformedData.length
              ? transformedData
              : mockOperationDetails[1234]
          );
        } catch (err) {
          console.error("Failed to fetch operation details:", err);
          setError("Failed to load operations.");
          setOperationDetails([]);
        } finally {
          setLoadingOperations(false);
        }
      } else {
        setOperationDetails([]);
      }
    };
    fetchOperations();
  }, [selectedOrder, dispatch]);

  const sections = useMemo(() => {
    return sectionList ? Object.keys(sectionList) : [];
  }, [sectionList]);

  const orderOptions = useMemo(() => {
    if (sectionList && activeSection && sectionList[activeSection]) {
      return sectionList[activeSection].map((order) => ({
        label: order.order_number,
        ...order,
      }));
    }
    return [];
  }, [activeSection, sectionList]);

  // Split operations into rows of max 3
  const operationRows = useMemo(() => {
    if (loadingOperations || !operationDetails || !operationDetails.length)
      return [];
    const rows = [];
    const maxPerRow = 4;
    for (let i = 0; i < operationDetails.length; i += maxPerRow) {
      rows.push(operationDetails.slice(i, i + maxPerRow));
    }
    return rows;
  }, [operationDetails, loadingOperations]);

  return (
    <Box sx={{ maxWidth: 1300 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
      >
        Order Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: 175 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              backgroundColor: "transparent",
              boxShadow: "none",
              padding: 0,
            }}
          >
            <Paper
              elevation={2} // shadow depth
              sx={{
                p: 2, // padding inside
                borderRadius: 2,
                backgroundColor: "#fff", // white background
                mr: 1,
                pr: 2,
              }}
            >
              {sections && sections.length > 0 ? (
                sections.map((s) => (
                  <SectionItem
                    key={s}
                    active={activeSection === s}
                    text={s}
                    onClick={() => {
                      setActiveSection(s);
                      setOperationDetails([]);
                      setSelectedOrder(null);
                      // setSectionList([]);
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No section
                </Typography>
              )}
            </Paper>
          </Paper>
        </Box>

        {/* Right side */}
        <Box sx={{ flex: 1 }}>
          {/* Filters */}
          <Paper
            elevation={2} // shadow depth
            sx={{
              p: 2, // padding inside
              pb: 1,
              borderRadius: 2,
              backgroundColor: "#fff", // white background
              mb: 2, // margin bottom
            }}
          >
            <Stack
              backgroundColor="#f9fafb"
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              {/* <CustomAutocomplete
                options={orderOptions}
                value={selectedOrder}
                onChange={(_, v) => setSelectedOrder(v)}
                sx={{
                  minWidth: 280,
                  flex: 1,
                  "& .MuiInputBase-root": { backgroundColor: "#fff" },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Ongoing Production Order No."
                    placeholder="Search"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              /> */}
              <CustomAutocomplete
                options={orderOptions}
                value={selectedOrder}
                onChange={(_, v) => setSelectedOrder(v)}
                getOptionLabel={(option) =>
                  option?.label || option?.order_number || ""
                }
                label="Ongoing Production Order No."
              />

              <TextField
                size="small"
                label="Item Code"
                value={selectedOrder?.item_code ?? "NA"}
                sx={{
                  minWidth: 160,
                  flexShrink: 0,
                  ...purpleOutlinedTextFieldStyles,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                }}
                disabled
                InputProps={{ readOnly: true }}
              />
              <TextField
                size="small"
                label="Item Description"
                value={selectedOrder?.item_desc ?? "NA"}
                sx={{
                  flex: 2,
                  minWidth: 200,
                  ...purpleOutlinedTextFieldStyles,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                }}
                disabled
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Stack>
          </Paper>
          {/* Operations */}
          {loadingOperations ? (
            <Typography sx={{ textAlign: "center", mt: 4 }}>
              Loading operations...
            </Typography>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
              {error}
            </Typography>
          ) : !operationDetails.length ? (
            <NoDataFound message="Please Select Ongoing Production Order No." />
          ) : (
            // <Typography sx={{ textAlign: "center", mt: 4 }}>
            //   No operations found for this order.
            // </Typography>
            <Paper
              elevation={2} // shadow depth
              sx={{
                p: 2, // padding inside
                borderRadius: 2,
                backgroundColor: "#fff", // white background
              }}
            >
              <Box>
                {operationRows.map((rowOps, rowIndex) => {
                  const isOddRow = rowIndex % 2 === 0;
                  const displayOps = isOddRow ? rowOps : [...rowOps].reverse();
                  const hasNextRow = rowIndex < operationRows.length - 1;

                  return (
                    <React.Fragment key={rowIndex}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: isOddRow ? "flex-start" : "flex-end",
                          alignItems: "center",
                          // gap: 1,
                          // mb: 1,
                        }}
                      >
                        {displayOps.map((op, idx) => (
                          <React.Fragment key={op.id}>
                            <OperationCard
                              index={idx}
                              op={op}
                              onClick={() => setModalOperation(op)}
                            />
                            {idx !== displayOps.length - 1 && (
                              <FlowArrow
                                direction={isOddRow ? "right" : "left"}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </Box>

                      {/* Vertical arrow only if there is a next row */}
                      {hasNextRow && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: isOddRow
                              ? "flex-end"
                              : "flex-start",
                            mb: 1,
                          }}
                        >
                          <FlowArrow direction="down" />
                        </Box>
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={!!modalOperation} onClose={() => setModalOperation(null)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 600,
            width: "95%",
            p: 3,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {modalOperation?.title}
            </Typography>
            <IconButton onClick={() => setModalOperation(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#1e40af" }}>
                    Parameter
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "#1e40af" }}
                  >
                    Count
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modalOperation?.params?.map((p, i) => (
                  <TableRow
                    key={i}
                    sx={{ "&:nth-of-type(odd)": { bgcolor: "#f9fafb" } }}
                  >
                    <TableCell>
                      {String.fromCharCode(97 + i)}) {p.name}
                    </TableCell>
                    <TableCell align="right">
                      {typeof p.count === "number" ? p.count : "00"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Modal>
    </Box>
  );
}
