import React, { Fragment, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/brand/logo.png";
import logolight from "../../../assets/images/brand/logo-light.png";
import { auth } from "../firebaseapi/firebaseapi";

function Signup() {
  const [err, setError] = useState("");
  const [Loader, setLoader] = useState(false);
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const { email, password, fullname } = data;
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const Signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        RouteChange();
        setLoader(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoader(false);
      });
  };
  let navigate = useNavigate();
  const RouteChange = () => {
    let path = `${import.meta.env.BASE_URL}vendorRegistration`;
    navigate(path);
  };
  return (
    <Fragment>
      <div className="page-content">
        <div className="container text-center text-dark">
          <Row>
            <Col lg={4} className="d-block mx-auto">
              <Row>
                <Col xl={12} md={12}>
                  <Card>
                    <Card.Body>
                      <div className="text-center mb-6">
                        <Link className="header-brand1" to="#">
                          <img
                            src={logo}
                            className="header-brand-img main-logo"
                            alt="Sparic logo"
                          />
                          <img
                            src={logolight}
                            className="header-brand-img darklogo"
                            alt="Sparic logo"
                          />
                        </Link>
                      </div>
                      <h3>Register</h3>
                      {err && <Alert variant="danger">{err}</Alert>}
                      <p className="text-muted">Create New Account</p>
                      <InputGroup className="input-group mb-3">
                        <span className="input-group-addon bg-white">
                          <i className="fa fa-user w-4 text-muted-dark"></i>
                        </span>
                        <Form.Control
                          type="text"
                          name="fullname"
                          placeholder="User name"
                          value={fullname}
                          onChange={changeHandler}
                        />
                      </InputGroup>
                      <InputGroup className="input-group mb-4">
                        <span className="input-group-addon bg-white">
                          <i className="fa fa-envelope  text-muted-dark w-4"></i>
                        </span>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={email}
                          onChange={changeHandler}
                        />
                      </InputGroup>
                      <InputGroup className="input-group mb-4">
                        <span className="input-group-addon bg-white">
                          <i className="fa fa-unlock-alt  text-muted-dark w-4"></i>
                        </span>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={password}
                          onChange={changeHandler}
                          required
                        />
                      </InputGroup>
                      <Form.Group className="form-group">
                        <Form.Label className="custom-control custom-checkbox text-start">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                          />
                          <span className="custom-control-label">
                            Agree the <Link to="#">terms and policy</Link>
                          </span>
                        </Form.Label>
                      </Form.Group>
                      <Row>
                        <div>
                          <Button
                            variant="primary"
                            to="#"
                            onClick={Signup}
                            className="btn btn-block px-4"
                          >
                            Create a new account
                          </Button>
                        </div>
                        <div className="text-center pt-3">
                          <p className="text-dark mb-0">
                            Already have account?
                            <Link
                              to={`${import.meta.env.BASE_URL}authlogin`}
                              className="text-primary ms-1"
                            >
                              Sign In
                            </Link>
                          </p>
                        </div>
                      </Row>
                      <div className="mt-6 btn-list">
                        <Button
                          variant="facebook"
                          type="button"
                          className="btn-icon "
                        >
                          <i className="fa fa-facebook"></i>
                        </Button>
                        <Button
                          variant="google"
                          type="button"
                          className="btn-icon "
                        >
                          <i className="fa fa-google"></i>
                        </Button>
                        <Button
                          variant="twitter"
                          type="button"
                          className="btn-icon"
                        >
                          <i className="fa fa-twitter"></i>
                        </Button>
                        <Button
                          variant="dribbble"
                          type="button"
                          className="btn-icon "
                        >
                          <i className="fa fa-dribbble"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  );
}

export default Signup;
