import React from "react";
import { TextField, CircularProgress } from "@mui/material";

const commonTextField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "",
  required = false,
  disabled = false,
  error = false,
  helperText = "",
  fullWidth = true,
  type = "text",
  loading = false,
  InputProps = {},
  InputLabelProps = {},
  multiline = false,
  rows = 1,
  sx = {},
  variant = "outlined",
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      // required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      type={type}
      multiline={multiline}
      rows={rows}
      sx={sx}
      InputLabelProps={InputLabelProps}
      variant={variant}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress size={18} /> : null}
            {InputProps?.endAdornment}
          </>
        ),
      }}
    />
  );
};

export default commonTextField;
