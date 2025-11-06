import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import config from "../../config";
import { showToast } from "../ShowToast";
import ConfirmModel from "../confirmModel";
import DeleteConfirmationPopup from "../commonComponent/deleteConfirmationPopup/deleteConfirmationPopup";

const AttachmentPreviewSection = ({
  attachments,
  handleRemoveAttachment,
  viewId,
  editId,
  disabled,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [payloadRemoveFile, setPayloadRemoveFile] = useState({
    status: false,
    id: null,
  });

  const handleConfirmClose = () => {
    setShowDownloadConfirm(false);
  };

  const normalizeUrl = (url) => url.replace(/^https?:\/\//, "");

  const handleOpenPreview = (file) => {
    let fileUrl;
    if (typeof file === "string") {
      let normalizedFile = file.trim();

      if (normalizedFile.startsWith("http://")) {
        normalizedFile = normalizedFile.replace("http://", "https://");
      }

      if (normalizedFile.startsWith(config.apiUrl)) {
        fileUrl = normalizedFile;
      } else {
        fileUrl = `${config.apiUrl}/${normalizedFile.replace(/^\/+/, "")}`;
      }
    } else if (file instanceof File) {
      fileUrl = URL.createObjectURL(file);
    }
    const unsupportedExtensions = ["xls", "xlsx", "doc", "docx"];
    const extension = fileUrl.split(".").pop().toLowerCase();
    if (unsupportedExtensions.includes(extension)) {
      showToast(
        "Unsupported file type for preview please check download",
        "error"
      );
      setPreviewUrl(fileUrl);
      handleDownload();
      return null;
    }
    setPreviewUrl(fileUrl);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl("");
  };
  const handleDownload = async () => {
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = previewUrl.split("/").pop() || "downloaded-file";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const shortenFilename = (name = "") => {
    if (name.length <= 10) return name;
    const ext = name.split(".").pop();
    return `${name.slice(0, 10)}...${name.slice(-10)}`;
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,

          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        {attachments &&
          attachments
            ?.filter((att) => att != null)
            .map((att, index) => (
              <Box key={att.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    {`Attachment ${index + 1}`}
                  </Typography>
                  <Paper
                    sx={{
                      p: 1,
                      minWidth: 200,
                      position: "relative",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      flexGrow: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, pr: 4 }}>
                      {shortenFilename(
                        viewId
                          ? typeof att?.file === "string"
                            ? att.file.split("/").pop()
                            : ""
                          : editId
                          ? typeof att?.file === "string"
                            ? att?.file.split("/").pop()
                            : att?.file?.name
                          : att?.name?.split("/").pop()
                      )}
                    </Typography>

                    {!viewId && (
                      <IconButton
                        size="small"
                        disabled={disabled}
                        onClick={() => {
                          setPayloadRemoveFile({
                            status: typeof att?.file === "string",
                            id: att.id,
                            index: index,
                          });
                          setShowDownloadConfirm(true);
                        }}
                        sx={{ position: "absolute", top: 6, right: 6 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>

                  {/* Preview link */}
                  <Typography
                    variant="body2"
                    onClick={() => handleOpenPreview(att.file || att.name)}
                    sx={{
                      color: "primary.main",
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Preview
                  </Typography>
                </Box>
              </Box>
            ))}
      </Box>
      <DeleteConfirmationPopup
        open={showDownloadConfirm}
        onConfirm={() => {
          setShowDownloadConfirm(false);
        }}
        onConfirmDelete={() => {
          handleRemoveAttachment(
            payloadRemoveFile.status,
            payloadRemoveFile.id,
            payloadRemoveFile.index
          );
        }}
      />
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Preview
          <IconButton
            onClick={handleDownload}
            sx={{ position: "absolute", right: 48, top: 8 }}
          >
            <DownloadIcon />
          </IconButton>
          <IconButton
            onClick={handleClosePreview}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>No preview available.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttachmentPreviewSection;
