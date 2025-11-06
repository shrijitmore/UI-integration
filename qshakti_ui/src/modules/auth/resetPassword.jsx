import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Row, Form, InputGroup } from "react-bootstrap";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import "../../layouts/styles/bulletQualityAuth.css";
import logo from "../../assets/images/brand/qshaktiLogo.png";
import bidImage from "../../assets/images/bg/mainbackgroudBid.png";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, resetPassword } from "../../store/slices/auth/authSlice";
import { showToast } from "../../common/ShowToast";
import QshaktiLogo from "../../assets/images/brand/finalLogo.png";

function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.auth);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitBtnRef = useRef(null);

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "password") {
        confirmPasswordRef.current?.focus();
      } else if (field === "confirmPassword") {
        submitBtnRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearMessage());
    } else if (success) {
      showToast(success, "success");
      dispatch(clearMessage());
    }
  }, [error, success, dispatch]);

  const passwordRegex =
    /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({});
  };

  const handlePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const handleConfirmPasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showConfirmPassword: !prev.showConfirmPassword,
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must start with an uppercase letter, include at least one number, one special character, and be at least 6 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      password: formData.password,
    };

    setLoading(true);

    try {
      dispatch(resetPassword({ id, token, payload })).unwrap();
      setTimeout(() => {
        setLoading(false);
        navigate(`${import.meta.env.BASE_URL}`);
      }, 1500);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page_content">
        <div className="container text-center text-dark">
          <Row className="justify-content-center">
            <div className="auth-wrapper">
              <div>
                <img
                  style={{ width: "320px", paddingLeft: "50px" }}
                  src={QshaktiLogo}
                />
              </div>

              <Card
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  boxShadow: "#baa7dd 0px 1px 10px",
                }}
              >
                <Card.Body>
                  <h4>Reset Password</h4>
                  <Form.Group className="mb-3" controlId="password">
                    <div className="input-group position-relative">
                      <span className="input-group-text bg-white">
                        <i className="fa fa-lock text-muted-dark"></i>
                      </span>
                      <Form.Control
                        ref={passwordRef}
                        type={formData.showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        onKeyDown={(e) => handleKeyDown(e, "password")}
                      />

                      <InputGroup.Text
                        style={{
                          backgroundColor: "white",
                        }}
                      >
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
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <div className="input-group position-relative">
                      <span className="input-group-text bg-white">
                        <i className="fa fa-lock text-muted-dark"></i>
                      </span>
                      <Form.Control
                        ref={confirmPasswordRef}
                        type={
                          formData.showConfirmPassword ? "text" : "password"
                        }
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitBtnRef.current?.focus();
                          }
                        }}
                      />

                      <InputGroup.Text
                        style={{
                          backgroundColor: "white",
                        }}
                      >
                        <IconButton
                          onClick={handleConfirmPasswordVisibility}
                          edge="end"
                          size="small"
                        >
                          {formData.showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>

                  <Button
                    className="btn btn-primary btn-block w-100"
                    ref={submitBtnRef}
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>

                  <p className="text-center mt-1 text-dark">
                    Back to <Link to="/login">Login</Link>
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

export default ResetPassword;
