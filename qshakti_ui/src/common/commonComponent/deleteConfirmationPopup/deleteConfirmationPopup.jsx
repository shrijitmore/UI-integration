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

export default function DeleteConfirmationPopup({
  open,
  onConfirm,
  title,
  message,
  onConfirmDelete,
}) {
  const handleYes = () => {
    // onConfirmDelete();
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
          <DeleteIcon sx={{ fontSize: 50, color: "error.main" }} />
        </Box>
      </Box>

      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem", pb: 0 }}>
        {title || "Confirm Delete"}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          {message || "Are you sure you want to delete your record."}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mt: 1 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{ minWidth: 100, height: 36 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleYes}
          variant="contained"
          color="error"
          sx={{ minWidth: 100, height: 36 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
