import React, { useState } from "react";
import { Link } from "react-router-dom";
import Quote from "../../assets/svgs/blockquote.svg";
import AppBtn from "../../components/AppBtn/AppBtn";
import LoginModal from "../../components/modals/LoginModal";
import Login from "./Login";
import autoHyveLogo from "../../assets/images/autoHyveLogo.svg";

const WelcomeAuthenticationPage = () => {
  const [modal, setModal] = useState(false);
  const [current, setShowCurrent] = useState(0);
  return (
    <>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-0">
        {/* login form */}
        <div className="flex  w-full flex-col">
          <div className="w-[100%] md:w-[50%] flex bg-white z-50 fixed justify-center md:justify-start py-5 pl-8">
            <div className="flex items-center gap-4 mt-5">
              <img src={autoHyveLogo} alt="logo" className=" w-[40px]" />
              <h2 className="font-montserrat font-bold text-base">AutoHyve</h2>
            </div>
          </div>

          <Login setModal={setModal} setShowCurrent={setShowCurrent} />
        </div>

        {/* image slider */}
        <div className="login_bg hidden md:flex sticky top-0 flex-col justify-between py-24 items-center px-24">
          <div className="w-full flex justify-between items-center">
            <img src={Quote} alt="" />
            <hr style={{ borderWidth: 0.5, width: 100 }} />
          </div>

          <div>
            <p className=" text-white slider-text font-montserrat ">
              The automobile has not merely taken over the street, it has
              dissolved the living tissue of the city. Its appetite for space is
              absolutely insatiable; moving and parked, it devours urban land,
              leaving the buildings as mere islands of habitable space in a sea
              of dangerous and ugly traffic.
            </p>

            <div className="w-full flex justify-between items-center mt-8">
              <p className="base-text primary-color font-montserrat">
                James Marston Fitch
              </p>
            </div>
          </div>
        </div>
        <LoginModal setModal={setModal} modal={modal} />
      </div>
    </>
  );
};

export default WelcomeAuthenticationPage;
