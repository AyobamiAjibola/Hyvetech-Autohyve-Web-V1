import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Select from "react-select";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { customStyles } from "../../contsants/customStyles";
import { stateLga } from "../../contsants/states";
import AdditionalContentModal from "./AdditionalContentModal";
import InputHeader from "../InputHeader/InputHeader";
import { FaCalendarAlt } from "react-icons/fa";

const GenerateEstimateModal = ({ showEstimate, setShowEstimate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const data = ["Individual", "Co-operate"];

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setShowEstimate(!showEstimate);
    }
  };

  return (
    <>
      {showEstimate && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
          id="modalWrapperId"
          onClick={toggleModal}
        >
          <div className="rounded-2xl md:w-[85%] w-[90%] h-[700px] md:h-[600px] overflow-y-auto bg-white py-8 px-3">
            <div className="modal-header pt-0 px-8">
              <div className="flex justify-between w-full">
                <h5 className="font-semibold w-60 font-montserrat">
                  Generate Estimates <br /> for David James
                </h5>
                <button onClick={() => setShowEstimate(false)}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="mt-5 flex gap-12">
                <span className="text-sm text-[#1C1C1C]">
                  Email: davidjames@gmail.com
                </span>
                <span className="text-sm text-[#1C1C1C]">
                  Phone Number: 081578457845
                </span>
                <span className="text-sm text-[#1C1C1C]">
                  Address: 23, alapere, Lagos, Nigeria
                </span>
              </div>

              <div className="mt-10 w-[30%]">
                <InputHeader text="Date of Invoice" />
                <div className="bg-[#F5F5F5] flex p-3 rounded-xl items-center justify-between">
                  <span className="text-sm text-[#A5A5A5]"> DD/MM/YY</span>
                  <FaCalendarAlt color="#A5A5A5" />
                </div>
              </div>

              <div className=" w-[100%] md:border-[1px] rounded-3xl py-3 flex mt-8  px-0 md:px-5 flex-col pb-20  md:border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                  Customer Information
                </h5>
                <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="First Name"
                      placeholder="Enter First name"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Last Name"
                      placeholder="Enter last name"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="w-[50%] mt-5">
                  <AppInputWithPhone
                    hasPLaceHolder={true}
                    placeholder="Phone Number"
                    placeholderTop="Phone Number"
                  />
                </div>

                <div className="flex gap-5 mt-3">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Vehicle Identification Number"
                      placeholder="Enter Vin"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Model Year"
                      placeholder="Enter model year"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Make"
                      placeholder="Enter vehicle make"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Model"
                      placeholder="Enter vehicle Model"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row  mt-5  gap-5 w-[50%]">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Plate Number"
                      placeholder="Enter vehicle plate number"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>{" "}
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Mileage Value"
                      placeholder="Enter vehicle make"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* view */}
            {/* <div className=" relative  flex gap-4 mt-0 justify-center md:justify-end items-center px-4 md:px-10">
              <AppBtn
                title="SUBMIT"
                className="font-medium w-[90%] md:w-[100px] "
              />
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateEstimateModal;
