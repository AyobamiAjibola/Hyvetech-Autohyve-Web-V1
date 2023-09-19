import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AppDropDown from "../AppDropDown/AppDropDown";
import Select from "react-select";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { customStyles } from "../../contsants/customStyles";
import { stateLga } from "../../contsants/states";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";

const AdditionalContentModal = ({
  openAdditionalContact,
  setOpenAdditionalContact,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 400,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    py: 5,
    pr: 8,
    pl: 8,
  };

  const handleClose = () => setOpenAdditionalContact(false);

  return (
    <>
      <Modal
        open={openAdditionalContact}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title="Add Aditional Customer" />

            <button onClick={() => setOpenAdditionalContact(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="mt-8 flex gap-8 flex-col justify-center">
            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="First Name"
                  placeholder="Enter alternative first name"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>

              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Last Name"
                  placeholder="Enter alternative last name"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Phone Number"
                  placeholder="Enter alternative phone number"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>

              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Email"
                  placeholder="Enter alternative phone email"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>
          </div>

          {/* view */}
          <div className=" flex gap-4 mt-8 justify-center md:justify-end items-center">
            <AppBtn
              title="SUBMIT"
              className="font-medium w-[90%] md:w-[100px] "
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AdditionalContentModal;
