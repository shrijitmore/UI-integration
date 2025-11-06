export const tabStyles = {
  minWidth: 140,
  color: "#0D1B2A",
  textTransform: "none",
  fontWeight: "bold",
  flexDirection: "row", // icon to the left of label
  justifyContent: "center",
  gap: "8px",
  borderBottom: "1px solid #5C2D91", // light line for all tabs
  transition: "all 0.2s ease-in-out",

  "&.Mui-selected": {
    borderBottom: "5px solid #5C2D91 !important", // golden underline
    color: "#0D1B2A",
    backgroundColor: "#fff",
    transform: "translateY(-4px)",
    boxShadow: "0px 4px 12px rgba(184, 134, 11, 0.4)",
    zIndex: 2,
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },

  "& .MuiTab-iconWrapper": {
    marginBottom: "0px !important", // reset for horizontal layout
    marginRight: "4px",
  },

  "&:focus": {
    outline: "none !important",
  },
  "&:focus-visible": {
    outline: "none !important",
  },
  "&.MuiButtonBase-root": {
    outline: "none !important",
    boxShadow: "none !important",
  },
};
