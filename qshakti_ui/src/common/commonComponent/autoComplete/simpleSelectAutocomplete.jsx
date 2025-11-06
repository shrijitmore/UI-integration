import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const SimpleSelectAutocomplete = ({
  label,
  options = [],
  value,
  onChange,
  loading = false,
  disabled = false,
  placeholder = '',
  getOptionLabel = (option) => option?.label || '',
  isOptionEqualToValue = (option, value) => option?.value === value?.value,
  sx = {},
  fullWidth = true,
  required = false,
  error = false,
  helperText = '',
  name,
  onInputChange,
  freeSolo = false,
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue, name)}
      onInputChange={onInputChange}
      loading={loading}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      sx={sx}
      fullWidth={fullWidth}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SimpleSelectAutocomplete;
