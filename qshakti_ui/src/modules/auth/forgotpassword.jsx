import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, InputGroup, Row, Form } from "react-bootstrap";

import bidImage from "../../assets/images/bg/mainbackgroudBid.png";
import "../../layouts/styles/bulletQualityAuth.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  forgotPassword,
} from "../../store/slices/auth/authSlice";
import { showToast } from "../../common/ShowToast";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import QshaktiLogo from "../../assets/images/brand/finalLogo.png";
import { Typography } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const loginButtonRef = useRef(null);

  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearMessage());
    } else if (success) {
      showToast(success, "success");
      dispatch(clearMessage());
      setEmail("");
      setErrors("");
    }
  }, [error, success, dispatch]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const payload = { email };

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      setErrors("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(forgotPassword(payload)).unwrap();
    } catch (err) {
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
        <motion.div
          className="key-features"
          style={{
            position: "absolute",
            left: "9.5%",
            transform: "translateY(-50%)",
            color: "white",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            textAlign: "center",
            paddingBottom: "150px",
          }}
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              background: "linear-gradient(135deg,#0072FF,#00C6FF)",
              borderRadius: "50%",
              padding: "20px",
              display: "inline-flex",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            <LockResetIcon sx={{ fontSize: 60, color: "#fff" }} />
          </motion.div>

          <Typography
            variant="h4"
            className="animated-gradient-text"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textTransform: "capitalize",
            }}
          >
            Reset Your Password
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: "1.8rem",
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            Enter your registered email address and we’ll send you a link to
            reset your password.
          </Typography>
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
                      Forgot Password ?
                    </Typography>

                    <InputGroup className="mb-3">
                      <span className="input-group-text bg-white">
                        <i className="fa fa-envelope text-muted-dark"></i>
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Email Id"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors("");
                        }}
                        isInvalid={!!errors}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            loginButtonRef.current?.focus();
                          }
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors}
                      </Form.Control.Feedback>
                    </InputGroup>

                    <div className="text-center">
                      <Button
                        className="btn btn-primary btn-block w-100"
                        onClick={handleSubmit}
                        disabled={loading}
                        ref={loginButtonRef}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                      >
                        {loading ? "Mail sending..." : "Send"}
                      </Button>
                    </div>
                    <p className="text-center mt-3 text-dark">
                      Back to <Link to="/login">Login</Link>
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

export default ForgotPassword;
