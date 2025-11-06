import React, { useRef, useState } from "react";
import { Box, Typography, Button, Input, IconButton } from "@mui/material";
import uploadIcon from "../../assets/bidsSvg/UploadtoCloud.svg";
import { showToast } from "../ShowToast";
import { useDispatch } from "react-redux";
import {
  createAttachmentObjects,
  revokeAttachmentUrls,
} from "../upload/config";
import AttachmentPreviewSection from "../upload/AttachmentPreviewSection";

import { deleteBidAttachmentById } from "../../store/slices/admin/bidListSlice";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { deleteBrdAttachmentById } from "../../store/slices/admin/brdDetailSlice";
import LoaderComponent from "../commonComponent/loader/loaderComponent";

const FileUpload = ({
  setAttachments,
  attachments,
  viewId,
  editId,
  acceptFiletypes = "*/*",
  multiple = "multiple",
  setIsAttachmentRemoved,
  disabled = false,
  component,
  apiCall,
  customRemoveHandler = false,
  customRemoveHandlerApply,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);


  // const handleFileUpload = async (e) => {
  //   setLoading(true);
  //   const files = Array.from(e.target.files);
  //   const validFiles = files.filter((file) => {
  //     const fileExtension = file.name.split(".").pop();
  //     return acceptFiletypes.includes(`.${fileExtension}`);
  //   });

  //   if (validFiles.length !== files.length) {
  //     showToast("Please upload pdf Only.", "error");
  //   }
  //   const newAttachments = createAttachmentObjects(validFiles);
  //   setTimeout(() => {
  //     if (newAttachments && newAttachments.length > 0) {
  //       if (component === "comment" || component === "vendor_registration") {
  //         setAttachments((prev) => [newAttachments[0]]);
  //       } else {
  //         setAttachments((prev) => [...prev, ...newAttachments]);
  //       }
  //     }

  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }

  //     setLoading(false);
  //   }, 1500);
  //   //  setLoading(false);
  // };
const handleFileUpload = async (e) => {
  setLoading(true);
  const files = Array.from(e.target.files);
  const maxFileSizeMB = 12;
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  // Validate file types and size
  const validFiles = [];
  let hasInvalidType = false;
  let hasOversizedFile = false;

  files.forEach((file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isValidType = acceptFiletypes.includes(`.${fileExtension}`);
    const isValidSize = file.size <= maxFileSizeBytes;

    if (!isValidType) hasInvalidType = true;
    if (!isValidSize) hasOversizedFile = true;

    if (isValidType && isValidSize) {
      validFiles.push(file);
    }
  });

  // Show relevant error messages
  if (hasInvalidType) {
    showToast("Please upload PDF files only.", "error");
  }

  if (hasOversizedFile) {
    showToast(`File size should not exceed ${maxFileSizeMB}MB.`, "error");
  }

  // Continue only with valid files
  if (validFiles.length === 0) {
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    return;
  }

  const newAttachments = createAttachmentObjects(validFiles);

  setTimeout(() => {
    if (newAttachments && newAttachments.length > 0) {
      if (component === "comment" || component === "vendor_registration") {
        setAttachments((prev) => [newAttachments[0]]);
      } else {
        setAttachments((prev) => [...prev, ...newAttachments]);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setLoading(false);
  }, 1500);
};

  const handleRemoveAttachment = async (eidtStatus, id) => {
    if (editId && eidtStatus) {
      let res = await dispatch(
        apiCall === "brdDetails"
          ? deleteBrdAttachmentById({ editId, id })
          : deleteBidAttachmentById({ editId, id })
      ).unwrap();
      showToast(res.message, "success");
      const file = attachments.find((a) => a.id === id);
      revokeAttachmentUrls([file]);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } else {
      const file = attachments.find((a) => a.id === id);
      revokeAttachmentUrls([file]);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
      showToast("Attachment removed successfully", "success");
      setIsAttachmentRemoved(true);
    }
  };
  return component == "comment" ? (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 120,
            width: "100%",
          }}
        >
          <LoaderComponent />
        </Box>
      ) : (
        <>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept={acceptFiletypes}
            multiple={multiple}
            onChange={handleFileUpload}
            disabled={disabled}
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ color: "gray" }}
          >
            <AttachFileIcon />
          </IconButton>
        </>
      )}
    </>
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, padding: 2 }}>
      <>
        <Box
          sx={{
            border: "1px solid #757575",
            borderRadius: "8px",
            height: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            width: { xs: "100%", sm: "60%" },
          }}
          component="label"
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 120,
                width: "100%",
              }}
            >
              <LoaderComponent />
            </Box>
          ) : (
            <>
              <img
                src={uploadIcon}
                alt="Upload"
                style={{ width: "50px", height: "50px" }}
              />
              <Typography sx={{ color: "#757575" }} mt={1} textAlign="center">
                Upload a file
              </Typography>
            </>
          )}
          <input
            type="file"
            hidden
            multiple={multiple}
            accept={acceptFiletypes}
            onChange={handleFileUpload}
            ref={fileInputRef}
            disabled={viewId || loading || disabled}
          />
        </Box>

        <Box
          sx={{ display: "flex", flexWrap: "wrap", gap: 2, paddingBottom: 2 }}
        >
          <AttachmentPreviewSection
            attachments={attachments}
            handleRemoveAttachment={
              customRemoveHandler
                ? customRemoveHandlerApply
                : handleRemoveAttachment
            }
            viewId={viewId}
            editId={editId}
            disabled={disabled}
            loading={loading}
          />
        </Box>
      </>
    </Box>
  );
};

export default FileUpload;
