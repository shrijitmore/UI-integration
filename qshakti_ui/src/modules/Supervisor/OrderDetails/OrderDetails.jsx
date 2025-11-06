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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Collapse } from "@mui/material";
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
  switch (status) {
    case "completed":
      return (
        <Chip
          size="small"
          color="success"
          variant="filled" // More prominent
          icon={<CheckCircleIcon fontSize="small" />}
          label="Completed"
          sx={{ fontWeight: 600 }}
        />
      );
    case "on-going":
      return (
        <Chip
          size="small"
          color="primary"
          variant="filled" // Consistent with completed
          icon={<HourglassBottomIcon fontSize="small" />}
          label="Ongoing"
          sx={{ fontWeight: 600 }}
        />
      );
    case "pending":
    default:
      return (
        <Chip
          size="small"
          color="info" // Distinct color for pending
          variant="outlined" // Indicates waiting state
          icon={<AccessTimeIcon fontSize="small" />}
          label="Pending"
          sx={{ fontWeight: 600 }}
        />
      );
  }
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
const OperationCard = ({ op, index, expandedId, setExpandedId }) => {
  const isExpanded = expandedId === op?.id;

  return (
    <Paper
      elevation={isExpanded ? 10 : 3}
      sx={{
        width: {
          xs: "100%",
          sm: "calc(50% - 16px)",
          md: "calc(33.33% - 16px)",
          lg: "calc(25% - 16px)",
        },
        minWidth: 200,
        maxWidth: 400,
        p: 1,
        flexGrow: 1,
        borderRadius: 2,
        border: isExpanded ? "2px solid #1976d2" : "1px solid #e0e0e0",
        bgcolor: isExpanded ? "#e3f2fd" : "#fff",
        boxShadow: isExpanded
          ? "0 12px 24px rgba(25, 118, 210, 0.35)"
          : "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isExpanded
            ? "0 16px 30px rgba(25, 118, 210, 0.45)"
            : "0 8px 16px rgba(0,0,0,0.15)",
        },
      }}
      onClick={() => setExpandedId(isExpanded ? null : op.id)}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: "#202124",
            wordBreak: "break-word",
            pb: 0.5,
          }}
        >
          Operation {index}: {op.title}
        </Typography>

        {/* Chips */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {statusChip(op.status)}
            <Chip
              size="small"
              variant="outlined"
              label={`${op.params.length} parameters`}
              sx={{
                borderColor: "#90caf9",
                color: "#1565c0",
                fontWeight: 600,
                bgcolor: isExpanded ? "#e3f2fd" : "#f5faff",
              }}
            />
            <ExpandMoreIcon
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform .3s ease-in-out", // Smoother icon rotation
                color: "#616161", // Slightly darker gray for icon
                fontSize: 26, // Slightly larger icon
              }}
            />
          </Box>
        </Box>
      </Box>

      {isExpanded && <Divider sx={{ borderColor: "#e0e0e0" }} />}

      {/* Expandable Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <TableContainer
          component={Box}
          sx={{
            maxHeight: 250,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 8, bgcolor: "#f1f3f4" },
            "&::-webkit-scrollbar-thumb": {
              background: "#bdc1c6",
              borderRadius: 8,
              border: "2px solid #f1f3f4",
            },
            // p: 1.5,
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#1565c0", // Darker blue text
                    bgcolor: "#e3f2fd", // Light pastel blue background
                    borderBottom: "2px solid #bbdefb",
                  }}
                >
                  Parameter
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: "#1565c0",
                    bgcolor: "#e3f2fd",
                    borderBottom: "2px solid #bbdefb",
                  }}
                >
                  Count
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {op.params.map((p, i) => (
                <TableRow
                  key={i}
                  sx={{
                    bgcolor: i % 2 === 0 ? "#ffffff" : "#f9f9f9", // alternating
                    "&:hover": {
                      bgcolor: "#f1faff", // subtle hover
                    },
                  }}
                >
                  <TableCell sx={{ wordBreak: "break-word", color: "#3c4043" }}>
                    {String.fromCharCode(97 + i)}) {p.name}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#3c4043" }}>
                    {p.sample_size ? p.sample_size : "00"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

export default function OrderDetails() {
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSection, setActiveSection] = useState("");
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
        if (res?.payload?.data) {
          const data = res.payload.data;

          // Set all sections
          setSectionList(data);

          // Get first section key (zero index)
          const firstSection = Object.keys(data)[0] || "";

          // Set active section
          setActiveSection(firstSection);

          // Get first order inside the first section
          const firstOrder =
            firstSection && data[firstSection]?.[0]
              ? data[firstSection][0]
              : null;

          // Set selected order (first one as default)
          setSelectedOrder(firstOrder);
        }
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
            const opId = item.id; // ✅ operation id
            const opName = item.operation_name;
            const opStatus = item.operation_status;

            if (!operationsMap.has(opId)) {
              operationsMap.set(opId, {
                id: opId,
                title: opName,
                status: opStatus,
                params: [],
              });
            }
            Object?.values(item.inspection_parameter || {})?.forEach(
              (param) => {
                operationsMap.get(opId).params.push({
                  id: param.id,
                  code: param.inspection_parameter_id,
                  name: param.inspection_parameter,
                  description: param.parameter_description,
                  sample_size: param.sample_size,
                  LSL: param.LSL || null,
                  USL: param.USL || null,
                  target_value: param.target_value || null,
                  likely_defects_classification:
                    param.likely_defects_classification || null,
                });
              }
            );
          });

          // Convert the map back to an array
          const transformedData = Array.from(operationsMap.values());

          // Sort by operation id (ascending)
          transformedData.sort((a, b) => a.id - b.id);

          setOperationDetails(transformedData.length ? transformedData : []);
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
    const maxPerRow = 3;
    for (let i = 0; i < operationDetails.length; i += maxPerRow) {
      rows.push(operationDetails.slice(i, i + maxPerRow));
    }
    return rows;
  }, [operationDetails, loadingOperations]);

  return (
    <Box>
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
                      const firstOrder =
                        s && sectionList[s]?.[0] ? sectionList[s][0] : null;

                      // Set selected order (first one as default)
                      setSelectedOrder(firstOrder);
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
            <Paper
              elevation={2} // shadow depth
              sx={{
                p: 2, // padding inside
                borderRadius: 2,
                backgroundColor: "#fff", // white background
              }}
            >
              <Box>
                {(() => {
                  let globalIndex = 0; // 🔵 start counter

                  return operationRows.map((rowOps, rowIndex) => {
                    const isOddRow = rowIndex % 2 === 0;
                    // const displayOps = isOddRow ? rowOps : [...rowOps];
                    // const displayOps = rowOps.;

                    const rowWithIndexes = rowOps.map((op) => ({
                      ...op,
                      displayIndex: ++globalIndex, // continuous increment
                    }));

                    // 🔥 Then reverse only for visual rendering (odd rows)
                    const displayOps = isOddRow
                      ? rowWithIndexes
                      : [...rowWithIndexes].reverse();
                    const hasNextRow = rowIndex < operationRows.length - 1;

                    return (
                      <React.Fragment key={rowIndex}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: isOddRow
                              ? "flex-start"
                              : "flex-end",
                            alignItems: "center",
                          }}
                        >
                          {displayOps.map((op, idx) => {
                            return (
                              <React.Fragment key={op.id}>
                                <OperationCard
                                  index={op.displayIndex} // 🔵 continuous index
                                  op={op}
                                  expandedId={expandedId}
                                  setExpandedId={setExpandedId}
                                />
                                {idx !== displayOps.length - 1 && (
                                  <FlowArrow
                                    direction={isOddRow ? "right" : "left"}
                                  />
                                )}
                              </React.Fragment>
                            );
                          })}
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
                  });
                })()}
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
