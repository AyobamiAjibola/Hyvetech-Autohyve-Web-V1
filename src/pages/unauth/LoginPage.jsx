import React, { useState } from "react";
import autoHyveLogo from "../../assets/images/autoHyveLogo.svg";
import Quote from "../../assets/svgs/blockquote.svg";

import LoginModal from "../../components/modals/LoginModal";

import LoginForm from "../../components/LoginForm/LoginForm";

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

          <LoginForm />
        </div>

        {/* image slider */}
        <div className="login_bg hidden md:flex sticky top-0 flex-col justify-between py-24 items-center px-24">
          <div className="w-full flex justify-between items-center">
            <img src={Quote} alt="" />
            <hr style={{ borderWidth: 0.5, width: 100 }} />
          </div>

          <div>
            <p className=" text-white slider-text font-montserrat">
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

              <div className="nav-btns flex gap-8">
                <button className="nav-left-btn">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1528 9.39062L5.54199 19.0015L15.1528 28.6123"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M32.458 19H5.81055"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <button className="nav-right-btn">
                  <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.8472 9.39062L32.458 19.0015L22.8472 28.6123"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.54195 19H32.1895"
                      stroke="#D9D9D9"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <LoginModal setModal={setModal} modal={modal} />
      </div>
    </>
  );
};

export default WelcomeAuthenticationPage;
