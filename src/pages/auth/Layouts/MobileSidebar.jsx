import React from "react";
import Tab from "../../../components/Dashboard/Tab";
import Logo from "../../../assets/svgs/logo.svg";
import CloseIcon from "../../../assets/svgs/close-circle.svg";
import hyvePay from "../../../assets/images/hyvePay.png";

const MobileSidebar = ({ toggle = false, closeSidebar }) => {
  return (
    <>
      <div
        className={
          !toggle
            ? "md:w-2/5 h-screen sticky top-0 hidden overflow-y-scroll"
            : "md:w-2/5 h-screen fixed block md:hidden top-0 overflow-y-scroll"
        }
        style={{
          backgroundColor: "#494949",
          zIndex: 5000,
          minWidth: "max-content",
          maxWidth: "max-content",
          overflow: "visible",
        }}
      >
        <div className="px-8 flex gap-4 mt-4 mb-8 items-center text-white">
          <img src={hyvePay} alt="" style={{ height: 50 }} />
          <h5 className="heading-five">HyvePay</h5>
          <button onClick={() => closeSidebar()} className="relative left-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12Z"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.16992 14.8319L14.8299 9.17188"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.8299 14.8319L9.16992 9.17188"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
        <Tab name={"HyvePay"} link={"/dashboard"} />

        <hr />
        <div className="absolute bottom-0 w-full ">
          <Tab name={"Logout"} link={"/logout"} />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
