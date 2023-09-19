import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";

import Eye from "../../assets/svgs/eye.svg";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { FaCalendarAlt } from "react-icons/fa";
import SingleAppCalender from "../AppCalender/SingleAppCalender";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import SearchInput from "../SearchInput/SearchInput";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";

const AddNewBeneficiaryModal = ({
  openNewBeneficiary,
  setOpenNewBeneficiary,
}) => {
  const node = useRef();
  const [openStart, setOpenStart] = useState(false);
  const [calender, setCalender] = useState("");
  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }

    setOpenNewBeneficiary(false);
  };

  useEffect(() => {
    if (openNewBeneficiary) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNewBeneficiary]);

  useEffect(() => {
    if (openNewBeneficiary) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openNewBeneficiary]);

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
      {openNewBeneficiary && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div
            ref={node}
            className="rounded-2xl md:w-[65%] w-[90%] h-auto overflow-y-auto bg-white py-8 px-3"
          >
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-between w-full">
                <ModalHeaderTitle title="Add New Benenficiary" />

                <button onClick={() => setOpenNewBeneficiary(false)}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="w-[80%] mt-10">
                <SearchInput placeholder="Search beneficiary by First name, Last Name" />
              </div>

              <div className="mt-8 gap-8 flex-col justify-center">
                <div className=" w-full flex items-center gap-10 mt-10">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Beneficiary Name"
                      placeholder="Labels"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Account Name"
                      placeholder="Labels"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className=" w-full flex items-center gap-10 mt-10">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Bank Name"
                      placeholder="Labels"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Bank Account Number"
                      placeholder="Labels"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col mt-8">
                  <AppDropDown
                    title="Invoice"
                    data={invoiceData}
                    placeholder="Type"
                    dropDownClass="h-[80px]"
                  />
                </div>
              </div>
            </div>

            <div className=" flex gap-4 mt-8 justify-center md:justify-start items-center px-4 md:px-10">
              <AppBtn
                title="Save"
                className="font-medium w-[90%] md:w-[100px]"
                //   onClick={() => setAddNewQuantity(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewBeneficiaryModal;
