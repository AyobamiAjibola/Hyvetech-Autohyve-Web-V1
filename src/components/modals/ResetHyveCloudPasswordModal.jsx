import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppInput from "../AppInput/AppInput";
import AppBtn from "../AppBtn/AppBtn";
import OtpModal from "./OtpModal";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { clearSendPasswordResetTokenStatus } from "../../store/reducers/authenticationReducer";
import { showMessage } from "../../helpers/notification";
import { sendPasswordResetTokenAction } from "../../store/actions/authenicationActions";

const ResetHyveCloudPasswordModal = ({
  openResetPassword,
  setOpenResetPassword,
  setOpenHyveLogin,
}) => {
  const handleClose = () => setOpenResetPassword(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [openOtp, setOpenOtp] = useState(false);
  const state = useAppSelector(state => state.authenticationReducer)
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");

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

  const handleResetPassword = () => {
    dispatch(sendPasswordResetTokenAction({
      email
    }))
  };

  useEffect(() => {
    if(state.sendPasswordResetTokenStatus === "completed") {
      setOpenOtp(true);
      setOpenResetPassword(false);
      setOpenHyveLogin(false);
      showMessage(
        "Reset password",
        state.sendPasswordResetTokenSuccess,
        "success"
      )
    } else if(state.sendPasswordResetTokenStatus === "failed") {
      showMessage(
        "Reset password",
        state.sendPasswordResetTokenError,
        "error"
      )
    }

    return () => {
      dispatch(clearSendPasswordResetTokenStatus())
    }
  },[state.sendPasswordResetTokenStatus]);

  return (
    <>
      <Modal
        open={openResetPassword}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={() => setOpenResetPassword(false)}
            className="absolute right-10 top-5"
          >
            <img src={CloseIcon} alt="" />
          </button>

          <div className="flex flex-col py-5 md:py-10 px-0 md:px-16 items-center justify-center">
            <h2 className="text-base font-montserrat font-semibold">
              Reset your password
            </h2>
            <span className="text-xs mt-2 font-montserrat text-center mb-5 w-[300px]">
              Enter your email address below and we will send you an OTP to
              reset your password
            </span>

            <div className="w-full">
              <AppInput
                placeholderTop="Email"
                placeholder="Enter your email"
                className="h-14"
                hasPLaceHolder={true}
                title="Email"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>

            <AppBtn
              title="GET RESET OTP"
              className="text-[#000] w-full bg-[#FAA21B]  mt-10"
              titleClassName="font-semibold"
              onClick={handleResetPassword}
              spinner={state.sendPasswordResetTokenStatus === 'loading'}
            />
          </div>
        </Box>
      </Modal>
      <OtpModal openOtp={openOtp} setOpenOtp={setOpenOtp} />
    </>
  );
};

export default ResetHyveCloudPasswordModal;
