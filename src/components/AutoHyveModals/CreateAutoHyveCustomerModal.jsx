import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Select from "react-select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";
import { customStyles } from "../../contsants/customStyles";
import { stateLga } from "../../contsants/states";
import AdditionalContentModal from "./AdditionalContentModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";

const CreateAutoHyveCustomerModal = ({
  openCreatCustomer,
  setOpenCreatCustomer,
}) => {
  const [openAdditionalContact, setOpenAdditionalContact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);
  const dropdownRef = useRef(null);

  const data = ["Individual", "Co-operate"];

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

  const handleClose = () => setOpenCreatCustomer(false);

  return (
    <>
      <Modal
        open={openCreatCustomer}
        onClose={handleClose}
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

          <div className="mt-8 flex gap-8 flex-col justify-center">
            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Title"
                  placeholder="Enter Title"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>

              <div className="w-full ">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="First Name"
                  placeholder="Enter First name"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Last Name"
                  placeholder="Enter last name"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>

              <div className="w-full">
                <AppDropDown
                  title="Customer Type"
                  data={data}
                  placeholder="Choose Customer Type"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  dropdownRef={dropdownRef}
                  dropDownClass="h-[80px]"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full md:mb-0 mb-3">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Email"
                  placeholder="Enter a valid email"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>

              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Company Name"
                  placeholder="Enter Your Company Name"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row  w-full gap-4">
              <div className="w-full md:mb-0 mb-3">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Address"
                  placeholder="Enter your address"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div>
              <div className="w-full ">
                <AppInputWithPhone
                  hasPLaceHolder={true}
                  placeholder="whatsapp Number"
                  placeholderTop="Phone Number"
                />
              </div>
            </div>

            <div className="flex flex-col -mt-5 md:flex-row  w-full gap-4">
              <div className="w-full ">
                <p className="text[10px] inline-block font-montserrat">State</p>
                <Select
                  options={stateLga}
                  onChange={(item) => {
                    setValue(item.value);
                  }}
                  styles={customStyles}
                  placeholder="Choose state"
                />
              </div>
              <div className="w-full">
                <p className="text[10px] inline-block font-montserrat">City</p>
                <Select
                  options={district}
                  styles={customStyles}
                  placeholder="Choose district"
                />
              </div>
            </div>
            <div className="flex w-full justify-between md:flex-row flex-col md:mt-10 mt-1">
              <p
                onClick={() => setOpenAdditionalContact(!openAdditionalContact)}
                className="text-sm cursor-pointer relative md:-top-8 font-montserrat text-[#FAA21B] font-medium "
              >
                Add Additional Contact
              </p>

              <div className=" relative md:-top-8 flex gap-4 mt-5 justify-center md:justify-end items-center px-0">
                <AppBtn
                  title="SUBMIT"
                  className="font-medium w-[100%] md:w-[100px] "
                />
              </div>
            </div>
          </div>
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
