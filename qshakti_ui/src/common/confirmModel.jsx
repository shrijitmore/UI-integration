import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const ConfirmModel = ({
  open,
  onClose,
  onConfirm,
  label,
  message,
  confirmText = "YES",
  cancelText = "CANCEL",
  confirmColor = "primary",
  icon = <RocketLaunchIcon fontSize="large" color="primary" />,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.();
  };

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: {
          borderRadius: 3,
          px: 3,
          py: 2,
          minWidth: 420,
          maxWidth: 500,
          boxShadow: 6,
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: "grey.600",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        sx={{
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          pt: 3,
          pb: 1,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        {label}
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center" px={2}>
          <Typography variant="body1" color="text.secondary" mt={1.5}>
            {message}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          pt: 2,
          pb: 3,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            textTransform: "none",
            minWidth: 100,
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          {cancelText}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color={confirmColor}
          sx={{
            textTransform: "none",
            minWidth: 100,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModel;
