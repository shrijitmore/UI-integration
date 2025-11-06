import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
  Switch,
  Divider,
  FormControlLabel,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../config";
import {
  clearMessage,
  getAdminUserRoles,
  getMachinesDropdown,
  getOperationsDropdown,
  getPlantsDropdown,
  getSectionsDropdown,
  getUserManagementDetails,
  getUserTableDetails,
  postUserManagementDetails,
  putUserManagementDetails,
} from "../../../store/slices/admin/userManagementSlice";
import { showToast } from "../../../common/ShowToast";
import ButtonLoaderWrapper from "../../../common/commonComponent/ButtonLoaderWrapper";
import {
  borderColorVariable,
  purpleOutlinedTextFieldStyles,
} from "../../Operator/InprocessInspection/config";
import CustomAutocomplete from "../../Operator/InprocessInspection/CustomAutocomplete";
import { ALPHANUMERIC_REGEX } from "../../../utils/commonConfig";
import { color } from "framer-motion";
import { getRoleData } from "../../../store/slices/roleManagement/addRoleSlice";

export default function CreateUserDialog({
  open,
  onClose,
  mode,
  userId,
  setSelectedUserId,
}) {
  const dispatch = useDispatch();
  const BASE_URL = config.apiUrl;
  const {
    success,
    error,
    adminUserRoles,
    plantOptions,
    sectionOptions,
    operationsOptions,
    machineOptions,
  } = useSelector((state) => state?.userManagement);

  const { data } = useSelector((state) => state?.addRole);

  const { profileData } = useSelector((state) => state?.auth);

  const allOperations = operationsOptions
    ? operationsOptions.flatMap((building) => building.operations)
    : [];

  const [loading, setLoading] = useState(false);
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [plant, setPlant] = useState("");

  useEffect(() => {
    if (open) {
      setImage(null);
      setImageFile(null);
      dispatch(getAdminUserRoles());
      // dispatch(getPlantsDropdown());
      // dispatch(getMachinesDropdown());
      if (!profileData?.is_superuser && profileData?.plant?.id) {
        setFormData((prev) => ({
          ...prev,
          plant: profileData.plant.id,
        }));
        dispatch(getSectionsDropdown(profileData.plant.id));
        dispatch(getRoleData({ plant_id: profileData.plant.id || "" }));
      }
    }
  }, [dispatch, open]);

  useEffect(() => {
    if ((isEdit || isView) && userId) {
      dispatch(getUserManagementDetails(userId))
        .unwrap()
        .then((res) => {
          const data = res.data;
          const matchedRole = adminUserRoles?.data?.find(
            (r) => r.name.toLowerCase() === data.role?.toLowerCase()
          );
          setFormData({
            id: data.id,
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number,
            role: matchedRole?.id || "", // ✅ this must be the role ID
            plant: data.plant_info?.id || null,
            section: data.section_info?.map((s) => s.id) || [],
            operation: data.operation_info || [], // ✅ store objects, not IDs
            emp_id: data.emp_id,
            // operation: data.operation_info?.map((o) => o.id) || [],
            qc_machine: data.qc_machine || [],
            user_status: data.user_status,
          });
          if (data?.section_info?.length > 0) {
            const buildingNames = data.section_info
              .map((s) => s.name)
              .join(",");
            dispatch(getOperationsDropdown(buildingNames));
            dispatch(getRoleData({ plant_id: data?.plant_info?.id || "" }));
          }
          setFormErrors({});
          if (data.user_image) setImage(data.user_image);
          setImageFile(null);
        });
    } else {
      setFormData({ user_status: "active" });
      setImage(null);
      setImageFile(null);
      setFormErrors({});
    }
  }, [userId, mode, adminUserRoles]);

  useEffect(() => {
    if (success) {
      // showToast(success, "success");
      dispatch(getUserTableDetails());
      setFormData({});
      setImageFile(null);
      onClose();
      dispatch(clearMessage());
    }
    if (error) {
      showToast(error, "error");
      setFormData({});
      dispatch(clearMessage());
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // ✅ Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Invalid email format",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }

    if (name === "emp_id") {
      if (value && !ALPHANUMERIC_REGEX.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          emp_id: "Employee ID must be alphanumeric only",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          emp_id: "",
        }));
      }
    }

    if (name === "first_name" || name === "last_name") {
      const nameRegex = /^[a-zA-Z\s'-]{2,30}$/; // Letters, space, hyphen, apostrophe (2-30 chars)
      const trimmedValue = value.trim();

      if (!trimmedValue) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: `${
            name === "first_name" ? "First" : "Last"
          } name is required.`,
        }));
      } else if (!nameRegex.test(trimmedValue)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: `${
            name === "first_name" ? "First" : "Last"
          } name must contain only letters and be 2–30 characters long.`,
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  useEffect(() => {
    if (formData?.section?.length > 0 && formData?.plant) {
      console.log("......");
      dispatch(
        getMachinesDropdown({
          plant_id: profileData?.plant?.id || formData?.plant || "",
          section_id: formData?.section || "",
        })
      );
    }
  }, [formData?.section, formData?.plant]);

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setImage(null);
        setImageFile(null);
        showToast(
          "Only PNG, JPG, JPEG, and WEBP formats are allowed.",
          "error"
        );

        setImageError("Only PNG, JPG, JPEG, and WEBP formats are allowed.");
        return;
      }

      if (file.size > maxSizeInBytes) {
        setImage(null);
        setImageFile(null);
        showToast("Image size should not exceed 2MB.", "error");
        setImageError("Image size should not exceed 2MB.");
        return;
      }
      setImageError("");
      setImageFile(file);
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
    }
  };

  const validateForm = () => {
    const errors = {};

    const requiredFields = [
      "first_name",
      "last_name",
      // "phone_number",
      "email",
      "plant",
      "section",
      "operation",
      "qc_machine",
      "emp_id",
      // "role",
    ];

    requiredFields.forEach((field) => {
      if (
        profileData?.is_superuser &&
        (field === "operation" || field === "qc_machine")
      ) {
        return;
      }

      const value = formData[field];
      if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "")
      ) {
        errors[field] = `${field.replace(/_/g, " ")} is required`;
      }
    });

    const nameRegex = /^[a-zA-Z\s'-]{2,30}$/;
    if (formData.first_name && !nameRegex.test(formData.first_name.trim())) {
      errors.first_name =
        "First name must contain only letters and be 2–30 characters long.";
    }
    if (formData.last_name && !nameRegex.test(formData.last_name.trim())) {
      errors.last_name =
        "Last name must contain only letters and be 2–30 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email format.";
    }

    const phoneRegex = /^\d{10}$/;
    if (
      formData.phone_number &&
      !phoneRegex.test(formData.phone_number.trim())
    ) {
      errors.phone_number = "Phone number must be exactly 10 digits.";
    }

    const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;
    if (formData.emp_id && !ALPHANUMERIC_REGEX.test(formData.emp_id.trim())) {
      errors.emp_id = "Employee ID must contain only letters and numbers.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isImageUpdated = !!imageFile && imageFile !== formData.user_image;
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      const apiKey = key === "role" ? "role_id" : key;
      if (Array.isArray(value)) {
        value.forEach((val) => {
          formDataToSend.append(apiKey, typeof val === "object" ? val.id : val);
        });
      } else {
        formDataToSend.append(apiKey, value);
      }
    });

    if (!profileData?.is_superuser) {
      formDataToSend.set("plant", profileData?.plant?.id);
    }

    if (isImageUpdated) {
      formDataToSend.append("user_image", imageFile);
    }

    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await dispatch(
          putUserManagementDetails({ userId, formDataToSend })
        ).unwrap();
        await dispatch(getUserTableDetails());
        setSelectedUserId(null);
      } else {
        res = await dispatch(
          postUserManagementDetails(formDataToSend)
        ).unwrap();
        await dispatch(getUserTableDetails());
        setSelectedUserId("");
      }

      showToast(res?.msg || "User saved successfully", "success");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast(error, "error");
    } finally {
      setLoading(false);
    }
  };

  const getLabelWithAsterisk = (label, required) =>
    required ? (
      <>
        {label}
        <Box component="span" sx={{ color: "#bb0f0f" }}>
          {" "}
          *
        </Box>
      </>
    ) : (
      label
    );
  const handleStatusToggle = (e) => {
    const newStatus = e.target.checked ? "active" : "inactive";
    setFormData((prev) => ({
      ...prev,
      user_status: newStatus,
    }));
  };
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
          setFormData({ user_status: "active" });
          setImage(null);
          setImageFile(null);
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
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
        >
          {mode === "create" && "Create New User"}
          {mode === "edit" && "Edit User"}
          {mode === "view" && "View User"}

          <Typography sx={{ color: "#1a237e" }}>
            {profileData?.is_superuser ? null : "Plant:"}{" "}
            {profileData?.plant?.name || ""}{" "}
          </Typography>
        </Typography>
        <Divider sx={{ mb: 0, bgcolor: "#494949" }} />

        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            setFormData({ user_status: "active" });
            setImage(null);
            setImageFile(null);
          }}
          sx={{ position: "absolute", right: 20, top: 8, color: "#bb0f0f" }}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: "auto",
          maxHeight: "100vh",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#8d8d8dff",
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                width: "100%",
                border: "1px dashed #ccc",
                borderRadius: "8px",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  mb: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover .upload-overlay": { opacity: 1 },
                }}
              >
                <Avatar
                  src={
                    image?.startsWith("blob:") || image?.startsWith("http")
                      ? image
                      : image
                      ? `${BASE_URL}${image}/`
                      : ""
                  }
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {!isView && (
                  <>
                    <label htmlFor="image-upload">
                      <Box
                        className="upload-overlay"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0,0,0,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                          opacity: 0,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      >
                        <EditIcon sx={{ fontSize: 30 }} />
                      </Box>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      hidden
                      onChange={handleImageChange}
                    />
                  </>
                )}
                <Typography
                  sx={{
                    ...purpleOutlinedTextFieldStyles,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Upload Photo
                </Typography>
                <Typography
                  sx={{
                    color: `${borderColorVariable}`,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Size limit 2MB
                </Typography>
                {imageError && (
                  <Typography color="error" variant="caption">
                    {imageError}
                  </Typography>
                )}
              </Box>

              <>
                <Typography
                  sx={{
                    color: `${borderColorVariable}`,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  {isEdit ? "Edit Photo" : "Upload Photo"}
                </Typography>
                <Typography
                  sx={{
                    color: `${borderColorVariable}`,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Size limit 2MB
                </Typography>
              </>

              {imageError && (
                <Typography color="error" variant="caption">
                  {imageError}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} mt={1}>
                <TextField
                  data-testid="input-first-name"
                  size="small"
                  label={getLabelWithAsterisk("First Name", true)}
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formErrors.first_name)}
                  helperText={formErrors.first_name}
                  disabled={isView}
                  sx={{
                    ...purpleOutlinedTextFieldStyles,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  data-testid="input-last-name"
                  size="small"
                  label={getLabelWithAsterisk("Last Name ", true)}
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formErrors.last_name)}
                  helperText={formErrors.last_name}
                  disabled={isView}
                  sx={{
                    ...purpleOutlinedTextFieldStyles,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  data-testid="input-mobile-number"
                  size="small"
                  label="Mobile Number"
                  name="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formErrors.phone_number)}
                  helperText={formErrors.phone_number}
                  disabled={isView}
                  sx={{
                    ...purpleOutlinedTextFieldStyles,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  data-testid="input-email"
                  size="small"
                  label={getLabelWithAsterisk("Email", true)}
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  disabled={isView}
                  sx={{
                    ...purpleOutlinedTextFieldStyles,
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        checked={formData.user_status === "active"}
                        onChange={handleStatusToggle}
                        disabled={isView}
                        data-testid="switch-user-status"
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: `${borderColorVariable}`,
                          fontFamily:
                            '"Roboto", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        Status
                      </Typography>
                    }
                    sx={{
                      mt: 1,
                      ml: 6,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    data-testid="input-employee-id"
                    size="small"
                    name="emp_id"
                    label={getLabelWithAsterisk("Employee Id ", true)}
                    value={formData.emp_id || ""}
                    onChange={handleChange}
                    fullWidth
                    disabled={isView}
                    error={Boolean(formErrors.emp_id)}
                    helperText={formErrors.emp_id}
                    sx={{
                      ...purpleOutlinedTextFieldStyles,
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            {profileData?.is_superuser ? (
              <CustomAutocomplete
                options={plantOptions || []}
                getOptionLabel={(option) => option?.plant_name || ""}
                value={
                  plantOptions.find((item) => item.id === formData.plant) ||
                  null
                }
                onChange={(e, newVal) => {
                  if (newVal) {
                    handleAutocompleteChange("plant", newVal.id);
                    dispatch(getSectionsDropdown(newVal.id));
                    dispatch(getRoleData({ plant_id: newVal.id }));
                    handleAutocompleteChange("section", []);
                    handleAutocompleteChange("operation", []);
                  } else {
                    handleAutocompleteChange("plant", "");
                    handleAutocompleteChange("section", []);
                    handleAutocompleteChange("operation", []);
                  }
                }}
                disabled={isView}
                textFieldProps={{
                  error: Boolean(formErrors.plant),
                  helperText: formErrors.plant,
                }}
                label="Plant"
                datatestid={"autocomplete-plant"}
              />
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              multiple={true}
              options={sectionOptions || []}
              getOptionLabel={(option) => option?.building_name || ""}
              value={sectionOptions.filter((option) =>
                (formData.section || []).includes(option.id)
              )}
              onChange={(e, newVal) => {
                handleAutocompleteChange(
                  "section",
                  newVal.map((item) => item.id)
                );
                if (!profileData?.is_superuser) {
                  setFormData((prev) => ({
                    ...prev,
                    plant: profileData?.plant?.id,
                  }));
                }

                setFormData((prev) => ({
                  ...prev,
                  operation: [],
                }));

                if (newVal && newVal.length > 0) {
                  const buildingNames = newVal
                    .map((item) => item.building_name)
                    .join(",");
                  dispatch(getOperationsDropdown(buildingNames));
                }
              }}
              // disabled={isView || !formData?.plant}
              label="Section"
              datatestid={"autocomplete-section"}
              textFieldProps={{
                error: Boolean(formErrors.section),
                helperText: formErrors.section,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={Boolean(formErrors.section)}
                  helperText={formErrors.section}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              multiple
              options={allOperations}
              getOptionLabel={(option) => option?.operation_name || ""}
              value={allOperations.filter((option) =>
                (formData.operation || []).some(
                  (op) => (typeof op === "object" ? op.id : op) === option.id
                )
              )}
              onChange={(e, newVal) =>
                handleAutocompleteChange(
                  "operation",
                  newVal.map((item) => item.id)
                )
              }
              disabled={isView || formData?.section?.length === 0}
              label="Operations"
              datatestid={"autocomplete-operation"}
              hideAsterisk={profileData?.is_superuser}
              textFieldProps={{
                error: Boolean(formErrors.operation),
                helperText: formErrors.operation,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              multiple={true}
              options={machineOptions || []}
              // getOptionLabel={(option) => option?.machine_name || ""}
              value={formData.qc_machine}
              onChange={(e, newVal) =>
                handleAutocompleteChange(
                  "qc_machine",
                  newVal.map((item) => item)
                )
              }
              disabled={isView}
              label="QC Machine"
              datatestid={"autocomplete-qc-machine"}
              hideAsterisk={profileData?.is_superuser}
              textFieldProps={{
                error: Boolean(formErrors.qc_machine),
                helperText: formErrors.qc_machine,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              options={data?.data || []}
              getOptionLabel={(option) => option?.name || ""}
              value={
                data?.data?.find((item) => item.id === formData.role) || null
              }
              onChange={(e, newVal) =>
                handleAutocompleteChange("role", newVal?.id || "")
              }
              disabled={
                isView || (profileData?.is_superuser && !formData?.plant)
              }
              label="Assign Role"
              datatestid={"autocomplete-role"}
              required={false}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {!isView && (
        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <ButtonLoaderWrapper
            loading={loading}
            button={
              <Button
                sx={{ width: "100px" }}
                variant="contained"
                className="button-submit"
                onClick={handleSubmit}
              >
                {isEdit ? "UPDATE" : "SAVE"}
              </Button>
            }
          />
        </DialogActions>
      )}
    </Dialog>
  );
}
