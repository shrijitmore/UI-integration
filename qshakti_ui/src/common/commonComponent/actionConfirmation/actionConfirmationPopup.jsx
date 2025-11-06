import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import "../../../assets/css/common.css";
import ButtonLoaderWrapper from "../ButtonLoaderWrapper";
import { useState } from "react";
const iconMap = {
  delete: <DeleteIcon sx={{ fontSize: 50, color: "error.main" }} />,
  cancel: <CancelIcon sx={{ fontSize: 50, color: "error.main" }} />,
  check: <CheckCircleIcon sx={{ fontSize: 50, color: "success.main" }} />,
  warning: <WarningAmberIcon sx={{ fontSize: 50, color: "warning.main" }} />,
};

export default function ActionConfirmationPopup({
  open,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  confirmColor = "primary", // e.g. success, error, warning
  iconType = "check", // one of: check, cancel, delete, warning
}) {
  const [loader, setLoader] = useState(false);
  const handleYes = () => {
    onConfirm(true);
  };

  const handleCancel = () => {
    onConfirm(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 400,
          textAlign: "center",
          p: 2,
          position: "relative",
        },
      }}
    >
      <IconButton
        onClick={handleCancel}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "grey.500",
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            borderRadius: "50%",
            backgroundColor: "#fdecea",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconMap[iconType] || iconMap["warning"]}
        </Box>
      </Box>

      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          className="cancelButton"
          sx={{ minWidth: 100, height: 36 }}
          color="error"
        >
          Cancel
        </Button>
        <ButtonLoaderWrapper
          loading={loader}
          button={
            <Button
              onClick={() => {
                setLoader(true);
                handleYes();
              }}
              variant="contained"
              color={confirmColor}
              sx={{ minWidth: 100, height: 36 }}
            >
              {confirmLabel}
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
}
