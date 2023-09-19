import * as React from "react";
import Box from "@mui/material/Box";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Modal from "@mui/material/Modal";
import CustomDate from "../CustomDate/CustomDate";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputHeader from "../InputHeader/InputHeader";

export default function ReminderSummaryModal({
  openReminderSummary,
  setOpenReminderSummary,
}) {
  const handleClose = () => setOpenReminderSummary(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "70%" : "95%",
    height: 650,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  return (
    <div>
      <Modal
        open={openReminderSummary}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title="Reminder Summary" />
            <button onClick={() => setOpenReminderSummary(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>
          <div className="md:flex w-[100%] md:items-end md:justify-end">
            <AppDropDown placeholder="Select an action" title="" />
          </div>

          <div className="flex flex-col md:flex-row  justify-between mt-5">
            <div className="flex flex-col gap-2 mt-5 md:mt-28">
              <h4 className="font-montserrat text-sm text-[#3E3E3E] font-bold">
                Customer Detail
              </h4>
              <span className="text-xs font-montserrat font-normal">
                Customer Demo
              </span>
              <span className="text-xs font-montserrat font-normal">
                demo@myautohyve.com
              </span>
              <span className="text-xs font-montserrat font-normal">
                08012345678
              </span>
            </div>
            <div>
              <div className="flex flex-col md:items-end gap-2 md:justify-end mt-5">
                <h4 className="font-montserrat text-sm text-[#3E3E3E] font-bold">
                  Vehicle{" "}
                </h4>
                <span className="text-xs font-montserrat font-normal">
                  Mercedes-Benz Demo
                </span>
                <span className="text-xs font-montserrat font-normal">240</span>
                <span className="text-xs font-montserrat font-normal">
                  1983
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-10 gap-5 md:gap-10">
            <div className="w-full">
              <AppInput
                placeholderTop="Reminder Type"
                placeholder="Brake Service"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Service Interval Unit"
                placeholder="Day"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>

            <div className="w-full">
              <AppInput
                placeholderTop="Service Interval "
                placeholder="7"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center mt-5 md:mt-10 gap-5 md:gap-10">
            <div className="w-full">
              <InputHeader text="Last Service Date" />

              <CustomDate />
            </div>
            <div className="w-full">
              <InputHeader text="Next Service Date" />
              <CustomDate />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Reminder Status"
                placeholder="Enter Reminder Status"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-5 md:mt-10 gap-5 md:gap-10">
            <div className="w-full">
              <AppInput
                placeholderTop="Last Server Mileage"
                placeholder="Enter  Last Service Mileage"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Last Service Mileage Unit"
                placeholder="Enter  Last Service Unit"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>

            <div className="w-full">
              <AppInput
                placeholderTop="Next Service Mileage "
                placeholder="Enter Next  Service Mileage"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row mt-5 md:mt-10 gap-5 md:gap-10">
            <div className="w-full">
              <AppInput
                placeholderTop="Next Service Mileage Unit"
                placeholder="Enter Service Mileage Unit"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Service Status"
                placeholder="Enter  Last Service Unit"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>

            <div className="w-full">
              <AppInput
                placeholderTop="Recurring"
                placeholder="Enter Recurring"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
              />
            </div>
          </div>

          <div className="mt-10">
            <CustomTextArea
              topTitle="Note/Comment"
              placeholder="write your note/comment.."
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
