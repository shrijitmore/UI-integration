import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion"; // ✨ motion added
import QshaktiLogo from "../../assets/images/brand/finalLogo.png";

import {
  clearMessage,
  myProfileAcc,
  signIn,
} from "../../store/slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../common/ShowToast";
import { ToastContainer } from "react-toastify";
import { getPermissionList } from "../../store/slices/roleManagement/roleBasedauthSlice";
import "../../layouts/styles/bulletQualityAuth.css";

function Authlogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const loginButtonRef = useRef(null);
  const lastRoute = sessionStorage.getItem("lastRoute");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  if (isAuthenticated && lastRoute) {
    return <Navigate to={lastRoute} replace />;
  }

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("rememberedEmail");
    const savedPassword = sessionStorage.getItem("rememberedPassword");
    const remember = sessionStorage.getItem("rememberMe") === "true";

    if (remember && savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword || "",
        rememberMe: true,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email Id is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid Email Id format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const payload = {
    email: formData.email,
    password: formData.password,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const resultAction = await dispatch(signIn(payload)).unwrap();

      if (resultAction?.is_success === 1) {
        console.log("Login successful:", resultAction);
        const roleData = resultAction?.data?.role;
        if (formData?.rememberMe) {
          sessionStorage.setItem("rememberedEmail", formData.email);
          sessionStorage.setItem("rememberedPassword", formData.password);
          sessionStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.removeItem("rememberedEmail");
          sessionStorage.removeItem("rememberedPassword");
          sessionStorage.removeItem("rememberMe");
        }

        const role = roleData?.name ?? null;
        const roleId = roleData?.id ?? null;
        const plant = resultAction?.data?.plant_info?.plant_id || null;
        const plantInfo = resultAction?.data?.plant_info || null;

        sessionStorage.setItem("role", role);
        sessionStorage.setItem("role_id", roleId);
        sessionStorage.setItem("isAuthenticated", "true");
        // Store plant_info for chatbot factory selection
        if (plantInfo) {
          sessionStorage.setItem("plant_info", JSON.stringify(plantInfo));
        }
        const permissionRes = await dispatch(
          getPermissionList({ role, plant })
        ).unwrap();

        if (permissionRes?.is_success) {
          sessionStorage.setItem(
            "permissions",
            JSON.stringify(permissionRes.data)
          );
          showToast(resultAction?.message || "Login successful", "success");

          setTimeout(() => {
            navigate("/main");
          }, 1200);
        } else {
          showToast("Failed to load permissions", "error");
        }
      } else {
        showToast("Sign-in failed", "error");
      }
    } catch (err) {
      showToast(err, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <motion.div
        className="page_content"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 8%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Left Side – Key Features */}
        <motion.div
          className="key-features"
          style={{
            position: "absolute",
            left: "11%",
            transform: "translateY(-50%)",
            color: "white",
            fontSize: "1.3rem",
            lineHeight: "2.3rem",
            textAlign: "left",
            fontWeight: 500,
            letterSpacing: "0.5px",
          }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Typography
            variant="h3"
            className="animated-gradient-text"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textTransform: "capitalize",
            }}
          >
            key features
          </Typography>
          {[
            "End-to-End Quality Inspection",
            "ERP & IoT Integration",
            "Role-Based Access Control",
            "Order & Inspection Management",
            "Dashboards & Analytics",
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, x: 15, color: "#4dd0e1" }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
                marginBottom: "20px",
                fontSize: "1.3rem",
              }}
            >
              <motion.span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(120deg, #0044CC, #00BFFF, #8400ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 12px rgba(0, 191, 255, 0.8)",
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                ✔
              </motion.span>

              <span style={{ fontWeight: "bolder" }}>{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="auth-card">
          <Row className="justify-content-center">
            <motion.div
              className="auth-wrapper"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Floating Logo */}
              <motion.div
                className="header-brand1"
                style={{
                  position: "relative",
                  margin: "0 auto",
                  position: "relative",
                  width: "maxWidth",
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <img
                  style={{
                    maxWidth: "220px", // responsive scaling
                    width: "100%", // adapt to parent width
                    height: "auto",
                  }}
                  src={QshaktiLogo}
                />
                <div
                  className="single-floating-dot"
                  style={{
                    position: "absolute",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    animation: "moveAroundLogo 15s ease-in-out infinite",
                  }}
                ></div>
              </motion.div>

              {/* Card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Card
                  style={{
                    width: "100%",
                    maxWidth: "360px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    borderRadius: "16px",
                  }}
                >
                  <Card.Body>
                    <Typography
                      variant="h5"
                      className="animated-gradient-heading"
                      sx={{
                        fontWeight: "bold",
                        mb: 3,
                        textTransform: "capitalize",
                        textAlign: "center",
                      }}
                    >
                      Quality Management System
                    </Typography>
                    <Form>
                      {/* Email */}
                      <Form.Group className="mb-3" controlId="email">
                        <InputGroup>
                          <span className="input-group-text bg-white">
                            <i className="fa fa-envelope text-muted-dark"></i>
                          </span>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter Email Id"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            ref={emailRef}
                            className="animated-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-3" controlId="password">
                        <InputGroup>
                          <span className="input-group-text bg-white">
                            <i className="fa fa-lock text-muted-dark"></i>
                          </span>
                          <Form.Control
                            type={formData.showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                            ref={passwordRef}
                            className="animated-input"
                          />
                          <InputGroup.Text style={{ backgroundColor: "white" }}>
                            <Tooltip title="Show Password">
                              <IconButton
                                onClick={handlePasswordVisibility}
                                edge="end"
                                size="small"
                              >
                                {formData.showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </Tooltip>
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>

                      {/* Login Button */}
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          className="btn btn-primary btn-block w-100"
                          onClick={handleLogin}
                          disabled={loading}
                          ref={loginButtonRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleLogin(e);
                            }
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="loading-spinner"></span>
                              <span style={{ marginLeft: "8px" }}>
                                Authenticating...
                              </span>
                            </>
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </motion.div>
                    </Form>

                    {/* Remember + Forgot */}
                    <div className="d-flex justify-content-between mt-3 mb-2">
                      <Form.Group controlId="rememberMe">
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleChange}
                              color="primary"
                            />
                          }
                          label={
                            <span style={{ fontSize: "0.85rem" }}>
                              Remember Me
                            </span>
                          }
                        />
                      </Form.Group>
                      <Link
                        to={`${import.meta.env.BASE_URL}forgotpassword`}
                        style={{
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          marginTop: "10px",
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <p
                      style={{
                        marginBottom: "1px",
                        fontSize: "x-small",
                        textAlign: "center",
                      }}
                    >
                      Developed By <Link to="https://c4i4.org/">C4i4</Link>
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </motion.div>
          </Row>
        </div>
      </motion.div>
    </>
  );
}

export default Authlogin;
