import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { RadioGroup, FormControlLabel, Radio, Paper } from "@mui/material";
import { Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import config from "../../../config";
import { Button } from "bootstrap";
import { inProcessGetData } from "../../../store/slices/operator/CommonIOSectionSlice";
import { useDispatch } from "react-redux";
export const isEmptyValue = (val) => {
  return val === "" || val === null || val === undefined;
};
// utils/keyboardHelpers.js
export const handleEnterAsTab = (e) => {
  const keys = ["Enter", "ArrowRight", "ArrowLeft"];
  if (!keys.includes(e.key)) return;

  e.preventDefault();
  const active = document.activeElement;
  if (!active) return;

  const scope = active.closest("[data-enter-scope], form") || document.body;

  const focusable = Array.from(
    scope.querySelectorAll(
      "input:not([disabled]):not([type=hidden]), " +
        "select:not([disabled]), " +
        "textarea:not([disabled]), " +
        "button:not([disabled]), " +
        "[tabindex]:not([tabindex='-1'])"
    )
  ).filter((el) => el.offsetParent !== null);

  const index = focusable.indexOf(active);
  if (index === -1) return;

  let next;
  if (e.key === "Enter" || e.key === "ArrowRight") {
    next = focusable[index + 1] || focusable[0]; // move forward
  } else if (e.key === "ArrowLeft") {
    next = focusable[index - 1] || focusable[focusable.length - 1]; // move backward
  }

  if (next) {
    requestAnimationFrame(() => {
      next.focus();
      if (typeof next.select === "function") next.select(); // highlight text
    });
  }
};

export const renderActualReadings = (
  row,
  inputErrors,
  handleParameterChange,
  isView,
  setInputErrors
) => {
  // const min = parseFloat(row.minLimit?.replace(/[^0-9.]/g, "") || "0");
  // const max = parseFloat(row.maxLimit?.replace(/[^0-9.]/g, "") || "0");
  const min = parseFloat(String(row.minLimit).replace(/[^0-9.]/g, "")) || 0;
  const max = parseFloat(String(row.maxLimit).replace(/[^0-9.]/g, "")) || 0;

  // chunk into groups of 10
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < row.actualReadings.length; i += chunkSize) {
    chunks.push(row.actualReadings.slice(i, i + chunkSize));
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {chunks.map((chunk, chunkIdx) => (
        <Box key={chunkIdx} display="flex" flexWrap="nowrap" gap={1}>
          {chunk.map((val, idx) => {
            const errorKey = `${row.id}-${chunkIdx * chunkSize + idx}`;
            const reading = parseFloat(val.r_value);
            let borderColorDynamic = "red";
            if (!isNaN(reading)) {
              borderColorDynamic =
                reading < min || reading > max ? "red" : "green";
            }

            const charLength = val?.r_value ? val.r_value.toString().length : 0;
            const dynamicWidth = `${Math.max(5, charLength + 4)}ch`;

            return (
              <TextField
                key={errorKey}
                // data-testid={`reading-input-${row.id}-${chunkIdx}-${idx}`}
                disabled={isView}
                size="small"
                // value={val?.r_value}
                value={val?.r_value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleParameterChange(
                    row.id,
                    "actualReadings",
                    value,
                    chunkIdx * chunkSize + idx
                  );

                  const allFilled = row.actualReadings.every((v, i) =>
                    i === chunkIdx * chunkSize + idx ? value !== "" : v !== ""
                  );

                  if (allFilled) {
                    const newErrors = { ...inputErrors };
                    Object.keys(newErrors)
                      .filter((key) => key.startsWith(row.id))
                      .forEach((key) => {
                        delete newErrors[key];
                      });
                    setInputErrors(newErrors);
                  }
                }}
                error={!!inputErrors[errorKey]}
                helperText={""}
                inputProps={{
                  "data-testid": `reading-input-${row.id}-${chunkIdx}-${idx}`,
                  onKeyDown: (e) => {
                    // Allow only numbers, dot, backspace, delete, arrows
                    if (
                      !/[0-9]/.test(e.key) &&
                      e.key !== "." &&
                      e.key !== "Backspace" &&
                      e.key !== "Delete" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight" &&
                      e.key !== "Tab"
                    ) {
                      e.preventDefault();
                    }

                    // Prevent multiple dots
                    if (e.key === "." && val?.r_value.includes(".")) {
                      e.preventDefault();
                    }

                    // Optional: keep your enter-as-tab behavior
                    handleEnterAsTab(e);
                  },
                  inputMode: "decimal",
                }}
                sx={{
                  width: dynamicWidth,
                  minWidth: "50px",
                  textAlign: "center",
                  transition: "width 0.2s ease",
                  "& .MuiOutlinedInput-root": {
                    "& input": {
                      textAlign: "center",
                      bgcolor: inputErrors[errorKey] ? "#ffe6e6" : "inherit",
                    },
                    "& fieldset": {
                      borderColor: `${borderColorDynamic} !important`,
                    },
                    "&:hover fieldset": {
                      borderColor: `${borderColorDynamic} !important`,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: `${borderColorDynamic} !important`,
                    },
                  },
                }}
              />
            );
          })}
        </Box>
      ))}

      {Object.keys(inputErrors).some((key) => key.startsWith(row.id)) && (
        <Typography variant="caption" color="error">
          Please Enter Readings
        </Typography>
      )}
    </Box>
  );
};
export const renderAcceptRejectFields = (
  row,
  inputErrors,
  handleParameterChange,
  isView,
  setInputErrors
) => {
  const acceptedReading = row.actualReadings?.find(
    (r) => r.r_key === "accepted"
  ) || { r_value: "" };
  const rejectedReading = row.actualReadings?.find(
    (r) => r.r_key === "rejected"
  ) || { r_value: "" };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography sx={{ color: "green", fontWeight: "bold" }}>
          Accepted
        </Typography>
        <TextField
          // data-testid={`accepted-${row.id}`}
          disabled={isView}
          size="small"
          type="number"
          value={acceptedReading.r_value ?? ""}
          onKeyDown={handleEnterAsTab}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseInt(value) >= 0) {
              handleParameterChange(row.id, "accepted", value);
            }
            if (value !== "") {
              const newErrors = { ...inputErrors };
              delete newErrors[`${row.id}-accepted`];
              setInputErrors(newErrors);
            }
          }}
          error={!!inputErrors[`${row.id}-accepted`]}
          inputProps={{ "data-testid": `accepted-${row.id}`, min: 0 }}
          sx={{ width: "100px" }}
        />

        <Typography sx={{ color: "red", fontWeight: "bold" }}>
          Rejected
        </Typography>
        <TextField
          // data-test-id={`rejected-${row.id}`}
          disabled={isView}
          size="small"
          type="number"
          value={rejectedReading.r_value ?? ""}
          onKeyDown={handleEnterAsTab}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseInt(value) >= 0) {
              handleParameterChange(row.id, "rejected", value);
            }
            if (value !== "") {
              const newErrors = { ...inputErrors };
              delete newErrors[`${row.id}-rejected`];
              setInputErrors(newErrors);
            }
          }}
          error={!!inputErrors[`${row.id}-rejected`]}
          inputProps={{ "data-testid": `rejected-${row.id}`, min: 0 }}
          sx={{ width: "100px" }}
        />
      </Box>

      {Object.keys(inputErrors).some((key) => key.startsWith(row.id)) && (
        <Typography variant="caption" color="error">
          Please enter Accepted/Rejected values
        </Typography>
      )}
    </Box>
  );
};

export const renderOkNotOkRadios = (
  row,
  inputErrors = {},
  handleParameterChange,
  isView,
  setInputErrors
) => {
  // chunk into groups of 10
  const chunkSize = 6;
  const chunks = [];
  for (let i = 0; i < row?.actualReadings?.length; i += chunkSize) {
    chunks.push(row?.actualReadings.slice(i, i + chunkSize));
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ width: "100%" }}>
      {chunks.map((chunk, chunkIdx) => (
        <Box key={chunkIdx} display="flex" flexWrap="nowrap" gap={1}>
          {chunk.map((val, idx) => {
            const errorKey = `${row.id}-${chunkIdx * chunkSize + idx}`;
            return (
              <Paper
                key={`${chunkIdx}-${idx}`}
                elevation={3}
                sx={{
                  p: 1,
                  minWidth: 160,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  bgcolor: "#f9f9f9",
                }}
              >
                <RadioGroup
                  id={`radio-group-${row.id}-${chunkIdx}-${idx}`}
                  data-testid={`radio-group-${row.id}-${chunkIdx}-${idx}`}
                  disabled={isView}
                  row
                  value={
                    val.r_value !== undefined && val.r_value !== null
                      ? val.r_value.toString()
                      : ""
                  }
                  onChange={(e) => {
                    const newValue = e.target.value; //
                    handleParameterChange(
                      row.id,
                      "actualReadings",
                      newValue,
                      chunkIdx * chunkSize + idx
                    );
                    const newErrors = { ...inputErrors };

                    // Remove error for this field if it has a value
                    if (newValue === "0" || newValue === "1") {
                      delete newErrors[
                        `${row.id}-${chunkIdx * chunkSize + idx}`
                      ];
                    }

                    // Updated readings
                    const updatedReadings = [...row.actualReadings];
                    updatedReadings[chunkIdx * chunkSize + idx] = newValue;

                    // Check if any reading is still empty
                    const anyEmpty = updatedReadings.some(
                      (v) => v !== "0" && v !== "1"
                    );

                    if (!anyEmpty) {
                      // Remove all row-level errors
                      Object.keys(newErrors)
                        .filter((key) => key.startsWith(row.id))
                        .forEach((key) => delete newErrors[key]);
                    }

                    setInputErrors(newErrors);
                  }}
                >
                  <FormControlLabel
                    id={`radio-ok-${row.id}-${chunkIdx}-${idx}`}
                    // data-testid={`radio-ok-${row.id}-${chunkIdx}-${idx}`}
                    value="1"
                    control={
                      <Radio
                        size="small"
                        onKeyDown={handleEnterAsTab}
                        sx={{ color: "green" }}
                        inputProps={{
                          "data-testid": `radio-ok-input-${row.id}-${chunkIdx}-${idx}`,
                        }}
                      />
                    }
                    label="Ok"
                    disabled={isView}
                  />
                  <FormControlLabel
                    id={`radio-notok-${row.id}-${chunkIdx}-${idx}`}
                    // data-testid={`radio-notok-${row.id}-${chunkIdx}-${idx}`}
                    disabled={isView}
                    value="0"
                    control={
                      <Radio
                        size="small"
                        onKeyDown={handleEnterAsTab}
                        sx={{ color: "red" }}
                        inputProps={{
                          "data-testid": `radio-notok-input-${row.id}-${chunkIdx}-${idx}`,
                        }}
                      />
                    }
                    label="Not Ok"
                  />
                </RadioGroup>
              </Paper>
            );
          })}
        </Box>
      ))}
      {Object.keys(inputErrors).some((key) => key.startsWith(row.id)) && (
        <Typography variant="caption" color="error">
          Please Select Ok / Not Ok
        </Typography>
      )}
    </Box>
  );
};

export function buildInspectionFormData(
  rows,
  POIONUMBER,
  LayoutKey,
  isEdit,
  final_key,
  operation_id,
  rowId
) {
  let keyId = isEdit ? "id" : "insp_schedule_id";
  const formData = new FormData();
  const isSampleFileAtZero =
    LayoutKey === "sample" && rows[0]?.attachment_document instanceof File;
  const readingPayload = rows.map((row, index) => {
    if (row.attachment_document instanceof File) {
      const fileKey = LayoutKey === "sample" ? `file_${0}` : `file_${index}`;
      formData.append(fileKey, row.attachment_document);
    }
    console.log(row, "row_______________________****");

    return {
      [keyId]: row?.id,
      input_type: LayoutKey === "sample" ? "sample" : "parameter",
      remarks: row.comments || "",
      machine_id:
        LayoutKey !== "sample"
          ? row?.machine_id
          : rowId
              ?.filter((item) => item.machine_type === row.machine_type)
              .map((m) => m.machine_id)
              .join(","),
      // ? rowId?
      // : null,
      actual_readings: row.actualReadings || [[]],
      insp_schedule_id: row.id,
      attachment_document: isSampleFileAtZero
        ? "file_0"
        : row?.attachment_document instanceof File
        ? `file_${index}`
        : row?.attachment_document
        ? row?.attachment_document
        : null,
      ...POIONUMBER,
      ...(operation_id ? { operation_id } : {}),
    };
  });
  formData.append("readings", JSON.stringify(readingPayload));
  formData.append("is_final", final_key ? true : false);

  return formData;
}

export const convertInspectionTypeToRows = (
  inspectionList,
  LayoutKey,
  isdata
) => {
  if (!Array.isArray(inspectionList)) return [];

  return inspectionList.map((item, index) => ({
    id: item.id,
    inspectionParameter: item.inspection_parameter || "",
    minLimit: item.LSL || 0,
    maxLimit: item.USL || 0,
    frequency: item.inspection_frequency || "daily",
    sampleSize: item.sample_size || 0,
    comments: item.remarks || "test",
    actualReadings: isdata
      ? item.actual_readings
      : item.inspection_type === "Qualitative" &&
        item.recording_type == "Summarized"
      ? item.existing_reading_data != null
        ? item?.existing_reading_data?.actual_readings
        : [
            { r_key: "accepted", r_value: "" },
            { r_key: "rejected", r_value: "" },
          ]
      : // [{ accepted: "", rejected: "" }]
      LayoutKey === "sample"
      ? item.existing_reading_data != null
        ? item.existing_reading_data?.actual_readings
        : Array.from({ length: item?.sample_size ? 1 : 0 }, () => "")
      : item.existing_reading_data != null
      ? item.existing_reading_data?.actual_readings
      : Array.from({ length: item?.sample_size || 0 }, () => ""),
    // Array.from({ length: 35|| 0 }, () => ""),
    qc_machine_id: item.qc_machine_id || null,
    inspection_type: item.inspection_type,
    recording_type: item.recording_type,
    inputType: "actualReadings ",
    attachment_document: item.attachment_document || "",
    preview_url: isdata ? `${config.apiUrl}${item?.attachment_document}` : "",
    reading_data: isdata ? item.actual_reading : item.reading_data || [],
    inspection_parameter_name: item.inspection_parameter_name,
    machine_ids: item.machine_ids || [],
    machine_type: item?.machine_type || "",
  }));
};

export const getChartDataFromReadings = (actualReadings = []) => {
  if (!Array.isArray(actualReadings)) return [];
  return actualReadings.map((value, index) => ({
    name: `S${index + 1}`,
    value: Number(value),
  }));
};
export const AnimatedTab = styled(Tab)(() => ({
  "--primary-color": "#00ACCD",
  "--hovered-color": "#4B0082",
  "--selected-color": "#ffffff",
  "--selected-bg": "#00ACCD",
  "--unselected-bg": "#f9fafb",

  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontWeight: 600,
  fontSize: "smaller",
  padding: "6px 12px",
  textTransform: "none",
  color: "var(--primary-color)",
  backgroundColor: "var(--unselected-bg)",
  // border: "none",
  cursor: "pointer",
  minHeight: "auto",
  borderRadius: 4,
  transition: "all 0.2s ease",
  border: "1px solid #ccc",

  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: -4,
    width: 0,
    height: "2px",
    backgroundColor: "var(--hovered-color)",
    transition: "width 0.3s ease-out",
  },

  "& .tab-text": {
    position: "relative",
    display: "inline-block",
  },

  "& .tab-text::before": {
    content: "attr(data-label)",
    position: "absolute",
    inset: 0,
    width: "0%",
    color: "var(--hovered-color)",
    overflow: "hidden",
    transition: "width 0.3s ease-out",
    whiteSpace: "nowrap",
  },

  "& svg": {
    color: "var(--primary-color)",
    transition: "transform 0.2s, color 0.2s",
    transitionDelay: "0.2s",
  },

  "&:hover::after": {
    width: "100%",
  },

  "&:hover .tab-text::before": {
    width: "100%",
  },

  "&:hover svg": {
    transform: "translateX(4px)",
    color: "var(--hovered-color)",
  },

  "&.Mui-selected": {
    color: "var(--selected-color)",
    fontWeight: "bold",
    backgroundColor: "var(--selected-bg)",
    borderRadius: 4,
    border: "1px solid var(--selected-bg)",

    "& svg": {
      color: "var(--selected-color)",
    },

    "&::after": {
      width: "100%",
      backgroundColor: "var(--selected-color)",
    },
  },
}));

export const actualReading = (row) => {
  return (
    row.inspection_type === "Quantitative" && row.recording_type == "Attribute"
  );
};
export const acceptAndReject = (row) => {
  return (
    row.inspection_type === "Qualitative" && row.recording_type === "Summarized"
  );
};
export const OkAndNotOK = (row) => {
  return (
    row.inspection_type === "Qualitative" && row.recording_type == "Parameter"
  );
};
