import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField, Box, CircularProgress } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

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

// 🔹 helper for label with asterisk
const getLabelWithAsterisk = (label, required) =>
  required ? (
    <>
      {label}
      <Box component="span" sx={{ color: "#BB0F0F" }}>
        {" "}
        *
      </Box>
    </>
  ) : (
    label
  );

// 🔹 render each option with hover + select effects
const RenderOption = ({ props, option, selected, getOptionLabel }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <li
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: selected
          ? themeColors.optionSelected
          : isHovered
          ? themeColors.optionHover
          : themeColors.background,
        color:
          selected || isHovered ? themeColors.textSelected : themeColors.text,
        fontWeight: selected || isHovered ? "bold" : "normal",
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {(selected || isHovered) && (
          <ArrowRightAltIcon
            fontSize="small"
            sx={{ color: themeColors.textSelected }}
          />
        )}
        <span>{getOptionLabel(option)}</span>
      </Box>
    </li>
  );
};

const SearchAutocomplete = ({
  label = "Search",
  value = null,
  onChange,
  apiThunk,
  apiParams = {},
  isOptionEqualToValue = (o, v) => o?.id === v?.id,
  disabled = false,
  placeholder = "Type to search...",
  minLength = 0,
  required = false,
  sx = {},
  textFieldProps,
  searchKey = "search",
  setOptions,
  options,
  optionLabelKey = "name",
  optionValueKey = "id",
  datasearchId = "search-autocomplete",
}) => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef(null);

  // 🔍 Debounced API call
  useEffect(() => {
    if (inputValue.length < minLength) {
      setOptions([]);
      return;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      if (!apiThunk) return;
      setLoading(true);
      try {
        const paramsObj = {
          ...apiParams.params,
          [searchKey]: inputValue?.toUpperCase(),
        };
        const res = await apiThunk({
          url: apiParams.url,
          params: paramsObj,
        }).unwrap();

        // setOptions([...options, ...res?.data] || []);
        setOptions((prevOptions) =>
          Array.from(
            new Map(
              [...prevOptions, ...(res?.data || [])].map((item) => [
                item.id,
                item,
              ])
            ).values()
          )
        );
      } catch (err) {
        console.error(`${label} search error:`, err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(typingTimeoutRef.current);
  }, [inputValue]);

  const getLabel = (option) =>
    option?.[optionLabelKey] ?? option?.[optionValueKey] ?? "";

  return (
    <Autocomplete
      // data-testid={datasearchId || "search-autocomplete"}
      size="small"
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      options={options}
      inputValue={inputValue}
      onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={getLabel}
      isOptionEqualToValue={(o, v) =>
        o?.[optionValueKey] === v?.[optionValueKey]
      }
      loading={loading}
      disabled={disabled}
      clearIcon={value ? undefined : null}
      sx={{ minWidth: 200, borderRadius: "8px", mb: 1, ...sx }}
      renderOption={(props, option, { selected }) => (
        <RenderOption
          props={props}
          option={option}
          selected={selected}
          getOptionLabel={getLabel}
        />
      )}
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
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...textFieldProps}
          label={getLabelWithAsterisk(label, required)}
          placeholder={placeholder}
          variant="outlined"
          InputLabelProps={{
            sx: {
              fontWeight: "bold",
              color: themeColors.text,
              "&.Mui-focused": {
                color: themeColors.textSelected,
              },
            },
          }}
          inputProps={{
            ...params.inputProps,
            "data-testid": datasearchId || "custom-autocomplete-input",
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
            sx: {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E0E0E0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: themeColors.textSelected,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: themeColors.textSelected,
              },
            },
          }}
          sx={{ minWidth: 150 }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;
