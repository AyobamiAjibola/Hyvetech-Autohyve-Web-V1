import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import logoEstimate from "../../assets/images/logoEstimate.png";
import documentdownload from "../../assets/images/document-download.png";
import mingcutelinkfill from "../../assets/images/mingcute_link-fill.png";
import mdi_share from "../../assets/images/mdi_share.png";
import Sorting from "../Sorting/Sorting";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const EstimateDetailsModal = ({
  openEstimateDetails,
  setOpenEstimateDetails,
}) => {
  const items = ["Generate  Invoice", "Duplicate Estimate", "Mark as sent"];
  const tableData = Array(3).fill("");
  const [select, setSelect] = useState("Select Option");
  const handleClose = () => setOpenEstimateDetails(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "70%" : "95%",
    height: 650,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  return (
    <>
      <Modal
        open={openEstimateDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 px-8">
            <div className="flex justify-between w-full">
              <div className="top-10 relative">
                <img src={logoEstimate} alt="" className="w-[80px]" />
              </div>
              <button onClick={() => setOpenEstimateDetails(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>
          </div>

          <div className="md:flex  w-[100%] md:items-end md:justify-end top-20 md:mt-0 mt-20 md:relative">
            <Sorting items={items} select={select} setSelect={setSelect} />
          </div>

          <div className="flex justify-between flex-col md:flex-row  mt-10">
            <div className="flex-1">
              <div className="flex flex-col">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Estimate
                </h5>
                <span className="text-sm font-montserrat font-light">
                  #INV-53001
                </span>
                <span className="text-sm font-montserrat font-light">
                  26th March, 2003
                </span>
              </div>

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
            </div>

            <div className="mt-5 md:mt-24">
              <div className="flex flex-col  justify-start md:justify-end text-left md:text-right">
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

          <hr className="mt-5" />
          <div className="flex flex-col md:flex-row py-5 gap-10 md:gap-28  md:items-center">
            <div className="flex gap-24 md:gap-20">
              <div className="flex flex-col">
                <span className="text-sm font-medium font-montserrat">
                  Vehicle
                </span>
                <span className="text-sm font-light font-montserrat">
                  2009 MAZDA CX-9
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium font-montserrat">
                  Reg.No
                </span>
                <span className="text-sm font-light font-montserrat">
                  YAB22DD
                </span>
              </div>
            </div>

            <div className="flex gap-28">
              <div className="flex flex-col  w-[50%]">
                <span className="text-sm font-medium font-montserrat">
                  Mileage
                </span>
                <span className="text-sm font-light font-montserrat">
                  N/A miles
                </span>
              </div>
              <div className="flex flex-col  w-[50%]">
                <span className="text-sm font-medium font-montserrat">VIN</span>
                <span className="text-sm font-light font-montserrat">
                  JVSN30873DGTSE
                </span>
              </div>
            </div>
          </div>
          <hr />

          <div className="mt-10" style={{ overflowX: "scroll" }}>
            <table border={1} style={{ borderRadius: 20, overflow: "clip" }}>
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

          <div className="flex flex-col md:flex-row gap-0 md:gap-5 mt-5">
            <div className="border-[1px] mt-5 cursor-pointer py-4 border-[#CACACA] gap-3 px-10  rounded-[20px] flex items-center">
              <img
                src={documentdownload}
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="text-[11px] font-montserrat font-semibold">
                Download PDF
              </span>
            </div>
            <div className="border-[1px] cursor-pointer mt-5 py-4 flex items-center gap-3 border-[#CACACA] px-10  rounded-[20px]">
              <img
                src={mingcutelinkfill}
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="text-[11px] font-montserrat font-semibold">
                Share Unique Link
              </span>
            </div>
            <div className="border-[1px] mt-5 py-4 cursor-pointer flex items-center gap-3 border-[#CACACA] px-10  rounded-[20px]">
              <img src={mdi_share} alt="" className="w-[24px] h-[24px]" />
              <span className="text-[11px] font-montserrat font-semibold">
                Share PDF
              </span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-16 mt-10">
            <div className="flex flex-col">
              <span className="text-sm">Account Name</span>
              <span className="text-sm font-light font-montserrat">
                David James
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Bank Name</span>
              <span className="text-sm font-light font-montserrat">
                Guaranty Trust Bank
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Account Number</span>
              <span className="text-sm font-light font-montserrat">
                0594546546
              </span>
            </div>
          </div>

          <hr className="mt-10" />
          <div className="flex flex-col mt-10">
            <span className="text-sm font-medium font-montserrat">
              Terms and Conditions
            </span>
            <p className="text-xs font-light font-montserrat">
              Lorem ipsum dolor sit amet consectetur. Imperdiet malesuada ipsum
              vehicula dui vel. At ultrices eu felis ultricies quis mattis a
              quis. Duis commodo venenatis eget est pellentesque. Quis dui magna
              posuere sem. Enim adipiscing vel nisi senectus varius lectus
              molestie purus. Diam erat porttitor egestas potenti. Auctor
              commodo dolor duis enim sed congue congue vel. Aliquet cras et
              blandit sit molestie nulla. Convallis cras odio interdum dolor nam
              in volutpat tincidunt. Faucibus ultrices nec cursus quam ornare
              enim sit quam.
            </p>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default EstimateDetailsModal;
