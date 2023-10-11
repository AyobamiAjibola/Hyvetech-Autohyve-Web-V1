import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Modal from "@mui/material/Modal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import AppInput from "../AppInput/AppInput";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import InputHeader from "../InputHeader/InputHeader";
import useReminder from "../../hooks/useReminder";
import { Divider, FormControl, InputLabel, ListSubheader, MenuItem, Select, Typography } from "@mui/material";
import capitalize from "capitalize";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { deleteReminderAction, getReminderAction, resetLastDateAction } from "../../store/actions/serviceReminderActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import { marked } from '../../utils/generic';
import { makeStyles } from '@mui/styles';
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import { clearDeleteReminderStatus, clearUpdateReminderStatus } from "../../store/reducers/serviceReminderReducer";
import DeleteReminderModal from "../modals/DeleteReminderModal";
import { MESSAGES } from "../../config/constants";

interface IProps {
  reminderId: number;
  openReminderSummary: boolean;
  setOpenReminderSummary: any;
  setReminderId: any
}

const useStyles = makeStyles({
  select: {
    '&:hover': {
      background: '#F1F0F1'
    },
  },
});

export default function ReminderSummaryModal({
  openReminderSummary,
  setOpenReminderSummary,
  setReminderId, reminderId
}: IProps) {
  const handleClose = () => {
    setOpenReminderSummary(false)
    setReminderId(-1)
  };
  const classes = useStyles();
  const navigate = useNavigate()
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [reminder, setReminder] = useState<any>(null);
  const { reminders } = useReminder()
  const [selectedValue, setSelectedValue] = useState<string>('');
  const dispatch = useAppDispatch();
  const [resetServiceDate, setResetServiceDate] = useState<boolean>(false);
  const [_delete, _setDelete] = useState<boolean>(false);
  const [markedStatus, setMarkedStatus] = useState<string>('');
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);

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

  const closeDeleteModal = (event: any) => {
    event.stopPropagation();
    _setDelete(!_delete);
  };

  const closeModal = (event: any) => {
    event.stopPropagation();
    setResetServiceDate(!resetServiceDate);
  };

  const data: any = {
    open_modal: 'true',
    id: reminder?.id
  }

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    if (value === "Share Reminder") {
      handleShare()
      setTimeout(() => {
        setSelectedValue('')
      }, 3000)
    }
    if(value === "Delete Reminder") {
      confirm_delete()
      setTimeout(() => {
        setSelectedValue('')
      }, 3000)
    }

    if(value === "Generate Estimate") {
      navigate('/estimates');
      Object.entries(data).forEach(([key, value]) => {
        //@ts-ignore
        sessionStorage.setItem(key, value);
      });
    }

    if(value === "Service Status"){
      setResetServiceDate(true)
      setTimeout(() => {
        setSelectedValue('')
      }, 3000)
    }
  };

  const handleShare = async () => {
    const message = `Hello ${reminder?.customer?.title ? capitalize.words(reminder?.customer?.title) : ''} ${reminder?.customer?.firstName && capitalize.words(reminder?.customer?.firstName)} ${reminder?.customer?.lastName && capitalize.words(reminder?.customer?.lastName)},\n
${reminder && capitalize.words(reminder?.reminderType)} for your. ${reminder && capitalize.words(reminder?.vehicle?.modelYear)} ${reminder && capitalize.words(reminder?.vehicle?.model)} ${reminder && capitalize.words(reminder?.vehicle?.make)}
is due on ${moment(reminder?.nextServiceDate).format('ddd - Do - MMM - YYYY')}.\n
Should I send you an estimate and schedule you in?`
      try {

        const shareData = {
          title: 'Reminder',
          text: `${message}`
        };

        await navigator.share(shareData);

        console.log('File shared successfully');
      } catch (error) {
        console.error('Error sharing file:', error);
      }
  };

  const confirm_delete = () => {
    _setDelete(true)
  }

  const _resetServiceDate = () => {

    const data ={
      id: reminder?.id,
    }
    void dispatch(resetLastDateAction(data))
  }

  const handleDelete = () => {
    const reminderId = reminder?.id !== undefined ? reminder?.id : -1
    dispatch(deleteReminderAction(reminderId));
  }

  useEffect(() => {
    const find = reminders.find(reminder => reminder.id === reminderId);
    setReminder(find)
  },[reminders, reminderId]);

  useEffect(() => {
    const today = new Date();
    const marked_status = marked(reminder?.lastServiceDate, today);
    setMarkedStatus(marked_status);
  }, [reminder?.lastServiceDate]);

  useEffect(() => {
    if (reminderReducer.deleteReminderStatus === 'completed') {
      setOpenReminderSummary(false)
      dispatch(getReminderAction());
    }else if(reminderReducer.deleteReminderStatus === 'failed') {
      showMessage(
        "Reminder",
        reminderReducer.deleteReminderError,
        "error"
      )
    }

    return () => {
      dispatch(clearDeleteReminderStatus())
    }
  }, [reminderReducer.deleteReminderStatus]);

  useEffect(() => {
    if (reminderReducer.deleteReminderStatus === 'completed') {
      setOpenReminderSummary(false)
      _setDelete(false)
      setReminderId(-1)
      dispatch(getReminderAction());
    }

    return () => {
      dispatch(clearDeleteReminderStatus())
    }
  }, [reminderReducer.deleteReminderStatus]);

  useEffect(() => {
    if (reminderReducer.updateReminderStatus === 'completed') {
      setResetServiceDate(false)
      setOpenReminderSummary(false)
      setReminderId(-1)
      dispatch(getReminderAction());
    }

    return () => {
      dispatch(clearUpdateReminderStatus())
    }
  }, [reminderReducer.updateReminderStatus]);
  
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
            <button onClick={handleClose}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>
          <div className="md:flex w-[100%] md:items-end md:justify-end">
            <FormControl sx={{ mt: 4, width: {sm: 200, xs: 170} }}>
              <InputLabel id="demo-simple-select-helper-label">Select an action</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={selectedValue}
                  label="Select an action"
                  onChange={handleChange}
                  sx={{
                    width: "100%",
                    backgroundColor: '#F5F5F5',
                    borderRadius: '20px',
        
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: 'transparent', // Remove border color
                    
                      "&:hover": {
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: 'transparent' // Border color on hover
                        }
                      }
                    },
                    
                    "& label": {
                      fontSize: "10px",
                      fontFamily: "montserrat",
                      color: "#A5A5A5",
                      paddingTop: "5px",
                      paddingLeft: "17px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "red", // Remove border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "red", // Remove border color on focus
                      },
                      borderRadius: "20px",
                      backgroundColor: "#F5F5F5",
        
                      borderColor: "transparent",
                      height: "53px",
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value="">
                  ...
                  </MenuItem>
                  <MenuItem value={'Generate Estimate'} className={classes.select}>Generate Estimate</MenuItem>
                  <MenuItem value={'Share Reminder'} className={classes.select}>Share Reminder</MenuItem>
                  <MenuItem value={'Delete Reminder'} className={classes.select}>Delete Reminder</MenuItem>
                  <Divider orientation='horizontal'/>
                  <ListSubheader>Service Status</ListSubheader>
                  <MenuItem value={'Service Status'} className={classes.select}>Mark as done</MenuItem>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <MenuItem></MenuItem>
                    <Typography
                      sx={{
                        fontSize: '12px', pl: 1, pr: 1, mr: 1,
                        fontStyle: 'italic'
                      }}
                    >
                      Marked done {markedStatus}
                    </Typography>
                  </Box>
                </Select>
            </FormControl>
          </div>

          <div className="flex flex-col md:flex-row  justify-between mt-5">
            <div className="flex flex-col gap-2 mt-5 md:mt-28">
              <h4 className="font-montserrat text-sm text-[#3E3E3E] font-bold">
                Customer Detail
              </h4>
              <span className="text-xs font-montserrat font-normal">
                {reminder?.customer.firstName}
              </span>
              <span className="text-xs font-montserrat font-normal">
              {reminder?.customer.email}
              </span>
              <span className="text-xs font-montserrat font-normal">
              {reminder?.customer.phone}
              </span>
            </div>
            <div>
              <div className="flex flex-col md:items-end gap-2 md:justify-end mt-5">
                <h4 className="font-montserrat text-sm text-[#3E3E3E] font-bold">
                  Vehicle{" "}
                </h4>
                <span className="text-xs font-montserrat font-normal">
                  {reminder?.vehicle.make} 
                </span>
                <span className="text-xs font-montserrat font-normal">
                  {reminder?.vehicle.model}
                </span>
                <span className="text-xs font-montserrat font-normal">
                {reminder?.vehicle.modelYear}
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
                value={reminder?.reminderType}
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Service Interval Unit"
                placeholder="Day"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.serviceIntervalUnit}
              />
            </div>

            <div className="w-full">
              <AppInput
                placeholderTop="Service Interval "
                placeholder="7"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.serviceInterval}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center mt-5 md:mt-10 gap-5 md:gap-10">
            <div className="w-full">
              <InputHeader text="Last Service Date" />
              <AppInput
                placeholderTop="Reminder Status"
                placeholder="Enter Reminder Status"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={moment(reminder?.lastServiceDate).format('MM-DD-YYYY')}
              />
            </div>
            <div className="w-full">
              <InputHeader text="Next Service Date" />
              <AppInput
                placeholderTop="Reminder Status"
                placeholder="Enter Reminder Status"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={moment(reminder?.nextServiceDate).format('MM-DD-YYYY')}
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Reminder Status"
                placeholder="Enter Reminder Status"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.reminderStatus}
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
                value={reminder?.lastServiceMileage}
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Last Service Mileage Unit"
                placeholder="Enter  Last Service Unit"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.lastServiceMileageUnit}
              />
            </div>

            <div className="w-full">
              <AppInput
                placeholderTop="Next Service Mileage "
                placeholder="Enter Next  Service Mileage"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.nextServiceMileage}
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
                value={reminder?.nextServiceMileageUnit}
              />
            </div>
            <div className="w-full">
              <AppInput
                placeholderTop="Service Status"
                placeholder="Enter  Last Service Unit"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.serviceStatus}
              />
            </div>

            <div className="w-full">
              <AppInput
                placeholderTop="Recurring"
                placeholder="Enter Recurring"
                hasPLaceHolder={true}
                className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                value={reminder?.recurring}
              />
            </div>
          </div>

          <div className="mt-10">
            <CustomTextArea
              topTitle="Note/Comment"
              placeholder="write your note/comment.."
              value={reminder?.note}
            />
          </div>
        </Box>
      </Modal>
      <DeleteReminderModal
        deletemodal={_delete}
        setDeletemodal={_setDelete}
        title={"Delete Reminder"}
        description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDelete}
        btnLabel="DELETE"
      />
      <DeleteReminderModal //Using this modal for marked as done not to delete the reminder
        deletemodal={resetServiceDate}
        setDeletemodal={setResetServiceDate}
        title={"Reset Reminder"}
        description={reminder?.recurring === 'no'
                      ? MESSAGES.delete_reminder_reset
                      : MESSAGES.reset_reminder
                    }
        closeDeleteModal={closeModal}
        handleDelete={_resetServiceDate}
        btnLabel="AGREE"
      />
    </div>
  );
}
