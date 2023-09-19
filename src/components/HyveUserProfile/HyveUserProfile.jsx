import React, { useEffect, useRef, useState } from "react";
import profilePicx from "../../assets/images/profilePicx.png";
import AppInput from "../../components/AppInput/AppInput";
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

  const banks = ["Individual", "Co-operate"];

  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setIsOpenBeneficiary(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  return (
    <>
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
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Title"
                  placeholder="Mr"
                />
              </div>
              <div className="mt-0 md:mt-5 w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="First Name"
                  placeholder="Enter your first name"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-5 mt-3">
              <div className="mt-5 md:mt-5 w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Last Name"
                  placeholder="Enter your last Name"
                />
              </div>

              <div className="mt-5 md:mt-5  w-full">
                <AppDropDown
                  title="Customer Type"
                  placeholder="Choose Customer Type"
                  data={banks}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  dropdownRef={dropdownRef}
                />
              </div>
            </div>

            <div className="flex gap-5 flex-col md:flex-row  justify-between mt-3">
              <div className="mt-5 md:mt-5  w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mt-5 md:mt-5  w-full relative">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Company Name"
                  placeholder="Enter Company Name"
                />
              </div>
            </div>

            <div className="flex gap-5 flex-col md:flex-row  justify-between">
              <div className="mt-10 md:mt-10 w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Address"
                  placeholder="Enter your current address"
                />
              </div>
              <div className=" w-full mt-5 md:mt-10">
                <AppInputWithPhone
                  placeholderTop="Phone Number*"
                  placeholder="Phone (WhatsApp)"
                  hasPLaceHolder={true}
                />
              </div>
            </div>

            <div className="flex justify-between flex-col md:flex-row  gap-5">
              <div className="mt-5 md:mt-5 w-full">
                <InputHeader text="State" />

                <Select
                  options={state}
                  onChange={(item) => {
                    setValue(item.value);
                  }}
                  styles={customStyles}
                  placeholder="Choose state"
                />
              </div>
              <div className="mt-5 md:mt-5 w-full">
                <InputHeader text="District" />

                <Select
                  options={district}
                  styles={customStyles}
                  placeholder="Choose district"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-col pb-40 md:flex-row gap-5 mt-5 flex md:items-end md:justify-end">
          {/* <AppBtn
            className=" btn-secondary w-full md:w-[100px] text-[#000] -mt-14 md:mt-3 mb-10"
            title="DELETE"
            titleClassName="font-semibold"
            onClick={() => setDeletemodal(true)}
          /> */}
          <AppBtn
            className="btn-secondary w-full md:w-[100px]  text-[#000] -mt-10 md:mt-3"
            title="DELETE"
            titleClassName="font-semibold"
          />
          <AppBtn
            className=" bg-[#FAA21B] w-full md:w-[100px]  text-[#000] mt-3 md:mt-3"
            title="SAVE"
            titleClassName="font-semibold"
          />
        </div>
      </div>

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
