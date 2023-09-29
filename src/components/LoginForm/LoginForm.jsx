import React, { useState } from "react";
import AppInput, { MyEmailTextInput, MyTextInput } from "../AppInput/AppInput";
import { Link, useNavigate } from "react-router-dom";
import AppBtn from "../AppBtn/AppBtn";
import User from "../../assets/svgs/user.svg";
import Lock from "../../assets/svgs/lock.svg";
import Eye from "../../assets/svgs/eye.svg";
import ResetPasswordModal from "../modals/ResetPasswordModal";
import { Form, Formik, useFormik } from "formik";
import AuthenticationHeader from "../AuthenticationHeader/AuthenticationHeader";
import AppModal from "../modals/AppModal/AppModal";
import OtpModal from "../modals/OtpModal";
import useAppDispatch from "../../hooks/useAppDispatch";
import { signInAction } from "../../store/actions/authenicationActions";
import * as Yup from "yup";

const LoginForm = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").email().required("Email is required"),
      password: Yup.string().required(),
    }),
    onSubmit: (values) => {
      console.log(values)
      // dispatch(
      //   signInAction({
      //     username: values.email.toLowerCase(),
      //     password: values.password,
      //   })
      // );
    },
  });

  return (
    <>
      <div className="flex flex-col h-full items-center mt-28 px-10 md:px-28 justify-center">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
          })}
          // onSubmit={(values) => {
          //   dispatch(
          //     signInAction({
          //       username: values.email.toLowerCase(),
          //       password: values.password,
          //     })
          //   );
          // }}
        >
          <Form>
            <div style={{ maxWidth: 600, width: "100%" }}>
              <AuthenticationHeader
                title="Sign in to AutoHyve"
                classNameTitle="mb-3"
                subTitle="Enter your AutoHyve account information below to log into your
                account"
              />

              <div className="mb-5 mt-10">
                <MyEmailTextInput
                  name="email"
                  placeholder={"Your Email"}
                  leftImg={User}
                  formik={formik}
                  type={"email"}
                />
              </div>
              <div className="w-full">
                <MyTextInput
                  rightImg={Eye}
                  placeholder={"Password"}
                  leftImg={Lock}
                  name="password"
                  formik={formik}
                  type="password"
                />
                <div className="justify-end  flex">
                  <p
                    onClick={() => setOpenModal(true)}
                    className="text-[14px] italic font-montserrat font-extralight relative mt-5 text-[#A5A5A5] cursor-pointer"
                  >
                    Forgot Password?
                  </p>
                </div>
              </div>

              <AppBtn
                onClick={() => navigate("/dashboard")}
                title="Log in"
                className=" w-full bg-[#FAA21B] mt-8 text-black "
                titleClassName="font-medium"
              />

              <p to="/register" className=" mt-5 font-montserrat text-[14px]">
                Don’t have an account?{" "}
                <b onClick={() => navigate("/register")} className="cursor-pointer">
                  Sign up
                </b>
              </p>
            </div>
          </Form>
        </Formik>
      </div>

      <AppModal open={openModal} setOpen={setOpenModal}>
        <ResetPasswordModal
          setOpenModal={setOpenModal}
          setOpenReset={setOpenReset}
        />
      </AppModal>

      <AppModal open={openReset} setOpen={setOpenReset}>
        <OtpModal openReset={openReset} setOpenReset={setOpenReset} />
      </AppModal>
    </>
  );
};

export default LoginForm;
