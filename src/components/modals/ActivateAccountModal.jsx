import React from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import UploadBox from "../UploadBox/UploadBox";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const ActivateAccountModal = ({ modal = false, activation, setModal }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    py: 5,
    // pr: 8,
    // pl: 8,
  };

  const handleClose = () => setModal(false);

  return (
    <>
      <Modal
        open={modal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src={CloseIcon}
            alt=""
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => setModal(false)}
          />
          <div className="">
            <div className=" flex flex-col mt-4 justify-center items-center px-4 md:px-10">
              <div className="text-center mb-8 mt-5">
                <h5 className="font-semibold font-montserrat">
                  Activate Account
                </h5>
                <p className="text-[14px] font-extralight font-montserrat leading-5">
                  Provide the information below to activate your account. Thank
                  you!
                </p>
              </div>
              <div className="w-full mb-5">
                <AppInput
                  hasPLaceHolder={true}
                  placeholder="Enter business name"
                  placeholderTop="Business Name"
                  className="bg-[#F5F5F5]"
                />
              </div>

              <UploadBox title="Valid Identity Card (Front)" />
              <UploadBox title="Valid Identity Card (Back)" />
              <UploadBox title="CAC Document" />
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholder="Enter NIN"
                  placeholderTop="National Identity Number(NIN)"
                  className="bg-[#F5F5F5] mb-5"
                />
              </div>
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholder="Enter BVN"
                  placeholderTop="BVN"
                  className="bg-[#F5F5F5]"
                />
              </div>

              <AppBtn
                title="Activate"
                className="bg-[#FAA21B] text-[#000] w-full my-5"
                onClick={() => activation()}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ActivateAccountModal;
