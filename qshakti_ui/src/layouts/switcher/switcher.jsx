import React, { Fragment, useEffect } from "react";
import { Button, Row } from "react-bootstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import * as switcherdata from "../../layouts/switcher/switcherdata";

export default function Switcher() {
  useEffect(() => {
    switcherdata.LocalBackup();
  }, []);

  return (
    <Fragment>
      <div className="switcher-wrapper">
        <div className="demo_changer">
          <div className="form_holder sidebar-right1">
            <PerfectScrollbar
              options={{ suppressScrollX: true, useBothWheelAxes: false }}
            >
              <Row className="row">
                <div className="predefined_styles">
                  <div className="swichermainleft text-center">
                    <h4>LTR AND RTL VERSIONS</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">LTR</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch25"
                              onClick={() => switcherdata.Ltr()}
                              id="myonoffswitch54"
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch54"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">RTL</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch25"
                              onClick={() => switcherdata.Rtl()}
                              id="myonoffswitch55"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch55"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swichermainleft switcher-nav">
                    <h4>Navigation Style</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Vertical Menu</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch15"
                              onClick={() => switcherdata.Verticalmenu()}
                              id="myonoffswitch34"
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch34"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Horizantal Click Menu</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch15"
                              onClick={() => switcherdata.Horizontalmenu()}
                              id="myonoffswitch35"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch35"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Horizantal Hover Menu</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch15"
                              onClick={() => switcherdata.HorizontalHoverMenu()}
                              id="myonoffswitch111"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch111"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swichermainleft leftmenu-styles">
                    <h4>Menu Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Light Menu</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              onClick={() => switcherdata.Lightmenu()}
                              id="myonoffswitch3"
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch3"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Color Menu</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              onClick={() => switcherdata.Colormenu()}
                              id="myonoffswitch4"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch4"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Dark Menu</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              onClick={() => switcherdata.Darkmenu()}
                              id="myonoffswitch5"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch5"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft header-styles">
                    <h4>Header Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Light Header</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              onClick={() => switcherdata.Lightheader()}
                              id="myonoffswitch6"
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch6"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Color Header</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              onClick={() => switcherdata.Colorheader()}
                              id="myonoffswitch7"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch7"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Dark Header</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              onClick={() => switcherdata.Darkheader()}
                              id="myonoffswitch8"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch8"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft">
                    <h4>Layout Width Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Full Width</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch04"
                              onClick={() => switcherdata.Fullwidth()}
                              id="myonoffswitch9"
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch9"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Boxed</span>
                          <p className="onoffswitch2 my-0">
                            <input
                              type="radio"
                              name="onoffswitch04"
                              onClick={() => switcherdata.Boxedwidth()}
                              id="myonoffswitch10"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch10"
                              className="onoffswitch2-label"
                            ></label>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="swichermainleft">
                    <h4>Reset All Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section px-2">
                        <Button
                          className="btn btn-danger btn-block"
                          type="button"
                          onClick={() => switcherdata.Resetall()}
                        >
                          Reset All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
