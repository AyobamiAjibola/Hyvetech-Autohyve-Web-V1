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
import SearchInput from "../SearchInput/SearchInput";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import AddNewBeneficiaryModal from "./AddNewBeneficiaryModal";
import AddnewExpnesesType from "./AddnewExpnesesType";
import CustomDate from "../CustomDate/CustomDate";

const AddNewExpensesModal = ({ newExpenses, setNewExpenses }) => {
  const node = useRef();
  const [openStart, setOpenStart] = useState(false);
  const [newExpensesType, setNewExpensesType] = useState(false);

  const [openNewBeneficiary, setOpenNewBeneficiary] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 900 : "95%",

    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => setNewExpenses(false);

  const invoiceData = ["INV-123456/David Nelson/2014 ", "Toyota 4Runner"];
  const expenseType = ["Parts", "Labour", "Transport"];
  const expenseCategory = [
    "Direct/Billable Cost",
    "Indirect/Non-Billable Cost",
    "Overhead",
    "Others",
  ];

  return (
    <>
      <Modal
        open={newExpenses}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 bg-white ">
            <div className="flex justify-between w-full">
              <ModalHeaderTitle title="Add New Expenses" />

              <button onClick={() => setNewExpenses(!newExpenses)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="w-[100%] md:w-[80%] mt-10">
              <SearchInput placeholder="Search beneficiary by First name, Last Name" />
            </div>

            <div className="mt-5 md:mt-8 gap-8 flex-col justify-center">
              <div className="flex gap-5 md:gap-36 items-center md:flex-row flex-col justify-between">
                <div className="w-[100%] md:w-[47%]">
                  <InputHeader text="Date" />
                  <CustomDate />
                </div>
                <div className="flex h-[100%] w-[100%] md:w-[30%] mt-5 gap-3">
                  <AppTabBtn
                    icon={<AiOutlinePlus />}
                    title="Add New Beneficiary"
                    className=" text-[#000] btn-secondary flex-1"
                    onClick={() => setOpenNewBeneficiary(true)}
                  />
                </div>
              </div>

              <div className=" w-full md:flex-row flex-col flex items-center gap-5 md:gap-10 mt-10">
                <div className="w-full">
                  <AppDropDown
                    title="Expense Category"
                    data={expenseCategory}
                    placeholder="Select Expense Category"
                    dropDownClass="h-[80px]"
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Amount"
                    placeholder="Labels"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>

              <div className=" w-full md:flex-row flex-col flex items-center gap-5 md:gap-10 mt-3 md:mt-8">
                <div className="w-full mt-4">
                  <AppDropDown
                    title="Expenses Type/Name"
                    data={expenseType}
                    placeholder="Select Expense Type"
                    dropDownClass="h-[80px]"
                  />
                  <span
                    className="text-[#FAA21B] cursor-pointer"
                    onClick={() => setNewExpensesType(true)}
                  >
                    <InputHeader text="Add service item" />
                  </span>
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Payment Reference "
                    placeholder="Labels"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col mt-8">
                <AppDropDown
                  title="Invoice"
                  data={invoiceData}
                  placeholder="Select Invoice"
                  dropDownClass="h-[80px]"
                />
                <div className="flex justify-end items-end w-[100%] mt-5">
                  <div className="w-[50%] md:w-[30%] flex">
                    <AppTabBtn
                      icon={<AiOutlinePlus />}
                      title="Generate Items"
                      className=" text-[#000] btn-secondary flex-1"
                      //   onClick={() => setNewExpenses(true)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <CustomTextArea topTitle="Notes/Remarks" placeholder="Note" />
              </div>
            </div>
          </div>

          <div className=" flex gap-4 mt-8 justify-center md:justify-start items-center px-4 md:px-10">
            <AppBtn
              title="CREATE"
              className="font-medium w-[90%] md:w-[100px]"
            />
          </div>
        </Box>
      </Modal>

      <AddNewBeneficiaryModal
        openNewBeneficiary={openNewBeneficiary}
        setOpenNewBeneficiary={setOpenNewBeneficiary}
      />
      <AddnewExpnesesType
        newExpensesType={newExpensesType}
        setNewExpensesType={setNewExpensesType}
      />
    </>
  );
};

export default AddNewExpensesModal;
