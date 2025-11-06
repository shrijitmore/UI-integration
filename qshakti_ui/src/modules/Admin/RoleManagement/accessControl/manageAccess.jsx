import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRoleData } from "../../../../store/slices/roleManagement/addRoleSlice";
import { screens } from "./config";
import {
  getPermissionList,
  postPermission,
} from "../../../../store/slices/roleManagement/roleBasedauthSlice";
import { showToast } from "../../../../common/ShowToast";
import "../../../../assets/css/common.css";
import CustomAutocomplete from "../../../Operator/InprocessInspection/CustomAutocomplete";
import { hasPermission } from "../../../../utils/permissions";
import {
  getCommonHeaderStyles,
  getTableCellStyles,
} from "../../../../utils/tableStyle";
import { getPlantsDropdown } from "../../../../store/slices/admin/userManagementSlice";

const columns = ["view", "create", "edit", "delete", "export"];

function ManageAccess() {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [roleId, setRoleid] = useState("");
  const [plantId, setPlantId] = useState("");
  const [isSelectAllManuallyToggled, setIsSelectAllManuallyToggled] =
    useState(false);

  const { plantOptions } = useSelector((state) => state?.userManagement);
  const { profileData } = useSelector((state) => state?.auth);

  useEffect(() => {
    dispatch(getPlantsDropdown());

    if (profileData?.is_superuser) {
      setPlantId("");
    } else if (profileData?.plant?.id) {
      setPlantId(profileData.plant.id);
    }
  }, [dispatch, profileData]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await dispatch(getRoleData({ plant_id: plantId })).unwrap();
        const data = res?.data;
        setRoleList(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };
    if (plantId) {
      fetchRoles();
    }
  }, [dispatch, plantId]);

  const getInitialPermissions = () => {
    return screens.map((item) => ({
      screen: item.label,
      ...Object.fromEntries(columns.map((col) => [col.toLowerCase(), false])),
    }));
  };

  const [permissions, setPermissions] = useState(getInitialPermissions());

  // Helper to check if all permissions are selected
  const areAllPermissionsSelected = () => {
    return (
      permissions.length > 0 &&
      permissions.every((screen) =>
        columns.every((col) => screen[col.toLowerCase()] === true)
      )
    );
  };

  const handleSelectAllChange = () => {
    const allSelected = areAllPermissionsSelected();
    const updated = permissions.map((screen) => ({
      screen: screen.screen,
      ...Object.fromEntries(
        columns.map((col) => [col.toLowerCase(), !allSelected])
      ),
    }));

    setPermissions(updated);
    setIsSelectAllManuallyToggled(true); // mark that this was toggled manually
  };

  const handleCheckboxChange = (rowIndex, columnKey) => {
    const updated = [...permissions];

    if (columnKey !== "view") {
      updated[rowIndex][columnKey] = !updated[rowIndex][columnKey];
      if (updated[rowIndex][columnKey]) {
        updated[rowIndex]["view"] = true;
      }
    } else {
      const isChecked = !updated[rowIndex]["view"];
      updated[rowIndex]["view"] = isChecked;

      if (!isChecked) {
        columns.forEach((key) => {
          if (key !== "view") {
            updated[rowIndex][key] = false;
          }
        });
      }
    }

    setPermissions(updated);
    setIsSelectAllManuallyToggled(false); // reset toggle flag when user manually changes checkboxes
  };

  const handleSubmit = async () => {
    const selectedPermissions = permissions
      .map(({ screen, ...rest }) => {
        const screenKeyObj = screens.find((s) => s.label === screen);
        const permissionKeys = Object.entries(rest)
          .filter(([_, value]) => value)
          .map(([key]) => key);

        if (permissionKeys.length === 0 || !screenKeyObj) return null;

        return {
          screen: screenKeyObj.key,
          actions: permissionKeys,
        };
      })
      .filter(Boolean);

    const payload = {
      role: roleId,
      screens: selectedPermissions,
      plant: plantId || profileData?.plant?.id,
    };

    let res = await dispatch(postPermission(payload)).unwrap();
    if (res) {
      showToast(res?.message, "success");
      setSelectedRole("");
      setPermissions(getInitialPermissions);
    }
  };

  const handleRoleChange = async (event, newValue) => {
    console.log(newValue);
    if (newValue) {
      setRoleid(newValue?.id);
      setSelectedRole(newValue);
      const role = newValue?.name;
      const plant = newValue?.plant_info?.id;

      try {
        let res = await dispatch(getPermissionList({ role, plant })).unwrap();
        let data = res?.data;

        const updatedPermissions = screens.map((screenItem) => {
          const match = data.find((d) => d.screen === screenItem.key);
          return {
            screen: screenItem.label,
            ...Object.fromEntries(
              columns.map((col) => [
                col.toLowerCase(),
                match ? match[col.toLowerCase()] : false,
              ])
            ),
          };
        });

        setPermissions(updatedPermissions);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    } else {
      setSelectedRole("");
      setPermissions(getInitialPermissions);
    }
  };

  return (
    <>
      <Box p={1}>
        {/* Role Selector + Select All */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 2 }}>
          <CustomAutocomplete
            sx={{ minWidth: 370 }}
            label="Select Plant"
            placeholder="Choose a"
            options={plantOptions}
            getOptionLabel={(option) => option?.plant_name || ""}
            onChange={(e, newValue) => {
              setPlantId(newValue?.id || "");
            }}
            value={
              plantOptions.find((opt) => opt.id === plantId) ||
              plantOptions.find(
                (opt) => opt.plant_name === profileData?.plant?.name
              ) ||
              null
            }
            disabled={!profileData?.is_superuser}
          />

          <CustomAutocomplete
            label="Select Role"
            placeholder="Choose a role"
            value={selectedRole}
            onChange={handleRoleChange}
            getOptionLabel={(option) => option?.name || ""}
            options={roleList}
            disabled={!plantId}
          />
          <FormControlLabel
            sx={{ color: "#4B0082" }}
            control={
              <Checkbox
                sx={{ color: "#4B0082" }}
                size="small"
                checked={areAllPermissionsSelected()}
                indeterminate={
                  isSelectAllManuallyToggled &&
                  permissions.some((screen) =>
                    columns.some((col) => screen[col.toLowerCase()] === true)
                  ) &&
                  !areAllPermissionsSelected()
                }
                onChange={handleSelectAllChange}
                disabled={!selectedRole}
              />
            }
            label="Select All"
          />
        </Box>

        {/* Permissions Table */}
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            border: "1px solid #ccc",
            maxHeight: 500,
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            {" "}
            {/* <-- Enables sticky table headers */}
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5", height: 32 }}>
                <TableCell sx={{ ...getCommonHeaderStyles({ center: false }) }}>
                  Screens
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    align="center"
                    sx={{ ...getCommonHeaderStyles() }}
                  >
                    {col === "create"
                      ? "Add"
                      : col.charAt(0).toUpperCase() + col.slice(1)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((row, index) => (
                <TableRow key={index} sx={{ height: 40 }}>
                  <TableCell
                    sx={{ py: 0.5, ...getTableCellStyles({ center: false }) }}
                  >
                    {row.screen}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col} align="center" sx={{ py: 0.5 }}>
                      <Checkbox
                        size="small"
                        checked={row[col.toLowerCase()]}
                        onChange={() =>
                          handleCheckboxChange(index, col.toLowerCase())
                        }
                        sx={{ padding: 0 }}
                        disabled={!selectedRole}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 2,
          marginBottom: "52px",
        }}
      >
        {hasPermission("roleManagement", "create") && selectedRole && (
          <Button
            sx={{ width: "100px" }}
            variant="contained"
            className="commonButton"
            onClick={handleSubmit}
            disabled={!selectedRole}
          >
            Submit
          </Button>
        )}
      </Box>
    </>
  );
}

export default ManageAccess;
