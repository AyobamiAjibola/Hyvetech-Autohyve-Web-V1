import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import settings from "../../assets/images/settings.png";
import { HiOutlineTrash } from "react-icons/hi";

import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import { stateLga } from "../../contsants/states";
import Select from "react-select";
import { customStyles } from "../../contsants/customStyles";
import SearchApiModal from "../modals/SearchApiModal";
import AppTabBtn from "../AppTabBtn/AppTabBtn";

const AccountSettings = () => {
  const data = [
    "Independent Technician/Business",
    "Single workshop",
    "Workshop Chain",
    "Others",
  ];

  const [state, setState] = useState([]);
  const [district, setDistrict] = useState([]);
  const [value, setValue] = useState(null);

  const [apiModal, setOpenApiModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const dropdownRef = useRef(null);

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
      <div className="p-5 md:p-14  hyvepay-setting rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <h5 className="font-bold font-montserrat">Business Profile</h5>
          <img
            src={settings}
            alt=""
            className="w-[50px] h-[50px] block md:hidden mt-5"
          />

          <AppBtn title="SAVE" className="font-medium hidden md:block" />
        </div>

        <div className="flex mt-5 md:mt-10 w-full justify-between items-center">
          <div className=" w-[280px]">
            <h5 className="font-montserrat font-medium mb-2">
              Your Company’s Logo
            </h5>
            <p className="text-[#494949] mb-10 md:mb-0 text-sm font-montserrat">
              Kindly upload/update your business logo if you have one
            </p>
          </div>
          <img
            src={settings}
            alt=""
            className="w-[100px] h-[100px] hidden md:block"
          />
        </div>

        <hr className="mt-14 mb-14 hidden md:block" />

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full ">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Company Full Name"
              placeholder="Company Name"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <div className="w-full ">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Name of Director"
              placeholder="Director Name"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>
        </div>

        <div className="flex mt-5 flex-col md:flex-row  gap-4 w-full">
          <div className="w-full">
            <AppDropDown
              title="Business Category"
              data={data}
              placeholder="Choose business category"
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              dropdownRef={dropdownRef}
            />
          </div>

          <div className="w-full md:mt-0 mt-5">
            <AppDropDown
              title="Business Registration Status"
              data={data}
              placeholder="Choose business registration status"
              isOpen={isOpen2}
              setIsOpen={setIsOpen2}
              dropdownRef={dropdownRef}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row  mt-10 gap-4 w-full">
          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Workshop Address"
              placeholder="Full Address"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <div className="w-full ">
            <p className="text[10px] inline-block font-montserrat">State</p>
            <Select
              options={state}
              onChange={(item) => {
                setValue(item.value);
              }}
              styles={customStyles}
              placeholder="Choose state"
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
            />
          </div>

          <div className="w-full md:mt-0 mt-5">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Tax Identity Number (TIN)"
              placeholder="Enter your TIN"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row  mt-8 gap-4 w-full">
          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Name of Manager"
              placeholder="Manager Name"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="CAC Number"
              placeholder="Enter your CAC number"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <AppBtn title="SAVE" className="font-medium block md:hidden" />
        </div>
      </div>
      <div className="p-5 md:p-14  hyvepay-setting rounded-3xl mt-14">
        <div className="flex items-center justify-between">
          <h5 className="font-bold font-montserrat">Employment Information</h5>

          <AppBtn title="SAVE" className="font-medium hidden md:block" />
        </div>

        <div className="flex flex-col md:flex-row  mt-8 gap-4 w-full">
          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Contact Number"
              placeholder="Enter Contact Number"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Total Staffs"
              placeholder="Enter the Total Staffs"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Total Technicians"
              placeholder="Enter Total Techicans"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>
          <AppBtn title="SAVE" className="font-medium block md:hidden" />
        </div>
      </div>

      <div className="p-5 md:p-14  hyvepay-setting rounded-3xl mt-14">
        <div className="flex items-center justify-between">
          <h5 className="font-bold font-montserrat">Brands</h5>

          <AppBtn title="SAVE" className="font-medium hidden md:flex" />
        </div>

        <div className="flex flex-col md:flex-row   mb-4 gap-4 w-full mt-5">
          <div className="w-full" onClick={() => setOpenApiModal(!apiModal)}>
            <AppDropDown title="Make" placeholder="Brand Make" />
          </div>

          <div className="w-full md:mt-0 mt-5">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="Model Year"
              placeholder="From"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <div className="w-full">
            <AppInput
              hasPLaceHolder={true}
              placeholderTop="To"
              placeholder="To"
              className="bg-[#F5F5F5] border-[#F5F5F5]"
            />
          </div>

          <button className="bg-red-500 h-[50px] w-32  items-center justify-center mt-6 rounded-lg hidden md:flex">
            <HiOutlineTrash size={20} color="#fff" className="text-center" />
          </button>
        </div>
        <Link to="/" className="primary-color">
          Add New Brand
        </Link>
        <AppBtn
          title="DELETE"
          className="font-medium w-full block md:hidden mt-5 btn-secondary"
        />

        <AppBtn
          title="SAVE"
          className="font-medium w-full block md:hidden mt-5"
        />
      </div>

      <SearchApiModal apiModal={apiModal} setOpenApiModal={setOpenApiModal} />
    </>
  );
};

export default AccountSettings;
