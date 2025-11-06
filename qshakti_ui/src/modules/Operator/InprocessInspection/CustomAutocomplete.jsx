import React from "react";
import { Autocomplete, TextField, Box, Checkbox, Chip } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { data } from "autoprefixer";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const lightTheme = {
  background: "#F9FAFB",
  optionHover: "#E3F2FD",
  optionSelected: "#BBDEFB",
  text: "#374151",
  textSelected: "#1565C0",
  chipBg: "#1976D2",
  chipText: "#fff",
};

const RenderOption = ({
  props,
  option,
  selected,
  multiple,
  getOptionLabel,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <li
      {...props}
      style={{
        background:
          selected || isHovered
            ? lightTheme.optionHover
            : lightTheme.background,
        color:
          selected || isHovered ? lightTheme.textSelected : lightTheme.text,
        fontWeight: selected || isHovered ? "bold" : "normal",
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {multiple ? (
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            sx={{
              color: lightTheme.text,
              "&.Mui-checked": {
                color: lightTheme.textSelected,
              },
            }}
          />
        ) : (
          (selected || isHovered) && (
            <ArrowRightAltIcon
              fontSize="small"
              style={{ color: lightTheme.textSelected }}
            />
          )
        )}
        <span>{getOptionLabel(option)}</span>
      </Box>
    </li>
  );
};

const getLabelWithAsterisk = (label, required) =>
  required ? (
    <>
      {label}
      <Box component="span" sx={{ color: "#bb0f0f" }}>
        {" "}
        *
      </Box>
    </>
  ) : (
    label
  );

const CustomAutocomplete = ({
  label = "Select Option",
  value = [],
  onChange,
  options = [],
  getOptionLabel = (option) => option,
  disabled = false,
  multiple = false,
  isOptionEqualToValue,
  disableCloseOnSelect = false,
  placeholder = "",
  sx = {},
  textFieldProps,
  required = true,
  datatestid,
  hideAsterisk = false,
}) => {
  const selectAllOption = "__select_all__";
  const extendedOptions =
    multiple && options.length > 0 ? [selectAllOption, ...options] : options;

  const handleChange = (event, newValue, reason) => {
    if (!multiple) {
      onChange(event, newValue, reason);
      return;
    }
    if (newValue.includes(selectAllOption)) {
      if (value.length === options.length) {
        onChange(event, [], reason);
      } else {
        onChange(event, [...options], reason);
      }
    } else {
      onChange(event, newValue, reason);
    }
  };

  return (
    <Autocomplete
      // data-testid={datatestid || "custom-autocomplete"}
      size="small"
      multiple={multiple}
      disableCloseOnSelect={multiple}
      value={value}
      onChange={handleChange}
      options={extendedOptions}
      getOptionLabel={(option) =>
        option === selectAllOption ? " Select All" : getOptionLabel(option)
      }
      isOptionEqualToValue={(opt, val) =>
        opt === val ||
        (isOptionEqualToValue ? isOptionEqualToValue(opt, val) : opt === val)
      }
      disabled={disabled}
      clearIcon={value ? undefined : null}
      sx={{ minWidth: 200, borderRadius: "8px", mt: 1, ...sx }}
      renderTags={(tagValue, getTagProps) =>
        multiple && (
          <Box
            sx={{
              maxHeight: 80,
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              padding: "4px",
            }}
          >
            {tagValue.map((option, index) => (
              <Chip
                variant="outlined"
                label={getOptionLabel(option)}
                {...getTagProps({ index })}
                sx={{
                  backgroundColor: lightTheme.chipBg,
                  color: lightTheme.chipText,
                  "& .MuiChip-deleteIcon": {
                    color: lightTheme.chipText,
                    "&:hover": { color: "#0D47A1" },
                  },
                }}
              />
            ))}
          </Box>
        )
      }
      renderOption={(props, option, state) => {
        if (option === selectAllOption) {
          const isAllSelected = value.length === options.length;
          return (
            <li {...props}>
              <Box display="flex" alignItems="center" gap={1.5} ml={-0.7}>
                <Checkbox
                  checked={isAllSelected}
                  sx={{
                    color: lightTheme.text,
                    "&.Mui-checked": { color: lightTheme.textSelected },
                  }}
                />
                <span>Select All</span>
              </Box>
            </li>
          );
        }
        return (
          <RenderOption
            props={props}
            option={option}
            selected={state.selected}
            multiple={multiple}
            getOptionLabel={getOptionLabel}
          />
        );
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: lightTheme.background,
            color: lightTheme.text,
            mt: 1,
            boxShadow: 3,
            "& .MuiAutocomplete-listbox": {
              maxHeight: "240px",
              overflowY: "auto",
            },
            "& .MuiAutocomplete-noOptions": {
              color: lightTheme.text,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          size="small"
          {...params}
          {...textFieldProps}
          label={
            required && !hideAsterisk
              ? getLabelWithAsterisk(label, required)
              : label
          }
          placeholder={placeholder}
          required={false}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            "data-testid": datatestid || "custom-autocomplete-input",
          }}
          InputLabelProps={{
            sx: {
              fontWeight: "bold",
              color: lightTheme.text,
              "&.Mui-focused": {
                color: lightTheme.textSelected,
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            sx: {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E0E0E0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: lightTheme.textSelected,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: lightTheme.textSelected,
              },
            },
          }}
          sx={{ minWidth: 150 }}
        />
      )}
    />
  );
};

export default CustomAutocomplete;
