import React, { useEffect, useState } from "react";
import "./modal.css";
import { MyTextInput } from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import OtpModal from "./OtpModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { Form, Formik } from "formik";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { resetPasswordWithTokenAction } from "../../store/actions/authenicationActions";
import { showMessage } from "../../helpers/notification";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { clearSendPasswordResetTokenStatus } from "../../store/reducers/authenticationReducer";

export default function NewPassword({ setNewPasswordModal, newPasswordModal, otp }) {

  const state = useAppSelector(state => state.authenticationReducer)
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  if (newPasswordModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  // const handleClickOutside = (e) => {
  //   if (node.current.contains(e.target)) {
  //     return;
  //   }

  //   setNewPasswordModal(false);
  // };

  // useEffect(() => {
  //   if (newPasswordModal) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return;
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [newPasswordModal]);

  useEffect(() => {
    if (newPasswordModal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [newPasswordModal]);

  const handleSubmit = (values) => {
    if(otp.length === 4) {
      dispatch(
        resetPasswordWithTokenAction({
          password: values.newPassword,
          token: otp
        })
      );
    }
  };

  useEffect(() => {
    if(state.resetPasswordWithTokenStatus === 'completed') {
      setNewPasswordModal(false)
      localStorage.clear()
      sessionStorage.clear()
      navigate("/")
    }
  },[state.resetPasswordWithTokenStatus]);

  useEffect(() => {
    if(state.resetPasswordWithTokenStatus === 'failed') {
      showMessage(
        "Password reset",
        state.resetPasswordWithTokenError,
        "error"
      )
    }
  },[state.resetPasswordWithTokenStatus]);

  useEffect(() => {
    if(state.sendPasswordResetTokenStatus === 'completed') {
      dispatch(clearSendPasswordResetTokenStatus())
    }
  },[state.sendPasswordResetTokenStatus]);

  return (
    <>
      {newPasswordModal && (
        <div className="overlay h-screen w-screen flex  fixed justify-center items-center">
          <div className=" bg-white rounded-xl w-[90%] md:w-[60%]  py-8 px-10 md:px-20">
            <div className="modal-header bg-white p-8 py-2 relative">
              <button
                onClick={() => setNewPasswordModal(!newPasswordModal)}
                className="flex justify-end w-full absolute  -top-3 right-3 md:-right-10"
              >
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col text-left justify-start items-start ">
                <ModalHeaderTitle title=" New Password" />

                <span className="text-xs font-light font-montserrat inline-block mb-[43px]">
                  Kindly enter a new password for your AutoHyve Account
                </span>
              </div>

              <Formik
                enableReinitialize
                initialValues={{
                  newPassword: "",
                  confirmPassword: ""
                }}
                validationSchema={Yup.object({
                  newPassword: Yup.string()
                    .matches(
                      /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
                      'Password does not meet requirement.'
                    )
                    .required('Password is required')
                    .label('Password'),
                  confirmPassword: Yup.string()
                    .oneOf([Yup.ref('newPassword')], 'Confirm new password and new password do not match ')
                    .required('Confirm password is required')
                    .label('Confirm Password'),
                })}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, handleChange, handleBlur }) => (
                  <Form>
                    <div className="flex flex-col md:flex-row  justify-between items-center gap-1 md:gap-5">
                      <div className="w-full">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop="New Password"
                          placeholder="Enter new password"
                          name="newPassword"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.newPassword}
                          type="password"
                        />
                      </div>
                      <div className="w-full relative">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop="Confirm New Password"
                          placeholder="Re-enter new password"
                          name="confirmPassword"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.confirmPassword}
                          type="password"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-3 gap-5">
                      <AppBtn
                        title="SUBMIT"
                        spinner={state.resetPasswordWithTokenStatus === 'loading'}
                        className="text-[#000]  w-full md:w-[200px]  bg-[#FAA21B] mt-1 font-medium"
                      />
                    </div>
                  </Form>
                )}
            </Formik>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}
