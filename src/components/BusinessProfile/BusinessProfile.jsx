import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/logoImg.png";
import { HiOutlineTrash } from "react-icons/hi";
import * as Yup from "yup";
import AppBtn from "../AppBtn/AppBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import { stateLga } from "../../contsants/states";
import Select from "react-select";
import { customStyles } from "../../contsants/customStyles";
import SearchApiModal from "../modals/SearchApiModal";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import useAdmin from "../../hooks/useAdmin";
import { FieldArray, Form, Formik } from "formik";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { createPartnerKycAction, createPartnerSettingsAction } from "../../store/actions/partnerActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import { clearCreatePartnerKycStatus, clearCreatePartnerSettingsStatus } from "../../store/reducers/partnerReducer";
import settings from "../../config/settings";
import UploadPictureModal from "../modals/UploadPictureModal";
import UploadCompanyLogoModal from "../modals/UploadCompanyLogoModal";
import { getUserAction, getUsersAction } from "../../store/actions/userActions";
import partnerModel from "../Forms/models/partnerModel";
import Brands from "./Brands";

const API_ROOT = settings.api.baseURL;

const businessRegStatus = [
  {label: "Business name", value: "Business name"},
  {label: "Limited Liability Company", value: "Limited Liability Company"},
  {label: "Non-registered", value: "Non-registered"}
];

const businessCategory = [
  {label: "Mechanic/Technician", value: "Mechanic/Technician"},
  {label: "Auto Workshop", value: "Auto Workshop"},
  {label: "Spare part retailer", value: "Spare part retailer"},
  {label: "Others", value: "Others"}
];

const BusinessProfile = ({user}) => {
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);
  const [apiModal, setOpenApiModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const dropdownRef = useRef(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    nameOfDirector: "",
    businessCategory: "",
    businessRegStatus: "",
    workshopAddress: "",
    state: "",
    district: "",
    tin: "",
    nameOfManager: "",
    cac: ""
  });
  const [userData, setUserData] = useState(null);
  const { fields, schema } = partnerModel;
  const dispatch = useAppDispatch()
  const partnerReducer = useAppSelector(state => state.partnerReducer);

  const handleSubmit = (values) => {
    dispatch(createPartnerKycAction({ 
      partnerId: user.partner.id, 
      data: values 
    }));
  };

  const handleSubmitEmployment = ({phone, ...rest}) => {
    const newPhone = `${phone}`.startsWith("234")
                        ? phone
                        : `${phone}`.startsWith("0")
                          ? `${phone}`.replace("0", "234")
                          : `${phone}`.replace("", "234")
    const values = { ...rest, phone: newPhone }

    dispatch(createPartnerSettingsAction({
      partnerId: user?.partner.id,
      data: {
        ...user?.partner,
        phone: values.phone,
        totalStaff: values.totalStaff,
        totalTechnicians: values.totalTechnicians
      }
    }))
  }

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

  useEffect(() => {
    setFormState({
      name: user.partner.name || "",
      nameOfDirector: user.partner.nameOfDirector || "",
      businessCategory: user.partner.businessCategory || "",
      businessRegStatus: user.partner.businessRegStatus || "",
      workshopAddress: user.partner.workshopAddress || "",
      state: user.partner.contact.state || "",
      district: user.partner.contact.district || "",
      tin: user.partner.tin || "",
      nameOfManager: user.partner.nameOfManager || "",
      cac: user.partner.cac || ""
    });
    handleDistrict(String(user?.partner?.contact?.state));
  }, [user]);

  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setIsOpenBeneficiary(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
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

  useEffect(() => {
    if(partnerReducer.createPartnerKycStatus === 'completed') {
      showMessage(
        "KYC Update",
        partnerReducer.createPartnerKycSuccess,
        'success'
      )
    }
    dispatch(clearCreatePartnerKycStatus());
  },[partnerReducer.createPartnerKycStatus]);

  useEffect(() => {
    if(partnerReducer.createPartnerKycStatus === 'failed') {
      showMessage(
        "KYC Update",
        partnerReducer.createPartnerKycError,
        'error'
      )
    }
    dispatch(clearCreatePartnerKycStatus());
  },[partnerReducer.createPartnerKycStatus]);

  useEffect(() => {
    if(partnerReducer.createPartnerSettingsStatus === 'completed') {
      dispatch(getUserAction(user.id))
      showMessage(
        "",
        "Profile updated",
        'success'
      )
    }
    dispatch(clearCreatePartnerSettingsStatus())
  },[partnerReducer.createPartnerSettingsStatus]);

  useEffect(() => {
    if(partnerReducer.createPartnerSettingsStatus === 'failed') {
      showMessage(
        "Employment update",
        partnerReducer.createPartnerSettingsError,
        'error'
      )
    }
    dispatch(clearCreatePartnerSettingsStatus())
  },[partnerReducer.createPartnerSettingsStatus]);

  useEffect(() => {
      const userData = user?.partner;
      setUserData(userData);
  },[]);
  const brands = user?.partner.brands.map(JSON.parse);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={formState}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string(),
          nameOfDirector: Yup.string(),
          businessCategory: Yup.string(),
          businessRegStatus: Yup.string(),
          workshopAddress: Yup.string(),
          state: Yup.string(),
          district: Yup.string(),
          tin: Yup.string(),
          nameOfManager: Yup.string(),
          cac: Yup.string()
        })}
      >
        {({ setFieldValue, values, handleChange, handleBlur }) => (
          <Form>
            <div className="p-5 md:p-14  hyvepay-setting rounded-3xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <h5 className="font-bold font-montserrat">Business Profile</h5>
                <img
                  src={settings}
                  alt=""
                  className="w-[50px] h-[50px] block md:hidden mt-5"
                />

                <AppBtn
                  title="SAVE"
                  className="font-medium hidden md:block"
                  spinner={partnerReducer.createPartnerKycStatus === 'loading'}
                />
              </div>

              <div className="flex mt-5 md:mt-10 w-full justify-between items-center">
                <div className=" w-[280px]">
                  <h5 className="font-montserrat font-medium mb-2">
                    {user?.partner.name}
                  </h5>
                  <p className="text-[#494949] mb-10 md:mb-0 text-sm font-montserrat">
                    {user?.partner.workshopAddress}
                  </p>
                </div>
                <img
                  onClick={() => setOpenProfile(!openProfile)}
                  src={ user?.partner.logo ? `${API_ROOT}/${user?.partner.logo}` : logoImg }
                  crossOrigin="anonymous"
                  alt="workshop-logo"
                  className="w-[100px] h-[100px] hidden md:block rounded-[50%] cursor-pointer"
                />
              </div>

              <hr className="mt-14 mb-14 hidden md:block" />

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="w-full ">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Company Full Name"
                    placeholder="Company Name"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </div>

                <div className="w-full ">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Name of Director"
                    placeholder="Director Name"
                    name="nameOfDirector"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nameOfDirector}
                  />
                </div>
              </div>

              <div className="flex mt-5 flex-col md:flex-row  gap-4 w-full">
                <div className="w-full">
                  <p className="text[10px] inline-block font-montserrat">Choose business category</p>
                  <Select
                    options={businessCategory}
                    styles={customStyles}
                    placeholder="Choose business category"
                    name="businessCategory"
                    onChange={(item) =>
                      setFieldValue("businessCategory", String(item?.value))
                    }
                    value={{
                      value: values.businessCategory,
                      label: values.businessCategory,
                    }}
                  />
                </div>

                <div className="w-full md:mt-0 mt-5">
                  <p className="text[10px] inline-block font-montserrat">Business Registration Status</p>
                  <Select
                    options={businessRegStatus}
                    styles={customStyles}
                    placeholder="Choose business registration status"
                    name="businessRegStatus"
                    onChange={(item) => {
                      setFieldValue("businessRegStatus", String(item?.value))
                    }}
                    value={{
                      value: values.businessRegStatus,
                      label: values.businessRegStatus,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  mt-10 gap-4 w-full">
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Workshop Address"
                    placeholder="Full Address"
                    name="workshopAddress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.workshopAddress}
                  />
                </div>

                <div className="w-full ">
                  <p className="text[10px] inline-block font-montserrat">State</p>
                  <Select
                    options={state}
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
              </div>

              <div className="flex flex-col md:flex-row mt-10 md:mt-8 gap-4 w-full">
                <div className="w-full">
                  <p className="text[10px] inline-block font-montserrat">District</p>
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

                <div className="w-full md:mt-0 mt-5">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Tax Identity Number (TIN)"
                    placeholder="Enter your TIN"
                    name="tin"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tin}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  mt-8 gap-4 w-full">
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Name of Manager"
                    placeholder="Manager Name"
                    name="nameOfManager"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nameOfManager}
                  />
                </div>

                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="CAC Number"
                    placeholder="Enter your CAC number"
                    name="cac"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.cac}
                  />
                </div>

                <AppBtn
                  title="SAVE"
                  className="font-medium block md:hidden"
                  spinner={partnerReducer.createPartnerKycStatus === 'loading'}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <Formik
        enableReinitialize
        initialValues={{
          phone: parsePhone(user.partner.phone),
          totalStaff: user.partner.totalStaff,
          totalTechnicians: user.partner.totalTechnicians
        }}
        onSubmit={handleSubmitEmployment}
        validationSchema={Yup.object({
          phone: Yup.string()
            .matches(/^[0-9]+$/, "Phone number should be numbers")
            .min(11, "Phone number should be 11 digits")
            .max(11, "Phone number should be 11 digits"),
          totalStaff: Yup.string(),
          totalTechnicians: Yup.string()
        })}
      >
        {({ setFieldValue, values, handleChange, handleBlur }) => (
          <Form>
            <div className="p-5 md:p-14  hyvepay-setting rounded-3xl mt-14">
              <div className="flex items-center justify-between">
                <h5 className="font-bold font-montserrat">Employment Information</h5>

                <AppBtn
                  title="SAVE" 
                  className="font-medium hidden md:block"
                  spinner={partnerReducer.createPartnerSettingsStatus === 'loading'}
                />
              </div>

              <div className="flex flex-col md:flex-row  mt-8 gap-4 w-full">
                <div className="w-full">
                  <AppInputWithPhone
                    placeholderTop="Contact Number"
                    placeholder="Enter Contact Number"
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

                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Total Staffs"
                    placeholder="Enter the Total Staffs"
                    name="totalStaff"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.totalStaff}
                  />
                </div>

                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholderTop="Total Technicians"
                    placeholder="Enter Total Techicans"
                    name="totalTechnicians"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.totalTechnicians}
                  />
                </div>
                <AppBtn
                  title="SAVE"
                  className="font-medium block md:hidden"
                  spinner={partnerReducer.createPartnerSettingsStatus === 'loading'}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <Brands
        brands={brands}
        partner={user?.partner}
      />

      <UploadCompanyLogoModal
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        data={user?.partner}
      />
      <SearchApiModal apiModal={apiModal} setOpenApiModal={setOpenApiModal} />
    </>
  );
};

export default BusinessProfile;
