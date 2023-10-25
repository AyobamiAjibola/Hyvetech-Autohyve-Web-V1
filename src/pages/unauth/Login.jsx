import React, { useEffect, useState } from "react";
import AppBtn from "../../components/AppBtn/AppBtn";
import cloudIcon from "../../assets/images/cloudIcon.png";
import { useNavigate } from "react-router-dom";
import AuthenticationHeader from "../../components/AuthenticationHeader/AuthenticationHeader";
import SignHyveModal from "../../components/modals/SignHyveModal";
import settings from "../../config/settings";
import { clearGarageSignUpStatus, clearResetPasswordWithTokenStatus } from "../../store/reducers/authenticationReducer";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";

const Login = ({ setModal, setShowCurrent }) => {
  const navigate = useNavigate();
  const [openHyveLogin, setOpenHyveLogin] = useState(false);

  const state = useAppSelector(state => state.authenticationReducer)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(state.resetPasswordWithTokenStatus === 'completed') {
      showMessage(
        "Password reset",
        state.resetPasswordWithTokenSuccess,
        "success"
      )
    }
    setTimeout(() => {
      dispatch(clearResetPasswordWithTokenStatus())
    },1000)
  },[state.resetPasswordWithTokenStatus]);

  return (
    <>
      <div className="w-full flex flex-col justify-center mt-10  px-10 md:px-28   items-center h-[100%]">
        <AuthenticationHeader
          title="Hello there!"
          subTitle="Welcome to AutoHyve, what would you like to do?"
        />

        <AppBtn
          title="Sign in with HyveCloud"
          className="w-full bg-[#FAA21B] mt-16 text-[#fff]"
          showIcon={true}
          image={cloudIcon}
          onClick={() => setOpenHyveLogin(true)}
          // onClick={() => navigate("/login")}
        />
        <AppBtn
          title="Create AutoHyve Account"
          titleClassName="text-2xl text-[#6C6C6C] "
          className="w-full mt-[35px] border-[#CACACA]  bg-transparent border-[1px] "
          showIcon={false}
          onClick={() => navigate("/register")}
        />
      </div>

      <SignHyveModal
        openHyveLogin={openHyveLogin}
        setOpenHyveLogin={setOpenHyveLogin}
        title="Sign in with HyveCloud "
        subTitle="Kindly login with your HyveCloud Email and Password"
        buttonTitle="Login"
      />
    </>
  );
};

export default Login;
