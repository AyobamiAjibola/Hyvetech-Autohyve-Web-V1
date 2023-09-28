import React, { useEffect, useRef, useState } from "react";
import profilePicx from "../../assets/images/profilePicx.png";
import AppInput, { MyTextInput } from "../../components/AppInput/AppInput";
import AppDropDown from "../../components/AppDropDown/AppDropDown";
import Select from "react-select";
import { stateLga } from "../../contsants/states";
import AppBtn from "../../components/AppBtn/AppBtn";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import UploadPictureModal from "../../components/modals/UploadPictureModal";
import { customStyles } from "../../contsants/customStyles";
import TabBtn from "../../components/TabBtn/TabBtn";
import AccountSettings from "../../components/AccountSettings/AccountSettings";
import useAdmin from "../../hooks/useAdmin";
import * as Yup from "yup";
import { showMessage } from "../../helpers/notification";
import { Form, Formik } from "formik";
import axiosClient from "../../config/axiosClient";
import AppInputWithPhone from "../../components/AppInputWithPhone/AppInputWithPhone";
import { useNavigate } from "react-router-dom";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getUserAction, updateUserAction } from "../../store/actions/userActions";
import useAppSelector from "../../hooks/useAppSelector";
import { clearCreateUserStatus } from "../../store/reducers/userReducer";
import settings from "../../config/settings";

const API_ROOT = settings.api.baseURL;

const Profile = () => {
  const [view, setView] = useState(0);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAdmin();
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    district: "",
    address: ""
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer)

  useEffect(() => {
    let stateArray = [];
    const newData = Object.entries(stateLga);
    newData.map((item, index) => {
      stateArray.push({
        value: item[0],
        label: item[0],
      });
    });
    setState(stateArray);
  }, []);

  useEffect(() => {
    if (value != null) {
      let districtArray = [];
      const newData = Object.entries(stateLga).find(
        (_items) => _items[0] === value
      );

      newData[1].map((item, index) => {
        districtArray.push({
          value: item,
          label: item,
        });
      });
      setDistrict(districtArray);
    }
  }, [value]);

  useEffect(() => {
    setFormState({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: parsePhone(user?.phone),
      state: user?.partner?.contact?.state || "",
      district: user?.partner?.contact?.district || "",
      address: user?.address || "",
    });
    handleDistrict(String(user?.partner?.contact?.state));
  }, [user]);

  useEffect(() => {
    let stateArray = [];
    const newData = Object.entries(stateLga);
    newData.forEach((item, index) => {
      stateArray.push({
        value: item[0],
        label: item[0],
      });
    });
    setState(stateArray);
  }, []);

  const handleDistrict = (value) => {
    if (!value) {
      return;
    }
    const newData = Object.entries(stateLga).find(
      (_items) => _items[0] === value
    );

    if (!newData) {
      return;
    }
    const districtArray = newData[1]?.map(
      (item) => {
        return {
          value: item,
          label: item,
        };
      }
    );
    setDistrict(districtArray);
  };

  const parsePhone = (phone) => {
    if (!phone) {
      return "";
    }

    if (phone.startsWith("234")) return phone.replace("234", "0");

    return phone;
  };

  const handleSubmit = ({ phone, ...rest }) => {
    console.log(phone, 'phone')
    const newPhone = `${phone}`.startsWith("234")
                        ? phone
                        : `${phone}`.startsWith("0")
                          ? `${phone}`.replace("0", "234")
                          : `${phone}`.replace("", "234") //`234${phone}`;
    const values = { ...rest, phone: newPhone };

    updateProfile(values)

    navigate('/profile')
  };

  function updateProfile(values) {
    const filteredObject = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    dispatch(updateUserAction({
      ...filteredObject,
      id: user?.id
    }))

  }

  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const data = ["Profile", "Business Profile"];

  useEffect(() => {
    if(userReducer.createUserStatus === 'completed') {
        showMessage(
        "Profile Update",
        "Profile Updated Successfully",
        "success"
      );
    }
    dispatch(getUserAction(user && user?.id))
    dispatch(clearCreateUserStatus())
  },[userReducer.createUserStatus]);

  useEffect(() => {
    if(userReducer.createUserStatus === 'failed') {
        showMessage(
        "Profile Update",
        userReducer.createUserError,
        "success"
      );
    }
    dispatch(getUserAction(user && user?.id))
    dispatch(clearCreateUserStatus())
  },[userReducer.createUserStatus]);
  
  return (
    <>
      <div className="mb-20 mt-24 w-full">
        {user?.accountType === 'cooperate' && (
          <div className="flex justify-between w-[100%] md:w-[47%] items-center mt-10 my-4 setting-tabs">
            <div className="flex items-center flex-col md:flex-row  w-[100%]  mt-3 md:mt-0 gap-4">
              {data.map((item, index) => {
                return (
                  <TabBtn
                    title={item}
                    onClick={() => setView(index)}
                    key={index}
                    className={
                      view === index
                        ? "btn-primary w-[210px]"
                        : "btn-secondary w-[210px]"
                    }
                  />
                );
              })}
            </div>
          </div>)}
            
        <div className={`${user?.accountType === 'cooperate' ? 'mt-20' : 'mt-52'}`}>
          {view == 0 && (
            <Formik
              enableReinitialize
              initialValues={formState}
              onSubmit={handleSubmit}
              validationSchema={Yup.object({
                firstName: Yup.string(),
                lastName: Yup.string(),
                address: Yup.string(),
                state: Yup.string(),
                district: Yup.string(),
                phone: Yup.string()
                .matches(/^[0-9]+$/, "Phone number should be numbers")
                .min(11, "Phone number should be 11 digits")
                .max(11, "Phone number should be 11 digits")
              })}
            >
              {({ setFieldValue, values, handleChange, handleBlur }) => (
                <Form>
                  <div className="mb-20 h-screen px-0 md:px-20">
                    <div className=" w-[100%] md:border-[1px] rounded-3xl relative flex px-0 md:px-20 flex-col pb-20  md:border-[#CACACA]">
                      <div
                        className="absolute -top-10 w-[100%] md:w-[80%] items-center justify-center text-center flex cursor-pointer"
                        onClick={() => setOpenProfile(!openProfile)}
                      >
                        <img
                          src={ user?.profileImageUrl ? `${API_ROOT}/${user?.profileImageUrl}` : profilePicx }
                          alt=""
                          className="w-[100px] h-[100px] rounded-[50%] upload-image-container"
                          crossOrigin="anonymous"
                        />
                      </div>

                      <div>
                        <div className="flex flex-col md:flex-row justify-between gap-5 mt-20">
                          <div className="mt-0 md:mt-5 w-full">
                            <MyTextInput
                              hasPLaceHolder={true}
                              placeholderTop="First Name"
                              placeholder="Enter your first name"
                              name="firstName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.firstName}
                            />
                          </div>
                          <div className="md:mt-5 w-full">
                            <MyTextInput
                              hasPLaceHolder={true}
                              placeholderTop="Last Name"
                              placeholder="Enter your last name"
                              name="lastName"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.lastName}
                            />
                          </div>
                        </div>

                        <div className="flex gap-5 flex-col md:flex-row mt-3 justify-between">
                          <div className="mt-5 md:mt-5  w-full relative">
                            <AppInput
                              hasPLaceHolder={true}
                              placeholderTop="Password"
                              placeholder="****************"
                              disabled
                              name="password"
                            />
                            <span
                              onClick={() => setOpenModal(!openModal)}
                              className="text-[#FAA21B] text-[14px] absolute cursor-pointer font-montserrat top-[85px]"
                            >
                              Change Password
                            </span>
                          </div>

                          <div className="mt-5 md:mt-5 relative w-full">
                            <MyTextInput
                              hasPLaceHolder={true}
                              placeholderTop="Email"
                              placeholder="Enter your valid email address"
                              name="email"
                              value={user?.email}
                              disabled
                            />
                            <span
                              onClick={() => setOpenChangeEmailModal(!openChangeEmailModal)}
                              className="text-[#FAA21B] text-[14px] absolute cursor-pointer font-montserrat top-[85px]"
                            >
                              Change/Edit Primary Email
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-5 flex-col md:flex-row mt-4  justify-between">
                          <div className=" w-full mt-10 md:mt-10">
                            <AppInputWithPhone
                              placeholderTop="Phone Number*"
                              placeholder="Phone Number* (WhatsApp)"
                              hasPLaceHolder={true}
                              type="text"
                              name="phone"
                              onChange={(event) => {
                                setFieldValue("phone", event?.target?.value);
                              }}
                              onBlur={handleBlur}
                              value={values.phone}
                            />
                          </div>

                          <div className="mt-0 md:mt-10 w-full">
                            <MyTextInput
                              hasPLaceHolder={true}
                              placeholderTop="Address"
                              placeholder="Enter your current address"
                              name="address"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.address}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between flex-col md:flex-row  gap-5">
                          <div className="mt-5 md:mt-5 w-full">
                            <p className="text[10px] inline-block font-montserrat">State</p>
                            <Select
                              options={state}
                              // onChange={(item) => {
                              //   setValue(item.value);
                              // }}
                              styles={customStyles}
                              placeholder="Choose state"
                              name="state"
                              onChange={(item) => {
                                handleDistrict(String(item?.value));
                                setFieldValue("district", "");
                                setFieldValue("state", String(item?.value));
                              }}
                              onBlur={handleBlur}
                              value={{
                                value: values.state,
                                label: values.state,
                              }}
                            />
                          </div>
                          <div className="mt-5 md:mt-5 w-full">
                            <p className="text[10px] inline-block font-montserrat">
                              District
                            </p>
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
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex md:items-end md:justify-end">
                      <AppBtn
                        className=" bg-[#FAA21B] w-full md:w-[100px] text-[#000] -mt-10 md:mt-3 mb-40"
                        title="SAVE"
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {view == 1 && (
            <>
              <AccountSettings />
            </>
          )}
        </div>

      </div>

      <ChangePasswordModal openModal={openModal} setOpenModal={setOpenModal} />
      <UploadPictureModal
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        data={formState}
      />
    </>
  );
};

export default Profile;
