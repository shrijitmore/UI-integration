import React, { useEffect, useState } from "react";
import CommonDataGrid from "../../../common/commonComponent/commonDataGrid/commonDataGrid";
import { columns, rows } from "./config";
import {
  productionActionOrders,
  productionOrdersList,
} from "../../../store/slices/openOrders/openOrdersSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../common/ShowToast";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  TextField,
} from "@mui/material";
import {
  Warning as WarningIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Close as CloseIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
// import StopCircleIcon from "@mui/icons-material/StopCircle"; // Complete
// import CancelIcon from "@mui/icons-material/Cancel"; // Close

const ProductionOrders = () => {
  const [totalCount, setTotalCount] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lotNo, setLotNo] = useState("");

  const handleActionClick = ({ status, row }) => {
    setSelectedAction({ status, row });
    setConfirmationOpen(true);
  };

  const handleStart = async ({ status, row }) => {
    try {
      let response = await dispatch(
        productionActionOrders({
          data: { action: status },
          id: row.id,
          lot_number: lotNo,
        })
      ).unwrap();
      showToast(response?.message, "success");
      setConfirmationOpen(false);
      setLotNo("");
      const result = await dispatch(
        productionOrdersList({
          page: paginationModel.page + 1,
          page_size: paginationModel.pageSize,
        })
      ).unwrap();
      setRows(result?.data || []);
    } catch (error) {
      // toast.error("Failed to start order");
    }
  };

  const onButtonClick = async () => {
    if (selectedAction?.status === "start") {
      if (!lotNo.trim()) {
        setError("Lot No is required");
        return;
      }
    }
    setError("");

    await handleStart(selectedAction);
  };
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await dispatch(
          productionOrdersList({
            page: paginationModel.page + 1, // your API expects 1-based index
            page_size: paginationModel.pageSize,
          })
        ).unwrap();
        setRows(result?.data || []);
        setTotalCount(result || 0);
      } catch (err) {
        setError("Failed to load production orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [dispatch, paginationModel]);
  // const isStartAction = selectedAction?.status === "start";

  /// updated code
  const status = selectedAction?.status?.toLowerCase();
  let dialogIcon = null;
  let dialogColor = "";
  switch (status) {
    case "start":
      dialogIcon = <PlayArrowIcon sx={{ fontSize: 50, color: "white" }} />;
      dialogColor = "#1976d2";
      break;
    case "stop":
      dialogIcon = <PauseIcon sx={{ fontSize: 50, color: "white" }} />;
      dialogColor = "#d32f2f";
      break;
    case "close":
      dialogIcon = <CancelIcon sx={{ fontSize: 50, color: "white" }} />;
      dialogColor = "#ef6c00";
      break;
    case "complete":
      dialogIcon = <StopCircleIcon sx={{ fontSize: 50, color: "white" }} />;
      dialogColor = "#388e3c";
      break;
    default:
      dialogIcon = <StopCircleIcon sx={{ fontSize: 50, color: "white" }} />;
      dialogColor = "#999";
      break;
  }
  //  : <StartIcon />;
  const rowsWithId = rows.map((row, index) => ({
    id: row.order_number,
    ...row,
  }));

  const handleDialogClose = () => {
    setConfirmationOpen(false);
    setLotNo("");
    setError("");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          width: "100%",
          mb: 1,
          // mt: 2,
        }}
      >
        <Typography
          variant="h4"
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
          }}
          onClick={() => navigate("/productionorders")}
        >
          Production Orders
        </Typography>
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
          getRowId={(row) => row?.order_number}
          getRowHeight={() => 100}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          rowCount={totalCount?.total || 0}
          paginationMode="server"
          enablePagination={true}
          rows={rows.map((item, index) => ({
            ...item,
            srNo: index + 1,
          }))}
          columns={columns(handleActionClick)}
          hideFooterPagination
          disableColumnMenu
          disableRowSelectionOnClick
          rowHeight={48}
          // height={"95%"}
        />

        <Dialog
          open={confirmationOpen}
          onClose={handleDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
        >
          <Box
            sx={{
              backgroundColor: dialogColor,
              color: "white",
              p: 3,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleDialogClose}
              sx={{ position: "absolute", top: 12, right: 12, color: "white" }}
            >
              <CloseIcon />
            </IconButton>

            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  p: 1,
                }}
              >
                {dialogIcon}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Confirm {selectedAction?.status} Order
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  Please review the details before proceeding
                </Typography>
              </Box>
            </Box>
          </Box>

          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to{" "}
                <Chip
                  label={selectedAction?.status}
                  sx={{
                    backgroundColor: dialogColor,
                    color: "white",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                  }}
                  icon={dialogIcon}
                  size="small"
                />{" "}
                this Order?
              </Typography>

              <Box sx={{ pl: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: "#888",
                    }}
                  >
                    Order Details
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ minWidth: 80, color: "#666" }}
                    >
                      Order No:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedAction?.row?.order_number || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ minWidth: 80, color: "#666" }}
                    >
                      Item Code:
                    </Typography>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {selectedAction?.row?.item_code || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedAction?.status === "start" && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          width: 80,
                          color: "#666",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        Lot No:<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Enter Lot No"
                        sx={{ width: 250 }}
                        value={lotNo}
                        onChange={(e) => {
                          setLotNo(e.target.value);
                          if (error && e.target.value.trim() !== "") {
                            setError("");
                          }
                        }}
                        error={!!error}
                        helperText={error}
                      />
                    </Box>
                  )}

                  {selectedAction?.row?.quantity && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ minWidth: 80, color: "#666" }}
                      >
                        Quantity:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedAction?.row?.quantity}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#fff3cd",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  gap: 1.5,
                }}
              >
                <WarningIcon sx={{ color: "#856404" }} />
                <Typography sx={{ fontSize: "0.875rem", color: "#856404" }}>
                  This action cannot be undone. Please make sure you have
                  reviewed all the details before confirming.
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
            <Button
              onClick={() => {
                setConfirmationOpen(false);
                setLotNo("");
                setError("");
              }}
              variant="outlined"
              sx={{ borderColor: "#d32f2f", color: "#d32f2f", fontWeight: 600 }}
            >
              Cancel
            </Button>

            <Button
              onClick={onButtonClick}
              variant="contained"
              startIcon={dialogIcon}
              sx={{
                backgroundColor: dialogColor,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Yes, {selectedAction?.status} Order
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ProductionOrders;
