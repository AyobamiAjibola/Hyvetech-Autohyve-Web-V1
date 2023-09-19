import React, { useEffect, useState } from "react";
import "./modal.css";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpInput from "react-otp-input";
import NewPassword from "./NewPassword";

export default function SelectRoleModal({}) {
  const [otp, setOtp] = useState("");
  const [newPasswordModal, setNewPasswordModal] = useState(false);
  if (openOtp) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setOpenOtp(!openOtp);
    }
  };

  return (
    <>
      {openOtp && (
        <div
          id="modalWrapperId"
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          onClick={toggleModal}
        >
          <div className="modal bg-white py-8 px-20 ">
            <div className="modal-header bg-white p-8 py-2 relative">
              <button
                onClick={() => setOpenOtp(false)}
                className="flex justify-end w-full absolute  -top-3 right-3 md:-right-10"
              >
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h2 className="font-montserrat font-bold text-[20px]">
                {headerTitle}
              </h2>
              <span className="text-[14px] text-center font-light font-montserrat inline-block mb-[43px]">
                {subHeader}
              </span>

              <div className="w-full mb-10 ">
                <div className="otp-inputs flex justify-center items-center gap-4">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span className="mr-3"> </span>}
                    // renderInput={(props) => <input {...props} />}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
              </div>

              {headerTitle === "Reset AutoHyve Password" ? (
                <AppBtn
                  title="CONFIRM OTP"
                  onClick={() => {
                    setNewPasswordModal(!newPasswordModal);
                    setOpenOtp(!openOtp);
                  }}
                  className="text-[#000] font-medium bg-[#FAA21B] mt-1"
                />
              ) : (
                <AppBtn
                  title="CONFIRM OTP"
                  className="text-[#000] font-medium bg-[#FAA21B] mt-1"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
