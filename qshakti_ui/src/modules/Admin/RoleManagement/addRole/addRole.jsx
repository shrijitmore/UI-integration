import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteConfirmationPopup from "../../../../common/commonComponent/deleteConfirmationPopup/deleteConfirmationPopup";
import {
  addRoleData,
  deleteRoleData,
  EditRoleData,
  getRoleData,
} from "../../../../store/slices/roleManagement/addRoleSlice";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../common/ShowToast";
import { CustomNoRowsOverlay, getColumns, modalStyle } from "./config";
import ButtonLoaderWrapper from "../../../../common/commonComponent/ButtonLoaderWrapper";
import { DataGrid } from "@mui/x-data-grid";
import "../../../../assets/css/common.css";
import {
  borderColorVariable,
  purpleOutlinedTextFieldStyles,
} from "../../../Operator/InprocessInspection/config";
import { hasPermission } from "../../../../utils/permissions";
import { getCommonDatagridHeaderStyles } from "../../../../utils/tableStyle";
import { getPlantsDropdown } from "../../../../store/slices/admin/userManagementSlice";
import CustomAutocomplete from "../../../Operator/InprocessInspection/CustomAutocomplete";

const AddRole = () => {
  const dispatch = useDispatch();
  const {
    success,
    error,
    adminUserRoles,
    plantOptions,
    sectionOptions,
    operationsOptions,
    machineOptions,
  } = useSelector((state) => state?.userManagement);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", description: "" });

  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [plant, setPlant] = useState(null);
  const [plantId, setplantId] = useState(null);
  const [filterPlant, setFilterPlant] = useState(null);
  const [modalPlant, setModalPlant] = useState(null);
  const [modalPlantId, setModalPlantId] = useState(null);
  const { data } = useSelector((state) => state.addRole);
  const { profileData } = useSelector((state) => state?.auth);
  const onClose = () => {
    setOpenModal(false);
    setName("");
    setDescription("");
    setEditId(null);
    setModalPlant(null);
    setModalPlantId(null);
  };

  useEffect(() => {
    dispatch(getRoleData({ exclude_role_name: "admin" }));
    dispatch(getPlantsDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setRows(data?.data);
    }
  }, [data]);

  const handleAddClick = () => {
    onClose();
    setOpenModal(true);
    setLoading(false);
  };
  const handleAddOrUpdateRole = () => {
    const newErrors = { name: "", description: "" };
    let hasError = false;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    } else if (name.length > 100) {
      newErrors.name = "100 characters allowed for name";
      hasError = true;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = "Only alphabets are allowed";
      hasError = true;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;
    setLoading(true);
    const plant = modalPlantId ? modalPlantId : profileData?.plant?.id;
    const payload = { name, description, plant };

    if (editId !== null) {
      dispatch(EditRoleData({ id: editId, payload }))
        .unwrap()
        .then((res) => {
          showToast(res?.message, "success");
          setLoading(false);
          setRows((prev) =>
            prev.map((row) =>
              row.id === editId ? { ...row, plant, name, description } : row
            )
          );
          onClose();
        })
        .catch(() => {
          showToast("Failed to update role", "error");
          setLoading(false);
        });
    } else {
      dispatch(addRoleData(payload))
        .unwrap()
        .then((res) => {
          showToast(res?.message, "success");
          setLoading(false);

          const newId = rows.length
            ? Math.max(...rows.map((r) => r.id)) + 1
            : 1;
          setRows([...rows, { id: newId, name, description }]);
          onClose();
        })
        .catch((error) => {
          const errorMessage = error || "Failed to add role";
          showToast(errorMessage, "error");
          setLoading(false);
        });
    }
  };

  const handleEdit = (id) => {
    const role = rows.find((r) => r.id === id);
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setEditId(id);

      const matchedPlant = plantOptions?.find(
        (p) => p.id === role?.plant_info?.id
      );
      setModalPlant(matchedPlant || null);
      setModalPlantId(role?.plant_info?.id || null);

      setOpenModal(true);
      setErrors({ name: "", description: "" });
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (confirmed) => {
    if (confirmed && selectedDeleteId) {
      dispatch(deleteRoleData(selectedDeleteId))
        .unwrap()
        .then((res) => {
          showToast(res?.message || "Role deleted successfully", "success");
          getRoleData({ exclude_role_name: "admin" });
          setRows((prev) => prev.filter((r) => r.id !== selectedDeleteId));
          setDeleteModalOpen(false);
          setSelectedDeleteId(null);
        })
        .catch((err) => {
          showToast("Failed to delete role", "error");
          console.error("Delete role error:", err);
          setDeleteModalOpen(false);
          setSelectedDeleteId(null);
        });
    } else {
      setDeleteModalOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = getColumns(handleEdit, handleDeleteClick);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box p={1}>
            {/* Row: Autocomplete on left, Add button on right */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                alignItems: "center",
              }}
            >
              <CustomAutocomplete
                options={plantOptions || []}
                getOptionLabel={(option) => option?.plant_name || ""}
                value={
                  plantOptions.find((item) => item.id === filterPlant?.id) ||
                  null
                }
                onChange={(event, newValue) => {
                  setFilterPlant(newValue);
                  dispatch(getRoleData({ plant_id: newValue?.id || null }));
                }}
                required={false}
                sx={{ minWidth: 250 }}
              />

              {hasPermission("roleManagement", "create") && (
                <Button
                  variant="contained"
                  onClick={handleAddClick}
                  className="commonAdd"
                >
                  <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                  Add
                </Button>
              )}
            </Box>

            {/* DataGrid */}
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={rows.map((item, index) => ({
                  ...item,
                  "sr.no": index + 1,
                }))}
                columns={columns}
                disableSelectionOnClick
                pageSize={rows.length}
                pagination={false}
                hideFooterPagination={true}
                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                sx={getCommonDatagridHeaderStyles({})}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <DeleteConfirmationPopup
        open={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message="Are you sure you want to delete this role?"
      />

      <Modal
        open={openModal}
        // onClose={onClose}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            onClose();
          }
        }}
      >
        <Box
          sx={{
            ...modalStyle,
            position: "relative",
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 24,
            width: { xs: "90%", sm: 500 },
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#bb0f0f",
            }}
          >
            <CancelIcon />
          </IconButton>
          <Typography
            variant="h6"
            mb={1}
            sx={{
              color: borderColorVariable || "#333",
              fontWeight: 600,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            {editId !== null ? "Edit Role" : "Add New Role"}
            <Typography sx={{ color: "#1a237e" }}>
              {profileData?.is_superuser ? null : "Plant:"}{" "}
              {profileData?.is_superuser ? null : profileData?.plant?.name}
            </Typography>
          </Typography>

          <Divider sx={{ mb: 3, bgcolor: "#ccc" }} />
          {profileData?.is_superuser && (
            <CustomAutocomplete
              sx={{ mb: 2 }}
              options={plantOptions || []}
              getOptionLabel={(option) => option?.plant_name || ""}
              value={
                plantOptions.find((item) => item.id === modalPlant?.id) || null
              }
              onChange={(event, newValue) => {
                setModalPlant(newValue);
                setModalPlantId(newValue?.id || null);
              }}
              label="Plant"
            />
          )}

          <TextField
            label={
              <span>
                Name <span style={{ color: "#d32f2f" }}>*</span>
              </span>
            }
            fullWidth
            size="small"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(value)) {
                if (value.length <= 100) {
                  setName(value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    name: "Max 100 characters allowed for name",
                  }));
                }
              } else {
                setErrors((prev) => ({
                  ...prev,
                  name: "Only alphabets are allowed",
                }));
              }
            }}
            error={Boolean(errors.name)}
            helperText={errors.name}
            sx={{
              mb: 2,
              ...purpleOutlinedTextFieldStyles,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={
              <span>
                Description <span style={{ color: "#d32f2f" }}>*</span>
              </span>
            }
            fullWidth
            size="small"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description && e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
            error={Boolean(errors.description)}
            helperText={errors.description}
            sx={{
              mb: 3,
              ...purpleOutlinedTextFieldStyles,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              color="error"
              sx={{
                textTransform: "none",
                px: 3,
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>

            <ButtonLoaderWrapper
              loading={loading}
              button={
                <Button
                  variant="contained"
                  onClick={handleAddOrUpdateRole}
                  color="primary"
                  sx={{
                    textTransform: "none",
                    width: 100,
                    fontWeight: 500,
                  }}
                >
                  {editId ? "Update" : "Submit"}
                </Button>
              }
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddRole;
