import React, { useEffect, useRef, useState } from "react";
import settings from "../../../assets/images/settings.png";
import MenuIcon from "../../../assets/svgs/menu.svg";
import ProfileDropDown from "../../../components/ProfileDropDown/ProfileDropDown";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const MobileHeader = ({ show, openNav, setOpenNav, open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="flex md:hidden mt-20">
      <h5 className=" text-[#494949] font-montserrat font-bold ">
        {location.pathname == "/dashboard" && "Dashboard"}
        {location.pathname == "/customers" && (
          <span className="font-montserrat font-bold text-[#494949]">
            Customers
          </span>
        )}
        {location.pathname == "/autoHyveProfile" && (
          <span
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer gap-3"
          >
            <IoIosArrowBack size={30} />
            Customer’s Profile
          </span>
        )}
        {location.pathname == "/hyvepay" && "HyvePay"}
        {location.pathname == "/inventory" && "Items & Inventory"}
        {location.pathname == "/profile" && "Profile"}
        {location.pathname == "/settings" && "Settings"}
        {location.pathname == "/estimates" && "Estimates"}
        {location.pathname == "/invoice" && "Invoices"}
        {location.pathname == "/payment" && "Payments"}
        {location.pathname == "/expenses" && "Expenses"}
        {location.pathname == "/vin-decoder" && "VIN Decoder"}
        {location.pathname == "/insurance" && "Insurance"}
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
    </header>
  );
};

export default MobileHeader;
