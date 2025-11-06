import React, { useEffect, useState } from "react";
import {
  Dialog,
  Avatar,
  Box,
  DialogContent,
  Typography,
  Grid,
  Button,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Phone } from "@mui/icons-material";
import config from "../../config";
import profileimg from "../../assets/images/bg/profile.jpg";
import DisplayListWithTooltip from "../../utils/showMore";
import { useDispatch } from "react-redux";
import { profilePassDetailsChange } from "../../store/slices/auth/authSlice";
import { showToast } from "../../common/ShowToast";
import "../../assets/css/common.css";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function AccountModelDialog({ open = false, onClose, data }) {
  const [isChangingDetails, setIsChangingDetails] = useState(false);
  const [newMobile, setNewMobile] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const passwordRegex =
    /^[A-Z](?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

  const BASE_URL = config.apiUrl;

  useEffect(() => {
    setShowConfirmPassword("");
    setPassword("");
  }, []);

  const validatePassword = (value) => {
    if (!value) return "";
    if (!passwordRegex.test(value)) {
      return "Please follow the required password format.";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Confirm password is required.";
    if (value !== password) return "Passwords do not match.";
    if (!passwordRegex.test(value)) {
      return "Password must follow the required format.";
    }
    return "";
  };

  const getPasswordHints = (value) => {
    return {
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value),
      length: value.length >= 6,
    };
  };

  const handleSaveDetails = async () => {
    const finalErrors = {};

    if (!password && !newMobile) {
      finalErrors.general = "Please update either password or mobile number.";
    }

    const pwdError = validatePassword(password);
    if (pwdError) finalErrors.password = pwdError;

    const confirmPwdError = validateConfirmPassword(confirmPassword);
    if (confirmPwdError) finalErrors.confirmPassword = confirmPwdError;

    setErrors(finalErrors);

    // ✅ Only proceed if there are NO errors
    if (Object.keys(finalErrors).length === 0) {
      const payload = {
        email: data?.email,
        password,
      };

      try {
        const res = await dispatch(profilePassDetailsChange(payload)).unwrap();
        showToast(res?.message, "success");
      } catch (error) {
        console.error("API error:", error);
      }
    }

    setIsChangingDetails(false);
    setPassword("");
    setConfirmPassword("");
    setNewMobile("");
  };

  const handleCancelAccountDialog = () => {
    setIsChangingDetails(false);
    setNewMobile("");
    setConfirmPassword("");
    setPassword("");
    setErrors({});
  };

  const passwordHints = getPasswordHints(password);

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          color: "#bb0f0f",
        }}
      >
        <CancelIcon />
      </IconButton>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={data?.user_image ? `${BASE_URL}${data.user_image}` : profileimg}
          alt="Profile"
          sx={{
            width: 100,
            height: 100,
            mt: 2,
            boxShadow: 2,
            border: "2px solid #ccc",
          }}
        />
        <Typography variant="h6" fontWeight={600} mb={1}>
          {data?.first_name || "N/A"} {data?.last_name || ""}
        </Typography>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={3}
          mb={2}
          width="100%"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Email sx={{ color: "#000000de" }} fontSize="small" />
            <Typography variant="body2" color="#000000de">
              {data?.email || "N/A"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Phone sx={{ color: "#000000de" }} fontSize="small" />
            <Typography variant="body2" color="#000000de">
              {data?.phone_number || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" pb={1}>
          <LocationOnIcon sx={{ color: "#800000" }} fontSize="small" />
          <Typography variant="body2" color="#000000de">
            {data?.plant["name"] || "N/A"}
          </Typography>
        </Box>

        <DialogContent dividers sx={{ width: "100%", height: "300px" }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="#1a237e">
              Sections
            </Typography>
            <DisplayListWithTooltip label="" data={data?.section} />
            <Typography variant="subtitle2" color="#1a237e">
              Operations
            </Typography>
            <DisplayListWithTooltip label="" data={data?.operation} />
            <Typography variant="subtitle2" color="#1a237e">
              QC Machines
            </Typography>
            <DisplayListWithTooltip label="" data={data?.qc_machine} />
          </Stack>
        </DialogContent>

        {isChangingDetails && (
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  autoComplete="new-password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      // password: validatePassword(value),
                      confirmPassword:
                        confirmPassword && value !== confirmPassword
                          ? "Passwords do not match."
                          : "",
                    }));
                  }}
                  onBlur={() => {
                    setErrors((prev) => ({
                      ...prev,
                      password: validatePassword(password),
                    }));
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ height: "70px", width: "80%" }}
                  InputProps={{
                    sx: { height: "50px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* Password strength hints (only for new password) */}
                <Stack spacing={0.5} mt={1} ml={1}>
                  <Typography
                    variant="caption"
                    color={passwordHints.upper ? "green" : "text.secondary"}
                  >
                    • At least 1 uppercase letter
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordHints.lower ? "green" : "text.secondary"}
                  >
                    • At least 1 lowercase letter
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordHints.number ? "green" : "text.secondary"}
                  >
                    • At least 1 number
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordHints.special ? "green" : "text.secondary"}
                  >
                    • At least 1 special character (!@#$%^&*)
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordHints.length ? "green" : "text.secondary"}
                  >
                    • Minimum 6 characters
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(value),
                    }));
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(confirmPassword),
                    }))
                  }
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  sx={{ height: "70px", width: "80%" }}
                  InputProps={{
                    sx: { height: "50px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        )}

        <DialogActions sx={{ mt: 2, width: "100%", justifyContent: "center" }}>
          {!isChangingDetails ? (
            <Box display="flex" gap={2} justifyContent="center" width="100%">
              <Button
                variant="contained"
                className="commonbtn"
                onClick={() => setIsChangingDetails(true)}
                sx={{
                  minWidth: 160,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: 2,
                }}
              >
                Change Details
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={onClose}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: 2,
                }}
              >
                Close
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={2} justifyContent="center" width="100%">
              <Button
                variant="contained"
                className="commonAdd"
                onClick={handleSaveDetails}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelAccountDialog}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default AccountModelDialog;
