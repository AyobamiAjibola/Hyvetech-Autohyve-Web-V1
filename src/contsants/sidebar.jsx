import DashboardIcon from "../../src/assets/svgs/vuesax/twotone/dashboard-icon.svg";
import CustomerIcon from "../../src/assets/svgs/customer-icon.svg";
import ExpensesIcon from "../../src/assets/svgs/vuesax/linear/refresh-circle.svg";
import PaymentIcon from "../../src/assets/svgs/vuesax/linear/dollar-circle.svg";
import InvoiceIcon from "../../src/assets/svgs/Iconsax/Outline/receipt2.svg";
import EstimateIcon from "../../src/assets/svgs/Iconsax/Linear/calculator.svg";
import ServiceIcon from "../../src/assets/svgs/Iconsax/Outline/calendar1.svg";
import hyvelogobar from "../../src/assets/svgs/hyvelogobar.svg";
// import ItemIcon from '../../assets/svgs/Iconsax/Linear/receiptadd.png'
import ItemIcon from "../../src/assets/svgs/receiptadd.svg";
import HyveIcon from "../../src/assets/svgs/hyve-icon.svg";
import vinIcon from "../../src/assets/svgs/vinIcon.svg";
import InsuranceIcon from "../../src/assets/svgs/InsuranceIcon.svg"


// import LogoutIcon from "../../src/assets/svgs/Icon/Outline/logout.svg";

export const sidebarItemsCooperate = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "VIN Decoder",
    path: "/vin-decoder",
    icon: vinIcon,
  },
  {
    name: "Insurance",
    path: "/insurance",
    icon: InsuranceIcon,
  }
];

export const sidebarItemsIndividual = [
  {
    name: "VIN Decoder",
    path: "/vin-decoder",
    icon: vinIcon,
  },
  {
    name: "Insurance",
    path: "/insurance",
    icon: InsuranceIcon,
  }
];

export const subSidebarItems = [
  {
    name: "Customers",
    path: "/customers",
    icon: CustomerIcon,
  },
  {
    name: "Items & Inventory",
    path: "/inventory",
    icon: ItemIcon,
  },
  {
    name: "Service Reminder",
    path: "/service-reminder",
    icon: ServiceIcon,
  },
  {
    name: "Estimates",
    path: "/estimates",
    icon: EstimateIcon,
  },
  {
    name: "Invoices",
    path: "/invoice",
    icon: InvoiceIcon,
  },
  {
    name: "Payments",
    path: "/payment",
    icon: PaymentIcon,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: ExpensesIcon,
  },
];
