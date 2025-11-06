import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import CreateUserDialog from "./CreateUserdialog";
import DeleteConfirmationPopup from "../../../common/commonComponent/deleteConfirmationPopup/deleteConfirmationPopup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useDispatch, useSelector } from "react-redux";
import {
  getUserTableDetails,
  deleteUserManagementDetails,
  getPlantsDropdown,
} from "../../../store/slices/admin/userManagementSlice";
import ExportDropdown from "../../../common/commonComponent/exportComponent/ExportDropdown";
import "../../../assets/css/common.css";

import { DROPDOWN_ENDPOINTS_USER } from "../../../utils/endpoints";

import CommonDataGrid from "../../../common/commonComponent/commonDataGrid/commonDataGrid";
import { getColumns } from "./config";
import { showToast } from "../../../common/ShowToast";
import { hasPermission } from "../../../utils/permissions";
import CustomAutocomplete from "../../Operator/InprocessInspection/CustomAutocomplete";
export default function UserManagement() {
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state?.auth);
  const { userTableDetails } = useSelector((state) => state.userManagement);
  const { plantOptions } = useSelector((state) => state?.userManagement);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [plant, setPlant] = useState(null);
  const [plantId, setplantId] = useState("");
  useEffect(() => {
    // if (!profileData?.plant?.id && !plantId) return;
    dispatch(getPlantsDropdown());
    dispatch(
      getUserTableDetails({
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize,
        plant_id: plantId || profileData?.plant?.id,
      })
    );
  }, [dispatch, paginationModel, plantId, profileData?.plant?.id]);

  const openDialog = (mode, userId) => {
    setDialogMode(mode);
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (confirmed) => {
    if (confirmed && selectedDeleteId) {
      dispatch(deleteUserManagementDetails(selectedDeleteId))
        .unwrap()
        .then((res) => {
          showToast(res?.message || "User deleted successfully.", "success");
          dispatch(getUserTableDetails());
        })
        .catch((err) => {
          showToast(err?.message || "Failed to delete user.", "error");
        });
    }

    setDeleteModalOpen(false);
    setSelectedDeleteId(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          // gap: 1,
          width: "100%",
          mb: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.2rem",
              lg: "1.3rem",
            },
            color: "#1a237e",
            fontWeight: "bold",
            cursor: "pointer",
            mb: 1,
          }}
          onClick={() => navigate("/admin/closedBids")}
        >
          User Management
        </Typography>{" "}
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <CustomAutocomplete
            options={plantOptions || []}
            getOptionLabel={(option) => option?.plant_name || ""}
            value={plant || null}
            onChange={(event, newValue) => {
              setPlant(newValue);
              setplantId(newValue?.id || null);

              if (newValue?.id) {
                // When a plant is selected
                dispatch(getUserTableDetails({ plant_id: newValue.id }));
              } else {
                // When cleared
                dispatch(getUserTableDetails({ plant_id: "" }));
              }
            }}
            required={false}
            sx={{ minWidth: 250 }}
          />

          {hasPermission("userManagement", "create") && (
            <Button
              variant="contained"
              onClick={() => openDialog("create")}
              className="commonAdd"
            >
              <AddCircleOutlineIcon
                fontSize="small"
                sx={{ marginRight: "10px" }}
              />
              Create
            </Button>
          )}
          {hasPermission("userManagement", "export") && (
            <ExportDropdown
              // rawData={exportData}
              fetchUrl={DROPDOWN_ENDPOINTS_USER?.USER_GET_LIST}
              fileName="User Management Report"
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
          borderRadius: 1,
          paddingX: 1,
          paddingY: 1,
          mt: 1,
        }}
      >
        <Box>
          <Box sx={{ height: "82vh", width: "100%", mt: 0 }}>
            <CommonDataGrid
              // rows={userTableDetails?.data?.map((row, index) => ({
              //   ...row,
              //   sr_no: index + 1,
              // }))}
              rows={userTableDetails?.data?.map((row, index) => ({
                ...row,
                sr_no: index + 1,
                user_name: `${row.first_name ?? ""} ${
                  row.last_name ?? ""
                }`.trim(),
              }))}
              columns={getColumns({
                handleDeleteClick,
                openDialog,
              })}
              disableRowSelectionOnClick
              sx={{
                borderRadius: 2,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                },
              }}
              getRowHeight={() => 100}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20, 50]}
              rowCount={userTableDetails?.total || 0}
              paginationMode="server"
              enablePagination={true}
            />
          </Box>
          <CreateUserDialog
            open={dialogOpen}
            onClose={() => {
              setDialogOpen(false);
              setSelectedUserId("");
            }}
            mode={dialogMode}
            userId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />

          <DeleteConfirmationPopup
            open={deleteModalOpen}
            onConfirm={handleDeleteConfirm}
            title="Delete User"
            message="Are you sure you want to delete this user?"
          />
        </Box>
      </Box>
    </>
  );
}
