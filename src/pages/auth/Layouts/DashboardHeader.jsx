import React, { useEffect, useRef, useState } from "react";
import settings from "../../../assets/images/settings.png";
import MenuIcon from "../../../assets/svgs/menu.svg";
import ProfileDropDown from "../../../components/ProfileDropDown/ProfileDropDown";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardHeader = ({ show, openNav, setOpenNav, open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // let name = "David";
  let workshop = "Demo workshop";
  const [path, setPath] = useState("");

  // console.log(location.pathname);

  // useEffect(() => {
  //   setPath(window.location.pathname);
  // }, [window.location.pathname]);

  return (
    <header
      className={`bg-[#F9F9F9]  w-[100%] flex justify-between items-center h-[80px] z-50 header-container ${
        show ? " small-paddings" : "full-header"
      } `}
    >
      {location.pathname === "/hyvepay/initiate-transaction" ? (
        <h5
          className="heading-five  font-montserrat md:flex hidden cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack size={30} />
          <span className="pl-3"> Back</span>
        </h5>
      ) : (
        <h5 className="heading-five text-[#494949] font-montserrat md:block hidden">
          {location.pathname == "/dashboard" && "Dashboard"}
          {location.pathname == "/customers" && "Customers"}
          {location.pathname == "/autoHyveProfile" && (
            <span
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-3"
            >
              <IoIosArrowBack size={30} />
              Customer’s Profile
            </span>
          )}
          {location.pathname == "/hyepay" && "HyvePay"}
          {location.pathname == "/inventory" && "Items & Inventory"}
          {location.pathname == "/profile" && "Profile"}
          {location.pathname == "/settings" && "Settings"}
          {location.pathname == "/estimates" && "Estimates"}
          {location.pathname == "/invoice" && "Invoices"}
          {location.pathname == "/payment" && "Payments"}
          {location.pathname == "/expenses" && "Expenses"}
          {location.pathname == "/service-reminder" && "Service Reminders"}
          {location.pathname == "/generate-invoice" && (
            <span
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-3"
            >
              <IoIosArrowBack size={30} />
              Generate Invoice
            </span>
          )}
          {location.pathname == "/edit-invoice" && (
            <span
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-3"
            >
              <IoIosArrowBack size={30} />
              Edit Invoice
            </span>
          )}
          {location.pathname == "/generate-estimate-estimate" && (
            <span
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-3"
            >
              <IoIosArrowBack size={30} /> Generate Estimate
            </span>
          )}
          {location.pathname == "/edit-estimate" && (
            <span
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-3"
            >
              <IoIosArrowBack size={30} /> EST-23019
            </span>
          )}
          {location.pathname == "/generate-customer-estimate" && (
            <span
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-3"
            >
              <IoIosArrowBack size={30} /> Generate Estimate
            </span>
          )}
        </h5>
      )}

      <img
        src={MenuIcon}
        className="md:hidden block"
        alt=""
        style={{ height: 20 }}
        onClick={() => setOpenNav(!openNav)}
      />

      <div className="">
        <button className="" onClick={() => setOpen(!open)}>
          <div className="flex  items-center gap-2">
            <span className="font-montserrat"> {workshop}</span>

            <img src={settings} alt="" className="w-[30px] h-[30px]" />
          </div>
        </button>

        {open && <ProfileDropDown setOpen={setOpen} open={open} />}
      </div>
    </header>
  );
};

export default DashboardHeader;
