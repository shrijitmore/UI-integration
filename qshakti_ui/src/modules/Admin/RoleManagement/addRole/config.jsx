import { IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoDataFound from "../../../../common/NoDataFound";
import { hasPermission } from "../../../../utils/permissions";

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export const Admin_Rows = [
  { id: 1, name: "John Doe", description: "Frontend Developer" },
  { id: 2, name: "Jane Smith", description: "Backend Developer" },
  { id: 3, name: "Alice Johnson", description: "UI/UX Designer" },
];

export const getColumns = (handleEdit, handleDelete) => [
  { field: "sr.no", headerName: "SR.No." },

  { field: "name", headerName: "Role", flex: 1 },
  { field: "description", headerName: "Description", flex: 1 },

  {
    field: "actions",
    headerName: "Action",
    flex: 1,
    sortable: false,
    filterable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {hasPermission("roleManagement", "edit") && (
          <IconButton
            sx={{ color: "#28304E" }}
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
        )}
        {hasPermission("roleManagement", "delete") && (
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    ),
  },
];

export const CustomNoRowsOverlay = () => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        flexDirection: "column",
      }}
    >
      <NoDataFound message="Data Not Found" messagePosition="center" />
    </Box>
  );
};
export const dataGridstyle = {
  minWidth: "100%",
  color: "#37373B",

  "& .MuiDataGrid-columnHeaders": {
    maxHeight: 64,
    minHeight: 64,
  },
  "& .wrap-header .MuiDataGrid-columnHeaderTitle": {
    whiteSpace: "normal",
    lineHeight: "1.2",
    textAlign: "center",
  },

  "& .MuiDataGrid-columnHeader": {
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    fontWeight: 600,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
    fontWeight: 600,
  },

  flex: 1,
  "& .MuiDataGrid-selectedRowCount": {
    display: "none",
  },
  "& .MuiDataGrid-footerContainer": {
    mt: "auto",
  },
};
