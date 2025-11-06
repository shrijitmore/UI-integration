import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Row } from "react-bootstrap";
import { InputAdornment, TextField, Autocomplete } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/brand/c4i4-logo.png";
import bidImage from "../../assets/images/bg/mainbackgroudBid.png";
//import { getBusinessTypes } from "../../store/slices/common/commonVendorSlice";
import { clearMessage, signUp } from "../../store/slices/auth/authSlice";
import { showToast } from "../../common/ShowToast";
import { ToastContainer } from "react-toastify";

function Signup() {
  const [formData, setFormData] = useState({
    fullname: "",
    company: "",
    businessType: "",
    email: "",
    mobile: "",
  });

  const companyRef = React.useRef();
  const businessTypeRef = React.useRef();
  const emailRef = React.useRef();
  const mobileRef = React.useRef();

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { businessTypes } = useSelector((state) => state.commonVendor);
  const { error, success } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //  // dispatch(getBusinessTypes());
  // }, []);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "fullname" && value.length > 0) {
      updatedValue = value
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
        )
        .join(" ");
    } else if (["company"].includes(name) && value.length > 0) {
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const fullnameRegex = /^[A-Za-z\s]+$/;

    if (!formData.fullname) newErrors.fullname = "Full name is required.";
    else if (!fullnameRegex.test(formData.fullname))
      newErrors.fullname = "Full name must only contain letters and spaces.";

    if (!formData.company) newErrors.company = "Company name is required.";
    if (!formData.businessType)
      newErrors.businessType = "Business type is required.";
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Valid Email is required.";
    if (!formData.mobile || !mobileRegex.test(formData.mobile))
      newErrors.mobile = "Valid 10-digit mobile is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const payload = {
    first_name: formData.fullname,
    company_name: formData.company,
    business_type: formData.businessType,
    email: formData.email,
    phone: formData.mobile,
    organisation: 1,
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await dispatch(signUp(payload)).unwrap();
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="page_content">
        <div className="container text-center text-dark">
          <Row className="justify-content-center">
            <div className="auth-wrapper">
              <div className="auth-left">
                <img src={bidImage} alt="Side Illustration" />
              </div>
              <div className="auth-right">
                <Card
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    boxShadow: "10px 20px 30px black",
                  }}
                >
                  <Card.Body>
                    <div className="text-center mb-4">
                      <Link className="header-brand1" to="https://c4i4.org/">
                        <img
                          src={logo}
                          className="header-brand-img main-logo"
                          alt="Kizuna Logo"
                        />
                      </Link>
                    </div>
                    <h4>Register</h4>
                    <p className="text-muted">Create New Account</p>

                    <Form>
                      <Form.Group className="mb-3" controlId="fullname">
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="fa fa-user text-muted-dark"></i>
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Full Name"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            isInvalid={!!errors.fullname}
                            onKeyDown={(e) => handleKeyDown(e, companyRef)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fullname}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="company">
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="fa fa-building text-muted-dark"></i>
                          </span>
                          <Form.Control
                            type="text"
                            placeholder="Company Name"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            isInvalid={!!errors.company}
                            onKeyDown={(e) => handleKeyDown(e, businessTypeRef)}
                            ref={companyRef}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.company}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="businessType">
                        <div className="input-group">
                          <Autocomplete
                            fullWidth
                            options={businessTypes}
                            getOptionLabel={(option) => option}
                            value={formData.businessType || null}
                            onChange={(e, value) => {
                              setFormData({ ...formData, businessType: value });
                              setErrors((prev) => ({
                                ...prev,
                                businessType: "",
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Business Type"
                                error={!!errors.businessType}
                                helperText={errors.businessType}
                                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                                inputRef={businessTypeRef}
                                FormHelperTextProps={{
                                  sx: {
                                    textAlign: "center",
                                    color: "#df3344 !important",
                                    fontSize: "0.875rem",
                                    marginRight: "0.5rem",
                                    fontFamily: "inherit",
                                  },
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <span className="input-group-text bg-white">
                                        <i className="fa fa-briefcase text-muted-dark"></i>
                                      </span>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: "39px",
                                fontSize: "0.875rem",
                                ...(!!errors.businessType && {
                                  borderColor: "#df3344",
                                  "& fieldset": {
                                    borderColor: "#df3344 !important",
                                  },
                                }),
                              },
                              "& .MuiInputBase-input": {
                                padding: "8px 0",
                                color: "#212529",
                              },
                              "& .MuiInputBase-input::placeholder": {
                                color: "#32373d8c",
                                opacity: 1,
                              },
                            }}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="email">
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="fa fa-envelope text-muted-dark"></i>
                          </span>
                          <Form.Control
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                            onKeyDown={(e) => handleKeyDown(e, mobileRef)}
                            ref={emailRef}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="mobile">
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <i className="fa fa-phone text-muted-dark"></i>
                          </span>
                          <Form.Control
                            type="tel"
                            placeholder="Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            isInvalid={!!errors.mobile}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSignup();
                              }
                            }}
                            ref={mobileRef}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                    </Form>
                    <div className="d-grid">
                      <Button
                        variant="primary"
                        className="btn-block"
                        onClick={handleSignup}
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                    <p className="text-center mt-4">
                      Already have an account? <Link to="/login">Login</Link>
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Signup;
