import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from './authenticationReducer';
import dashboardReducer from "./dashboardReducer";
import userReducer from "./userReducer";
import vehicleReducer from "./vehicleReducer";

const rootReducer = combineReducers({
    authenticationReducer,
    dashboardReducer,
    userReducer,
    vehicleReducer
});

export default rootReducer;