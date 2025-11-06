import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Card } from "react-bootstrap";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import {
  getOrderManagementDropdown,
  postOrderManagemnt,
  UpdateOrderManagemnet,
} from "../../../store/slices/orderManagement/orderManagementSlice";
import { showToast } from "../../../common/ShowToast";
import CustomAutocomplete from "../../Operator/InprocessInspection/CustomAutocomplete";
import { initialMachine } from "./config";

const CreateOrderDialog = ({
  open,
  onClose,
  setIsCreated,
  mode,
  userId,
  editUserData,
}) => {
  const dispatch = useDispatch();
  const [machines, setMachines] = useState([{ ...initialMachine }]);
  const [sectionList, setSectionList] = useState([]);

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }
    dispatch(getOrderManagementDropdown({}))
      .unwrap()
      .then((res) => setSectionList(res?.sections || []))
      .catch(() => showToast("Failed to load sections", "error"));
  }, [open]);

  useEffect(() => {
    if (mode === "edit" && editUserData) {
      setMachines([
        {
          section: editUserData.section || "",
          po_no: editUserData.po_no || "",
          machine_type: editUserData.machine_type || "",
          machine_id: editUserData.machine_id || "",
          is_active: editUserData.is_active ?? true,
          dropdowns: {
            po_numbers: [],
            machine_types: [],
            machines: [],
          },
          errors: {},
        },
      ]);
      async function fetchData() {
        await fetchDropdownDataForEdit(0, "section", editUserData.section);
        await fetchDropdownDataForEdit(0, "po_no", editUserData.po_no);
        await fetchDropdownDataForEdit(
          0,
          "machine_type",
          editUserData.machine_type
        );
      }
      fetchData();
    }
  }, [mode, editUserData]);

  const resetForm = () => setMachines([{ ...initialMachine }]);

  const handleChange = (index, field, value) => {
    setMachines((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        errors: { ...updated[index].errors, [field]: false },
      };
      return updated;
    });
  };

  const updateDropdown = (index, key, data) => {
    setMachines((prev) => {
      const updated = [...prev];
      updated[index].dropdowns[key] = data;
      return updated;
    });
  };

  const clearDependentFields = (index, fields) => {
    setMachines((prev) => {
      const updated = [...prev];
      fields.forEach((f) => (updated[index][f] = ""));
      return updated;
    });
  };

  const fetchDropdownData = async (index, field, value) => {
    const machine = machines[index];
    try {
      if (field === "section") {
        clearDependentFields(index, ["po_no", "machine_type", "machine_id"]);
        updateDropdown(index, "machine_types", []);
        updateDropdown(index, "machines", []);

        const res = await dispatch(
          getOrderManagementDropdown({ section: value })
        ).unwrap();
        updateDropdown(index, "po_numbers", res?.po_numbers || []);
      }

      if (field === "po_no" && machine.section) {
        clearDependentFields(index, ["machine_type", "machine_id"]);
        updateDropdown(index, "machine_types", []);

        const res = await dispatch(
          getOrderManagementDropdown({
            section: machine.section,
            po_number: value,
          })
        ).unwrap();
        updateDropdown(index, "machine_types", res?.machine_types || []);
      }

      if (field === "machine_type" && machine.section && machine.po_no) {
        clearDependentFields(index, ["machine_id"]);

        const res = await dispatch(
          getOrderManagementDropdown({
            section: machine.section,
            po_number: machine.po_no,
            machine_type: value,
          })
        ).unwrap();
        updateDropdown(index, "machines", res?.machines || []);
      }
    } catch {}
  };

  const fetchDropdownDataForEdit = async (index, field, value) => {
    try {
      if (field === "section") {
        const res = await dispatch(
          getOrderManagementDropdown({ section: value })
        ).unwrap();
        updateDropdown(index, "po_numbers", res?.po_numbers || []);
      }

      if (field === "po_no" && editUserData?.section) {
        const res = await dispatch(
          getOrderManagementDropdown({
            section: editUserData?.section,
            po_number: value,
          })
        ).unwrap();
        updateDropdown(index, "machine_types", res?.machine_types || []);
      }

      if (
        field === "machine_type" &&
        editUserData?.section &&
        editUserData?.po_no
      ) {
        const res = await dispatch(
          getOrderManagementDropdown({
            section: editUserData?.section,
            po_number: editUserData?.po_no,
            machine_type: value,
          })
        ).unwrap();
        updateDropdown(index, "machines", res?.machines || []);
      }
    } catch {}
  };
  const handleFieldChange = async (index, field, value) => {
    handleChange(index, field, value);
    await fetchDropdownData(index, field, value);
  };

  const addMachine = () =>
    setMachines((prev) => [...prev, { ...initialMachine }]);

  const removeMachine = (index) =>
    setMachines((prev) => prev.filter((_, i) => i !== index));

  const validateMachines = () => {
    let valid = true;
    const updated = machines.map((m) => {
      const err = {};
      ["section", "po_no", "machine_type", "machine_id"].forEach((f) => {
        if (!m[f]) {
          err[f] = true;
          valid = false;
        }
      });
      return { ...m, errors: err };
    });
    setMachines(updated);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateMachines()) return;
    try {
      if (mode === "edit" && userId) {
        const { dropdowns, errors, ...rest } = machines[0];
        const res = await dispatch(
          UpdateOrderManagemnet({ id: userId, payload: rest })
        ).unwrap();
        showToast(res?.message, "success");
        setIsCreated(true);
        onClose();
        resetForm();
        return;
      }
      const res = await dispatch(
        postOrderManagemnt({ payload: machines })
      ).unwrap();
      showToast(res?.message, "success");
      setIsCreated(true);
      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      showToast(err, "error");
    }
  };

  const renderAutocomplete = (
    label,
    index,
    field,
    options,
    disabled = false
  ) => (
    <Autocomplete
      options={options || []}
      value={machines[index][field] || null}
      onChange={(_, val) => handleFieldChange(index, field, val)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          error={!!machines[index].errors?.[field]}
          helperText={machines[index].errors?.[field] ? "Required" : ""}
          fullWidth
        />
      )}
      disabled={disabled}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Machine Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#f5f5f5", p: 2 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {machines.map((machine, index) => (
            <Card
              key={index}
              sx={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                borderRadius: 2,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#e3f2fd",
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ fontWeight: 600, color: "#1565c0" }}>
                  Record {index + 1}
                </Box>
                <Box>
                  {machines.length > 1 && (
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => removeMachine(index)}
                      sx={{
                        bgcolor: "#ffcdd2",
                        "&:hover": { bgcolor: "#ef9a9a" },
                        ml: 1,
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  )}
                  {mode === "edit" ||
                    (index === machines.length - 1 && (
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={addMachine}
                        sx={{
                          bgcolor: "#bbdefb",
                          "&:hover": { bgcolor: "#90caf9" },
                          ml: 1,
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    ))}
                </Box>
              </Box>

              <Box sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2.5}>
                    <CustomAutocomplete
                      sx={{ minWidth: "30%" }}
                      label="Section"
                      options={sectionList || []}
                      value={machine.section || null}
                      onChange={(e, newVal) =>
                        handleFieldChange(index, "section", newVal)
                      }
                      required
                      textFieldProps={{
                        error: machine.errors?.section,
                        helperText: machine.errors?.section
                          ? "Section is required"
                          : "",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2.5}>
                    <CustomAutocomplete
                      sx={{ minWidth: "30%" }}
                      label="PO Number"
                      options={machine.dropdowns.po_numbers || []}
                      value={machine.po_no || null}
                      onChange={(e, newVal) =>
                        handleFieldChange(index, "po_no", newVal)
                      }
                      disabled={!machine.section}
                      required
                      textFieldProps={{
                        error: machine.errors?.po_no,
                        helperText: machine.errors?.po_no
                          ? "PO Number is required"
                          : "",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2.5}>
                    <CustomAutocomplete
                      sx={{ minWidth: "30%" }}
                      label="Machine Type"
                      options={machine.dropdowns.machine_types || []}
                      value={machine.machine_type || null}
                      onChange={(e, newVal) =>
                        handleFieldChange(index, "machine_type", newVal)
                      }
                      disabled={!machine.po_no}
                      required
                      textFieldProps={{
                        error: machine.errors?.machine_type,
                        helperText: machine.errors?.machine_type
                          ? "Machine Type is required"
                          : "",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2.5}>
                    <CustomAutocomplete
                      sx={{ minWidth: "30%" }}
                      label="Machine ID"
                      options={machine.dropdowns.machines || []}
                      value={machine.machine_id || null}
                      onChange={(e, newVal) =>
                        handleFieldChange(index, "machine_id", newVal)
                      }
                      disabled={!machine.machine_type}
                      required
                      textFieldProps={{
                        error: machine.errors?.machine_id,
                        helperText: machine.errors?.machine_id
                          ? "Machine ID is required"
                          : "",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={1}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={machine.is_active}
                          onChange={(e) =>
                            handleFieldChange(
                              index,
                              "is_active",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label="Active"
                      labelPlacement="top"
                      sx={{ ml: 1 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={resetForm}
          color="warning"
          sx={{
            mr: 1,
            backgroundColor: "red",
            color: "white",
            "&:hover": { backgroundColor: "#ef6c00" },
          }}
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="commonButton"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderDialog;
