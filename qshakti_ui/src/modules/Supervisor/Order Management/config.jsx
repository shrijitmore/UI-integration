import { Button, Box, Tooltip } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { hasPermission } from "../../../utils/permissions";

export const initialMachine = {
  section: "",
  po_no: "",
  machine_type: "",
  machine_id: "",
  is_active: true,
  dropdowns: {
    po_numbers: [],
    machine_types: [],
    machines: [],
  },
  errors: {},
};

export const columns = ({ handleDeleteClick, openDialog }) => [
  { field: "sr_no", headerName: "Sr No", width: 90 },
  { field: "section", headerName: "SECTION", flex: 1 },
  { field: "machine_id", headerName: "MACHINE ID", flex: 1 },
  { field: "machine_type", headerName: "MACHINE TYPE", flex: 1 },
  { field: "po_no", headerName: "PO NO.", flex: 1 },
  {
    field: "is_active",
    headerName: "STATUS",
    flex: 1,
    renderCell: (params) => (
      <span
        style={{
          color: params.value ? "green" : "red",
          fontWeight: "bold",
          textTransform: "capitalize",
        }}
      >
        {params.value ? "Active" : "Inactive"}
      </span>
    ),
  },

  (hasPermission("orderManagement", "edit") ||
    hasPermission("orderManagement", "delete")) && {
    field: "actions",
    type: "actions",
    headerName: "Action",
    width: 200,
    getActions: (params) =>
      [
        hasPermission("orderManagement", "edit") && (
          <GridActionsCellItem
            icon={
              <Tooltip title="Edit">
                <EditIcon sx={{ color: "blue" }} />
              </Tooltip>
            }
            label="Edit"
            onClick={() => openDialog("edit", params.row)}
          />
        ),
        hasPermission("orderManagement", "delete") && (
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete">
                <DeleteIcon sx={{ color: "#555" }} />
              </Tooltip>
            }
            label="Delete"
            onClick={() => handleDeleteClick(params?.row?.id)}
          />
        ),
      ].filter(Boolean),
  },
];
