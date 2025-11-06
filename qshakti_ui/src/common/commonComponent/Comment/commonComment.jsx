import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  IconButton,
  Stack,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SyncSharpIcon from "@mui/icons-material/SyncSharp";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PersonProfile from "../../../assets/bidsSvg/profileIcon.png";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../../upload/FileUpload";
import BidCommentsList from "../../../modules/admin/createBidComponent/BidCommentsList";
import { shortenFilename } from "../../../modules/admin/createBidComponent/Config";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { showToast } from "../../ShowToast";
import { verifyVendorProposalEvaluation } from "../../../store/slices/admin/openBidSlice";
import { postProposalCommentList } from "../../../store/slices/vendor/appliedBids/appliedBidSlice";
import { getViewBidApplied } from "../../../store/slices/vendor/vendorOpenBids/vendorOpenBidSlice";
import CancelIcon from "@mui/icons-material/Cancel";
function CommonComment({
  venProposalId,
  id,
  isView,
  editId,
  dataNew,
  onClose,
}) {
  const [commentsData, setCommentsData] = useState([]);
  const role = sessionStorage.getItem("role");
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [attachmentFile, setAttachmentFile] = useState([]);
  const handleSendComment = async () => {
    const formData = new FormData();
    formData.append("comment", commentText);
    formData.append("vendor_proposal_id", venProposalId);
  };
  const handleClick = async () => {};
  const comment = async (venProposalId) => {
  };
  useEffect(() => {
    if (venProposalId) {
      comment(venProposalId);
    }
  }, [venProposalId]);
  return (
    <>
      <IconButton
        onClick={onClose}
        disableRipple
        sx={{
          position: "absolute",
          top: -20,
          right: -16,
          color: "#bb0f0f",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "&:active": {
            backgroundColor: "transparent",
          },
          "&:focus": {
            backgroundColor: "transparent",
          },
        }}
      >
        <CancelIcon />
      </IconButton>
      <Typography sx={{ fontWeight: 600, fontSize: 20, p: 2 }}>
        Comment{" "}
      </Typography>
      <Box
        sx={{
          flex: "4",
          backgroundColor: "#fff",
          padding: 2,
          borderRadius: 2,
        }}
      >
        {role == 1 && (
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-start" }}>
            <Avatar
              sx={{
                bgcolor: "#90caf9",
                width: 36,
                height: 36,
                mt: "6px",
              }}
            >
              <img alt="User" style={{ width: "100%", height: "100%" }} />
            </Avatar>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Add a comment or type @ to attach a file"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    alignItems: "flex-start",
                    alignItems: "center",
                    fontSize: "14px",
                    padding: "8px 12px",
                  },
                  "& .MuiInputBase-inputMultiline": {
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Stack direction="row" alignItems="center">
                        <FileUpload
                          component="comment"
                          multiple
                          setAttachments={setAttachmentFile}
                          attachments={attachmentFile}
                          viewId={isView}
                          editId={editId}
                          acceptFiletypes={[".pdf"]}
                        />
                        <Tooltip title="Action Needed">
                          <IconButton
                            onClick={handleClick}
                            disabled={
                              !commentText.trim() && !attachmentFile?.length
                            }
                            sx={{ color: "#FF5733", fontSize: "25" }}
                          >
                            <SyncSharpIcon />
                          </IconButton>
                        </Tooltip>

                        <IconButton
                          onClick={handleSendComment}
                          disabled={
                            !commentText.trim() && !attachmentFile?.length
                          }
                          sx={{ color: "green" }}
                        >
                          <SendIcon />
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />

              {attachmentFile?.length > 0 ? (
                <Box
                  sx={{
                    border: "1px solid #E0E0E0",
                    borderTop: "none",
                    borderRadius: "0 0 10px 10px",
                    backgroundColor: "#fff",
                    maxHeight: 150,
                    overflowY: "auto",
                    px: 1,
                    py: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {attachmentFile.map((att, index) => (
                    <Box
                      key={att.id || index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: "#f9f9f9",
                        border: "1px solid #eee",
                      }}
                    >
                      {index == 0 && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            wordBreak: "break-word",
                            flex: 1,
                            fontSize: "13px",
                          }}
                        >
                          {shortenFilename(
                            att.name ||
                              att.file?.name ||
                              `Attachment ${index + 1}`
                          )}
                        </Typography>
                      )}

                      <IconButton
                        size="small"
                        onClick={() =>
                          setAttachmentFile((prev) =>
                            prev.filter((item, i) => i !== index)
                          )
                        }
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>
          </Box>
        )}
        {commentsData?.length > 0 && (
          <BidCommentsList commentsListData={commentsData} />
        )}
      </Box>
    </>
  );
}

export default CommonComment;
