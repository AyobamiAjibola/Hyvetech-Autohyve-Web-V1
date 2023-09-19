import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "../../assets/svgs/vuesax/twotone/dashboard-icon.svg";
import CustomerIcon from "../../assets/svgs/customer-icon.svg";
import ExpensesIcon from "../../assets/svgs/vuesax/linear/refresh-circle.svg";
import PaymentIcon from "../../assets/svgs/vuesax/linear/dollar-circle.svg";
import InvoiceIcon from "../../assets/svgs/Iconsax/Outline/receipt2.svg";
import EstimateIcon from "../../assets/svgs/Iconsax/Linear/calculator.svg";
import ServiceIcon from "../../assets/svgs/Iconsax/Outline/calendar1.svg";
// import ItemIcon from '../../assets/svgs/Iconsax/Linear/receiptadd.png'
import ItemIcon from "../../assets/svgs/receiptadd.svg";
import HyveIcon from "../../assets/svgs/hyve-icon.svg";
import LogoutIcon from "../../assets/svgs/Icon/Outline/logout.svg";

const Tab = ({ name, link, collapse }) => {
  const [url, getURL] = useState("");

  const [icons, SetIcons] = useState({
    Dashboard: DashboardIcon,
    Customers: CustomerIcon,
    HyvePay: HyveIcon,
    "Items & Inventory": ItemIcon,
    "Service Reminder": ServiceIcon,
    Estimates: EstimateIcon,
    Invoices: InvoiceIcon,
    Payments: PaymentIcon,
    Expenses: ExpensesIcon,
    Logout: LogoutIcon,
  });

  useEffect(() => {
    let i = true;
    getURL(window.location.pathname);

    return () => {
      i = false;
    };
  }, [window.location.pathname]);

  return (
    <>
      <Link to={link} onClick={() => closeSidebar()}>
        <div
          className={
            url === link
              ? "py-4 px-8 tab active text-white flex gap-4"
              : "py-4 px-8 tab text-white flex gap-4"
          }
        >
          <img src={icons[name]} alt="" />
          {!collapse && name}
        </div>
      </Link>
    </>
  );
};

export default Tab;
