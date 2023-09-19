import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import User from "../../assets/svgs/user.svg";
import Lock from "../../assets/svgs/lock.svg";
import Eye from "../../assets/svgs/eye.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppInput from "../AppInput/AppInput";
import AppBtn from "../AppBtn/AppBtn";
import InputHeader from "../InputHeader/InputHeader";
import { useNavigate } from "react-router-dom";
import ResetHyveCloudPasswordModal from "./ResetHyveCloudPasswordModal";

const SignHyveModal = ({
  openHyveLogin,
  setOpenHyveLogin,
  title,
  subTitle,
  buttonTitle,
}) => {
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const navigate = useNavigate();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "40%" : "95%",
    // height: 400,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    py: 5,
    pr: isSmallScreen ? 8 : 3,
    pl: isSmallScreen ? 8 : 3,
  };

  const handleClose = () => setOpenHyveLogin(false);

  return (
    <>
      <Modal
        open={openHyveLogin}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button
            onClick={() => setOpenHyveLogin(false)}
            className="absolute right-10 top-5"
          >
            <img src={CloseIcon} alt="" />
          </button>

          <div className="w-full mt-5 justify-center items-center flex flex-col">
            <h3 className="text-base font-montserrat font-semibold">{title}</h3>
            <p className="text-xs mt-2 font-montserrat text-center">
              {subTitle}
            </p>
          </div>
          <div className="flex flex-col gap-5 mt-10">
            <AppInput placeholder={"Your HyveCloud Email"} leftImg={User} />
            <div className="flex flex-col justify-end items-end">
              <AppInput
                rightImg={Eye}
                placeholder={"Your HyveCloud Password"}
                leftImg={Lock}
              />
              <span
                onClick={() => setOpenResetPassword(true)}
                className="text-xs font-montserrat italic inline-block cursor-pointer mt-3 A text-[#A5A5A5]"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          <AppBtn
            title={buttonTitle}
            titleClassName="text-2xl text-[#000]"
            className="w-full mt-8"
            showIcon={false}
            onClick={() => navigate("/dashboard")}
          />
          <div className="w-[100%] flex items-center justify-center mt-5">
            <span className="text-sm text-[#6C6C6C] text-center inline-block font-montserrat">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="font-semibold cursor-pointer"
              >
                Sign up
              </span>
            </span>
          </div>
        </Box>
      </Modal>

      <ResetHyveCloudPasswordModal
        openResetPassword={openResetPassword}
        setOpenResetPassword={setOpenResetPassword}
        setOpenHyveLogin={setOpenHyveLogin}
      />
    </>
  );
};

export default SignHyveModal;
