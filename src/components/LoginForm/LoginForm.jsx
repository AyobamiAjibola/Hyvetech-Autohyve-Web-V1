import React, { useState } from "react";
import AppInput from "../AppInput/AppInput";
import { Link, useNavigate } from "react-router-dom";
import AppBtn from "../AppBtn/AppBtn";
import User from "../../assets/svgs/user.svg";
import Lock from "../../assets/svgs/lock.svg";
import Eye from "../../assets/svgs/eye.svg";
import ResetPasswordModal from "../modals/ResetPasswordModal";

import AuthenticationHeader from "../AuthenticationHeader/AuthenticationHeader";
import AppModal from "../modals/AppModal/AppModal";
import OtpModal from "../modals/OtpModal";

const LoginForm = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openReset, setOpenReset] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full items-center mt-28 px-10 md:px-28 justify-center">
        <div style={{ maxWidth: 600, width: "100%" }}>
          <AuthenticationHeader
            title="Sign in to AutoHyve"
            classNameTitle="mb-3"
            subTitle="Enter your AutoHyve account information below to log into your
            account"
          />

          <div className="mb-5 mt-10">
            <AppInput placeholder={"Your Email"} leftImg={User} />
          </div>
          <div className="w-full">
            <AppInput rightImg={Eye} placeholder={"Password"} leftImg={Lock} />
            <div className="justify-end  flex">
              <p
                onClick={() => setOpenModal(true)}
                className="text-[14px] italic font-montserrat font-extralight relative mt-5 text-[#A5A5A5] cursor-pointer"
              >
                Forgot Password?
              </p>
            </div>
          </div>

          <AppBtn
            onClick={() => navigate("/dashboard")}
            title="Log in"
            className=" w-full bg-[#FAA21B] mt-8 text-black "
            titleClassName="font-medium"
          />

          <p to="/register" className=" mt-5 font-montserrat text-[14px]">
            Don’t have an account?{" "}
            <b onClick={() => navigate("/register")} className="cursor-pointer">
              Sign up
            </b>
          </p>
        </div>
      </div>

      <AppModal open={openModal} setOpen={setOpenModal}>
        <ResetPasswordModal
          setOpenModal={setOpenModal}
          setOpenReset={setOpenReset}
        />
      </AppModal>

      <AppModal open={openReset} setOpen={setOpenReset}>
        <OtpModal openReset={openReset} setOpenReset={setOpenReset} />
      </AppModal>
    </>
  );
};

export default LoginForm;
