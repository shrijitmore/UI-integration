export { default } from "./OrderDetails";

import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Autocomplete,
  TextField,
  Paper,
  Collapse,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SearchIcon from "@mui/icons-material/Search";

const mockOrders = [
  {
    id: "1234",
    itemCode: "001",
    description: "Lorem Ipsum dolor velo tarani",
    operations: [
      {
        id: 1,
        title: "Operation 1 : Cleaning",
        status: "ongoing",
        params: [
          { name: "Sulphuric Acid strength", count: 5 },
          { name: "Soap solution strength", count: 215 },
          { name: "Soap formula strength", count: 4 },
        ],
      },
      {
        id: 2,
        title: "Operation 2 : Draw & Trimming",
        status: "pending",
        params: [
          { name: "Wall thickness at 2.24mm from inside dome", count: 6 },
          { name: "Wall thickness at 9.24mm from inside dome", count: 6 },
          { name: "Wall thickness at 28.24mm from inside dome", count: 6 },
        ],
      },
      {
        id: 3,
        title: "Operation 3 : Body Annealing",
        status: "pending",
        params: [{ name: "Sulphuric Acid strength", count: null }],
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
      {
        id: 6,
        title: "Operation 6 : Packaging",
        status: "pending",
        params: [{ name: "Box integrity", count: 2 }],
      },
      {
        id: 7,
        title: "Operation 7 : Labeling",
        status: "pending",
        params: [{ name: "Label adhesion", count: 5 }],
      },
      {
        id: 8,
        title: "Operation 8 : Palletizing",
        status: "pending",
        params: [{ name: "Stack stability", count: 4 }],
      },
      {
        id: 9,
        title: "Operation 9 : Dispatch QA",
        status: "pending",
        params: [{ name: "Seal verification", count: 3 }],
      },
      {
        id: 10,
        title: "Operation 10 : Shipment",
        status: "pending",
        params: [{ name: "Waybill check", count: 1 }],
      },
    ],
  },
];

const statusChip = (status) => {
  if (status === "completed")
    return (
      <Chip
        size="small"
        color="success"
        icon={<CheckCircleIcon />}
        label="Completed"
        sx={{ ml: 1 }}
      />
    );
  if (status === "ongoing")
    return (
      <Chip
        size="small"
        color="primary"
        icon={<HourglassBottomIcon />}
        label="Ongoing"
        sx={{ ml: 1 }}
      />
    );
  return (
    <Chip
      size="small"
      color="default"
      icon={<RadioButtonUncheckedIcon />}
      label="Pending"
      sx={{ ml: 1 }}
    />
  );
};

const ChevronItem = ({ active, text, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "relative",
      bgcolor: active ? "#0d47a1" : "#ffffff",
      color: active ? "#ffffff" : "#1e293b",
      borderRadius: 1,
      px: 2,
      py: 1,
      mb: 1.2,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 700,
      boxShadow: active
        ? "0 3px 8px rgba(13,71,161,.35)"
        : "0 1px 3px rgba(0,0,0,.12)",
      transition: "all .2s ease",
      "&::after": {
        content: '""',
        position: "absolute",
        right: -14,
        top: 0,
        width: 0,
        height: 0,
        borderTop: "18px solid transparent",
        borderBottom: "18px solid transparent",
        borderLeft: active ? "14px solid #0d47a1" : "14px solid #ffffff",
        filter: active ? "drop-shadow(2px 2px 3px rgba(0,0,0,.2))" : "none",
      },
      "&:hover": { bgcolor: active ? "#0c3f90" : "#f5f7fb" },
    }}
  >
    {text}
  </Box>
);

export default function OrderDetails() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOperationId, setExpandedOperationId] = useState(null);
  const [activeSection, setActiveSection] = useState("Bullet");
  const opRefs = useRef({});
  const railRef = useRef(null);
  const [detailsWidthPercent, setDetailsWidthPercent] = useState(11);

  const orderOptions = useMemo(
    () => mockOrders.map((o) => ({ label: o.id, ...o })),
    []
  );

  const activeOrder = selectedOrder || null;

  const sections = ["Bullet", "Section 3", "Section 4", "Section 5"];
  const activeOperation = useMemo(() => {
    if (!activeOrder) return null;
    return (
      activeOrder.operations.find((o) => o.id === expandedOperationId) || null
    );
  }, [activeOrder, expandedOperationId]);

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}
      >
        Order Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* Left Sidebar Sections */}
        <Box sx={{ width: 140, flexShrink: 0 }}>
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2 }}>
            {sections.map((s) => (
              <ChevronItem
                key={s}
                active={activeSection === s}
                text={s}
                onClick={() => setActiveSection(s)}
              />
            ))}
          </Paper>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0, // important for overflow to work in flexbox
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 2, flexWrap: "wrap" }}
          >
            <Autocomplete
              options={orderOptions}
              sx={{ minWidth: 280, flexGrow: 1, maxWidth: 360 }}
              value={selectedOrder}
              onChange={(_, v) => {
                setSelectedOrder(v);
                setExpandedOperationId(v?.operations?.[0]?.id ?? null);
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
            />
            <TextField
              size="small"
              label="Item Code"
              value={activeOrder?.itemCode ?? "-"}
              sx={{ width: 160 }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              size="small"
              label="Item Description"
              value={activeOrder?.description ?? "-"}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Stack>

          {activeOrder && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                whiteSpace: "nowrap",
                scrollBehavior: "smooth",
                pb: 2,
                pl: 2,
                maxWidth: "900px",
                // scrollbar styles
                "&::-webkit-scrollbar": { height: 8 },
                "&::-webkit-scrollbar-thumb": {
                  background: "#90caf9",
                  borderRadius: 6,
                },
                "&::-webkit-scrollbar-track": {
                  background: "#e3f2fd",
                },
              }}
              ref={railRef}
            >
              {activeOrder.operations.map((op, idx) => (
                <Box
                  key={op.id}
                  sx={{ display: "flex", alignItems: "stretch" }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      flex: "0 0 300px",
                      borderRadius: 2,
                      border:
                        expandedOperationId === op.id
                          ? "2px solid #66bb6a"
                          : "1px solid #e0e0e0",
                      bgcolor:
                        expandedOperationId === op.id ? "#f1f8f6" : "#fafafa",
                      display: "flex",
                      flexDirection: "column",
                      transform:
                        expandedOperationId === op.id
                          ? "scale(1.04)"
                          : "scale(1)",
                      boxShadow:
                        expandedOperationId === op.id
                          ? "0 8px 22px rgba(102,187,106,.35)"
                          : "0 3px 8px rgba(0,0,0,.1)",
                      transition: "all .25s ease",
                      scrollSnapAlign: "center",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 6px 16px rgba(0,0,0,.15)",
                      },
                      minWidth: 280,
                      maxWidth: 320,
                    }}
                    ref={(el) => {
                      if (el) opRefs.current[op.id] = el;
                    }}
                    onClick={() => {
                      setExpandedOperationId(
                        expandedOperationId === op.id ? null : op.id
                      );
                      setTimeout(() => {
                        const cardEl = opRefs.current[op.id];
                        const containerEl = railRef.current;
                        if (cardEl && containerEl) {
                          const percent = Math.max(
                            5,
                            Math.min(
                              100,
                              (cardEl.offsetWidth / containerEl.clientWidth) *
                                100
                            )
                          );
                          setDetailsWidthPercent(Number(percent.toFixed(2)));
                        }
                        cardEl?.scrollIntoView({
                          behavior: "smooth",
                          inline: "center",
                          block: "nearest",
                        });
                      }, 0);
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          minHeight: 56,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#0f4c3a",
                            fontSize: 14,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 200,
                          }}
                        >
                          {op.title}
                        </Typography>
                        <Box
                          sx={{
                            mt: 0.5,
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {statusChip(op.status)}
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`${op.params.length} tests`}
                            sx={{ borderColor: "#90caf9" }}
                          />
                        </Box>
                      </Box>
                      <ExpandMoreIcon
                        sx={{
                          transform:
                            expandedOperationId === op.id
                              ? "rotate(180deg)"
                              : "rotate(0)",
                          transition: "transform .2s ease",
                          color: "#546e7a",
                        }}
                      />
                    </Box>
                    <Divider />
                  </Paper>

                  {idx < activeOrder.operations.length - 1 && (
                    <ArrowForwardIosIcon
                      sx={{
                        mx: 1,
                        color: "#b0bec5",
                        alignSelf: "center",
                        fontSize: 16,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Collapse
            in={!!activeOperation}
            timeout={250}
            unmountOnExit
            sx={{
              "& .MuiCollapse-wrapperInner": {
                width: `${detailsWidthPercent}%`,
                maxWidth: "100%",
                minWidth: 280,
                transition: "width 0.3s ease",
              },
            }}
          >
            {activeOperation && (
              <Paper
                elevation={0}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e6e9ef",
                  maxWidth: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    bgcolor: "#f8fafc",
                  }}
                >
                  <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {activeOperation.title}
                  </Typography>
                  {statusChip(activeOperation.status)}
                </Box>
                <Divider />
                <TableContainer
                  component={Box}
                  sx={{
                    maxHeight: 320,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { width: 6 },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#b0bec5",
                      borderRadius: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                  }}
                >
                  <Table
                    stickyHeader
                    size="small"
                    aria-label="parameters table"
                    sx={{ tableLayout: "fixed", minWidth: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: "#e8f0fe",
                            color: "#1e40af",
                            fontWeight: 700,
                            width: "60%",
                            wordBreak: "break-word",
                          }}
                        >
                          Parameters
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            bgcolor: "#e8f0fe",
                            color: "#1e40af",
                            fontWeight: 700,
                            width: "40%",
                            wordBreak: "break-word",
                          }}
                        >
                          Testing Count
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeOperation.params.map((p, i) => (
                        <TableRow
                          key={i}
                          sx={{ "&:nth-of-type(odd)": { bgcolor: "#f9fafb" } }}
                        >
                          <TableCell
                            sx={{ color: "#334155", wordBreak: "break-word" }}
                          >
                            {String.fromCharCode(97 + i) + ") "} {p.name}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: "#0f172a", fontWeight: 600 }}
                          >
                            {typeof p.count === "number" ? p.count : "00"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}



