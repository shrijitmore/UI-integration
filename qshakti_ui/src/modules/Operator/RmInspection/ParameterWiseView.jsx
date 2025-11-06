import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Grid,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
// import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import SensorsIcon from "@mui/icons-material/Sensors";
import UploadIcon from "@mui/icons-material/Upload";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { showToast } from "../../../common/ShowToast";
import ButtonLoaderWrapper from "../../../common/commonComponent/ButtonLoaderWrapper";
import {
  inProcessGetData,
  inProcessGetDeatils,
  inProcessInspectionSave,
  updateInProcessInspection,
} from "../../../store/slices/operator/CommonIOSectionSlice";
import { useDispatch } from "react-redux";
import {
  FAI_INSPECTION_SAVE,
  IN_PROCESS_INSPECTION_SAVE,
  RM_INSPECTION_SAVE,
} from "../../../utils/endpoints";
import { useNavigate } from "react-router-dom";
import {
  acceptAndReject,
  actualReading,
  buildInspectionFormData,
  convertInspectionTypeToRows,
  getChartDataFromReadings,
  isEmptyValue,
  OkAndNotOK,
  renderAcceptRejectFields,
  renderActualReadings,
  renderOkNotOkRadios,
} from "./config";
import NoDataFound from "../../../common/NoDataFound";
import ControlChart from "../RmInspectionDetails/ControlChart";
import config from "../../../config";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import { io } from "socket.io-client";
import { useSocketData } from "./useSocketData";
import { useScrollNavigation } from "./useScrollNavigation";
import CustomAutocomplete from "../InprocessInspection/CustomAutocomplete";
import { breakLongWords, groupedRows, groupedRowsmachine } from "./Helper";
import { use } from "react";
const ParameterWiseTable = ({
  keyName,
  LayoutKey = "sample",
  operationList = [],
  setActiveView,
  POIONUMBER = {},
  isView = false,
  isEdit = "",
  isdata = false,
  activeView = null,
  operation_id = null,
  setIsUpdated,
}) => {
  const { scrollRef, canScrollLeft, canScrollRight, scroll } =
    useScrollNavigation();
  const [rows, setRows] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [qcMachineId, setQcMachineId] = useState(null);
  const { messages } = useSocketData(qcMachineId);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [sampleFlag, setSampleFlag] = useState(false);
  const nextRowIndexRef = useRef(0);
  useEffect(() => {
    if (!messages || !messages.length || !qcMachineId) return;
    if (LayoutKey === "sample") {
      if (!messages || !messages.length || !qcMachineId) return;
      setRows((prevRows) => {
        const newRows = [...prevRows];
        const grouped = Object.entries(groupedRows(newRows));
        grouped.forEach(([machineType, groupRows]) => {
          messages.forEach((msg) => {
            const msgMachineId = msg.qc_machine_id?.trim().toLowerCase();
            const rowToFill = groupRows[nextRowIndexRef.current];
            if (!rowToFill) return;
            const rowMachineIds = rowToFill.machine_ids?.map((m) =>
              m.machine_id?.trim().toLowerCase()
            );
            if (rowMachineIds?.includes(msgMachineId)) {
              const updatedReadings = [...(rowToFill.actualReadings || [])];
              const emptyIndex = updatedReadings.findIndex(
                (val) => !val || val.r_value === "" || val.r_value === null
              );
              if (emptyIndex !== -1) {
                updatedReadings[emptyIndex] = {
                  ...(updatedReadings[emptyIndex] || {}),
                  r_value: msg.reading_data,
                };
                rowToFill.actualReadings = updatedReadings;
                nextRowIndexRef.current =
                  (nextRowIndexRef.current + 1) % groupRows.length;
              }
            }
          });
        });

        return newRows;
      });

      setInputErrors({});
    } else if (LayoutKey === "parameter") {
      if (!messages || !messages.length || !rowId) return;
      const normalize = (s) =>
        (s ?? "")
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
      const msgBuckets = {};
      messages.forEach((m) => {
        if (!m) return;
        const msg = Array.isArray(m) && m.length ? m[0] : m;
        const key = normalize(msg.qc_machine_id);
        if (!msgBuckets[key]) msgBuckets[key] = [];
        msgBuckets[key].push(msg);
      });
      const pickMostRecent = (arr = []) =>
        arr.length === 0
          ? null
          : arr.reduce((a, b) =>
              new Date(a.last_update || 0) > new Date(b.last_update || 0)
                ? a
                : b
            );
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id !== rowId) return row;
          const rowKey = normalize(row.qc_machine_id);
          let matchedMsg = pickMostRecent(msgBuckets[rowKey]);
          if (!matchedMsg) {
            const looseKey = Object.keys(msgBuckets).find(
              (k) => k.includes(rowKey) || rowKey.includes(k)
            );
            if (looseKey) matchedMsg = pickMostRecent(msgBuckets[looseKey]);
          }
          if (!matchedMsg) {
            console.warn("No matching message found for:", row.qc_machine_id);
            return row;
          }
          const sampleSize = Number(row.sampleSize) || 0;
          const readingValue = matchedMsg.reading_data ?? "";
          const updatedReadings = Array.from(row.actualReadings || []);
          while (updatedReadings.length < sampleSize) {
            updatedReadings.push({ r_value: "" });
          }
          const emptyIndex = updatedReadings.findIndex(
            (val) =>
              !val ||
              val.r_value === undefined ||
              val.r_value === null ||
              val.r_value === ""
          );
          if (emptyIndex === -1) {
            console.warn("Sample size limit reached for row:", rowId);
            setRowId(null);
            setQcMachineId(null);
            return row;
          }
          updatedReadings[emptyIndex] = {
            ...(updatedReadings[emptyIndex] || {}),
            r_value: readingValue,
          };
          return {
            ...row,
            actualReadings: updatedReadings,
            inspection_parameter_name:
              matchedMsg.inspection_parameter_name ??
              row.inspection_parameter_name,
          };
        })
      );
      setInputErrors({});
    }
    setInputErrors({});
  }, [messages, qcMachineId, LayoutKey, rowId]);
  const [graphVisibility, setGraphVisibility] = useState({});
  const toggleGraph = (rowId) => {
    setGraphVisibility((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };
  const [inputErrors, setInputErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [previewModal, setPreviewModal] = useState({
    open: false,
    fileUrl: null,
    fileType: "",
  });

  const [graphModal, setGraphModal] = useState({
    open: false,
    rowData: null,
  });
  const openGraphModal = (row) => {
    setGraphModal({
      open: true,
      rowData: row,
    });
  };

  const closeGraphModal = () => {
    setGraphModal({
      open: false,
      rowData: null,
    });
  };
  useEffect(() => {
    const newRows = convertInspectionTypeToRows(
      operationList,
      LayoutKey,
      isdata
    );
    if (JSON.stringify(rows) !== JSON.stringify(newRows)) {
      setRows(newRows);
    }
  }, [operationList, LayoutKey]);
  useEffect(() => {
    if (!operationList || !operationList.length) return;

    if (LayoutKey === "parameter") {
      const initialSelectedMachines = {};
      operationList.forEach((item) => {
        if (item.machine_id && Array.isArray(item.machine_ids)) {
          const matchedMachine = item.machine_ids.find(
            (m) => m.machine_id === item.machine_id
          );
          if (matchedMachine) {
            initialSelectedMachines[item.id] = matchedMachine;
          }
        }
      });
      setSelectedMachines(initialSelectedMachines);
    } else if (LayoutKey === "sample") {
      // const initialSelectedMachines = operationList
      //   ?.map((item) => {
      //     if (item.machine_id && Array.isArray(item.machine_ids)) {
      //       const matchedMachine = item.machine_ids.find(
      //         (m) => m.machine_id === item.machine_id
      //       );
      //       if (matchedMachine) {
      //         return {
      //           ...matchedMachine,
      //           machine_label: `${matchedMachine.machine_id}-${
      //             matchedMachine.machine_type || "Unknown"
      //           }`,
      //         };
      //       }
      //     }
      //     return null;
      //   })
      //   .filter(Boolean);
      const initialSelectedMachines = Array.from(
        new Map(
          operationList
            ?.map((item) => {
              if (item.machine_id && Array.isArray(item.machine_ids)) {
                const matchedMachine = item.machine_ids.find(
                  (m) => m.machine_id === item.machine_id
                );
                if (matchedMachine) {
                  return {
                    ...matchedMachine,
                    machine_label: `${matchedMachine.machine_id}-${
                      matchedMachine.machine_type || "Unknown"
                    }`,
                  };
                }
              }
              return null;
            })
            .filter(Boolean) // remove nulls
            .map((machine) => [machine.machine_id, machine]) // use machine_id as key
        ).values()
      );

      setSelectedMachines(initialSelectedMachines);
      console.log(initialSelectedMachines, "initialSelectedMachines");
    }
  }, [operationList, LayoutKey]);
  const dispatch = useDispatch();
  const handleParameterChange = (rowId, field, value, index = null) => {
    if (field === "attachment_document") {
      if (!value) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  attachment_document: "",
                  preview_url: null,
                  file_name: "",
                  isExcel: false,
                  file_error: "",
                }
              : row
          )
        );
        showToast("Attachment removed successfully", "success");
        return;
      }

      const file = value;
      const fileSizeLimit = 10 * 1024 * 1024;
      const fileType = file?.type;

      if (file.size > fileSizeLimit) {
        showToast("File size should be less than 10MB", "error");
        return;
      }

      const isImage = fileType?.startsWith("image/");
      const isPdf = fileType === "application/pdf";
      const isExcel =
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        fileType === "application/vnd.ms-excel";

      const fileURL = isImage || isPdf ? URL.createObjectURL(file) : null;
      const fileName = file?.name || "";
      if (rows && rowId === "sample") {
        setRows((prev) => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            attachment_document: file,
            preview_url: fileURL,
            file_name: fileName,
            isExcel: isExcel,
            file_error: "",
          };
          return updated;
        });
      } else {
        setRows((prev) =>
          prev.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  attachment_document: file,
                  preview_url: fileURL,
                  file_name: fileName,
                  isExcel: isExcel,
                  file_error: "",
                }
              : row
          )
        );
      }
    }

    if (field === "actualReadings") {
      let sanitizedValue = value.replace(/[^0-9.]/g, "");
      const parts = sanitizedValue.split(".");
      if (parts.length > 2) {
        sanitizedValue = parts[0] + "." + parts.slice(1).join("");
      }

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: row[field].map((reading, i) =>
                  i === index
                    ? { ...reading, r_value: sanitizedValue || "" }
                    : reading
                ),
              }
            : row
        )
      );

      const isValid =
        sanitizedValue === "" ||
        (/^\d+(\.\d+)?$/.test(sanitizedValue) && Number(sanitizedValue) >= 0);

      setInputErrors((prev) => ({
        ...prev,
        [`${rowId}-${index}`]: isValid
          ? ""
          : "Enter a valid non-negative number",
      }));

      return;
    }
    if (field === "accepted" || field === "rejected") {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                actualReadings: row.actualReadings.map((reading) =>
                  reading.r_key === field
                    ? { r_key: field, r_value: value }
                    : reading
                ),
              }
            : row
        )
      );
      return;
    }

    if (field === "comments") {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: value,
              }
            : row
        )
      );
    }
    if (field === "machine_id") {
      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: value,
              }
            : row
        )
      );
    }
  };

  const addReading = (rowId, type) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        if (type === "actual") {
          return {
            ...row,
            actualReadings: [...row.actualReadings, ""],
          };
        }
        return row;
      })
    );
  };

  const handleSave = async (newData, final_key) => {
    const newErrors = {};
    newData.forEach((row, rowIndex) => {
      if (actualReading(row)) {
        row.actualReadings.forEach((val, idx) => {
          if (isEmptyValue(val?.r_value)) {
            newErrors[`${row.id}-${idx}`] = "Required";
          }
        });
      } else if (acceptAndReject(row)) {
        if (
          isEmptyValue(
            row.actualReadings.find((r) => r.r_key === "accepted")?.r_value
          )
        ) {
          newErrors[`${row.id}-accepted`] = "Required";
        }
        if (
          isEmptyValue(
            row.actualReadings.find((r) => r.r_key === "rejected")?.r_value
          )
        ) {
          newErrors[`${row.id}-rejected`] = "Required";
        }
      } else if (OkAndNotOK(row)) {
        row.actualReadings.forEach((val, idx) => {
          if (isEmptyValue(val?.r_value)) {
            newErrors[`${row.id}-${idx}`] = "Required";
          }
        });
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setInputErrors(newErrors);
      showToast("Please fill all required fields", "error");
      return;
    }
    if (final_key !== true) {
      if (LayoutKey !== "sample") {
        setVisibleCount((prev) => Math.min(prev + 1, rows.length));
      } else {
        addReadingSampleRow();
      }
    }

    const formData = buildInspectionFormData(
      newData,
      POIONUMBER,
      LayoutKey,
      isEdit,
      final_key,
      operation_id,
      rowId
    );

    try {
      setLoader(true);
      const url =
        keyName === "inprocess"
          ? IN_PROCESS_INSPECTION_SAVE
          : keyName === "fai"
          ? FAI_INSPECTION_SAVE
          : RM_INSPECTION_SAVE;

      const action = isEdit
        ? updateInProcessInspection
        : inProcessInspectionSave;
      let res = await dispatch(action({ data: formData, url })).unwrap();
      setIsUpdated(true);
      if (res?.is_success && !final_key) {
        showToast(res?.message, "success");
      }
      if (res?.is_success && final_key) {
        showToast(res?.message, "success");
        setVisibleCount(1);
        setActiveView(null);
        if (keyName === "inprocess") {
          setActiveView(null);
        } else if (keyName === "fai") {
          setActiveView(null);
        } else {
          setActiveView(null);
        }
      }
    } catch (err) {
      console.error("API call failed:", err);
      showToast("Something went wrong", "error");
    } finally {
      setLoader(false);
    }
  };
  const [visibleCount, setVisibleCount] = useState(1);

  const renderFilePreviewActions = (row, isView = false) => {
    if (!row.attachment_document) return null;

    const resolveFileName = () => {
      if (row?.file_name) return row.file_name;
      if (typeof row?.attachment_document === "string") {
        const parts = row.attachment_document.split("/");
        return parts[parts.length - 1] || "file";
      }
      if (row?.attachment_document?.name) return row.attachment_document.name;
      return "Unknown File";
    };
    const fullName = resolveFileName();
    const displayName =
      fullName.length > 15 ? `${fullName.slice(0, 12)}...` : fullName;
    const disallowedExtensions = [".xls", ".xlsx"];
    const isNotExcel = (nameOrUrl) =>
      !disallowedExtensions.some((ext) =>
        nameOrUrl.toLowerCase().endsWith(ext)
      );
    const canPreview = Boolean(row.preview_url) && isNotExcel(fullName);
    const handleDownload = async (e, file) => {
      e.stopPropagation();
      let url = "";
      if (typeof file === "string") {
        let normalizedFile = file.trim();
        if (normalizedFile.startsWith("http://")) {
          normalizedFile = normalizedFile.replace("http://", "https://");
        }
        if (
          normalizedFile.startsWith("https://") ||
          normalizedFile.startsWith("http://")
        ) {
          url = normalizedFile;
        } else {
          url = `${config.apiUrl}/${normalizedFile.replace(/^\/+/, "")}`;
        }
      } else {
        url = URL.createObjectURL(file);
      }
      try {
        const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        const isImageUrl = (nameOrUrl) =>
          allowedExtensions.some((ext) =>
            nameOrUrl.toLowerCase().endsWith(ext)
          );
        let urlnew = isImageUrl(url) ? `${url}/` : url;
        const response = await fetch(urlnew);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        const filename =
          typeof file === "string"
            ? file.split("/").pop()
            : file.name || "downloaded_file";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error("Download failed", err);
      }
    };
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
        <Tooltip title={fullName}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              maxWidth: 240,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
          >
            {displayName}
          </Typography>
        </Tooltip>

        <Box
          display="flex"
          gap={1.5}
          alignItems="center"
          justifyContent="center"
        >
          <Tooltip title="Download">
            <IconButton
              color="success"
              onClick={(e) => handleDownload(e, row.attachment_document)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                backgroundColor: "#E8F5E9",
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {!isView && (
            <Tooltip title="Remove">
              <IconButton
                color="error"
                disabled={isView}
                onClick={() =>
                  handleParameterChange(row.id, "attachment_document", null)
                }
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  backgroundColor: "#FFEBEE",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  };
  const addReadingSampleRow = () => {
    setRows((prev) =>
      prev.map((row) => {
        const currentLen = row.actualReadings?.length || 0;
        const sampleSize = Number(row.sampleSize) || 0;
        if (currentLen >= sampleSize) {
          return row;
        }

        return {
          ...row,
          actualReadings: [...row.actualReadings, ""],
        };
      })
    );
  };
  const removeReadingSampleRow = () => {
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        actualReadings: (row.actualReadings || []).slice(0, -1),
      }))
    );
  };
  const isSingleEntryInAllRows = rows.every(
    (row) => Array.isArray(row.actualReadings) && row.actualReadings.length <= 1
  );
  const grouped = groupedRowsmachine(rows);
  const allMachineData = Object?.values(grouped)?.flatMap((g) => g.machineData);

  return (
    <Box position="relative" mb={1}>
      {canScrollLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "#00ACCD",
            color: "#fff",
            "&:hover": { bgcolor: "#008ea0" },
          }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
      )}
      <Paper
        elevation={3}
        ref={scrollRef}
        sx={{
          // mb: 3,
          p: { xs: 1.5, sm: 3 },
          borderRadius: 3,
          mt: 1,
          bgcolor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
          },
          overflowX: "auto",
          whiteSpace: "nowrap",
          "&::-webkit-scrollbar": {
            height: 10,
            width: 10,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#E0F7FA",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#9b9c9dff",
            cursor: "pointer",
            borderRadius: 4,
          },
        }}
      >
        {LayoutKey === "sample" && (
          <Grid
            container
            marginBottom={1}
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
          >
            <Grid item>
              <CustomAutocomplete
                multiple
                label="Machine"
                value={Array.isArray(selectedMachines) ? selectedMachines : []}
                onChange={(e, newSelectedMachines) => {
                  const newSelection = Array.isArray(newSelectedMachines)
                    ? newSelectedMachines
                    : [];
                  const oldSelection = Array.isArray(selectedMachines)
                    ? selectedMachines
                    : [];
                  if (newSelection.length > oldSelection.length) {
                    const oldMachineIds = new Set(
                      oldSelection.map((m) => m.machine_id)
                    );
                    const newlyAddedMachine = newSelection.find(
                      (m) => !oldMachineIds.has(m.machine_id)
                    );

                    if (newlyAddedMachine) {
                      const newMachineType = newlyAddedMachine.machine_type;
                      const sameTypeMachines = newSelection.filter(
                        (machine) => machine.machine_type === newMachineType
                      );

                      if (sameTypeMachines.length > 1) {
                        const machinesToKeep = oldSelection.filter(
                          (machine) => machine.machine_type !== newMachineType
                        );
                        const finalSelection = [
                          ...machinesToKeep,
                          newlyAddedMachine,
                        ];
                        setSelectedMachines(finalSelection);
                        setRowId(finalSelection);
                        return;
                      }
                    }
                  }

                  setSelectedMachines(newSelection);
                  setRowId(newSelection);
                }}
                options={Array.isArray(allMachineData) ? allMachineData : []}
                getOptionLabel={(option) => option?.machine_label || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.machine_id === value?.machine_id
                }
                disabled={sampleFlag || isView}
                sx={{ minWidth: 200 }}
                datatestid={`machine-select-for-sample-reading`}
              />
            </Grid>
            {!isView && (
              <Grid item>
                <IconButton
                  onClick={() => {
                    if (sampleFlag) {
                      setRowId(null);
                      setQcMachineId(null);
                      setSampleFlag(false);
                    } else {
                      setSampleFlag(true);
                      setQcMachineId(selectedMachine || null);
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    height: 32,
                    minWidth: 140,
                    px: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    gap: 0.5,
                    backgroundColor: sampleFlag
                      ? "rgba(255,0,0,0.08)"
                      : "rgba(0,128,0,0.08)",
                    border: sampleFlag
                      ? "1px solid rgba(255,0,0,0.3)"
                      : "1px solid rgba(0,128,0,0.3)",
                    "&:hover": {
                      backgroundColor: sampleFlag
                        ? "rgba(255,0,0,0.15)"
                        : "rgba(0,128,0,0.15)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {sampleFlag ? (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <SyncDisabledIcon
                        fontSize="small"
                        sx={{ color: "#b71c1c" }}
                      />
                      <span style={{ fontSize: "0.75rem", color: "#5e1e1bff" }}>
                        Stop Capture Reading
                      </span>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <SyncIcon fontSize="small" sx={{ color: "#1b5e20" }} />
                      <span style={{ fontSize: "0.75rem", color: "#1b5e20" }}>
                        Capture Reading
                      </span>
                    </Box>
                  )}
                </IconButton>
              </Grid>
            )}
          </Grid>
        )}
        {rows && rows?.length > 0 ? (
          <Box sx={{ width: "max-content", minWidth: "100%" }}>
            <Table
              size="small"
              stickyHeader
              sx={{
                minWidth: 800,
                borderCollapse: "collapse",
                "& th, & td": {
                  border: "1px solid #ccc",
                  whiteSpace: "nowrap",
                  fontSize: "0.875rem",
                },
                "& thead th": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
              }}
            >
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell style={{ width: "5%" }}>
                    <strong>Sr. No.</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Inspection Parameter</strong>
                  </TableCell>
                  <TableCell style={{ width: "8%" }}>
                    <strong>Dimensional Limits</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Frequency</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Sample Size</strong>
                  </TableCell>
                  {/* {LayoutKey === "sample" && ( */}
                  <TableCell>
                    <strong>Graph</strong>
                  </TableCell>
                  {/* // )} */}

                  <TableCell>
                    <strong>Remarks </strong>
                  </TableCell>
                  {LayoutKey === "sample" ? (
                    <TableCell>
                      <strong>Actual Reading</strong>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <strong>Attachments</strong>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {LayoutKey !== "sample" ? (
                  (LayoutKey === "sample" || isEdit
                    ? rows
                    : !isView
                    ? rows.slice(0, visibleCount)
                    : rows
                  ).map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableRow sx={{ "& td": { borderTop: "none" } }}>
                        <TableCell style={{ width: "5%" }}>
                          <span>{index + 1}</span>
                        </TableCell>

                        <TableCell style={{ width: "10%" }}>
                          <Tooltip title={row.inspection_parameter_name}>
                            {breakLongWords(row.inspection_parameter_name)}
                          </Tooltip>
                        </TableCell>

                        <TableCell style={{ width: "8%" }}>
                          <span>{`${row?.minLimit} - ${row?.maxLimit}`}</span>
                        </TableCell>

                        <TableCell style={{ width: "10%" }}>
                          <span>{row.frequency}</span>
                        </TableCell>

                        <TableCell style={{ width: "10%" }}>
                          <span>{row.sampleSize}</span>
                        </TableCell>
                        <TableCell>
                          {actualReading(row) &&
                          row?.sampleSize &&
                          row?.reading_data?.length > 0 ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<BarChartIcon />}
                              onClick={() => openGraphModal(row)}
                            >
                              Graph
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<BarChartIcon />}
                              disabled
                            >
                              Graph
                            </Button>
                          )}
                        </TableCell>
                        <TableCell style={{ width: "20%" }}>
                          <Tooltip title={row.comments || "Enter remarks "}>
                            <Box
                              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}
                            >
                              <TextField
                                // data-testid={`remarks-${row?.id}`}
                                disabled={isView}
                                value={row.comments}
                                placeholder="Enter remarks "
                                size="small"
                                fullWidth
                                inputProps={{
                                  "data-testid": `remarks-${
                                    row?.id ?? "unknown"
                                  }`,
                                  style: {
                                    whiteSpace: "nowrap",
                                    overflowX: "auto",
                                  },
                                }}
                                onChange={(e) =>
                                  handleParameterChange(
                                    row.id,
                                    "comments",
                                    e.target.value
                                  )
                                }
                              />
                            </Box>
                          </Tooltip>
                        </TableCell>

                        {LayoutKey === "sample" && (
                          <TableCell colSpan={7}>
                            <Box
                              display="flex"
                              flexWrap="nowrap"
                              overflowX="auto"
                              gap={0.5}
                              mt={1}
                              justifyContent={{
                                xs: "flex-start",
                                sm: "flex-start",
                              }}
                            >
                              {actualReading(row) &&
                                renderActualReadings(
                                  row,
                                  inputErrors,
                                  handleParameterChange,
                                  isView,
                                  setInputErrors
                                )}

                              {OkAndNotOK(row) &&
                                renderOkNotOkRadios(
                                  row,
                                  inputErrors,
                                  handleParameterChange,
                                  isView,
                                  setInputErrors
                                )}

                              {acceptAndReject(row) &&
                                renderAcceptRejectFields(
                                  row,
                                  inputErrors,
                                  handleParameterChange,
                                  isView,
                                  setInputErrors
                                )}
                            </Box>
                          </TableCell>
                        )}

                        {LayoutKey !== "sample" && (
                          <TableCell
                            align="center"
                            sx={{
                              height: 80,
                              p: 0,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "100%",
                              }}
                            >
                              {!row.attachment_document && (
                                <IconButton
                                  component="label"
                                  disabled={isView}
                                  sx={{
                                    border: "2px solid",
                                    borderColor: isView ? "#9CA3AF" : "#1976D2", // Primary blue for active state
                                    backgroundColor: isView
                                      ? "#F3F4F6"
                                      : "#FFFFFF",
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": !isView && {
                                      backgroundColor: "#FFFFFF",
                                      borderColor: "#1565C0",
                                      transform: "scale(1.05)",
                                    },
                                    "&:active": !isView && {
                                      backgroundColor: "#FFFFFF",
                                      borderColor: "#0D47A1",
                                      transform: "scale(0.98)",
                                    },
                                  }}
                                  size="small"
                                >
                                  <UploadIcon
                                    sx={{
                                      fontSize: 22,
                                      color: isView ? "#9CA3AF" : "#1976D2", // Primary blue for active state
                                    }}
                                  />
                                  <input
                                    data-testid={`upload-${row?.id}`}
                                    disabled={isView}
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file)
                                        handleParameterChange(
                                          row.id,
                                          "attachment_document",
                                          file
                                        );
                                    }}
                                  />
                                </IconButton>
                              )}

                              {row.attachment_document &&
                                renderFilePreviewActions(row, isView)}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>

                      {LayoutKey !== "sample" && (
                        <TableCell colSpan={8}>
                          <Typography fontWeight="bold" color="primary" mb={1}>
                            {actualReading(row) || OkAndNotOK(row) ? (
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={2}
                              >
                                {/* Label */}
                                <Typography component="span" color="#000000de">
                                  Enter Readings{" "}
                                  <Typography
                                    component="span"
                                    sx={{ color: "red" }}
                                  >
                                    *
                                  </Typography>
                                </Typography>
                                {(actualReading(row) || OkAndNotOK(row)) && (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    sx={{ minWidth: 250 }}
                                  >
                                    <CustomAutocomplete
                                      label="Machine"
                                      value={selectedMachines[row.id] || null}
                                      onChange={(e, newValue) => {
                                        setSelectedMachines((prev) => ({
                                          ...prev,
                                          [row.id]: newValue,
                                        }));
                                        handleParameterChange(
                                          row.id,
                                          "machine_id",
                                          newValue?.machine_id
                                        );
                                      }}
                                      options={row.machine_ids}
                                      getOptionLabel={(option) =>
                                        option?.machine_name || ""
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option?.machine_id === value?.machine_id
                                      }
                                      disabled={row.id === rowId || isView}
                                      datatestid={`machine-select-${row.id}`}
                                    />
                                    {!isView && (
                                      <IconButton
                                        onClick={() => {
                                          if (row.id === rowId) {
                                            setRowId(null); // stop
                                            setQcMachineId(null);
                                          } else {
                                            setRowId(row.id);
                                            setQcMachineId(
                                              selectedMachines[row.id]
                                                ?.machine_id || null
                                            );
                                          }
                                        }}
                                        sx={{
                                          borderRadius: 2,
                                          height: 32, // smaller height
                                          minWidth: 120, // compact width
                                          px: 1.5, // padding inside
                                          display: "flex",
                                          justifyContent: "center",
                                          gap: 0.5,
                                          backgroundColor:
                                            row.id === rowId
                                              ? "rgba(255,0,0,0.08)"
                                              : "rgba(0,128,0,0.08)",
                                          border:
                                            row.id === rowId
                                              ? "1px solid rgba(255,0,0,0.3)"
                                              : "1px solid rgba(0,128,0,0.3)",
                                          "&:hover": {
                                            backgroundColor:
                                              row.id === rowId
                                                ? "rgba(255,0,0,0.15)"
                                                : "rgba(0,128,0,0.15)",
                                          },
                                          transition: "all 0.2s ease", // smooth hover effect
                                        }}
                                      >
                                        {row.id === rowId ? (
                                          <Box
                                            position="relative"
                                            display="inline-flex"
                                          >
                                            <SyncDisabledIcon
                                              fontSize="small"
                                              sx={{ color: "#b71c1c" }}
                                            />

                                            <span
                                              style={{
                                                fontSize: "0.75rem",
                                                color: "#5e1e1bff",
                                              }}
                                            >
                                              Stop Capture Reading
                                            </span>
                                          </Box>
                                        ) : (
                                          <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={0.5}
                                          >
                                            <SyncIcon
                                              fontSize="small"
                                              sx={{ color: "#1b5e20" }}
                                            />
                                            <span
                                              style={{
                                                fontSize: "0.75rem",
                                                color: "#1b5e20",
                                              }}
                                            >
                                              Capture Reading
                                            </span>
                                          </Box>
                                        )}
                                      </IconButton>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ) : OkAndNotOK(row) && row?.sampleSize ? (
                              <Typography component="span">
                                Select Readings{" "}
                                <Typography
                                  component="span"
                                  sx={{ color: "red" }}
                                >
                                  *
                                </Typography>
                              </Typography>
                            ) : (
                              ""
                            )}
                          </Typography>
                          <Box
                            display="flex"
                            flexWrap="wrap"
                            gap={0.5}
                            mt={1}
                            justifyContent={{
                              xs: "center",
                              sm: "flex-start",
                            }}
                          >
                            {actualReading(row) && (
                              <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="space-between"
                                gap={2}
                                alignItems="center"
                              >
                                {renderActualReadings(
                                  row,
                                  inputErrors,
                                  handleParameterChange,
                                  isView,
                                  setInputErrors
                                )}
                              </Box>
                            )}

                            {OkAndNotOK(row) && (
                              <>
                                {renderOkNotOkRadios(
                                  row,
                                  inputErrors,
                                  handleParameterChange,
                                  isView,
                                  setInputErrors
                                )}
                              </>
                            )}
                            {acceptAndReject(row) &&
                              renderAcceptRejectFields(
                                row,
                                inputErrors,
                                handleParameterChange,
                                isView,
                                setInputErrors
                              )}
                          </Box>
                        </TableCell>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    {Object.entries(groupedRows(rows)).map(
                      ([machineType, groupRows]) => (
                        <React.Fragment key={machineType}>
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              sx={{ backgroundColor: "#f5f5f5" }}
                            >
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                {/* Left side: machine type */}
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    color: "#1976d2",
                                  }}
                                >
                                  Machine Type: {machineType.toUpperCase()}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>

                          {groupRows?.map((row, index) => (
                            <TableRow key={row.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Tooltip title={row.inspection_parameter_name}>
                                  {breakLongWords(
                                    row.inspection_parameter_name
                                  )}
                                </Tooltip>
                              </TableCell>
                              <TableCell>{`${row.minLimit} - ${row.maxLimit}`}</TableCell>
                              <TableCell>{row.frequency}</TableCell>
                              <TableCell>{row.sampleSize}</TableCell>

                              {/* Graph */}
                              <TableCell>
                                {actualReading(row) &&
                                row.sampleSize &&
                                row.reading_data?.length > 0 ? (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<BarChartIcon />}
                                    onClick={() => openGraphModal(row)}
                                  >
                                    Graph
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<BarChartIcon />}
                                    disabled
                                  >
                                    Graph
                                  </Button>
                                )}
                              </TableCell>

                              {/* Remarks + Actual Readings in same row */}
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={row.comments}
                                  disabled={isView}
                                  onChange={(e) =>
                                    handleParameterChange(
                                      row.id,
                                      "comments",
                                      e.target.value
                                    )
                                  }
                                  inputProps={{
                                    "data-testid": `remarks-${
                                      row?.id ?? "unknown"
                                    }`,
                                  }}
                                  placeholder="Enter remarks"
                                />
                              </TableCell>
                              <TableCell>
                                <Box
                                  display="flex"
                                  flexWrap="nowrap"
                                  overflowX="auto"
                                  gap={0.5}
                                  mt={1}
                                  justifyContent="flex-start"
                                >
                                  {actualReading(row) &&
                                    renderActualReadings(
                                      row,
                                      inputErrors,
                                      handleParameterChange,
                                      isView,
                                      setInputErrors
                                    )}

                                  {OkAndNotOK(row) &&
                                    renderOkNotOkRadios(
                                      row,
                                      inputErrors,
                                      handleParameterChange,
                                      isView,
                                      setInputErrors
                                    )}

                                  {acceptAndReject(row) &&
                                    renderAcceptRejectFields(
                                      row,
                                      inputErrors,
                                      handleParameterChange,
                                      isView,
                                      setInputErrors
                                    )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      )
                    )}
                  </>
                )}
              </TableBody>
            </Table>
            {LayoutKey === "sample" && rows && rows?.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  gap={2}
                >
                  {!rows[0].attachment_document && (
                    <Button
                      disabled={isView}
                      variant="contained"
                      component="label"
                      startIcon={
                        <UploadIcon sx={{ fontSize: 20, color: "white" }} />
                      }
                      sx={{
                        textTransform: "none",
                        borderRadius: "12px",
                        padding: "12px 24px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        background: isView
                          ? "#B0BEC5" // grey when view/disabled
                          : "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                        color: isView ? "#ECEFF1" : "#fff", // text color change
                        boxShadow: isView
                          ? "none"
                          : "0 4px 12px rgba(25, 118, 210, 0.3)",
                        cursor: isView ? "not-allowed" : "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": !isView && {
                          background:
                            "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                    >
                      Attachment
                      <input
                        // data-test-id={`upload-${rows[0]?.id}`}
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file)
                            handleParameterChange(
                              "sample",
                              "attachment_document",
                              file
                            );
                        }}
                        inputProps={{
                          "data-testid": `upload-${rows[0]?.id}`,
                        }}
                      />
                    </Button>
                  )}
                  {rows[0].attachment_document && (
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                      gap={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        boxShadow: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        flexWrap: "wrap",
                        maxWidth: 500,
                        mx: "auto",
                      }}
                    >
                      {rows[0].attachment_document &&
                        renderFilePreviewActions(rows[0], isView)}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              width="100%"
              mt={3}
              px={2}
            >
              <Button
                datatestid={`back-to-button`}
                color="primary"
                variant="contained"
                onClick={() => {
                  setActiveView(null);
                  setVisibleCount(1);
                }}
              >
                Back
              </Button>

              {rows && rows.length > 0 && !isView && (
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  {!isEdit && (
                    <>
                      {LayoutKey !== "sample" && (
                        <Button
                          datatestid={`previous-button`}
                          variant="contained"
                          color="primary"
                          disabled={
                            (LayoutKey !== "sample" && visibleCount === 1) ||
                            (LayoutKey === "sample" && isSingleEntryInAllRows)
                          }
                          onClick={() =>
                            LayoutKey !== "sample"
                              ? setVisibleCount((prev) =>
                                  Math.min(prev - 1, rows.length)
                                )
                              : //  (() => {
                                //     setVisibleCount((prev) =>
                                //       Math.min(prev + 1, rows.length)
                                //     );
                                //     handleSave(
                                //       rows.slice(visibleCount - 1, visibleCount),

                                //       false
                                //     );
                                //   })()
                                removeReadingSampleRow()
                          }
                        >
                          &lt; Previous
                        </Button>
                      )}

                      {/* {LayoutKey == "sample" && !isEdit && ( */}
                      <Button
                        datatestid={`save-next-button`}
                        variant="contained"
                        color="primary"
                        disabled={
                          LayoutKey !== "sample"
                            ? visibleCount >= rows.length
                            : !rows.some((row) => {
                                // Detect accept/reject type rows
                                const hasAcceptReject =
                                  row.actualReadings?.some(
                                    (r) =>
                                      r.r_key === "accepted" ||
                                      r.r_key === "rejected"
                                  ) ?? false;

                                // Skip accept/reject rows
                                if (hasAcceptReject) return false;

                                const currentLen =
                                  row.actualReadings?.length || 0;
                                const sampleSize = Number(row.sampleSize) || 0;
                                return currentLen < sampleSize;
                              })
                        }
                        onClick={
                          () =>
                            LayoutKey === "sample"
                              ? (() => {
                                  // setVisibleCount((prev) =>
                                  //   Math.min(prev + 1, rows.length)
                                  // );
                                  // handleSave(rows, false);  //revert
                                  addReadingSampleRow();
                                })()
                              : //  addReadingSampleRow()
                                (() => {
                                  setVisibleCount((prev) =>
                                    Math.min(prev + 1, rows.length)
                                  );
                                  // handleSave(
                                  //   rows.slice(visibleCount - 1, visibleCount),
                                  //   false
                                  // );  revert
                                })()
                          // setVisibleCount((prev) =>
                          //     Math.min(prev + 1, rows.length)
                          //   )
                        }
                      >
                        {visibleCount < rows.length && LayoutKey !== "sample"
                          ? "Save & Next Parameter >"
                          : LayoutKey === "sample"
                          ? " Save  & Next Sample >"
                          : "Show All"}
                      </Button>
                      {/* )} */}
                    </>
                  )}

                  <ButtonLoaderWrapper
                    loading={loader}
                    button={
                      <Button
                        datatestid={`save-button`}
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          handleSave(rows, true);
                        }}
                        disabled={
                          !isEdit &&
                          ((visibleCount < rows.length &&
                            LayoutKey !== "sample") ||
                            (LayoutKey === "sample" &&
                              !rows.every((row) => {
                                const hasAcceptReject =
                                  row.actualReadings?.some(
                                    (r) =>
                                      r.r_key === "accepted" ||
                                      r.r_key === "rejected"
                                  ) ?? false;

                                if (hasAcceptReject) return true;

                                const currentLen =
                                  row.actualReadings?.length || 0;
                                const sampleSize = Number(row.sampleSize) || 0;
                                return currentLen >= sampleSize;
                              })))
                        }
                      >
                        {isEdit ? "Update" : "Save"}
                      </Button>
                    }
                  />
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <>
            <>
              <Table>
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <NoDataFound />
                  </TableCell>
                </TableRow>
              </Table>
            </>
          </>
        )}
      </Paper>
      <Dialog
        open={graphModal.open}
        onClose={closeGraphModal}
        fullWidth
        maxWidth="md"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            width: "100%",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography fontSize={14} fontWeight={500}>
            Control Chart - {graphModal.rowData?.inspection_parameter_name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Upper Specification Limit">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#e64f4fff",
                  }}
                />
                <Typography fontSize={12}>Upper Specification</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Lower Specification Limit">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#e64f4fff",
                  }}
                />
                <Typography fontSize={12}>Lower Specification</Typography>
              </Box>
            </Tooltip>

            {/* Center Line */}
            <Tooltip title="Control Center Line">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "green",
                  }}
                />
                <Typography fontSize={12}>Center Line</Typography>
              </Box>
            </Tooltip>

            {/* Actual Reading */}
            <Tooltip title="Measured Actual Reading">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "blue",
                  }}
                />
                <Typography fontSize={12}>Actual Reading</Typography>
              </Box>
            </Tooltip>
          </Box>
          <IconButton
            onClick={closeGraphModal}
            size="small"
            sx={{ color: "red" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent
          dividers
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            p: 3,
          }}
        >
          {graphModal.rowData && (
            <Box sx={{ width: "100%", height: 400 }}>
              <ControlChart
                label={graphModal.rowData?.inspection_parameter_name}
                chartData={getChartDataFromReadings(
                  graphModal.rowData?.reading_data
                )}
                usl={graphModal.rowData?.maxLimit}
                lsl={graphModal.rowData?.minLimit}
                controlLimit={Number(
                  (Number(graphModal.rowData?.maxLimit) +
                    Number(graphModal.rowData?.minLimit)) /
                    2
                )}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={previewModal.open}
        onClose={() =>
          setPreviewModal({ open: false, fileUrl: null, fileType: "" })
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          File Preview
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={() =>
              setPreviewModal({ open: false, fileUrl: null, fileType: "" })
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {previewModal.fileType?.startsWith("image/") ||
          previewModal.fileUrl?.toLowerCase().endsWith(".png") ||
          previewModal.fileUrl?.toLowerCase().endsWith(".jpg") ||
          previewModal.fileUrl?.toLowerCase().endsWith(".jpeg") ||
          previewModal.fileUrl?.toLowerCase().endsWith(".gif") ? (
            <iframe
              src={`${previewModal.fileUrl}/`}
              width="100%"
              height="600px"
              title="PDF Preview"
            ></iframe>
          ) : previewModal.fileType === "application/pdf" ||
            previewModal.fileUrl?.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={previewModal.fileUrl}
              width="100%"
              height="600px"
              title="PDF Preview"
            ></iframe>
          ) : (
            <Typography color="text.secondary">
              Cannot preview this file type. Please download and view.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
      {canScrollRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "#00ACCD",
            color: "#fff",
            "&:hover": { bgcolor: "#008ea0" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
export default ParameterWiseTable;
