import React, { useState, Fragment } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/brand/Kizuna.svg";
import logolight from "../../../assets/images/brand/KizunaWhiteLogo.svg";

function Authlogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { email, password } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Dummy validation example (replace with real auth logic)
    if (email === "admin@example.com" && password === "password") {
      navigate(`${import.meta.env.BASE_URL}dashboard`);
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <div className="page_content">
        <div className="container text-center text-dark">
          <Row>
            <Col lg={4} className="d-block mx-auto">
              <Card>
                <Card.Body>
                  <div className="text-center mb-4">
                    <Link className="header-brand1" to="#">
                      <img
                        src={logo}
                        className="header-brand-img main-logo"
                        alt="Kizuna Logo"
                      />
                      <img
                        src={logolight}
                        className="header-brand-img darklogo"
                        alt="Kizuna White Logo"
                      />
                    </Link>
                  </div>

                  <h3>Login</h3>
                  <p className="text-muted">Sign in to your account</p>

                  {err && <div className="alert alert-danger">{err}</div>}

                  <Form onSubmit={handleLogin}>
                    <InputGroup className="mb-3">
                      <span className="input-group-addon bg-white">
                        <i className="fa fa-user text-dark"></i>
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <span className="input-group-addon bg-white">
                        <i className="fa fa-unlock-alt text-dark"></i>
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>

                    <Button
                      type="submit"
                      className="btn btn-primary btn-block w-100"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </Form>

                  <div className="mt-3">
                    <Link
                      to={`${import.meta.env.BASE_URL}forgotpassword`}
                      className="btn btn-link px-0"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="text-center pt-3">
                    <p className="text-dark mb-0">
                      Not a member?{" "}
                      <Link to={`${import.meta.env.BASE_URL}signup`}>
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
}

export default Authlogin;
