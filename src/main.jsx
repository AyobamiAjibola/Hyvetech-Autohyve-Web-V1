import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Unauth from "./routes/Unauth.jsx";
import Login from "./pages/unauth/Login";
import Register from "./pages/unauth/Register";
import ErrorPage from "./pages/error/ErrorPage";
import Verification from "./pages/unauth/Verification.jsx";
import Auth from "./routes/Auth.jsx";
import Dashboard from "./pages/auth/Dashboard.jsx";
import Customers from "./pages/auth/Customers.jsx";
import Hyvepay from "./pages/auth/Hyvepay.jsx";
import Inventory from "./pages/auth/Inventory.jsx";
import Service from "./pages/auth/Service.jsx";
import Estimates from "./pages/auth/Estimates.jsx";
import Invoice from "./pages/auth/Invoice.jsx";
import Payment from "./pages/auth/Payment.jsx";
import Expenses from "./pages/auth/Expenses.jsx";
import NewTransaction from "./pages/auth/NewTransaction.jsx";
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
      },
    ],
  },
  {
    // DASHBOARD LINKS (AUTH)
    element: <Auth />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/hyepay",
        element: <Hyvepay />,
      },
      {
        path: "/service-reminder",
        element: <Reminder />,
      },
      {
        path: "/estimates",
        element: <Estimates />,
      },
      {
        path: "/invoice",
        element: <Invoice />,
      },
      {
        path: "/generate-invoice",
        element: <GenerateInvoice />,
      },
      {
        path: "/edit-invoice",
        element: <EditInvoice />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/expenses",
        element: <Expenses />,
      },

      {
        path: "/logout",
      },
      {
        path: "/hyvepay/initiate-transaction",
        element: <NewTransaction />,
      },
      {
        path: "/hyvepay/saved-beneficiaries",
        element: <SavedBeneficiaries />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/autoHyveProfile",
        element: <AutoHyveProfile />,
      },
      {
        path: "/generate-customer-estimate",
        element: <GenerateEstimate />,
      },
      {
        path: "/generate-estimate-estimate",
        element: <GenerateEstimateEstimate />,
      },
      {
        path: "/edit-estimate",
        element: <EditEstimate />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
