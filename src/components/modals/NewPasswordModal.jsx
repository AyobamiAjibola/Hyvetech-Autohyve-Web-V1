import React, { useEffect, useState } from "react";
import "./modal.css";
import AppInput, { MyChangePassInput, MyTextInput } from "../AppInput/AppInput";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { createUserAction } from "../../store/actions/userActions";
import { garageSignUpAction } from "../../store/actions/authenicationActions";
import { showMessage } from "../../helpers/notification";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { clearGarageSignUpStatus } from "../../store/reducers/authenticationReducer";

export default function NewPasswordModal({ setNewPasswordModal, newPasswordModal }) {
  
  const dispatch = useAppDispatch();
  const authReducer = useAppSelector(state => state.authenticationReducer);
  const navigate = useNavigate();
  
  if (newPasswordModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }

    setNewPasswordModal(false);
  };

  useEffect(() => {
    if (newPasswordModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return;
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newPasswordModal]);

  useEffect(() => {
    if (newPasswordModal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [newPasswordModal]);

  const handleSubmit = (values) => {

    const userData = localStorage.getItem("user_data")
    
    const retrievedObject = JSON.parse(userData);
    const phone = retrievedObject.phone

    const newPhone = `${phone}`.startsWith("234")
                        ? phone
                        : `${phone}`.startsWith("0")
                          ? `${phone}`.replace("0", "234")
                          : `${phone}`.replace("", "234")

    const data = { ...retrievedObject, phone: newPhone};
    dispatch(garageSignUpAction({
        ...data,
        email: data.email.toLowerCase(),
        password: values.password,
        confirm_password: values.confirmPassword
      }))
    }

    useEffect(() => {
      if(authReducer.garageSignUpStatus === 'completed') {
        navigate('/')
        localStorage.removeItem('user_data')
      } else if (authReducer.garageSignUpStatus === 'failed') {
        showMessage(
          "Sign up",
          authReducer.garageSignUpError,
          "error"
        )
        dispatch(clearGarageSignUpStatus())
      }
    },[authReducer.garageSignUpStatus]);

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
                password: "",
                confirmPassword: ""
              }}
              validationSchema={Yup.object({
                password: Yup.string()
                  .matches(
                    /^(?=.*\d)(?=.*[a-z])(?=.*\W)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/,
                    'Password does not meet requirement.'
                  )
                  .required('Password is required')
                  .label('Password'),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password')], 'Confirm password and password do not match ')
                  .required('Confirm password is required')
                  .label('Confirm Password'),
              })}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, handleChange, handleBlur }) => (
                <Form>
                  <div className="flex flex-col md:flex-row  justify-between items-center gap-1 md:gap-5">
                    <div className="w-full">
                      <MyChangePassInput
                        hasPLaceHolder={true}
                        placeholderTop="Password"
                        placeholder="Enter password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        type="password"
                      />
                    </div>
                    <div className="w-full relative">
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
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-5">
                    <AppBtn
                      title="SUBMIT"
                      // onClick={() => setNewPasswordModal(!newPasswordModal)}
                      className="text-[#000]  w-full md:w-[100px]  bg-[#FAA21B] mt-1 font-medium"
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