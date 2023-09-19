import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import Sidebar from "../pages/auth/Layouts/Sidebar";
import "../assets/css/layout.css";
import DashboardHeader from "../pages/auth/Layouts/DashboardHeader";
import MobileHeader from "../pages/auth/Layouts/MobileHeader";

const Auth = () => {
  const [show, setShow] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Sidebar
        show={show}
        setShow={setShow}
        openNav={openNav}
        setOpenNav={setOpenNav}
      />

      <DashboardHeader
        show={show}
        open={open}
        setOpen={setOpen}
        setOpenNav={setOpenNav}
        openNav={openNav}
      />
      <main className={show ? "large-container " : "content-container"}>
        <MobileHeader />

        <Outlet />
      </main>
    </div>
  );
};

export default Auth;
