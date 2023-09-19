import React, { useEffect, useState } from "react";
import "./modal.css";
import AppInput from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpModal from "./OtpModal";
import AppModal from "./AppModal/AppModal";

export default function ResetPasswordModal({ setOpenModal, setOpenReset }) {
  const [openOtp, setOpenOtp] = useState(false);

  return (
    <>
      <div className=" w-[96%] md:w-[40%] rounded-xl bg-white py-8 px-10 reset-pword">
        <div className="modal-header bg-white p-8 py-2 relative">
          <button
            onClick={() => setOpenModal(false)}
            className="flex justify-end w-full absolute  -top-4 right-0 md:right-2"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="font-montserrat font-bold text-[20px]">
            Reset your password
          </h2>
          <span className="text-[14px] text-center font-light font-montserrat inline-block mb-3 md:mb-[43px]">
            Enter your email address below and we will send you an OTP to reset
            your password
          </span>

          <div className="w-full">
            <AppInput
              placeholderTop="Email"
              placeholder="Enter your email"
              className="h-14"
              hasPLaceHolder={true}
              title="Email"
            />
          </div>

          <AppBtn
            title="GET RESET OTP"
            className="text-[#000] w-full bg-[#FAA21B]  mt-10"
            titleClassName="font-semibold"
            onClick={() => {
              setOpenReset(true);
              setOpenModal(false);
            }}
          />
        </div>
      </div>

      {/* <OtpModal openOtp={openOtp} setOpenOtp={setOpenOtp} /> */}
    </>
  );
}
