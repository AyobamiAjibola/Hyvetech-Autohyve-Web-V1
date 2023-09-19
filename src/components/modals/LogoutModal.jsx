import React, { useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({ logoutModal, setLogoutModal }) => {
  const navigate = useNavigate();
  if (logoutModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      {logoutModal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className="md:w-[30%] w-[90%] rounded-md bg-white py-5 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full mb-5">
                <button onClick={() => setLogoutModal()}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="flex flex-col justify-center">
                <h5 className="text-center text-[10px] md:text-sm font-medium font-montserrat">
                  {/* {description} */}
                  Are you sure you want to logout <br /> from your account
                </h5>
              </div>
            </div>

            {/* view */}

            <div className=" flex gap-4 mt-5 justify-center items-center px-4 md:px-10">
              <AppBtn
                title="CANCEL"
                className="btn-secondary"
                onClick={() => setLogoutModal(false)}
              />
              <AppBtn title="LOGOUT" onClick={() => navigate("/")} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutModal;
