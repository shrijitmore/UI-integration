import React from 'react';
import { Autocomplete, TextField, Chip, CircularProgress, Box, Checkbox } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const MultiSelectAutocomplete = ({
  label,
  options = [],
  value = [],
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
}) => {
  const SELECT_ALL_OPTION = { label: 'Select All', value: '__all__' };

  const extendedOptions = [SELECT_ALL_OPTION, ...options];

  const handleChange = (event, newValue) => {
    const isSelectAllSelected = newValue.find(opt => opt.value === '__all__');

    if (isSelectAllSelected) {
      if (value.length === options.length) {
        // Deselect all
        onChange([], name);
      } else {
        // Select all
        onChange([...options], name);
      }
    } else {
      onChange(newValue, name);
    }
  };

  const isAllSelected = value.length === options.length;

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      limitTags={2}
      options={extendedOptions}
      value={value}
      onChange={handleChange}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      sx={sx}
      fullWidth={fullWidth}
      renderOption={(props, option, { selected }) => {
        const isSelectAll = option.value === '__all__';
        const checked = isSelectAll ? isAllSelected : selected;

        return (
          <li {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={checked}
            />
            {option.label}
          </li>
        );
      }}
      renderTags={(selected, getTagProps) => (
        <>
          {selected.slice(0, 2).map((option, index) => (
            <Chip key={index} label={getOptionLabel(option)} {...getTagProps({ index })} />
          ))}
          {selected.length > 2 && (
            <Box component="span" sx={{ ml: 1, fontSize: 14, color: 'gray' }}>
              +{selected.length - 2} more
            </Box>
          )}
        </>
      )}
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

export default MultiSelectAutocomplete;
