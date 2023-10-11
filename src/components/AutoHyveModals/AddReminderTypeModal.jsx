import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import useReminder from "../../hooks/useReminder";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getReminderTypesAction } from "../../store/actions/serviceReminderActions";
import { showMessage } from "../../helpers/notification";
import { clearCreateReminderTypeStatus } from "../../store/reducers/serviceReminderReducer";

const AddReminderTypeModal = ({ openReminderType, setOpenReminderType }) => {

  const [type, setType] = useState("");
  const { handleCreateReminderType } = useReminder();
  const dispatch = useAppDispatch();
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 280,
    outline: "none",
    // overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    py: 5,
    pr: 8,
    pl: 8,
  };

  const handleClose = () => setOpenReminderType(false);

  useEffect(() => {
    if(reminderReducer.createReminderTypeStatus === 'completed') {
      setOpenReminderType(false)
    }

    return () => {
      dispatch(clearCreateReminderTypeStatus())
    }
  },[reminderReducer.createReminderTypeStatus])

  return (
    <>
      <Modal
        open={openReminderType}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title=" Add Reminder Type" />
            <button onClick={() => setOpenReminderType(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <AppInput
            placeholder="Enter Reminder Type"
            className="bg-[#F5F5F5] border-[#F5F5F5] h-14 mt-10"
            onChange={(e) => setType(e.target.value)}
            value={type}
          />

          <div className="flex justify-end mt-10 gap-5">
            <AppBtn
              title="SAVE" 
              className="font-semibold" 
              onClick={() => handleCreateReminderType({name: type})}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AddReminderTypeModal;
