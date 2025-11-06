// store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth/authSlice";
import userManagementReducer from "./slices/admin/userManagementSlice";
import openOrdersReducer from "./slices/openOrders/openOrdersSlice";
import addRoleReducer from "./slices/roleManagement/addRoleSlice";
import poListReducer from "./slices/operator/CommonIOSectionSlice";
import roleBaseReducer from "./slices/roleManagement/roleBasedauthSlice";
import ActivityLogReducer from "./slices/activityLog/activityLogSlice";
import moduleReducer from "./slices/moduleSlice";
import dashBoardOneReducer from "./slices/dashboard/dashboardSlice";
import orderManagementReducer from "./slices/orderManagement/orderManagementSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userManagement: userManagementReducer,
    openOrders: openOrdersReducer,
    addRole: addRoleReducer,
    poList: poListReducer,
    roleBaseAuth: roleBaseReducer,
    activityLog: ActivityLogReducer,
    module: moduleReducer,
    dashboardone: dashBoardOneReducer,
    orderManagementAuth: orderManagementReducer,
  },
});

export default store;
