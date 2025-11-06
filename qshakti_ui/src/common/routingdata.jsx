import React from "react";
import DashboardTwo from "../modules/Dashboard/DashboardTwo";

const Error404 = React.lazy(() => import("../common/commonComponent/Error404"));
const RoleMangement = React.lazy(() =>
  import("../modules/Admin/RoleManagement/RoleMangement")
);
const FaiInspectionDetails = React.lazy(() =>
  import("../modules/Operator/FaiInspection/FaiInspectionDetails")
);
const FaiInspection = React.lazy(() =>
  import("../modules/Operator/FaiInspection/FaiInspection")
);
const UserManagement = React.lazy(() =>
  import("../modules/Admin/UserManagement/UserManagement")
);
const ProductionOrders = React.lazy(() =>
  import("../modules/Supervisor/ProductionOrders/ProductionOrders")
);
const OpenOrders = React.lazy(() =>
  import("../modules/Planner/OpenOrders/OpenOrders")
);
const RmInspection = React.lazy(() =>
  import("../modules/Operator/RmInspection/RmInspection")
);
const RmInspectionDetails = React.lazy(() =>
  import("../modules/Operator/RmInspectionDetails/RmInspectionDetails")
);
const InProcessInspection = React.lazy(() =>
  import("../modules/Operator/InprocessInspection/InProcessInspection")
);
const InprocessInspectionReport = React.lazy(() =>
  import(
    "../modules/Operator/inprocessInspectionReport/inprocessInspectionReport"
  )
);
const FaiInspectionReport = React.lazy(() =>
  import("../modules/Operator/FaiInspectionReport/FaiInspectionReport")
);
const RmInspectionReport = React.lazy(() =>
  import("../modules/Operator/RmInspectionReport/RmInspectionReport")
);

const InprocessInspectionDetails = React.lazy(() =>
  import(
    "../modules/Operator/InprocessInspectionDetails/InprocessInspectionDetails"
  )
);
const UploadProductionPlan = React.lazy(() =>
  import("../modules/Planner/OpenOrders/UploadProductionPlan")
);
const ActivityLog = React.lazy(() =>
  import("../modules/ActivityLog/ActivityLog")
);
const Dashboard = React.lazy(() => import("../modules/Dashboard/Dashboard"));
const ModulePage = React.lazy(() => import("../modules/modules/modulesPage"));
const OrderDetails = React.lazy(() =>
  import("../modules/Supervisor/OrderDetails/OrderDetails")
);
const OrderManage = React.lazy(() =>
  import("../modules/Supervisor/Order Management/OrderManagement")
);
// Chatbot component - Quality Insights Chatbot for querying production and inspection data
const Chatbot = React.lazy(() =>
  import("../modules/Chatbot/Chatbot")
);
export const Routingdata = [
  {
    path: "uploadfile",
    element: <UploadProductionPlan />,
    permission: {
      screens: "uploadFile",
      action: "view",
    },
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    permission: {
      screens: "dashboard",
      action: "view",
    },
  },
  {
    path: "dashboard2",
    element: <DashboardTwo />,
    permission: {
      screens: "dashboard2",
      action: "view",
    },
  },
  {
    path: "roleManagement",
    permission: {
      screens: "roleManagement",
      action: "view",
    },
    element: <RoleMangement />,
  },
  {
    path: "userManagement",
    element: <UserManagement />,
    permission: {
      screens: "userManagement",
      action: "view",
    },
  },
  {
    path: "openorders",
    element: <OpenOrders />,
    permission: {
      screens: ["rm", "production"],
      action: "view",
    },
  },
  {
    path: "productionorders",
    element: <ProductionOrders />,
    permission: {
      screens: "productionOrders",
      action: "view",
    },
  },
  {
    path: "orderdetails",
    element: <OrderDetails />,
    permission: {
      screens: "orderDetails",
      action: "view",
    },
  },
  {
    path: "inprocessinspection",
    element: <InProcessInspection />,
    permission: {
      screens: "inprocessInspection",
      action: "view",
    },
  },
  {
    path: "inprocessReport",
    element: <InprocessInspectionReport />,
    permission: {
      screens: "inprocessReport",
      action: "view",
    },
  },
  {
    path: "faiReport",
    element: <FaiInspectionReport />,
    permission: {
      screens: "faiReport",
      action: "view",
    },
  },
  {
    path: "rmReport",
    element: <RmInspectionReport />,
    permission: {
      screens: "rmReport",
      action: "view",
    },
  },

  {
    path: "rminspection",
    element: <RmInspection />,
    permission: {
      screens: "rmInspection",
      action: "view",
    },
  },

  {
    path: "rminspectiondetails",
    element: <RmInspectionDetails />,
    permission: {
      screens: "rmInspectionDetails",
      action: "view",
    },
  },

  {
    path: "inprocessinspectiondetails",
    element: <InprocessInspectionDetails />,
    permission: {
      screens: "inprocessInspectionDetails",
      action: "view",
    },
  },
  {
    path: "faiinspectiondetails",
    element: <FaiInspectionDetails />,
    permission: {
      screens: "faiInspectionDetails",
      action: "view",
    },
  },
  {
    path: "activitylog",
    element: <ActivityLog />,
    permission: {
      screens: "activity",
      action: "view",
    },
  },
  {
    path: "faiInspection",
    element: <FaiInspection />,
    permission: {
      screens: "faiInspection",
      action: "view",
    },
  },
  {
    path: "orderManagement",
    element: <OrderManage />,
  },
  { path: "*", element: <Error404 /> },
];
