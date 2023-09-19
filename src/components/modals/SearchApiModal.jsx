import React, { useEffect, useState } from "react";
import "./modal.css";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpInput from "react-otp-input";
import NewPassword from "./NewPassword";
import AppInput from "../AppInput/AppInput";

export default function SearchApiModal({ apiModal, setOpenApiModal }) {
  if (apiModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setOpenApiModal(!apiModal);
    }
  };

  return (
    <>
      {apiModal && (
        <div
          id="modalWrapperId"
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          onClick={toggleModal}
        >
          <div className=" rounded-md w-[28%] bg-white py-8 px-10 ">
            <div className="modal-header bg-white p-8 py-2 relative">
              {/* <button
                onClick={() => setOpenApiModal(false)}
                className="flex justify-end w-full absolute  -top-3 right-3 md:right-2"
              >
                <img src={CloseIcon} alt="" />
              </button> */}
            </div>

            <div className="flex flex-col items-center justify-center">
              <h2 className="font-montserrat font-bold text-[16px]">
                Paste an API key to search a  brand make
              </h2>

              <div className="w-full mb-5 mt-5 ">
                <AppInput
                  placeholder="Enter API key"
                  className="bg-[#F5F5F5] border-[#F5F5F5]"
                />
              </div>

              <AppBtn
                title="SEARCH"
                className="text-[#000] font-medium bg-[#FAA21B] mt-1"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
