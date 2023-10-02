import React, { useEffect, useState } from "react";
import "./modal.css";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpInput from "react-otp-input";
import NewPassword from "./NewPassword";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NewPasswordModal from "./NewPasswordModal";
import { Button, Typography } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function OtpModal({
  openOtp,
  setOpenOtp,
  openReset,
  setOpenReset,
  headerTitle = "Confirm OTP",
  subHeader = " We sent you an OTP, check your email address and provide the code",
}) {
  const [otp, setOtp] = useState("");
  const [newPasswordModal, setNewPasswordModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const handleClose = () => setOpenOtp(false);
  if (openReset) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "40%" : "95%",
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "20px" : "40px",
  };

  return (
    <>
      <Modal
        open={openOtp}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header bg-white p-8 py-2 relative mt-4">
            <button
              onClick={() => setOpenOtp(false)}
              className="flex justify-end w-full absolute  -top-5 right-1 md:right-3"
            >
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h2 className="text-base font-montserrat font-semibold">
              Reset AutoHyve Password
            </h2>
            {/* <ModalHeaderTitle title="Reset AutoHyve Password" /> */}

            <span className="text-xs text-center font-light font-montserrat inline-block mb-[43px]">
              {subHeader}
            </span>

            <div className="w-full mb-5 ">
              <div className="otp-inputs flex justify-center items-center gap-4">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderSeparator={<span className="mr-3"> </span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
            </div>

            <AppBtn
              title="CONFIRM"
              onClick={() => {
                setNewPasswordModal(!newPasswordModal);
                setOpenOtp(!openOtp);
              }}
              className="text-[#000] font-medium bg-[#FAA21B] mt-1"
            />
          </div>
        </Box>
      </Modal>

      <NewPassword
        newPasswordModal={newPasswordModal}
        setNewPasswordModal={setNewPasswordModal}
        otp={otp}
      />
    </>
  );
}

