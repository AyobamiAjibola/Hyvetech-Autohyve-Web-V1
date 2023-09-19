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
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CustomDate from "../CustomDate/CustomDate";
import DeleteBox from "../DeleteBox/DeleteBox";

const ExpensesDetailsModal = ({
  expenseDetailmodal,
  setExpenseDetailmodal,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 800 : "95%",
    height: 600,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => setExpenseDetailmodal(false);

  return (
    <>
      <Modal
        open={expenseDetailmodal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title="Summary EXP-530003" />

            <button onClick={() => setExpenseDetailmodal(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col mt-5">
            <h3 className="text-lg text-[#494949] font-semibold font-montserrat">
              Vendor 2
            </h3>
            <span className="text-base font-montserrat">0000000000000</span>
            <span className="text-base font-montserrat">Access Bank</span>
          </div>

          <div className="mt-10 w-[100%] md:w-[47%]">
            <InputHeader text="Date" />
            <CustomDate className="w-[40%]" />
          </div>
          <div className="flex md:flex-row flex-col items-start   md:items-center mt-5 gap-5">
            <div className="md:flex-1 w-full">
              <AppInput
                hasPLaceHolder={true}
                placeholderTop="Expenses Category"
                placeholder="I’ve been typed"
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>

            <div className="md:flex-1 w-full">
              <AppInput
                hasPLaceHolder={true}
                placeholderTop="Amount"
                placeholder="I’ve been typed"
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row mt-5 gap-5">
            <div className="md:flex-1 w-full">
              <AppInput
                hasPLaceHolder={true}
                placeholderTop="Expense Type/Name"
                placeholder="I’ve been typed"
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>

            <div className="md:flex-1 w-full">
              <AppInput
                hasPLaceHolder={true}
                placeholderTop="Payment Reference"
                placeholder="I’ve been typed"
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
          </div>
          <div className="flex-1 mt-5">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Invoice"
              placeholder="I’ve been typed"
              className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
            />
          </div>

          <div className="mt-5">
            <CustomTextArea topTitle="Notes/Remarks" placeholder="Note" />
          </div>

          <div className="flex md:flex-row flex-col  mt-8 gap-5">
            <AppBtn title="EDIT" className="btn-secondary" />
            <AppBtn title="SAVE" />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ExpensesDetailsModal;
