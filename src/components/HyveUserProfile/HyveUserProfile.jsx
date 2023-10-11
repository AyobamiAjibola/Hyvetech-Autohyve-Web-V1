import React, { useEffect, useRef, useState } from "react";
import profilePicx from "../../assets/images/profilePicx.png";
import AppInput, { MyTextInput } from "../../components/AppInput/AppInput";
import AppDropDown from "../../components/AppDropDown/AppDropDown";
import AppInputWithPhone from "../../components/AppInputWithPhone/AppInputWithPhone";
import Select from "react-select";
import { stateLga } from "../../contsants/states";
import AppBtn from "../../components/AppBtn/AppBtn";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import UploadPictureModal from "../../components/modals/UploadPictureModal";
import DeleteModal from "../modals/DeleteModal";
import InputHeader from "../InputHeader/InputHeader";
import { customStyles } from "../../contsants/customStyles";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { updateCustomerAction } from "../../store/actions/customerActions";
import { showMessage } from "../../helpers/notification";
import { clearUpdateCustomerStatus } from "../../store/reducers/customerReducer";

const updateCustomerSchema = Yup.object({
  firstName: Yup.string().required().label("First name"),
  lastName: Yup.string().required().label("Last name"),
  address: Yup.string().label("Address"),
  state: Yup.string().required().label("State"),
  district: Yup.string().required().label("District"),
  phone: Yup.string()
  .matches(/^[0-9]+$/, "Phone number should be numbers")
  .min(11, "Phone number should be 11 digits")
  .max(11, "Phone number should be 11 digits")
  .required().label("phone"),
  email: Yup.string().required().label("Email"),
  title: Yup.string().required().label("Title"),
  companyName: Yup.string().label("Company name"),
  customerType: Yup.string().required().label("Customer type")
})

const HyveUserProfile = () => {
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [opneProfile, setOpenProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deletemodal, setDeletemodal] = useState(false);
  const dropdownRef = useRef(null);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    title: "",
    customerType: "",
    companyName: "",
    address: "",
    state: "",
    district: ""
  });
  const location = useLocation();
  const [customer, setCustomer] = useState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const customerReducer = useAppSelector(state => state.customerReducer);

  const closeDeleteModal = () => setDeletemodal(!deletemodal);

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

  const handleSubmit = ({ phone, ...rest }) => {
    const newPhone = `${phone}`.startsWith("234")
                        ? phone
                        : `${phone}`.startsWith("0")
                          ? `${phone}`.replace("0", "234")
                          : `${phone}`.replace("", "234") //`234${phone}`;
    const values = { ...rest, phone: newPhone };

    const payload = {
      ...values,
      id: customer.id
    }

    dispatch(updateCustomerAction(payload))
  };

  const customerType = [
    "individual",
    "cooperate"
  ]

  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setIsOpenBeneficiary(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      setCustomer(state.item);
    }
  }, [location.state]);

  const parsePhone = (phone) => {
    if (!phone) {
      return "";
    }

    if (phone.startsWith("234")) return phone.replace("234", "0");

    return phone;
  };

  useEffect(() => {
    setFormState({
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      title: customer?.title || "",
      customerType: customer?.customerType || "",
      companyName: customer?.companyName || "",
      phone: parsePhone(customer?.phone),
      state: customer?.contacts[0]?.state || "",
      district: customer?.contacts[0]?.district || "",
      address: customer?.contacts[0].address || "",
    });
    handleDistrict(String(customer?.contacts[0]?.state));
  }, [customer]);

  useEffect(() => {
    if(customerReducer.updateCustomerStatus === 'completed') {
      showMessage(
        "Customer",
        "Customer detail updated successfully",
        "success"
      )
      navigate('/customers')
    } else if(customerReducer.updateCustomerStatus === 'failed') {
      showMessage(
        "Customer",
        customerReducer.updateCustomerError,
        "error"
      )
    }

    return () => {
      dispatch(clearUpdateCustomerStatus())
    }
  },[customerReducer.updateCustomerStatus])

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={formState}
        onSubmit={handleSubmit}
        validationSchema={updateCustomerSchema}
      >
        {({ setFieldValue, values, handleChange, handleBlur }) => (
          <Form>
            <div className="mb-20 mt-0 h-screen px-0 md:px-0">
              <div className=" w-[100%] md:border-[1px] rounded-3xl relative flex mt-20 md:mt-32  px-0 md:px-20 flex-col pb-20  md:border-[#CACACA]">
                <div
                  className="absolute -top-10 w-[100%] md:w-[80%] items-center justify-center text-center flex cursor-pointer"
                  onClick={() => setOpenProfile(!opneProfile)}
                >
                  <img
                    src={profilePicx}
                    alt=""
                    className="w-[100px] h-[100px] rounded-[50%]"
                  />
                </div>

                <div>
                  <div className="flex flex-col md:flex-row justify-between gap-5 mt-20">
                    <div className=" md:mt-5  w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Title"
                        placeholder="Enter Title"
                        name="title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                      />
                    </div>
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
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-5 mt-3">
                    <div className="mt-5 md:mt-5 w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Last Name"
                        placeholder="Enter your last Name"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                      />
                    </div>

                    <div className="mt-5 md:mt-5  w-full">
                      <InputHeader text="Customer Type" />
                      <Select
                        options={customerType.map(option => ({ value: option, label: option }))}
                        onChange={(item) => {
                          setFieldValue("customerType", String(item?.value));
                        }}
                        styles={customStyles}
                        placeholder="Choose Customer Type"
                        name="customerType"
                        onBlur={handleBlur}
                        value={{
                          value: values.customerType,
                          label: values.customerType,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-5 flex-col md:flex-row  justify-between mt-3">
                    <div className="mt-5 md:mt-5  w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Email"
                        placeholder="Enter your email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </div>

                    <div className="mt-5 md:mt-5  w-full relative">
                      {values.customerType === 'cooperate' && (<div className="w-full">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop="Company Name"
                          placeholder="Enter Your Company Name"
                          name="companyName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.companyName}
                          required={values.customerType === 'cooperate'}
                        />
                      </div>)}
                    </div>
                  </div>

                  <div className="flex gap-5 flex-col md:flex-row  justify-between">
                    <div className="mt-10 md:mt-10 w-full">
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
                    <div className=" w-full mt-5 md:mt-10">
                      <AppInputWithPhone
                        placeholderTop="Phone Number*"
                        placeholder="Phone (WhatsApp)"
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
                  </div>

                  <div className="flex justify-between flex-col md:flex-row  gap-5">
                    <div className="mt-5 md:mt-5 w-full">
                      <InputHeader text="State" />
                      <Select
                        options={state}
                        styles={customStyles}
                        placeholder="Choose state"
                        name="state"
                        onChange={(item) => {
                          handleDistrict(String(item?.value));
                          setFieldValue("district", "");
                          console.log(item?.value, 'item value')
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
                  </div>
                </div>
              </div>

              <div className="w-full flex-col pb-40 md:flex-row gap-5 mt-5 flex md:items-end md:justify-end">

                {/* <AppBtn
                  className="btn-secondary w-full md:w-[100px]  text-[#000] -mt-10 md:mt-3"
                  title="DELETE"
                  titleClassName="font-semibold"
                /> */}
                <AppBtn
                  className=" bg-[#FAA21B] w-full md:w-[300px]  text-[#000] mt-3 md:mt-3"
                  title="SAVE"
                  titleClassName="font-semibold"
                  spinner={customerReducer.updateCustomerStatus === 'loading'}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <UploadPictureModal
        opneProfile={opneProfile}
        setOpenProfile={setOpenProfile}
      />

      <DeleteModal
        deletemodal={deletemodal}
        title={
          "Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
        }
        description=""
        closeDeleteModal={closeDeleteModal}
      />
    </>
  );
};

export default HyveUserProfile;
