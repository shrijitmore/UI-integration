import { bgcolor } from "@mui/system";

export const parameters = [
  "Cleaning",
  "Draw & Trimming",
  "Body Annealing",
  "Picking, Soaping & Drying",
];
export const borderColorVariable = "#5C2D91";
export const backgroundColor = "#00ACCD";
export const purpleOutlinedTextFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    "& fieldset": {
      borderColor: `${borderColorVariable} !important`,
    },
    "&:hover fieldset": {
      borderColor: `${borderColorVariable}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${borderColorVariable}`,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    color: `${borderColorVariable}`,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: `${borderColorVariable}`,
  },
};

export const purpleOutlinedInputFieldStyles = {
  backgroundColor: "#e0e0e0", // gray background like the screenshot
  borderRadius: "8px", // rounded edges
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#555", // text color when disabled
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    "& fieldset": {
      borderColor: `${borderColorVariable} !important`,
    },
    "&:hover fieldset": {
      borderColor: `${borderColorVariable}`,
    },
    "&.Mui-focused fieldset": {
      borderColor: `${borderColorVariable}`,
      borderWidth: "2px",
    },
    "&.Mui-disabled fieldset": {
      borderColor: "#494949 !important", // gray border when disabled
    },
  },
  "& .MuiInputLabel-root": {
    color: `${borderColorVariable}`,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: `${borderColorVariable}`,
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#494949", // gray label when disabled
  },
};