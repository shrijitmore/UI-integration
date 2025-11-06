// utils/styles.js
export const getCommonHeaderStyles = ({
  center = true,
  overrides = {},
} = {}) => ({
  minWidth: "90px",
  fontSize: "0.95rem",
  textTransform: "uppercase",
  backgroundColor: "#dfe2e5ff !important",
  textAlign: center ? "center" : "left",
  verticalAlign: "middle",
  display: "table-cell", // ensure table-cell layout
  justifyContent: center ? "center" : "flex-start", // for flex-based cells
  ...overrides,
});

export const getTableCellStyles = ({
  center = true, // default is centered
  overrides = {},
} = {}) => ({
  maxWidth: { xs: 120, sm: 150, md: 200 },
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  padding: "8px",
  textAlign: center ? "center" : "left",
  verticalAlign: center ? "middle" : "top",
    // border: "1px solid #e0e0e0",
  alignItems: center ? "center" : "flex-start",
  justifyContent: center ? "center" : "flex-start",
  fontSize: "0.9rem",
  ...overrides,
});

// utils/styles.js
export const getCommonDatagridHeaderStyles = (overrides = {}) => ({
  flex: 1,
  border: "1px solid #ccc",
  borderRadius: 1,
  height: "100%",
  bgcolor: "#ffffff",

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#dfe2e5ff !important",
    color: "#0f0f0fff !important",
    fontWeight: "bold",
    fontSize: "0.95rem",
    textTransform: "uppercase",
    borderBottom: "2px solid #004080",
    justifyContent: "center",
  },

  "& .MuiDataGrid-sortIcon": {
    color: "#daa520 !important",
  },

  "& .MuiDataGrid-cell": {
    borderColor: "#fff",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
  },

  "& .MuiDataGrid-row": {
    backgroundColor: "#ffffff",
    color: "#333",
    borderBottom: "1px solid #ddd",
    fontSize: "0.65rem",
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#e3f2fd",
  },

  "& .MuiDataGrid-footerContainer": {
    zIndex: 2,
    backgroundColor: "#ffffff",
    borderTop: "1px solid #ccc",
  },

  "& .MuiDataGrid-columnHeader:hover": {
    backgroundColor: "#a2b6c9ff",
  },

  ...overrides, // Let caller override styles
});
