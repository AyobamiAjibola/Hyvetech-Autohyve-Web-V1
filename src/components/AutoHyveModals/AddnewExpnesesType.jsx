import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { FaCalendarAlt } from "react-icons/fa";
import SingleAppCalender from "../AppCalender/SingleAppCalender";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import SearchInput from "../SearchInput/SearchInput";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import AddNewBeneficiaryModal from "../modals/AddNewBeneficiaryModal";

const AddnewExpnesesType = ({ newExpensesType, setNewExpensesType }) => {
  const node = useRef();
  const [openStart, setOpenStart] = useState(false);
  const [openNewBeneficiary, setOpenNewBeneficiary] = useState(false);
  const [calender, setCalender] = useState("");
  const handleClickOutside = (e) => {
    if (node.current && !node.current.contains(e.target)) {
      setNewExpensesType(false);
    }
  };

  useEffect(() => {
    if (newExpensesType) {
      document.addEventListener("mousedown", handleClickOutside);
      return;
    }
  }, [newExpensesType]);

  useEffect(() => {
    if (newExpensesType) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [newExpensesType]);

  return (
    <>
      {newExpensesType && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div
            ref={node}
            className="rounded-2xl md:w-[50%] w-[90%] h-auto overflow-y-auto bg-white py-8 px-3"
          >
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-between w-full">
                <ModalHeaderTitle title="Add New Expenses Type" />

                <button onClick={() => setNewExpensesType(!newExpensesType)}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="mt-8 gap-8 flex-col justify-center">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Expense Type"
                    placeholder="Labels"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>
            </div>

            <div className=" flex gap-4 mt-8 justify-center md:justify-start items-center px-4 md:px-10">
              <AppBtn
                title="SAVE"
                className="font-medium w-[90%] md:w-[100px]"
              />
            </div>
          </div>
        </div>
      )}

      <AddNewBeneficiaryModal
        openNewBeneficiary={openNewBeneficiary}
        setOpenNewBeneficiary={setOpenNewBeneficiary}
      />
    </>
  );
};

export default AddnewExpnesesType;
