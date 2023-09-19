import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import TrashIcon from "../../assets/svgs/vuesax/linear/trash.svg";
import Eye from "../../assets/svgs/eye.svg";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import AddNewQuantityModal from "./AddNewQuantityModal";
import Sorting from "../Sorting/Sorting";
import SearchInput from "../SearchInput/SearchInput";
import { GrEdit } from "react-icons/gr";
import AppSwitch from "../AppSwitch/AppSwitch";
import DropDownHalf from "../DropDownHalf/DropDownHalf";
import SingleAppCalender from "../AppCalender/SingleAppCalender";
import InputHeader from "../InputHeader/InputHeader";
import { FaCalendarAlt } from "react-icons/fa";
import AddReminderTypeModal from "./AddReminderTypeModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";

const NewReminderModal = ({ openNewReminder, setOpenNewReminder }) => {
  const node = useRef();
  const data = ["label one", "label 2"];
  const [openStart, setOpenStart] = useState(false);
  const [openStart2, setOpenStart2] = useState(false);
  const [calender, setCalender] = useState("");
  const [calender2, setCalender2] = useState("");
  const [openReminderType, setOpenReminderType] = useState(false);

  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }

    setOpenNewReminder(false);
  };

  useEffect(() => {
    if (openNewReminder) {
      document.addEventListener("mousedown", handleClickOutside);
      return;
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openNewReminder]);

  useEffect(() => {
    if (openNewReminder) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openNewReminder]);

  return (
    <>
      {openNewReminder && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div
            className="rounded-2xl md:w-[80%] w-[90%] h-[700px] md:h-[650px] overflow-y-auto bg-white py-8 px-3"
            ref={node}
          >
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-between w-full">
                <ModalHeaderTitle title=" New Reminders" />

                <button onClick={() => setOpenNewReminder(false)}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="mt-5 w-[60%]">
                <SearchInput />
              </div>

              <div className="flex gap-14 mt-10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">First Name</span>
                  <span className="text-sm font-light">Ayo</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Last Name</span>
                  <span className="text-sm font-light">Testa</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Phone Number</span>
                  <span className="text-sm font-light">090872376128</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Email</span>
                  <span className="text-sm font-light">Ayo@gmail.com</span>
                </div>
              </div>

              <hr className="mt-10" />

              <div className="flex flex-col md:flex-row  mt-5 w-full gap-5">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="VIN"
                    placeholder="Enter Vin"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Make"
                    placeholder="Toyota"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Model"
                    placeholder="Enter Model"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Year"
                    placeholder="Enter Year"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>

              <div className="w-[23%] mt-5">
                <AppDropDown
                  title="Recuring"
                  data={data}
                  placeholder="labels"
                />
              </div>

              <div className="flex items-center gap-10 mt-10">
                <div className="w-[23%] flex flex-col relative">
                  <AppDropDown
                    title="Reminder Type"
                    data={data}
                    placeholder="labels"
                  />

                  <span
                    onClick={() => setOpenReminderType(true)}
                    className="absolute -bottom-6 text-sm cursor-pointer font-montserrat text-[#FAA21B]"
                  >
                    Add reminder type
                  </span>
                </div>

                <div className="w-[23%]">
                  <DropDownHalf
                    title="Service Interval"
                    placeholder="Unit"
                    placeholderInput="N/A"
                  />
                </div>
              </div>

              <div className="flex mt-12 gap-10">
                <div className="w-[23%] relative ">
                  <InputHeader text="Last Service Date" />
                  <div
                    className="bg-[#F5F5F5] flex p-3 cursor-pointer py-5 rounded-xl items-center justify-between"
                    onClick={() => setOpenStart(!openStart)}
                  >
                    <span className="text-sm text-[#A5A5A5]">{calender}</span>
                    <FaCalendarAlt color="#A5A5A5" />
                  </div>

                  {openStart && (
                    <SingleAppCalender
                      setCalender={setCalender}
                      setOpenStart={setOpenStart}
                      openStart={openStart}
                    />
                  )}
                </div>

                <div className="w-[23%]">
                  <DropDownHalf
                    title="Last Service Mileage"
                    placeholder="Miles"
                    placeholderInput="N/A"
                  />
                </div>

                <div className="w-[23%]">
                  <DropDownHalf
                    title="Next Service Mileage"
                    placeholder="Miles"
                    placeholderInput="N/A"
                  />
                </div>

                <div className="w-[18%] relative">
                  <InputHeader text="Next Service Date" />
                  <div
                    className="bg-[#F5F5F5] cursor-pointer h-[52px] flex p-3  py-5 rounded-xl items-center justify-between"
                    onClick={() => setOpenStart2(!openStart2)}
                  >
                    <span className="text-sm text-[#A5A5A5]">{calender2}</span>
                    <FaCalendarAlt color="#A5A5A5" />
                  </div>

                  {openStart2 && (
                    <div className="relative">
                      <SingleAppCalender
                        setCalender={setCalender2}
                        setOpenStart={setOpenStart2}
                        openStart={openStart2}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <CustomTextArea
                  topTitle="Note/Comment"
                  placeholder="write your note/comment.."
                />
              </div>

              <div className="flex justify-end mt-10 gap-5">
                <AppBtn
                  title="ADD REMINDER"
                  className="btn-secondary font-semibold"
                />
                <AppBtn title="SAVE" className="font-semibold" />
              </div>
            </div>
          </div>
        </div>
      )}

      <AddReminderTypeModal
        openReminderType={openReminderType}
        setOpenReminderType={setOpenReminderType}
      />
    </>
  );
};

export default NewReminderModal;
