import React, { useState } from "react";
import {
  TextField,
  Box,
  Radio,
  FormControlLabel,
  Typography,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const themeColors = {
  background: "#F9FAFB",
  optionHover: "#E3F2FD",
  optionSelected: "#BBDEFB",
  text: "#374151",
  textHover: "#1565C0",
  textSelected: "#1565C0",
  chipBg: "#1976D2",
  chipText: "#fff",
};

const DateFilter = ({ setFormData, formData }) => {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Custom Date Range", value: "custom" },
    { label: "Last 24 Hours", value: "24hours" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 15 Days", value: "15days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 3 Months", value: "3months" },
    { label: "Last 6 Months", value: "6months" },
  ];

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getCustomRangeLabel = () => {
    if (formData.fromDate && formData.toDate) {
      return `${dayjs(formData.fromDate).format("DD/MM/YY")} → ${dayjs(
        formData.toDate
      ).format("DD/MM/YY")}`;
    }
    return "Custom Date Range";
  };

  return (
    <Autocomplete
      label="Date"
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        if (formData.dateRange === "custom") {
          if (formData.fromDate && formData.toDate) {
            setOpen(false);
          }
        } else {
          setOpen(false);
        }
      }}
      disableCloseOnSelect
      openOnFocus
      options={options}
      value={options.find((opt) => opt.value === formData.dateRange) || null}
      getOptionLabel={(option) =>
        option.value === "custom" ? getCustomRangeLabel() : option.label
      }
      onChange={(event, newValue) => {
        if (newValue?.value === "custom") {
          handleFormChange("dateRange", "custom");
          handleFormChange("fromDate", null);
          handleFormChange("toDate", null);
          setOpen(true);
        } else {
          handleFormChange("dateRange", newValue ? newValue.value : null);
          setOpen(false);
        }
      }}
      sx={{
        minWidth: 180,
        "& .MuiOutlinedInput-root": {
          color: themeColors.text,
          "& fieldset": { borderColor: "#E0E0E0" },
          "&:hover fieldset": { borderColor: themeColors.textSelected },
          "&.Mui-focused fieldset": { borderColor: themeColors.textSelected },
        },
        "& .MuiInputLabel-root": {
          color: themeColors.text,
          "&.Mui-focused": { color: themeColors.textSelected },
        },
        "& .MuiSvgIcon-root": {
          color: themeColors.text,
        },
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: themeColors.background,
            color: themeColors.text,
            mt: 1,
            boxShadow: 3,
            "& .MuiAutocomplete-listbox": {
              maxHeight: "240px",
              overflowY: "auto",
            },
            "& .MuiAutocomplete-noOptions": {
              color: themeColors.text,
            },
            "& .MuiAutocomplete-option": {
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: themeColors.optionHover,
                color: themeColors.textHover,
              },
              "&.Mui-focused": {
                backgroundColor: `${themeColors.optionHover} !important`,
                color: themeColors.textHover,
              },
              '&[aria-selected="true"]': {
                backgroundColor: `${themeColors.optionSelected} !important`,
                color: themeColors.textSelected,
                fontWeight: 600,
              },
            },
          },
        },
      }}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.value}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            p: 0,
            m: 0,
            color: themeColors.text,
          }}
        >
          <FormControlLabel
            sx={{
              m: 0,
              width: "100%",
              pl: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.9rem",
                color: themeColors.text,
              },
            }}
            control={
              <Radio
                size="small"
                checked={formData.dateRange === option.value}
                onChange={() => handleFormChange("dateRange", option.value)}
                sx={{
                  color: themeColors.text,
                  "&.Mui-checked": {
                    color: themeColors.textSelected,
                  },
                }}
              />
            }
            label={<Typography variant="body2">{option.label}</Typography>}
          />

          {option.value === "custom" && formData.dateRange === "custom" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                ml: 4.5,
                mt: 1,
                pb: 1,
              }}
            >
              <DatePicker
                label="From Date"
                value={
                  formData?.fromDate
                    ? formData?.fromDate?.toDate()
                    : null || null
                }
                onChange={(newValue) => {
                  handleFormChange(
                    "fromDate",
                    newValue ? dayjs(newValue) : null
                  );
                  if (newValue && formData.toDate) {
                    setOpen(false);
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !formData.fromDate,
                    helperText: !formData.fromDate
                      ? "Please select From Date"
                      : "",
                    sx: {
                      minWidth: 160,
                      input: { color: themeColors.text },
                      label: { color: themeColors.text },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#E0E0E0" },
                        "&:hover fieldset": {
                          borderColor: themeColors.textSelected,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: themeColors.textSelected,
                        },
                      },
                      "& .MuiSvgIcon-root": { color: themeColors.text },
                    },
                  },
                }}
              />

              <DatePicker
                label="To Date"
                value={
                  formData?.toDate ? formData?.toDate?.toDate() : null || null
                }
                onChange={(newValue) => {
                  handleFormChange("toDate", newValue ? dayjs(newValue) : null);
                  if (formData.fromDate && newValue) {
                    setOpen(false);
                  }
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !formData.toDate,
                    helperText: !formData.toDate ? "Please select To Date" : "",
                    sx: {
                      minWidth: 160,
                      input: { color: themeColors.text },
                      label: { color: themeColors.text },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#E0E0E0" },
                        "&:hover fieldset": {
                          borderColor: themeColors.textSelected,
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: themeColors.textSelected,
                        },
                      },
                      "& .MuiSvgIcon-root": { color: themeColors.text },
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Date"
          size="small"
          sx={{
            "& .MuiInputLabel-root": {
              fontWeight: "bold", // 👈 makes label bold
            },
          }}
        />
      )}
    />
  );
};

export default DateFilter;
