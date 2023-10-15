import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from './authenticationReducer';
import dashboardReducer from "./dashboardReducer";
import userReducer from "./userReducer";
import vehicleReducer from "./vehicleReducer";
import partnerReducer from "./partnerReducer";
import autoHyveReducer from "./autoHyveReducer";
import customerReducer from "./customerReducer";
import serviceReminderReducer from "./serviceReminderReducer";
import itemStockReducer from "./itemStockReducer";
import invoiceReducer from "./invoiceReducer";
import estimateReducer from "./estimateReducer";
import transactionReducer from "./transactionReducer";
import expenseReducer from "./expenseReducer";

const rootReducer = combineReducers({
    authenticationReducer,
    dashboardReducer,
    userReducer,
    vehicleReducer,
    partnerReducer,
    autoHyveReducer,
    customerReducer,
    serviceReminderReducer,
    itemStockReducer,
    invoiceReducer,
    estimateReducer,
    transactionReducer,
    expenseReducer
});

export default rootReducer;