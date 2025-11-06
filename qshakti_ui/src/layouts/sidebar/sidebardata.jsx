import React from "react";

import ContactEmergencyOutlinedIcon from "@mui/icons-material/ContactEmergencyOutlined";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SupportIcon from "@mui/icons-material/Support";

// Step 1: Get the role safely from sessionStorage

const allItems = [
  {
    icon: <EqualizerIcon className="side-menu__icon" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}dashboard`,
    active: false,
    selected: false,
    title: "DASHBOARD 1",
    key: "dashboard",
    module: "Dashboard",
  },
  {
    icon: <EqualizerIcon className="side-menu__icon" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}dashboard2`,
    active: false,
    selected: false,
    title: "DASHBOARD 2",
    key: "dashboard2",
    module: "Dashboard",
  },
  {
    icon: <LockPersonIcon className="side-menu__icon " />,
    type: "link",
    path: `${import.meta.env.BASE_URL}roleManagement`,
    active: false,
    selected: false,
    title: "ROLE MANAGEMENT",
    key: "roleManagement",
    module: "User & Security Management",
  },
  {
    icon: <ContactEmergencyOutlinedIcon className="side-menu__icon" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}userManagement`,
    active: false,
    selected: false,
    title: "USER MANAGEMENT",
    key: "userManagement",
    module: "User & Security Management",
  },
  {
    icon: <ContentPasteGoIcon className="side-menu__icon" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}openorders`,
    active: false,
    selected: false,
    title: "OPEN ORDERS",
    key: ["production", "rm"],
    module: "Order Management",
  },
  {
    icon: <PlayCircleOutlineIcon className="side-menu__icon" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}productionorders`,
    active: false,
    selected: false,
    title: "PRODUCTION ORDERS",
    key: "productionOrders",
    module: "Order Management",
  },
  {
    icon: <ContentPasteGoIcon className="side-menu__icon" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}orderdetails`,
    active: false,
    selected: false,
    title: "ORDER DETAILS",
    key: "orderDetails",
    module: "Order Management",
  },
  {
    icon: (
      <PrecisionManufacturingIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}inprocessinspection`,
    active: false,
    selected: false,
    title: "IN PROCESS INSPECTION",
    key: "inprocessInspection",
    module: "Inprocess Management",
  },
  {
    icon: (
      <DisplaySettingsIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}inprocessinspectiondetails`,
    active: false,
    selected: false,
    title: "IN PROCESS DETAILS",
    key: "inprocessInspectionDetails",
    module: "Inprocess Management",
  },
  {
    icon: (
      <DisplaySettingsIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}inprocessReport`,
    active: false,
    selected: false,
    title: "IN PROCESS REPORT",
    key: "inprocessReport",
    module: "Report Management",
  },
  {
    icon: (
      <DisplaySettingsIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}faiReport`,
    active: false,
    selected: false,
    title: "FAI REPORT",
    key: "faiReport",
    module: "Report Management",
  },
  {
    icon: (
      <DisplaySettingsIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}rmReport`,
    active: false,
    selected: false,
    title: "RM REPORT",
    key: "rmReport",
    module: "Report Management",
  },
  {
    icon: (
      <ContentPasteSearchIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}rminspection`,
    active: false,
    selected: false,
    title: "RM INSPECTION",
    key: "rmInspection",
    module: "RM Management",
  },
  {
    icon: <ChecklistIcon className="side-menu__icon ri-file-list-3-line" />,
    type: "link",
    path: `${import.meta.env.BASE_URL}rminspectiondetails`,
    active: false,
    selected: false,
    title: "RM INSPECTION DETAILS",
    key: "rmInspectionDetails",
    module: "RM Management",
  },
  {
    icon: <DescriptionOutlinedIcon className="side-menu__icon " />,
    type: "link",
    path: `${import.meta.env.BASE_URL}faiInspection`,
    active: false,
    selected: false,
    title: "FAI INSPECTION",
    key: "faiInspection",
    module: "Final Acceptance Inspection",
  },
  {
    icon: (
      <DisplaySettingsIcon className="side-menu__icon ri-file-list-3-line" />
    ),
    type: "link",
    path: `${import.meta.env.BASE_URL}faiinspectiondetails`,
    active: false,
    selected: false,
    title: "FAI INSPECTIONS DETAILS",
    key: "faiInspectionDetails",
    module: "Final Acceptance Inspection",
  },
  {
    icon: <CloudUploadOutlinedIcon className="side-menu__icon " />,
    type: "link",
    path: `${import.meta.env.BASE_URL}uploadfile`,
    active: false,
    selected: false,
    title: "UPLOAD FILE",
    key: "uploadFile",
    module: "Master Data Management (MDM)",
  },

  {
    icon: <DescriptionOutlinedIcon className="side-menu__icon " />,
    type: "link",
    path: `${import.meta.env.BASE_URL}activityLog`,
    active: false,
    selected: false,
    title: "ACTIVITY LOG",
    key: "activity",
    module: "Dashboard",
    showOnlyForAdmin: true,
  },
  {
    icon: <SupportIcon className="side-menu__icon " />,
    type: "link",
    path: `${import.meta.env.BASE_URL}orderManagement`,
    active: false,
    selected: false,
    title: "ORDER MANAGEMENT",
    key: "orderManagement",
    module: "Order Management",
    // showOnlyForAdmin: true,
  },
];

const MenuItems = [
  {
    Items: allItems,
  },
];

export default MenuItems;
