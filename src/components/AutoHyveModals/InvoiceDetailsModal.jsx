import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Hypelogo from "../../assets/images/Hypelogo.png";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Sorting from "../Sorting/Sorting";
// import RoundChat from "../RoundChat/RoundChat";
import CustomBarChart from "../BarChart/CustomBarChart";
import RoundChat from "../RoundChat/RoundChat";
import { BsChevronDown } from "react-icons/bs";

const InvoiceDetailsModal = ({ openInvoiceDetails, setOpenInvoiceDetails }) => {
  const node = useRef(null);
  const tableData = Array(3).fill("");
  const [select, setSelect] = useState("Select Option");
  const [toggleReport, setToggleReport] = useState(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "900px" : "95%",
    height: 650,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => setOpenInvoiceDetails(false);

  const items = [
    "Record Payment",
    "Record expenses",
    "Download PDF",
    "Share",
    "Add Reminder",
    "Edit Invoice",
  ];

  return (
    <>
      <Modal
        open={openInvoiceDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 px-8">
            <div className="flex justify-between w-full">
              <div className="top-10 relative">
                <img src={Hypelogo} alt="" className="w-[60px]" />
              </div>
              <button onClick={() => setOpenInvoiceDetails(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>
          </div>

          <div className="md:flex  w-[100%] md:items-end md:justify-end top-20 md:mt-0 mt-20 md:relative">
            <Sorting items={items} select={select} setSelect={setSelect} />
          </div>

          <div>
            <div className="flex-1">
              <div className="flex flex-col">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Invoice
                </h5>
                <span className="text-sm font-montserrat font-light">
                  #INV-53001
                </span>
                <span className="text-sm font-montserrat font-light">
                  26th March, 2003
                </span>
              </div>
            </div>

            <div className="flex justify-between flex-col md:flex-row mt-2 md:mt-10">
              <div className="flex flex-col mt-5 text-left w-[100%] ">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Demo Workshop
                </h5>
                <span className="text-sm pb-1  font-montserrat font-light">
                  17 Odunayo Street
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  Portacourt,Nigeria.
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  +23490873476343
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  demo@gmail.com
                </span>
              </div>

              <div className="flex flex-col mt-5 justify-start text-left md:justify-end md:text-right  w-[100%]">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Billing Information
                </h5>
                <span className="text-sm pb-1 font-montserrat font-light">
                  Ayo Testa
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  Portacourt,Nigeria.
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  demo@gmail.com
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  +23490873476343
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  test
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-5">
            <div
              onClick={() => setToggleReport(!toggleReport)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="font-montserrat">
                {toggleReport ? " Hide Report" : "Show Report"}
              </span>

              <BsChevronDown />
            </div>
          </div>

          {toggleReport && (
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-[100%]">
                <CustomBarChart />
              </div>

              <div className="w-[100%]">
                <RoundChat />
              </div>
            </div>
          )}

          {toggleReport && (
            <div className="w-[100%] md:w-[100%] overflow-x-scroll border-[1px] rounded-3xl  flex mt-8  px-5 flex-col py-5  border-[#CACACA]">
              <div className="w-[700px] md:w-[100%]">
                <div className="flex justify-between">
                  <div className="flex items-center md:w-[200px] gap-2">
                    <span className="text-sm font-ligt font-montserrat">
                      Total Sales:
                    </span>
                    <span className="font-montserrat font-semibold">
                      ₦35,120.00
                    </span>
                  </div>
                  <div className="flex w-[200px] gap-2">
                    <span className="text-sm font-light font-montserrat">
                      Total Amount Paid:
                    </span>
                    <span className="text-sm font-semibold font-montserrat">
                      ₦0.00
                    </span>
                  </div>
                  <div className="flex w-[144px] md:w-[201px] gap-4">
                    <span className="text-sm font-light font-montserrat">
                      Total Expenses:
                    </span>
                    <span className="text-sm font-semibold font-montserrat">
                      ₦0
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-5">
                  <div className="flex gap-2 w-[205px]">
                    <span className="text-sm font-light font-montserrat">
                      Payments recorded:
                    </span>
                    <span className="text-sm font-semibold font-montserrat">
                      0
                    </span>
                  </div>
                  <div className="flex w-[170px] md:w-[200px] gap-2">
                    <span className="text-sm font-light font-montserrat">
                      Expenses recorded:
                    </span>
                    <span className="text-sm font-semibold font-montserrat">
                      0
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm font-light font-montserrat">
                      Total Receivable:
                    </span>
                    <span className="text-sm font-semibold font-montserrat">
                      ₦35,120.00
                    </span>
                  </div>
                </div>
                <hr className="mt-5" />
                <div className="flex justify-between items-center mt-5">
                  <div className="flex gap-2">
                    <span className="text-sm font-light  font-montserrat">
                      Book Profit:
                    </span>
                    <span className="text-sm font-semibold  font-montserrat">
                      ₦35,120.00
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-sm font-light font-montserrat">
                      Profit/ Loss:
                    </span>
                    <span className="text-sm font-semibold font-montserrat">
                      ₦0.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr className="mt-8" />
          <div className="flex md:flex-row flex-col py-5 gap-10 md:gap-24 items-start md:items-center">
            <div className="flex  md:gap-24">
              <div className="flex md:w-[100%] gap-1 w-[200px] flex-col">
                <span className="text-sm font-medium  font-montserrat">
                  Vehicle
                </span>
                <span className="md:text-sm text-xs font-ligh font-montserrat font-montserratt">
                  2009 MAZDA CX-9
                </span>
              </div>
              <div className="flex  gap-1  flex-col">
                <span className="text-sm font-medium  font-montserrat">
                  Reg.No
                </span>
                <span className="md:text-sm text-xs font-light  font-montserrat">
                  YAB22DD
                </span>
              </div>
            </div>

            <div className="flex  md:gap-24">
              <div className="flex flex-col md:w-[100%] w-[200px] gap-1">
                <span className="text-sm font-medium font-montserrat">
                  Mileage
                </span>
                <span className="md:text-sm text-xs font-light font-montserrat">
                  N/A miles
                </span>
              </div>
              <div className="flex  gap-1 flex-col">
                <span className="text-sm font-medium font-montserrat">VIN</span>
                <span className="md:text-sm text-xs font-light font-montserrat">
                  JVSN30873DGTSE
                </span>
              </div>
            </div>
          </div>

          <hr />

          <div className="mt-10" style={{ overflowX: "scroll" }}>
            <table className="paymentTable mb-10">
              <thead>
                <th className="font-montserrat    text-xs text-left">#</th>
                <th className="font-montserrat    text-xs text-left">
                  Item Description
                </th>
                <th className="font-montserrat    text-xs text-left">
                  Warranty
                </th>
                <th className="font-montserrat text-xs text-left">
                  Unit Cost x{" "}
                </th>
                <th className="font-montserrat     text-xs text-left">
                  Amount
                </th>
              </thead>

              {tableData.map((item, index) => {
                return (
                  <tbody>
                    <tr
                      onClick={() => setOpenItem(true)}
                      className="cursor-pointer table-hover"
                    >
                      <td className="font-montserrat text-xs cursor-pointer">
                        {index + 1}
                      </td>
                      <td className="font-montserrat flex items-center gap-2 text-xs">
                        <span>Brake Pads (Front)</span>
                      </td>
                      <td className="font-montserrat text-xs">3 month</td>
                      <td className="font-montserrat text-xs">
                        {" "}
                        43,000 x 5pcs
                      </td>
                      <td className="font-montserrat text-xs">43,000.00</td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>

          <div className="flex flex-col md:flex-row gap-10 justify-between mt-8">
            <div className="w-[100%] md:w-[50%]">
              <textarea
                className="custom-textarea2 bg-[#f5f5f5]"
                placeholder="labels"
                style={{ width: "100%", height: "300px" }}
              ></textarea>
              {/* <CustomTextArea placeholder="Labels" className="h-52" /> */}
            </div>

            <div className="w-[100%] md:w-[50%] px-0 md:px-5">
              <div className=" border-[1px] py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Sub-Total:</span>
                  <span className="text-sm">₦270,000.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">VAT:</span>
                  <span className="text-sm">₦20,250.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Discount:</span>
                  <span className="text-sm">₦5,000.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Discount:</span>
                  <span className="text-sm">₦285,250.00</span>
                </div>
              </div>
              <p className="text-xs font-light font-montserrat text-right mt-1">
                Job Duration: 1days
              </p>

              <div className=" border-[1px] mt-5 py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Paid:</span>
                  <span className="text-sm">₦270,000.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Balance Due:</span>
                  <span className="text-sm">₦20,250.00</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Refund Due:</span>
                  <span className="text-sm">₦5,000.00</span>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default InvoiceDetailsModal;
