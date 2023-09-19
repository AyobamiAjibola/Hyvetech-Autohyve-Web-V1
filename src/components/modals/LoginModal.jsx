import React, { useEffect, useState } from "react";
import "./modal.css";
import AppInput from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";

import User from "../../assets/svgs/user.svg";
import Lock from "../../assets/svgs/lock.svg";
import Eye from "../../assets/svgs/eye.svg";
import { Link, useNavigate } from "react-router-dom";
import ResetPasswordModal from "./ResetPasswordModal";

export default function LoginModal({ modal, setModal }) {
  const [openModal, setOpenModal] = useState(false);

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = () => {
    setModal(!modal);
  };

  const navigate = useNavigate();

  return (
    <>
      {modal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          onClick={toggleModal}
        >
          <div className="modal bg-white py-8 px-20 ">
            <div className="modal-header bg-white p-8 py-2 relative">
              <div className="flex justify-end w-full absolute  -top-3 md:right-0 right-3">
                <button onClick={toggleModal}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>
              {/* <div>
                <h5 className="text-center heading-five">Transfer Fund</h5>
              </div> */}
            </div>

            <div className="flex flex-col items-center justify-center">
              <h2 className="font-montserrat  text-4xl font-medium">
                Sign in with HyveCloud
              </h2>
              <span className="text-[14px] font-light font-montserrat inline-block mb-[43px]">
                Kindly enter a new password for your HyveCloud Account
              </span>
              <AppInput leftImg={User} />
              <div className="w-full">
                <AppInput rightImg={Eye} leftImg={Lock} />
                <div className="justify-end  flex">
                  <div
                    onClick={() => setOpenModal(true)}
                    href="#"
                    className="text-[14px] italic font-montserrat font-extralight relative -mt-5 text-[#A5A5A5] cursor-pointer"
                  >
                    Forgot Password?
                  </div>
                </div>
              </div>

              <AppBtn
                title="Log in"
                className="text-[#000] w-full bg-[#FAA21B] mt-8"
                onClick={() => navigate("/dashboard")}
              />

              <Link
                to="/register"
                className="text-link mt-5 font-montserrat text-[14px]"
              >
                Don’t have an account? <b>Sign up</b>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* <ResetPasswordModal setOpenModal={setOpenModal} openModal={openModal} /> */}
    </>
  );
}
