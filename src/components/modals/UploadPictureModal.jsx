import React, { useEffect, useState } from "react";
import "./modal.css";
import AppInput from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import profilePicx from "../../assets/images/profilePicx.png";
import AppBtn from "../AppBtn/AppBtn";
import OtpModal from "./OtpModal";

export default function UploadPictureModal({ setOpenProfile, opneProfile }) {
  if (opneProfile) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setOpenProfile(!opneProfile);
    }
  };

  return (
    <>
      {opneProfile && (
        <div
          className="overlay h-screen w-screen flex  fixed justify-center items-center"
          onClick={toggleModal}
        >
          <div className=" bg-white w-[90%] md:w-[30%] rounded-md py-8 px-20">
            <div className="modal-header bg-white p-8 py-2 relative">
              <button
                onClick={() => setOpenProfile(!opneProfile)}
                className="flex justify-end w-full absolute  -top-3 -right-12 md:-right-10"
              >
                <img src={CloseIcon} alt="" />
              </button>

              {/* <div>
                <h5 className="text-center heading-five">Transfer Fund</h5>
              </div> */}
            </div>

            <div className="flex justify-center items-center flex-col">
              <h2 className="font-montserrat font-bold text-sm">
                Edit your profile Image
              </h2>

              <img
                src={profilePicx}
                alt=""
                className="w-[100px] h-[100px] rounded-[50%] mt-5"
              />

              <div className="flex justify-between gap-5 mt-5">
                <AppBtn
                  className="text-[#000] w-[100px] border-[1px] bg-white border-[#D9D9D9] mt-1 font-medium"
                  title="CLEAR"
                />
                <AppBtn
                  className=" bg-[#FAA21B] w-[100px] text-[#000] "
                  title="UPLOAD"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
