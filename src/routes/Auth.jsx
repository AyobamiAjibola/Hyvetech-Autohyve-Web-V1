import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import Sidebar from "../pages/auth/Layouts/Sidebar";
import "../assets/css/layout.css";
import DashboardHeader from "../pages/auth/Layouts/DashboardHeader";
import MobileHeader from "../pages/auth/Layouts/MobileHeader";
import PrivateRoute from "../components/RouteGuard/ProtectedRoute";

const Auth = () => {
  const [show, setShow] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(localStorage?.getItem("active"));
  
  return (
    <div>
      <Sidebar
        show={show}
        setShow={setShow}
        openNav={openNav}
        setOpenNav={setOpenNav}
        setActive={setActive}
        active={active}
      />

      <DashboardHeader
        show={show}
        open={open}
        setOpen={setOpen}
        setOpenNav={setOpenNav}
        openNav={openNav}
        setActive={setActive}
      />
      <main className={show ? "large-container " : "content-container"}>
        <MobileHeader />

        <Outlet />
        
      </main>
    </div>
  );
};

export default Auth;
