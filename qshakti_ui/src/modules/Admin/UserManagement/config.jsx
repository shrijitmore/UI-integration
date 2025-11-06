import {
  EMAIL_REGEX,
  MOBILE_REGEX,
  NAME_REGEX,
  EMAIL_VALIDATION_MESSAGE,
  MOBILE_VALIDATION_MESSAGE,
  NAME_VALIDATION_MESSAGE,
} from "../../../utils/commonConfig";
import React from "react";
import { Box, Typography, Avatar, Tooltip } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../../../config";
import { hasPermission } from "../../../utils/permissions";
const BASE_URL = config.apiUrl;
const commonDateFormat = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
export const createUserFields = [
  {
    name: "first_name",
    label: "First Name",
    required: true,
    type: "text",
    validationRegex: NAME_REGEX,
    validationMessage: NAME_VALIDATION_MESSAGE,
  },
  {
    name: "middle_name",
    label: "Middle Name",
    required: true,
    type: "text",
    validationRegex: NAME_REGEX,
    validationMessage: NAME_VALIDATION_MESSAGE,
  },
  {
    name: "last_name",
    label: "Last Name",
    required: true,
    type: "text",
    validationRegex: NAME_REGEX,
    validationMessage: NAME_VALIDATION_MESSAGE,
  },
  {
    name: "phone",
    label: "Mobile No.",
    required: true,
    type: "tel",
    validationRegex: MOBILE_REGEX,
    validationMessage: MOBILE_VALIDATION_MESSAGE,
  },
  {
    name: "email",
    label: "Email ID",
    required: true,
    type: "email",
    validationRegex: EMAIL_REGEX,
    validationMessage: EMAIL_VALIDATION_MESSAGE,
  },
  {
    name: "role",
    label: "Assign Role",
    type: "select",
  },
  {
    name: "user_status",
    label: "Status",
    required: true,
    isToggle: true,
    options: ["active", "inactive"],
  },
];

export const getColumns = ({ handleDeleteClick, openDialog }) =>
  [
    {
      field: "sr_no",
      headerName: "Sr. No",
      width: 100,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "user_name",
      headerName: "User Name",
      width: 200,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            height: "100%",
            minWidth: 0,
          }}
        >
          <Avatar
            src={
              params?.row?.user_image
                ? `${BASE_URL}${params.row.user_image}/`
                : "/default-avatar.png"
            }
            alt={`${params?.row?.first_name || ""} ${
              params?.row?.last_name || ""
            }`}
            sx={{ width: 36, height: 36, flex: "0 0 auto" }}
          />
          <Typography
            variant="body2"
            noWrap
            sx={{
              marginLeft: 2,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: "0 0 auto",
            }}
            title={`${params?.row?.first_name || ""} ${
              params?.row?.last_name || ""
            }`}
          >
            {`${params?.row?.first_name ?? ""} ${
              params?.row?.last_name ?? ""
            }`.trim() || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "plant_info",
      headerName: "Plant",
      width: 120,
      valueGetter: (params) => {
        return params?.name || "-";
      },
      align: "left",
      headerAlign: "left",
    },
    {
      field: "section_info",
      headerName: "Section",
      align: "left",
      headerAlign: "left",
      width: 180,
      valueGetter: (params) => params?.map((s) => s.name).join(", ") || "-",
    },

    {
      field: "operation_info",
      headerName: "Operations",
      align: "left",
      headerAlign: "left",
      width: 180,
      valueGetter: (params) =>
        params?.map((op) => op.operation_name).join(", ") || "-",
    },
    {
      field: "qc_machine",
      headerName: "QC Machine",
      align: "left",
      headerAlign: "left",
      width: 200,
      valueGetter: (params) => params.join(", ") || "-",
    },

    // {
    //   field: "user_status",
    //   headerName: "Active Status",
    //   width: 130,
    //   renderCell: (params) => {
    //     const isActive = params.row.user_status === "active";
    //     return (
    //       <Typography
    //         variant="caption"
    //         sx={{
    //           px: 2,
    //           py: 0.5,
    //           border: "1px solid",
    //           borderColor: isActive ? "green" : "red",
    //           color: isActive ? "green" : "red",
    //           borderRadius: "20px",
    //           display: "inline-block",
    //         }}
    //       >
    //         {isActive ? "Active" : "Inactive"}
    //       </Typography>
    //     );
    //   },
    // },
    {
      field: "user_status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isActive = params.row.user_status === "active";
        return (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 0.5,
              border: "1px solid",
              borderColor: isActive ? "#4caf50" : "#f44336",
              color: isActive ? "#2e7d32" : "#c62828",
              backgroundColor: isActive ? "#e8f5e9" : "#ffebee",
              borderRadius: "20px",
              display: "inline-block",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </Typography>
        );
      },
    },
    {
      field: "updated_at",
      headerName: "Date Created",
      width: 100,
      align: "left",
      headerAlign: "left",
      valueFormatter: (params) => commonDateFormat(params),
    },

    (hasPermission("userManagement", "edit") ||
      hasPermission("userManagement", "delete")) && {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 200,
      getActions: (params) =>
        [
          hasPermission("userManagement", "edit") && (
            <GridActionsCellItem
              icon={
                <Tooltip title="Edit">
                  <EditIcon sx={{ color: "blue" }} />
                </Tooltip>
              }
              label="Edit"
              onClick={() => openDialog("edit", params?.row?.id)}
            />
          ),
          hasPermission("userManagement", "delete") && (
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
  ].filter(Boolean);
