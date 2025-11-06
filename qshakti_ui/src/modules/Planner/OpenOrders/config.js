export const TEMPLATE_HEADERS = {
  Production: ["Date", "Shift", "Machine", "Target Output", "Remarks"],
  RM: ["RMS ID", "Planner Name", "Material", "Quantity", "Schedule Date"],
};

export const transformProductionRow = (row, index) => ({
  id: index,
  "Prod. Order No.": row.order_number || "",
  "Lot No.": row.lot_number || "",
  "Lot Qty": row.lot_qty || 0,
  "Item Code": row.item_code || "",
  "Item Description": row.item_desc || "",
  "Targeted Date": row.target_date || "",
  Section: row.section || "",
});
export const transformRMRow = (row, index) => ({
  id: index,
  "MIS No.": row.mis_no || "",
  "I/O No.": row.io_number || "",
  "Lot Qty": row.lot_qty || 0,
  "Item Code": row.item_code || "",
  "Item Description": row.item_desc || "",
  Section: row.section || "",
});

export const productionData = [
  {
    orderNo: "1234",
    lotNo: "101",
    lotQty: "3",
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
    date: "07/07/25",
    section: "Section 1",
  },
  {
    orderNo: "1234",
    lotNo: "101",
    lotQty: "3",
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
    date: "07/07/25",
    section: "Section 1",
  },
];

export const rmData = [
  {
    misNo: "1111",
    ioNo: "101",
    lotQty: "3",
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
  },
  {
    misNo: "1111",
    ioNo: "101",
    lotQty: "3",
    itemCode: "001",
    itemDesc: "Lorem Ipsum auer",
  },
];

export const tabStyles = {
  minWidth: 140,
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  flexDirection: "row",
  justifyContent: "center",
  gap: "8px",
  borderBottom: "1px solid white",
  transition: "all 0.2s ease-in-out",

  "&.Mui-selected": {
    borderBottom: "5px solid #00ACCD !important",
    color: "#28304E",
    backgroundColor: "#fff",
    transform: "translateY(-4px)",
    boxShadow: "0px 4px 12px rgba(184, 134, 11, 0.4)",
    zIndex: 2,
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },

  "& .MuiTab-iconWrapper": {
    marginBottom: "0px !important",
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
  "&:hover": {
    backgroundColor: "#fdf6e3",
    color: "#28304E",
    transform: "translateY(-2px)",
  },
};
