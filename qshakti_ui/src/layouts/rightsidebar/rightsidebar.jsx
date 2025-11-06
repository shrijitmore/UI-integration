import React, { Fragment, useEffect, useState } from 'react'
import { Button, Nav, Tab } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { imagesData } from "../../common/commomimages/imagedata"


export default function Rightsidebar () {

  const Removefunction = () => {
    document.querySelector(".sidebar-right").classList.remove("sidebar-open");
  }


	
  
  return (
        <Fragment>
       <div className = "sidebar sidebar-right sidebar-animate">

       <div className="panel panel-primary card mb-0 box-shadow">
       <div className="px-4 py-3 sidebar-icon d-flex align-items-center justify-content-between bg-primary-light">
					<h6 className="mb-0 fw-semibold">SIDEBAR-MENU</h6>
					<Link to="#" className="text-end float-end" 
					onClick={()=>Removefunction()}
					><i className="fe fe-x"></i></Link>
				</div>
  <Tab.Container id="left-tabs-example" defaultActiveKey="first">
					<div className='tab-menu-heading siderbar-tabs border-0'>
						<div className="tabs-menu">
				<Nav as="ul" variant="pills" className="nav panel-tabs m-2" >
					<Nav.Item as="li" className=''>
					<Nav.Link eventKey="first"><i className="fe fe-mail me-1"></i>Chat</Nav.Link>
					</Nav.Item>
					<Nav.Item as="li" className=''>
					<Nav.Link eventKey="second"><i className="fe fe-activity me-1"></i>Activity</Nav.Link>
					</Nav.Item>
					<Nav.Item as="li">
					<Nav.Link eventKey="third"><i className="fe fe-edit-3 me-1"></i>Todo</Nav.Link>
					</Nav.Item>
				</Nav>
						</div>
					</div>
        
          <Tab.Content className="panel-body tabs-menu-body side-tab-body p-0 border-0 ">
            <Tab.Pane eventKey="first">
            <div className="chat">
								<div>
									<div className="input-group p-4">
										<input type="text" placeholder="Search..." className="form-control search"/>
										<button type="button" className="btn btn-primary">
											<i className="fa fa-search" aria-hidden="true"></i>
										</button>
									</div>
									<div className="px-4 text-dark fw-semibold">Today</div>
									<ul className="mb-0 list-group list-group-flush">
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('male32')} className="avatar brround avatar-md cover-image" />
													<span className="avatar-status bg-green"></span>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Maryam Naz</h6>
													<small className="text-muted fs-12">Thanks, maryam! talk later</small>
												</Link>
											</div>
											<div className="ms-auto text-end mt-1">
												<h6 className="text-dark fw-semibold fs-12 mb-0">08:20 PM</h6>
												<span className="p-1 fs-7 lh-1 bg-success fws-emibold rounded-circle">24</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image">
                          <img src={imagesData('female1')} className="avatar brround avatar-md cover-image" />
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Sahar Darya</h6>
													<small className="text-muted fs-12">No rush meet! lets go</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">08:00 PM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image">
                          <img src={imagesData('female21')} className="avatar brround avatar-md cover-image"/>
													<span className="avatar-status bg-green"></span>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Maryam Naz</h6>
													<small className="text-muted fs-12">Okay. I'll tell him about it!</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">07:40 PM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('female23')} className="avatar brround avatar-md cover-image"/>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Yolduz Rafi</h6>
													<small className="text-muted fs-12">I will text you later.</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">07:20 PM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('male33')} className="avatar brround avatar-md cover-image" />
													<span className="avatar-status bg-green"></span>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Nargis Hawa</h6>
													<small className="text-muted fs-12">Yesterday we make fun a lot..</small>
												</Link>
											</div>
											<div className="ms-auto text-end mt-1">
												<h6 className="text-dark fw-semibold fs-12 mb-0">07:00 PM</h6>
												<span className="p-1 fs-7 lh-1 bg-success fws-emibold rounded-circle">10</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('male15')} className="avatar brround avatar-md cover-image" />
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Khadija Mehr</h6>
													<small className="text-muted fs-12">Hey! buddy what's up...</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">06:10 PM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('female15')} className="avatar brround avatar-md cover-image"/>
													<span className="avatar-status bg-green"></span>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Khadija Mehr</h6>
													<small className="text-muted fs-12">Yeah! I knew..!</small>
												</Link>
											</div>
											<div className="ms-auto text-end mt-1">
												<h6 className="text-dark fw-semibold fs-12 mb-0">05:20 PM</h6>
												<span className="p-1 fs-7 lh-1 bg-success fws-emibold rounded-circle">06</span>
											</div>
										</li>
									</ul>
									<div className="px-4 text-dark fw-semibold">Yesterday</div>
									<ul className="mb-0 list-group list-group-flush">
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('male10')} className="avatar brround avatar-md cover-image"/>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Rishab</h6>
													<small className="text-muted fs-12">I have to go...!</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">11:20 AM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image">
                          <img src={imagesData('male1')} className="avatar brround avatar-md cover-image" />
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Scarlet</h6>
													<small className="text-muted fs-12">Hey! there I' am available....</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">10:00 AM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image" >
                          <img src={imagesData('female9')} className="avatar brround avatar-md cover-image" />
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Willson</h6>
													<small className="text-muted fs-12">Today I completed my work.!</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">09:50 AM</span>
											</div>
										</li>
										<li className="list-group-item d-flex border-0">
											<div className="d-flex">
												<span className="avatar brround avatar-md cover-image">
                          <img src={imagesData('female11')} className="avatar brround avatar-md cover-image"/>
												</span>
												<Link to={`${import.meta.env.BASE_URL}apps/chat`} className="ms-2 p-0">
													<h6 className="mt-1 mb-0 fw-semibold">Yolduz Rafi</h6>
													<small className="text-muted fs-12">Okay...I will be wait for you</small>
												</Link>
											</div>
											<div className="ms-auto text-end">
												<span className="text-dark fw-semibold fs-12">09:20 AM</span>
											</div>
										</li>
									</ul>
								</div>
							</div>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
            <div className="text-dark fw-semibold bg-light px-4 py-2">Today</div>
							<ul className="list-group list-group-flush mb-2 mt-4">
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-file-plus p-3 fs-6 bg-primary-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											New websites is created
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>36s
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-briefcase p-3 fs-6 bg-danger-transparent rounded-circle"></i>
									</div>
									<div className=" w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Prepare for the next project
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock ed me-1"></i>2 mins
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-clock p-3 fs-6 bg-info-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Decide the live discussion time
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>10 mins
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-users p-3 fs-6 bg-success-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Team review meeting at yesterday at 3:00 pm
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>1 hr
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-book-open p-3 fs-6 bg-pink-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Prepare for presentation
										</h6>
										<span className="text-muted fs-12">
											<i className="mdi mdi-clock me-1"></i>3 hr
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-check-circle p-3 fs-6 bg-purple-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Willson jake was created a task
										</h6>
										<span className="text-muted">
											<i className="mdi mdi-clock me-1"></i>5 hr
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-mail p-3 fs-6 bg-orange-transparent rounded-circle"></i>
									</div>
									<div className=" w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Barina kilton commented on your designs
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>10 hr
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-zap p-3 fs-6 bg-secondary-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Juline klept shared a file-attachments
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock text-muted me-1"></i>12 hr
										</span>
									</div>
								</li>
							</ul>

							<div className="text-dark fw-semibold bg-light px-4 py-2">Last 7 Days</div>
							<ul className="list-group list-group-flush mt-4">
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-calendar p-3 fs-6 bg-primary-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Robert veltz was completed project
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>14 May
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-user-check p-3 fs-6 bg-danger-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Completed for the next meeting
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>16 May
										</span>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-clock p-3 fs-6 bg-info-transparent rounded-circle"></i>
									</div>
									<div className="w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Decide the live discussion time
										</h6>
										<div className="d-flex justify-content-between align-items-center">
											<span className="text-muted fs-13">
												<i className="mdi mdi-clock me-1"></i>20 May
											</span>
										</div>
									</div>
								</li>
								<li className="list-group-item d-flex border-0">
									<div>
										<i className="fe fe-users p-3 fs-6 bg-success-transparent rounded-circle"></i>
									</div>
									<div className=" w-100 ms-3">
										<h6 className="mb-0 fw-semibold">
											Team review meeting at yesterday at 3:00 pm
										</h6>
										<span className="text-muted fs-13">
											<i className="mdi mdi-clock me-1"></i>22 May
										</span>
									</div>
								</li>
							</ul>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
            <ul className="list-group list-group-flush">
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox1"
											value="option1" defaultChecked=""/>
										<span className="custom-control-label fw-semibold fw-semibold">Do Even More..</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox2"
											value="option2" defaultChecked=""/>
										<span className="custom-control-label fw-semibold">Find an idea.</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox3"
											value="option3" defaultChecked=""/>
										<span className="custom-control-label fw-semibold">Hangout with friends</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox4"
											value="option4"/>
										<span className="custom-control-label fw-semibold">Do Something else</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox5"
											value="option5"/>
										<span className="custom-control-label fw-semibold">Eat healthy, Eat Fresh..</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox6"
											value="option6" defaultChecked=""/>
										<span className="custom-control-label fw-semibold">Finsh something more..</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox7"
											value="option7" defaultChecked=""/>
										<span className="custom-control-label fw-semibold">Do something more</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox8"
											value="option8"/>
										<span className="custom-control-label fw-semibold">Updated more files</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox9"
											value="option9"/>
										<span className="custom-control-label fw-semibold">System updated</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
								<li className="list-group-item border-bottom d-flex">
									<label className="custom-control custom-checkbox mb-0">
										<input type="checkbox" className="custom-control-input" name="example-checkbox10"
											value="option10"/>
										<span className="custom-control-label fw-semibold">Settings Changings...</span>
									</label>
									<div className="ms-auto">
										<Link to="#">
											<i className="fe fe-edit text-primary me-2"></i>
										</Link>
										<Link to="#">
											<i className="fe fe-trash-2 text-danger"></i>
										</Link>
									</div>
								</li>
							</ul>
							<div className="text-center p-4">
								<Link to="#" className="btn btn-primary btn-block">Upgrade more</Link>
							</div>
            </Tab.Pane>
          </Tab.Content>
        
    </Tab.Container>
    
    </div>
    </div>
        </Fragment>
        )
}
