import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import logo from "../../assets/images/brand/C4i4-Logo - Register.png";
import QshaktiLogo from "../../assets/images/brand/qshaktiLogo.png";
// import QshaktiLogo from "../../assets/images/brand/figmaQshaktilogo.png";

import {
  clearMessage,
  myProfileAcc,
  signIn,
} from "../../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import { showToast } from "../../common/ShowToast";
import { ToastContainer } from "react-toastify";
import { getPermissionList } from "../../store/slices/roleManagement/roleBasedauthSlice";
import { Routingdata } from "../../common/routingdata";
import "../../layouts/styles/bulletQualityAuth.css";

function Authlogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const loginButtonRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const lastRoute = sessionStorage.getItem("lastRoute");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  if (isAuthenticated && lastRoute) {
    return <Navigate to={lastRoute} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    const passwordRegex =
      /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,}$/;

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
        const roleData = resultAction?.data?.role;

        if (!roleData) {
          showToast("Role data missing from login response", "error");
          return;
        }

        const { id: roleId, name: role } = roleData;

        sessionStorage.setItem("role", role);
        sessionStorage.setItem("role_id", roleId);
        sessionStorage.setItem("isAuthenticated", "true");

        // 🔽 Call permissions API here
        const permissionRes = await dispatch(
          getPermissionList({ role })
        ).unwrap();

        if (permissionRes?.is_success) {
          sessionStorage.setItem(
            "permissions",
            JSON.stringify(permissionRes.data)
          );
          showToast(resultAction?.message || "Login successful", "success");
          setTimeout(() => {
            navigate("/main");
          }, 1500);
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

      <div
        className="page_content"
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <div className="container text-center text-dark">
          <Row className="justify-content-center">
            <div className="auth-wrapper">
              <div className="header-brand1" style={{ position: "relative" }}>
                <img src={QshaktiLogo} />
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
              </div>

              <Card
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  boxShadow: "1px 1px 10px #B8860B",
                }}
              >
                <Card.Body>
                  {/* <div className="text-center mb-4">
                    <Link className="header-brand1" to="https://c4i4.org/">
                      <img
                        src={logo}
                        className="brand-img main-logo"
                        alt="Kizuna Logo"
                      />
                    </Link>
                  </div> */}

                  <h4>Quality Management System</h4>
                  <Form>
                    <Form.Group className="mb-3" controlId="email">
                      <InputGroup>
                        <span className="input-group-text bg-white">
                          <i className="fa fa-envelope text-muted-dark"></i>
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email Id"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          ref={emailRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              passwordRef.current?.focus();
                            }
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <InputGroup>
                        <span className="input-group-text bg-white">
                          <i className="fa fa-lock text-muted-dark"></i>
                        </span>
                        <Form.Control
                          type={formData.showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Security Password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          ref={passwordRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              loginButtonRef.current?.focus();
                            }
                          }}
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
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

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
                  </Form>

                  <div className="text-center pt-3">
                    <p className="text-dark">
                      <Link to={`${import.meta.env.BASE_URL}forgotpassword`}>
                        Forgot password?
                      </Link>
                    </p>
                  </div>
                  <p style={{ marginBottom: "1px", fontSize: "x-small" }}>
                    Developed By <Link to="https://c4i4.org/">C4i4</Link>
                  </p>
                </Card.Body>
              </Card>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Authlogin;
