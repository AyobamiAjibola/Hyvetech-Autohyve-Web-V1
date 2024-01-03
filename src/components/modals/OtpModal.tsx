import React, { useEffect, useState } from "react";
import "./modal.css";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpInput from "react-otp-input";
import NewPassword from "./NewPassword";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { resetTokenAction, sendPasswordResetTokenAction } from "../../store/actions/authenicationActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import NewPinResetModal from "./NewPinResetModal";
import { showMessage } from "../../helpers/notification";
import { clearResetTokenStatus, clearSendPasswordResetTokenStatus } from "../../store/reducers/authenticationReducer";

interface IProps {
  openOtp: any;
  setOpenOtp: any;
  openReset?: any;
  setOpenReset?: any;
  subHeader?: string;
  pin?: boolean;
  email?: string;
}

export default function OtpModal({
  openOtp,
  setOpenOtp,
  subHeader = "We sent you an OTP, check your email address and provide the code", email
}: IProps) {
  const [otp, setOtp] = useState("");
  const [newPasswordModal, setNewPasswordModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.authenticationReducer);
  const [changePin, setChangePin] = useState<boolean>(false);

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
      email: email ? email : sessionStorage.getItem('emailReset')
    }))
  };

  const handleOtp = () => {
    if(otp.length === 4) {
      dispatch(
        resetTokenAction({
          email: email ? email : sessionStorage.getItem('emailReset'),
          token: otp
        })
      );
    }
  };

  useEffect(() => {
    if(state.sendPasswordResetTokenStatus === "completed") {
      showMessage(
        "Reset password",
        state.sendPasswordResetTokenSuccess,
        "success"
      )
      dispatch(clearSendPasswordResetTokenStatus())
    } else if(state.sendPasswordResetTokenStatus === "failed") {
      showMessage(
        "Reset password",
        state.sendPasswordResetTokenError,
        "error"
      )
      dispatch(clearSendPasswordResetTokenStatus())
    }
  },[state.sendPasswordResetTokenStatus]);

  useEffect(() => {
    if(state.resetTokenStatus === 'completed') {
      setOpenOtp(false);
      setNewPasswordModal(true)
      setOtp('')
      dispatch(clearResetTokenStatus())
    } else if (state.resetTokenStatus === 'failed') {
      showMessage(
        "Password reset",
        state.resetTokenError,
        "error"
      )
      dispatch(clearResetTokenStatus())
    }
  },[state.resetTokenStatus]);

  return (
    <>
      <Modal
        open={openOtp}
        // onClose={handleClose}
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

              <span
                className="text-[10px] mt-8 ml-3 font-bold font-montserrat text-[#FAA21B] cursor-pointer flex justify-center items-center"
                onClick={() => handleResetPassword()}
              >
                Resend Token
              </span>
            </div>

            <AppBtn
              title="CONFIRM"
              onClick={handleOtp}
              className="text-[#000] font-medium bg-[#FAA21B] mt-1"
              spinner={state.sendPasswordResetTokenStatus === 'loading' || state.resetTokenStatus === 'loading'}
            />
          </div>
        </Box>
      </Modal>

      <NewPassword
        newPasswordModal={newPasswordModal}
        setNewPasswordModal={setNewPasswordModal}
        otp={otp}
        email={email}
      />

      <NewPinResetModal
        setChangePin={setChangePin}
        changePin={changePin}
        otp={otp}
      />
    </>
  );
}

