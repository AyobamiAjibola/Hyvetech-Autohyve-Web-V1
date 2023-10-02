import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import autoHyveLogo from "../../assets/images/autoHyveLogo.svg";
import Quote from "../../assets/svgs/blockquote.svg";
import cloudIcon from "../../assets/images/cloudColor.png";
import Eye from "../../assets/svgs/eye.svg";
import AppBtn from "../../components/AppBtn/AppBtn";
import AppInput, { MyEmailTextInput, MyTextInput } from "../../components/AppInput/AppInput";
import { stateLga } from "../../contsants/states";
import AppInputWithPhone from "../../components/AppInputWithPhone/AppInputWithPhone";
import { customStyles } from "../../contsants/customStyles";
import InputHeader from "../../components/InputHeader/InputHeader";
import AuthenticationHeader from "../../components/AuthenticationHeader/AuthenticationHeader";
import AppModal from "../../components/modals/AppModal/AppModal";
import OtpModal from "../../components/modals/OtpModal";
import SignHyveModal from "../../components/modals/SignHyveModal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import settings from "../../config/settings";
import { showMessage } from "../../helpers/notification";
import axiosClient from '../../config/axiosClient';
import axios from "axios";
import useAppDispatch from "../../hooks/useAppDispatch";
import { preSignUpAction } from "../../store/actions/authenicationActions";
import useAppSelector from "../../hooks/useAppSelector";
import { clearPreSignUpStatus } from "../../store/reducers/authenticationReducer";

const accountType = [
  "individual",
  "cooperate"
]

const createUserSchema = Yup.object().shape({
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
  email: Yup.string().email().required().label("Email"),
  phone: Yup.string()
    .required()
    .matches(/^[0-9]+$/, "Phone number should be numbers")
    .min(11, "Phone number should be 11 digits")
    .max(11, "Phone number should be 11 digits")
    .label("Phone Number"),
  state: Yup.string().required().label("State"),
  district: Yup.string().required().label("District"),
  address: Yup.string().required().label("Address"),
  accountType: Yup.string().required().label("Account Type"),
  name: Yup.string().label("Business Name"),
  // name: Yup.string().when('accountType', {
  //   is: 'cooperate',
  //   then: Yup.string().required('Business Name is required').label("Business Name"),
  //   otherwise: Yup.string().label("Business Name"),
  // }),
});


const API_ROOT = settings.api.baseURL

const Register = () => {
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [openHyveLogin, setOpenHyveLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const authReducer = useAppSelector(state => state.authenticationReducer)
  const navigate = useNavigate();

  useEffect(() => {
    let stateyArray = [];
    const newData = Object.entries(stateLga);
    newData.map((item, index) => {
      stateyArray.push({
        value: item[0],
        label: item[0],
      });
    });
    setState(stateyArray);
  }, []);

  useEffect(() => {
    if (value != null) {
      let distrciyArray = [];
      const newData = Object.entries(stateLga).find(
        (_items) => _items[0] === value
      );

      newData[1].map((item, index) => {
        distrciyArray.push({
          value: item,
          label: item,
        });
      });
      setDistrict(distrciyArray);
    }
  }, [value]);

  const handleSubmit = (values) => {
    const data = JSON.stringify(values);
    localStorage.setItem('user_data', data);

    dispatch(preSignUpAction({
      email: values.email,
      phone: values.phone
    }))
  }

  useEffect(() => {
    if(authReducer.preSignUpStatus === 'completed') {
      showMessage(
        "Sign up",
        authReducer.preSignUpSuccess,
        "success"
      )
        navigate('/verification')
    } else if(authReducer.preSignUpStatus === 'failed') {
      showMessage(
        "Sign up",
        authReducer.preSignUpError,
        "error"
      )
      localStorage.removeItem('user_data')
      dispatch(clearPreSignUpStatus())
    }

    return () => {
      dispatch(clearPreSignUpStatus())
    }
  },[authReducer.preSignUpStatus]);

  return (
    <>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-0">
        <div className="w-full flex flex-col justify-center mt-20 px-10 md:px-28  mb-20 items-center h-[100%]">
          <div className="w-[100%] md:w-[50%] top-0 right-0 left-0 flex bg-white z-50 fixed justify-center md:justify-start py-5 pl-8">
            <div className="flex items-center gap-4 mt-5">
              <img src={autoHyveLogo} alt="logo" className=" w-[40px]" />
              <h2 className="font-montserrat font-bold text-base">AutoHyve</h2>
            </div>
          </div>

          <AuthenticationHeader
            title="Create AutoHyve Account"
            classNameTitle="mb-3"
            subTitle="Fill in the information below to create your account"
          />

          <div className="form w-full">
            {/* <AppBtn
              title="Sign up with HyveCloud"
              className="w-full  border-[#CACACA] border-[1px] my-10 bg-white text-[#6C6C6C]"
              showIcon={true}
              image={cloudIcon}
              onClick={() => setOpenHyveLogin(true)}
              // onClick={() => setOpenHyveLogin(true)}
            /> */}

            <div className="flex items-center gap-5 mb-5">
              <div className="w-[100%] bg-[#CACACA] h-[1px] mt-8 "></div>
              {/* <span className="font-montserrat text-sm text-[#CACACA]]">
                or
              </span> */}
              {/* <div className="w-[50%] bg-[#CACACA] h-[1px]"></div> */}
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                state: "",
                district: "",
                accountType: "",
                name: "" 
              }}
              onSubmit={handleSubmit}
              validationSchema={createUserSchema}
            >
              {({ setFieldValue, values, handleChange, handleBlur }) => (
                <Form>
                  <div className="mt-8">
                    <div className="form-group flex-col md:flex-row w-full">
                      <div className="w-full ">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop="First Name*"
                          placeholder="First Name"
                          name="firstName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                        />
                      </div>
                      <div className="md:mt-0 w-full ">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop="Last Name*"
                          placeholder="Last Name"
                          name="lastName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                        />
                      </div>
                    </div>
                    <div className="mt-5 md:mt-5 mb-5 md:mb-5">
                      <MyEmailTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Email Address*"
                        placeholder="Enter your valid email address"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </div>

                    <div className="mt-5 md:mt-5">
                      <InputHeader text="Account Type" />
                      
                      <Select
                        options={accountType.map(option => ({ value: option, label: option }))}
                        onChange={(item) => {
                          setFieldValue("accountType", String(item?.value));
                        }}
                        name="accountType"
                        styles={customStyles}
                        placeholder="Account Type"
                        onBlur={handleBlur}
                        value={{
                          value: values.accountType,
                          label: values.accountType,
                        }}
                      />
                    </div>

                    {values.accountType === 'cooperate' && (<div className="mt-5 md:mt-5">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Business Name*"
                        placeholder="Enter business name"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        required={values.accountType === 'cooperate'}
                      />
                    </div>)}

                    <div className="mt-5 md:mt-5">
                      <AppInputWithPhone
                        placeholderTop="Phone Number*"
                        placeholder="Number* (WhatsApp)"
                        hasPLaceHolder={true}
                        name="phone"
                        type="text"
                        onChange={(event) => {
                          setFieldValue("phone", event?.target?.value);
                        }}
                        onBlur={handleBlur}
                        value={values.phone}
                      />
                    </div>

                    <div className="mt-5 md:mt-5">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Address/Location*"
                        placeholder="Enter your address"
                        name="address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address}
                      />
                    </div>

                    <div className="mt-5 md:mt-5">
                      <InputHeader text="State" />

                      <Select
                        options={state}
                        onChange={(item) => {
                          setValue(item.value);
                          setFieldValue("district", "");
                          setFieldValue("state", String(item?.value));
                        }}
                        name="state"
                        styles={customStyles}
                        placeholder="Choose state"
                        onBlur={handleBlur}
                        value={{
                          value: values.state,
                          label: values.state,
                        }}
                      />
                    </div>
                    <div className="mt-5 md:mt-5">
                      <InputHeader text="District" />

                      <Select
                        options={district}
                        styles={customStyles}
                        placeholder="Choose district"
                        name="district"
                        onChange={(item) =>
                          setFieldValue("district", String(item?.value))
                        }
                        value={{
                          value: values.district,
                          label: values.district,
                        }}
                      />
                    </div>

                    {/*<div className="mt-5 md:mt-5">
                      <MyEmailTextInput
                        rightImg={Eye}
                        leftImg={Lock}
                        hasPLaceHolder={true}
                        placeholderTop="Password *"
                        placeholder="Min of 8 characters"
                      />
                    </div>
                    <div className="mt-5 md:mt-5">
                      <MyEmailTextInput
                        rightImg={Eye}
                        leftImg={Lock}
                        hasPLaceHolder={true}
                        placeholderTop="Confirm Password *"
                        placeholder="password must match"
                      />
                    </div> */}

                    <span className="text-[10px] md:text-[12px] gray-color mt-8 inline-block font-montserrat italic">
                      By clicking ‘Proceed’ you agree with the AutoHyve Terms and
                      Policies
                    </span>

                    <AppBtn
                      className="w-full bg-[#FAA21B] text-[#000] mt-3"
                      title="Proceed"
                      spinner={authReducer.preSignUpStatus === 'loading'}
                      titleClassName="font-medium"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <p className=" mt-3 font-montserrat text-[#6C6C6C]  text-sm">
            Already have an account?
            <b
              onClick={() => navigate("/login")}
              className="cursor-pointer text-[#6C6C6C] font-semibold "
            >
              Sign in
            </b>
          </p>
        </div>

        <div className="login_bg hidden md:flex fixed right-0 w-[50%] top-0 flex-col justify-between py-24 items-center px-24">
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
            </div>
          </div>
        </div>
      </div>
      {/* <SignHyveModal
        openHyveLogin={openHyveLogin}
        setOpenHyveLogin={setOpenHyveLogin}
        title="Sign up with HyveCloud"
        subTitle="Create your AutoHyve account using your HyveCloud account"
        buttonTitle="Sign up"
      /> */}

      <AppModal open={openReset} setOpen={setOpenReset}>
        <OtpModal openReset={openReset} setOpenReset={setOpenReset} />
      </AppModal>
    </>
  );
};

export default Register;
