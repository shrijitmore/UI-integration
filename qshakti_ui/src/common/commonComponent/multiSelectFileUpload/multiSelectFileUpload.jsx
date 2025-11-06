import React from "react";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MultiFileUpload = ({ files, setFiles, buttonLabel = "Upload Files" }) => {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Button component="label" variant="contained">
        {buttonLabel}
        <input type="file" hidden multiple onChange={handleFileChange} />
      </Button>

      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
        {files.map((file, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: 2,
              bgcolor: "#f5f5f5",
              width: "100px",
              padding: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              height: "20px",
              margin: 0.5,
            }}
          >
            <Tooltip title={file.name}>
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                  mr: 1,
                }}
              >
                {file.name}
              </Typography>
            </Tooltip>
            <IconButton size="small" onClick={() => removeFile(index)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MultiFileUpload;
