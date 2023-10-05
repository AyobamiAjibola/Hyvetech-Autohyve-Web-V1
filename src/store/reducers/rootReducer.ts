import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from './authenticationReducer';
import dashboardReducer from "./dashboardReducer";
import userReducer from "./userReducer";
import vehicleReducer from "./vehicleReducer";
import partnerReducer from "./partnerReducer";
import autoHyveReducer from "./autoHyveReducer";

const rootReducer = combineReducers({
    authenticationReducer,
    dashboardReducer,
    userReducer,
    vehicleReducer,
    partnerReducer,
    autoHyveReducer
});

export default rootReducer;