import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from './authenticationReducer';
import dashboardReducer from "./dashboardReducer";
import userReducer from "./userReducer";
import vehicleReducer from "./vehicleReducer";
import partnerReducer from "./partnerReducer";

const rootReducer = combineReducers({
    authenticationReducer,
    dashboardReducer,
    userReducer,
    vehicleReducer,
    partnerReducer,
});

export default rootReducer;