import React, { useEffect, useState } from "react";
import "./modal.css";
import AppInput, { MyChangePassInput, MyTextInput } from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpModal from "./OtpModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { changePasswordAction, sendPasswordResetTokenAction } from "../../store/actions/authenicationActions";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { showMessage } from "../../helpers/notification";
import useAdmin from "../../hooks/useAdmin";

export default function ChangePasswordModal({ setOpenModal, openModal, email }) {
  const [openOtp, setOpenOtp] = useState(false);
  const toggleModal = () => {
    setOpenModal(!openModal);
  };
  const state = useAppSelector(state => state.authenticationReducer)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  useEffect(() => {
    if(state.changePasswordStatus === 'completed') {
      showMessage(
        "Password",
        state.changePasswordSuccess,
        "success"
      );
    }
    setTimeout(() => {
      setOpenModal(false)
    },1000)
  },[state.changePasswordStatus]);

  useEffect(() => {
    if(state.changePasswordStatus === 'failed') {
      showMessage(
        "Error",
        state.changePasswordError,
        "error"
      );
    }
  },[state.changePasswordStatus]);

  const handleResetPassword = () => {
    dispatch(sendPasswordResetTokenAction({
      email
    }))
  };

  useEffect(() => {
    if(state.sendPasswordResetTokenStatus === 'completed') {
      setOpenOtp(true);
      setOpenModal(false);
      showMessage(
        "Password Reset",
        state.sendPasswordResetTokenSuccess,
        "success"
      );
    }
  },[state.sendPasswordResetTokenStatus]);

  useEffect(() => {
    if(state.sendPasswordResetTokenStatus === 'failed') {
      showMessage(
        "Password Reset",
        state.sendPasswordResetTokenError,
        "error"
      );
    }
  },[state.sendPasswordResetTokenStatus]);

  return (
    <>
      {openModal && (
        <div
          className="overlay h-screen w-screen flex  fixed justify-center items-center"
          // onClick={toggleModal}
        >
          <div className="rounded-2xl bg-white py-8 px-20">
            <div className="modal-header bg-white p-8 py-2 relative">
              <button
                onClick={() => setOpenModal(false)}
                className="flex justify-end w-full absolute  -top-3 right-3 md:-right-10"
              >
                <img src={CloseIcon} alt="" />
              </button>

              {/* <div>
                <h5 className="text-center heading-five">Transfer Fund</h5>
              </div> */}
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                newPassword: "",
                confirmPassword: "",
                currentPassword: ""
              }}
              validationSchema={Yup.object({
                newPassword: Yup.string()
                  .matches(
                    /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
                    'Password does not meet requirement.'
                  )
                  .required('Password is required')
                  .label('Password'),
                currentPassword: Yup.string().required(),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('newPassword')], 'Confirm new password and new password do not match ')
                  .required('Confirm password is required')
                  .label('Confirm Password'),
              })}
              onSubmit={(values, e) => {
                dispatch(
                  changePasswordAction({
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                    currentPassword: values.currentPassword
                  })
                );
              }}
            >
              {({ setFieldValue, values, handleChange, handleBlur }) => (
                <Form>
                  <div className="flex flex-col">
                    <div className="flex flex-col justify-start items-start">
                      <ModalHeaderTitle title=" Change Password" />
                      <span className="text-xs  font-light font-montserrat inline-block mb-[43px]">
                        Please enter your password to change your AutoHyve account
                        password
                      </span>
                    </div>

                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Current Password"
                        placeholder="Enter your current password"
                        name="currentPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.currentPassword}
                        type="password"
                      />
                    </div>
                    <div className="w-full relative mt-5 mb-4">
                      <MyChangePassInput
                        hasPLaceHolder={true}
                        placeholderTop="New Password"
                        placeholder="Enter new password"
                        name="newPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.newPassword}
                        type="password"
                      />
                      <span className="text-[9px] inline-block mt-1 absolute top-[78px] text-[#A5A5A5] font-montserrat">
                        Your password must be minimum of 8, contain at least 1 number
                        and 1 special character
                      </span>
                    </div>
                    <div className="w-full mt-5 relative">
                      <MyChangePassInput
                        hasPLaceHolder={true}
                        placeholderTop="Confirm New Password"
                        placeholder="Re-enter new password"
                        name="confirmPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmPassword}
                        type="password"
                      />
                      <span className="text-[9px] inline-block mt-1  absolute top-[78px] text-[#A5A5A5] font-montserrat">
                        Your password must be minimum of 8, contain at least 1 number
                        and 1 special character
                      </span>
                    </div>

                    <div className="flex justify-end mt-12 gap-5">
                      <AppBtn
                        title="RESET AUTOHYVE PASSWORD"
                        className="text-[#000] border-[1px] bg-white border-[#D9D9D9] mt-1 font-medium"
                        type="button"
                        spinner={state.sendPasswordResetTokenStatus === 'loading'}
                        onClick={() => {
                          handleResetPassword()
                          // setOpenOtp(true);
                          // setOpenModal(false);
                        }}
                      />

                      <AppBtn
                        title="SUBMIT"
                        className="text-[#000]  bg-[#FAA21B] mt-1 font-medium"
                        spinner={state.changePasswordStatus === 'loading'}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            
          </div>
        </div>
      )}

      <OtpModal
        openOtp={openOtp}
        setOpenOtp={setOpenOtp}
        headerTitle="Reset AutoHyve Password"
        subHeader="We sent an OTP to your WhatsApp and as a text message"
      />
    </>
  );
}
