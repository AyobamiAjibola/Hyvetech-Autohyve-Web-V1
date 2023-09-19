import React from "react";
import User from "../../assets/svgs/user.svg";
import Lock from "../../assets/svgs/lock.svg";
import Eye from "../../assets/svgs/eye.svg";
import AppInput from "../../components/AppInput/AppInput";
import AppBtn from "../../components/AppBtn/AppBtn";
import { Link } from "react-router-dom";

const HighCloudSignIn = () => {
  return (
    <div className="flex flex-col items-center mt-28 px-10 md:px-28 justify-center">
      <h2 className="font-montserrat  text-4xl font-medium">
        Sign in to HyvePay
      </h2>
      <span className="text-[14px] font-light font-montserrat inline-block mb-[43px]">
        Enter your information below to log into your account
      </span>
      <AppInput leftImg={User} />
      <div className="w-full">
        <AppInput rightImg={Eye} leftImg={Lock} />
        <div className="justify-end  flex">
          <Link
            href="#"
            className="text-[14px] italic font-montserrat font-extralight relative -mt-5 text-[#A5A5A5]"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <AppBtn title="Log in" className="text-[#000] w-full bg-[#FAA21B] mt-8" />

      <Link
        to="/register"
        className="text-link mt-5 font-montserrat text-[14px]"
      >
        Don’t have an account? <b>Sign up</b>
      </Link>
    </div>
  );
};

export default HighCloudSignIn;
