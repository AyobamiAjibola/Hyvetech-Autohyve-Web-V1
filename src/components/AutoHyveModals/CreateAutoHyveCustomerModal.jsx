import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Select from "react-select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { customStyles } from "../../contsants/customStyles";
import { stateLga } from "../../contsants/states";
import AdditionalContentModal from "./AdditionalContentModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputHeader from "../InputHeader/InputHeader";
import useAppDispatch from "../../hooks/useAppDispatch";
import { addCustomerAction, getNewCustomersAction } from "../../store/actions/customerActions";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import { clearAddCustomerStatus } from "../../store/reducers/customerReducer";

const createCustomerSchema = Yup.object({
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

const CreateAutoHyveCustomerModal = ({
  openCreatCustomer,
  setOpenCreatCustomer,
}) => {
  const [openAdditionalContact, setOpenAdditionalContact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);
  const refOne = useRef(null);
  const dispatch = useAppDispatch();
  const customerReducer = useAppSelector(state => state.customerReducer);
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenCreatCustomer(true);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const customerType = [
    "individual",
    "cooperate"
  ]

  const [openReminderType, setOpenReminderType] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "65%" : "95%",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "40px" : "40px",
  };

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

  const handleClose = () => setOpenCreatCustomer(false);
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

    dispatch(addCustomerAction(values))
  };

  useEffect(() => {
    if(customerReducer.addCustomerStatus === 'completed') {
      showMessage(
        "Customer",
        customerReducer.addCustomerSuccess,
        "success"
      )
      setOpenCreatCustomer(false)
      dispatch(getNewCustomersAction())
    } else if(customerReducer.addCustomerStatus === 'failed') {
      showMessage(
        "Customer",
        customerReducer.addCustomerError,
        "error"
      )
    }

    return () => {
      dispatch(clearAddCustomerStatus())
    }
  },[customerReducer.addCustomerStatus]);

  return (
    <>
      <Modal
        open={openCreatCustomer}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title="Create Customer" />

            <button onClick={() => setOpenCreatCustomer(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <Formik
            enableReinitialize
            initialValues={formState}
            onSubmit={handleSubmit}
            validationSchema={createCustomerSchema}
          >
            {({ setFieldValue, values, handleChange, handleBlur }) => (
              <Form>
                <div className="mt-8 flex gap-8 flex-col justify-center">
                  <div className="flex flex-col md:flex-row  w-full gap-4">
                    <div className="w-full">
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

                    <div className="w-full ">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="First Name"
                        placeholder="Enter First name"
                        name="firstName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.firstName}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row  w-full gap-4">
                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Last Name"
                        placeholder="Enter last name"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lastName}
                      />
                    </div>

                    <div className="w-full">
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

                  <div className="flex flex-col md:flex-row  w-full gap-4">
                    <div className="w-full md:mb-0 mb-3">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Email"
                        placeholder="Enter a valid email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                    </div>

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

                  <div className="flex flex-col md:flex-row  w-full gap-4">
                    <div className="w-full md:mb-0 mb-3">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Address"
                        placeholder="Enter your address"
                        name="address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.address}
                      />
                    </div>
                    <div className="w-full ">
                      <AppInputWithPhone
                        hasPLaceHolder={true}
                        placeholder="whatsapp Number"
                        placeholderTop="Phone Number"
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

                  <div className="flex flex-col -mt-5 md:flex-row  w-full gap-4">
                    <div className="w-full ">
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
                    <div className="w-full">
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
                  <div className="flex w-full justify-between md:flex-row flex-col md:mt-10 mt-1">
                    {/* <p
                      onClick={() => setOpenAdditionalContact(!openAdditionalContact)}
                      className="text-sm cursor-pointer relative md:-top-8 font-montserrat text-[#FAA21B] font-medium "
                    >
                      Add Additional Contact
                    </p> */}

                    <div className=" relative md:-top-8 flex gap-4 mt-5 justify-center md:justify-end items-center px-0">
                      <AppBtn
                        title="SUBMIT"
                        className="font-medium w-[100%] md:w-[300px] "
                        spinner={customerReducer.addCustomerStatus === 'loading'}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      <AdditionalContentModal
        openAdditionalContact={openAdditionalContact}
        setOpenAdditionalContact={setOpenAdditionalContact}
      />
    </>
  );
};

export default CreateAutoHyveCustomerModal;
