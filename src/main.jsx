import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/style.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Unauth from "./routes/Unauth.jsx";
import Login from "./pages/unauth/Login";
import Register from "./pages/unauth/Register";
import ErrorPage from "./pages/error/ErrorPage";
import Verification from "./pages/unauth/Verification.jsx";
import Auth from "./routes/Auth.jsx";
import Dashboard from "./pages/auth/Dashboard.jsx";
import Customers from "./pages/auth/Customers.jsx";
import Inventory from "./pages/auth/Inventory.jsx";
import Service from "./pages/auth/Service.jsx";
import Estimates from "./pages/auth/Estimates.jsx";
import Invoice from "./pages/auth/Invoice.jsx";
import Payment from "./pages/auth/Payment.jsx";
import Expenses from "./pages/auth/Expenses.jsx";
import NewTransaction from "./pages/auth/NewTransaction.tsx";
import SavedBeneficiaries from "./pages/auth/SavedBeneficiaries.jsx";
import WelcomeAuthenticationPage from "./pages/unauth/WelcomeAuthenticationPage.jsx";
import LoginPage from "./pages/unauth/LoginPage.jsx";
import Settings from "./pages/auth/Settings.jsx";
import Profile from "./pages/auth/Profile.jsx";
import AutoHyveProfile from "./pages/auth/AutoHyveProfile.jsx";
import GenerateEstimate from "./pages/auth/GenerateEstimate.jsx";
import GenerateEstimateEstimate from "./pages/auth/GenerateEstimateEstimate.jsx";
import EditEstimate from "./pages/auth/EditEstimate.jsx";
import GenerateInvoice from "./pages/auth/GenerateInvoice.jsx";
import EditInvoice from "./pages/auth/EditInvoice.jsx";
import Reminder from "./pages/auth/Reminder.jsx";
import store from "./store";
import { Provider } from "react-redux";
import VinDecoder from "./pages/auth/VinDecoder.tsx";
import Insurance from "./pages/auth/Insurance.tsx";
import PrivateRoute from "./components/RouteGuard/ProtectedRoute.tsx";
import Hyvepay from "./pages/auth/Hyvepay.tsx";
import jwt_decode from "jwt-decode";
import settings from "./config/settings";

const token =sessionStorage.getItem(settings.auth.admin);
const { accountType } = token && (jwt_decode(token));

const router = createBrowserRouter([
  {
    //AUTHENTICATION LINKS (UNAUTH)
    element: <Unauth />,
    children: [
      {
        path: "/",
        element: <WelcomeAuthenticationPage />,
        // errorElement: <ErrorPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verification",
        element: <Verification />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      }
    ],
  },
  {
    // DASHBOARD LINKS (AUTH)
    element: <Auth />,
    children: [
      {
        path: "/dashboard",
        element: <PrivateRoute>
          {accountType === "cooperate" || accountType === null 
            ? <Dashboard />
            : <Navigate to="/vin-decoder" replace />
          }
        </PrivateRoute>
      },
      {
        path: "/customers",
        element: <PrivateRoute><Customers/></PrivateRoute>,
      },
      {
        path: "/inventory",
        element: <PrivateRoute><Inventory/></PrivateRoute>,
      },
      {
        path: "/hyvepay",
        element: <PrivateRoute><Hyvepay /></PrivateRoute>,
      },
      {
        path: "/service-reminder",
        element: <PrivateRoute><Reminder/></PrivateRoute>,
      },
      {
        path: "/estimates",
        element: <PrivateRoute><Estimates/></PrivateRoute>,
      },
      {
        path: "/invoice",
        element: <PrivateRoute><Invoice/></PrivateRoute>,
      },
      {
        path: "/generate-invoice",
        element: <PrivateRoute><GenerateInvoice/></PrivateRoute>,
      },
      {
        path: "/edit-invoice",
        element: <PrivateRoute><EditInvoice/></PrivateRoute>,
      },
      {
        path: "/payment",
        element: <PrivateRoute><Payment/></PrivateRoute>,
      },
      {
        path: "/expenses",
        element: <PrivateRoute><Expenses/></PrivateRoute>,
      },

      {
        path: "/logout",
      },
      {
        path: "/hyvepay/initiate-transaction",
        element: <PrivateRoute><NewTransaction/></PrivateRoute>,
      },
      {
        path: "/hyvepay/saved-beneficiaries",
        element: <PrivateRoute><SavedBeneficiaries/></PrivateRoute>,
      },
      {
        path: "/settings",
        element: <PrivateRoute><Settings/></PrivateRoute>,
      },
      {
        path: "/profile",
        element: <PrivateRoute ><Profile/></PrivateRoute>,
      },
      {
        path: "/autoHyveProfile",
        element: <PrivateRoute><AutoHyveProfile/></PrivateRoute>,
      },
      {
        path: "/generate-customer-estimate",
        element: <PrivateRoute><GenerateEstimate/></PrivateRoute>,
      },
      {
        path: "/generate-estimate-estimate",
        element: <PrivateRoute><GenerateEstimateEstimate/></PrivateRoute>,
      },
      {
        path: "/edit-estimate",
        element: <PrivateRoute><EditEstimate/></PrivateRoute>,
      },
      {
        path: "/vin-decoder",
        element: <PrivateRoute><VinDecoder/></PrivateRoute>,
      },
      {
        path: "/insurance",
        element: <PrivateRoute><Insurance/></PrivateRoute>,
      },
      {
        path: "/hyvepay/transfer",
        element: <PrivateRoute><NewTransaction /></PrivateRoute>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
