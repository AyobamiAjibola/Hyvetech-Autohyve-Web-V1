import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TabBtn from "../TabBtn/TabBtn";
import DropDownHalf from "../DropDownHalf/DropDownHalf";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CustomDate from "../CustomDate/CustomDate";
import DeleteBox from "../DeleteBox/DeleteBox";

const AddPaymentModal = ({ openAddPayment, setOpenAddPayment }) => {
  const node = useRef();
  const [openStart, setOpenStart] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [calender, setCalender] = useState("");

  const tabsItems = ["Item Sold", "Invoice"];
  const paymentMode = ["Cash", "Transfer", "Check", "Payment link", "POS"];
  const types = ["label 1", "label 2"];

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "80%" : "95%",
    height: isSmallScreen ? 550 : 700,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => setOpenAddPayment(false);

  return (
    <>
      <Modal
        open={openAddPayment}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title=" Generate Payment" />

            <button onClick={() => setOpenAddPayment(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="flex gap-3 mt-5 border-[1px] w-[100%] md:w-[40%] rounded-[21px] p-1 border-[#CACACA]">
            {tabsItems.map((item, index) => {
              return (
                <TabBtn
                  title={item}
                  onClick={() => setActiveTab(index)}
                  key={index}
                  className={
                    activeTab === index
                      ? "btn-primary  w-[80%]"
                      : "btn-secondary w-[80%]"
                  }
                />
              );
            })}
          </div>

          {activeTab === 0 && (
            <>
              <div className=" w-[100%] md:border-[1px] rounded-3xl  flex mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                  Items Information
                </h5>
                <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                  <div className="w-full flex-col">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Item Description"
                      placeholder="Brake Pads (Front) [EBC124YG]"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                    <InputHeader
                      text=" Add New Item"
                      className="text-[#FAA21B] mt-3 hidden md:block"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Price (₦)"
                      placeholder="43,000.00"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                  <div className="w-full">
                    <DropDownHalf
                      title="Quantity"
                      placeholder="Pcs"
                      placeholderInput="5"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Amount Paid (₦)"
                      placeholder="215,000.00"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="mt-3 md:mt-7 flex justify-between">
                    <InputHeader
                      text=" Add New Item"
                      className="text-[#FAA21B] mt-3 block md:hidden"
                    />
                    <DeleteBox />
                  </div>
                </div>
              </div>
              <div className="flex md:flex-row justify-between flex-col">
                <div className="flex w-[100%] justify-start md:justify-end mt-8 order-2 md:order-2">
                  <AppBtn
                    title="Generate"
                    className="font-medium w-full md:w-[30%] h-12"
                  />
                </div>

                <div className="flex w-full relative mt-5 order-1 md:order-1">
                  <div className="mt-2 w-[100%] md:w-[80%]">
                    <CustomTextArea
                      topTitle="Notes/Remarks"
                      placeholder="Note"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <div className="w-[100%] md:w-[30%] mt-5">
                <AppDropDown
                  title="Select Invoice"
                  data={types}
                  placeholder="Labels"
                />
              </div>
              <div className=" w-[100%] md:border-[1px] rounded-3xl  flex mt-3 md:mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                  Customer Information
                </h5>
                <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="First Name"
                      placeholder="David"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Last Name"
                      placeholder="James"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="flex md:flex-row flex-col gap-5 mt-8">
                  <div className="flex-1">
                    <InputHeader text="Date of Invoice" />
                    <CustomDate />
                  </div>

                  <div className="flex-1">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Receipt #"
                      placeholder="DRC-64845206"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                  <div className="flex-1">
                    <AppDropDown
                      title="Mode of payment"
                      data={paymentMode}
                      placeholder="Labels"
                    />
                  </div>
                  <div className="flex-1">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Amount Paid (₦)"
                      placeholder="140,184.00"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start  md:justify-end mt-8">
                <AppBtn
                  title="Generate"
                  className="font-medium md:w-[15%] w-[100%]"
                />
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddPaymentModal;
