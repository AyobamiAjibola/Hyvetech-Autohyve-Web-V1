import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import Box from "@mui/material/Box";
import SearchInput from "../SearchInput/SearchInput";

import DropDownHalf from "../DropDownHalf/DropDownHalf";
import SingleAppCalender from "../AppCalender/SingleAppCalender";
import InputHeader from "../InputHeader/InputHeader";
import { FaCalendarAlt } from "react-icons/fa";
import AddReminderTypeModal from "./AddReminderTypeModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CustomDate from "../CustomDate/CustomDate";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const AddNewReminderModal = ({
  openNewReminder,
  setOpenNewReminder,
  title,
}) => {
  const data = ["label one", "label 2"];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const [openReminderType, setOpenReminderType] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "70%" : "95%",
    outline: "none",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "20px" : "10px",
    py: 5,
  };

  const handleClose = () => setOpenNewReminder(false);

  return (
    <>
      <Modal
        open={openNewReminder}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 bg-white px-8">
            <div className="flex justify-between w-full">
              <ModalHeaderTitle title={title} />

              <button onClick={() => setOpenNewReminder(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="mt-5 w-[100%] md:w-[60%]">
              <SearchInput />
            </div>

            <div className="flex  flex-col md:flex-row mt-5 md:mt-10 w-full gap-5">
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

            <div className="w-[100%] md:w-[23%] mt-8">
              <AppDropDown title="Recuring" data={data} placeholder="labels" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-5 mt-5 md:mt-10">
              <div className="md:w-[23%] w-[100%] flex flex-col relative">
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

              <div className="md:w-[23%] w-[100%] md:mt-0 mt-8">
                <DropDownHalf
                  title="Service Interval"
                  placeholder="Unit"
                  placeholderInput="N/A"
                />
              </div>
            </div>

            <div className="flex md:flex-row flex-col mt-8 md:mt-14 gap-5">
              <div className="w-full">
                <InputHeader text="Last Service Date" />
                <CustomDate />
              </div>

              <div className="w-full mt-3 md:mt-0">
                <DropDownHalf
                  title="Last Service Mileage"
                  placeholder="Miles"
                  placeholderInput="N/A"
                />
              </div>

              <div className="w-full mt-3 md:mt-0">
                <DropDownHalf
                  title="Next Service Mileage"
                  placeholder="Miles"
                  placeholderInput="N/A"
                />
              </div>

              <div className="w-full relative mt-3 md:mt-0">
                <InputHeader text="Next Service Date" />
                <CustomDate />
              </div>
            </div>

            <div className="mt-10">
              <CustomTextArea
                topTitle="Note/Comment"
                placeholder="write your note/comment.."
              />
            </div>

            <div className="flex flex-col md:flex-row justify-end mt-10 gap-5">
              <AppBtn
                title="ADD REMINDER"
                className="btn-secondary font-semibold"
              />
              <AppBtn title="SAVE" className="font-semibold" />
            </div>
          </div>
        </Box>
      </Modal>

      <AddReminderTypeModal
        openReminderType={openReminderType}
        setOpenReminderType={setOpenReminderType}
      />
    </>
  );
};

export default AddNewReminderModal;
