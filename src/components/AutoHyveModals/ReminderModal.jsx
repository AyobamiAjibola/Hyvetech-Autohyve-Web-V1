import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Sorting from "../Sorting/Sorting";
import SearchInput from "../SearchInput/SearchInput";
import { GrEdit } from "react-icons/gr";
import AppSwitch from "../AppSwitch/AppSwitch";
import NewReminderModal from "./NewReminderModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TableCountTitile from "../TableCountTitile/TableCountTitile";
import Pagination from "../Pagination/Pagination";
import moment from "moment";
import { IconButton } from "@mui/material";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { clearToggleReminderStatus } from "../../store/reducers/serviceReminderReducer";
import { getReminderAction, toggleReminderStatusAction } from "../../store/actions/serviceReminderActions";
import AddNewReminderModal from "./AddNewReminderModal";

const ReminderModal = ({ openReminder, setOpenReminder, vehicleReminder }) => {
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [openNewReminder, setOpenNewReminder] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [openEditReminder, setOpenEditReminder] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [reminderId, setReminderId] = useState(-1);

  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);

  const dispatch = useAppDispatch();

  // const node = useRef();
  const data = [
    "Independent Technician",
    "Single workshop",
    "Workshop Chain",
    "Others",
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 600,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    py: 5,
    pr: 2,
    pl: 2,
  };

  const handleClose = () => setOpenReminder(false);

  const toggleCarts = (id) => {
    if (checkBoxValue.includes(id)) {
      // already exist
      let _tmp = [];
      for (let i = 0; i < checkBoxValue.length; i++) {
        const __data = checkBoxValue[i];

        if (__data != id) {
          _tmp.push(__data);
        }
      }
      setCheckBoxValue(_tmp);
    } else {
      // add
      setCheckBoxValue([...[id], ...checkBoxValue]);
    }
  };

  const openEditReminderFunction = (event) => {
    event.stopPropagation();
    setOpenEditReminder(!openEditReminder);
  };

  const items = [
    "Name (Ascending)",
    "Name (Descending)",
    "Date (Ascending)",
    "Date (Descending)",
  ];

    // Function to handle changes in the search input
    const handleSearchChange = (e) => {
      const inputValue = e.target.value;
      const cleanedInput = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
  
      setSearchQuery(cleanedInput);
      setCurrentPage(1); // Reset to the first page when the search query changes
    };
  
    // Function to filter data based on the search query
    const filteredData = vehicleReminder?.filter((item) =>
      item.reminderType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const itemsPerPage = filteredData.length === vehicleReminder?.length ? 10 : filteredData.length;
  
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    const handleDisableReminder = (reminder) => {
      dispatch(toggleReminderStatusAction({ reminderId: reminder.id }));
    };

    useEffect(() => {
      if(reminderReducer.toggleReminderStatus === 'completed') {
        dispatch(getReminderAction())
      } else if(reminderReducer.toggleReminderStatus === 'failed') {
        showMessage(
          "Reminder",
          reminderReducer.toggleReminderError,
          "error"
        )
      }
  
      return () => {
        dispatch(clearToggleReminderStatus())
      }
    },[reminderReducer.toggleReminderStatus]);

  return (
    <>
      <Modal
        open={openReminder}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 bg-white px-8">
            <div className="flex justify-between w-full">
              <ModalHeaderTitle title="Reminders" />

              <button onClick={() => setOpenReminder(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="mt-10">
              <Sorting items={items} select={select} setSelect={setSelect} />
            </div>

            <div className="mt-8 flex gap-8 flex-col justify-center">
              <div className="flex flex-col md:flex-row items-center justify-between  w-full gap-4">
                <div className="w-[60%]">
                  <SearchInput 
                    handleSearchChange={handleSearchChange}
                    searchQuery={searchQuery}
                  />
                </div>

                <TableCountTitile />
              </div>
            </div>

            <div className="mt-4" style={{ overflowX: "scroll" }}>
              <table border={1} className="paymentTableCustomer w-[1200px]">
                <thead>
                  <th className="font-montserrat    text-xs text-left">
                    <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                  </th>
                  <th className="font-montserrat    text-xs text-left">S/N</th>
                  <th className="font-montserrat text-xs text-left">Type</th>
                  <th className="font-montserrat     text-xs text-left">
                    Customer Name
                  </th>
                  <th className="font-montserrat    text-xs text-left">Vehicle</th>
                  <th className="font-montserrat   text-xs text-left">
                    Last Service Date
                  </th>
                  <th className="font-montserrat   text-xs text-left">Status</th>
                  <th className="font-montserrat  text-xs text-left">Status</th>

                  <th className="font-montserrat  text-xs text-left">Action</th>
                </thead>

                {filteredData.length === 0 ? (
                  <tbody>
                    <tr>
                      <td className="font-montserrat font-bold">No data found</td>
                    </tr>
                  </tbody>
                  ) : (
                  currentData.map((item, index) => {
                    return (
                      <tbody>
                        <tr
                          // onClick={(e) => {
                          //   if (!e.target.closest(".toggle")) {
                          //     openReminderSummaryFunction(e, item.id)
                          //   }
                          // }}
                          className="cursor-pointer table-hover"
                          key={index}
                        >
                          <td
                            className="font-montserrat text-xs cursor-pointer"
                            onClick={() => toggleCarts(index)}
                          >
                            {[
                              checkBoxValue.includes(index) ? (
                                <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                                  <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                                </div>
                              ) : (
                                <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                              ),
                            ]}
                          </td>
                          <td className="font-montserrat flex items-center gap-2 text-xs">
                            {index + 1}
                          </td>
                          <td className="font-montserrat text-xs">{item.reminderType}</td>
                          <td className="font-montserrat text-xs">{item.customer.firstName} {item.customer.lastName}</td>
                          <td className="font-montserrat text-xs">
                            {item.vehicle.modelYear} {item.vehicle.make} {item.vehicle.model} 
                          </td>
                          <td className="font-montserrat text-xs">{moment(item.lastServiceDate).format('DD/MM/YYYY')}</td>
                          <td className="font-montserrat text-xs">
                            {
                              item.reminderStatus.split(" ")[0] === 'Overdue' || item.reminderStatus === 'Due today'
                                ? <span className="font-montserrat text-xs text-[red]">
                                    {item.reminderStatus}
                                  </span>
                                : item.reminderStatus === "Not Available"
                                  ? item.reminderStatus
                                  : <span className="font-montserrat text-xs text-[green]">
                                      {item.reminderStatus}
                                    </span>
                            }
                          </td>

                          <td className="font-montserrat text-xs">
                            <span
                              className={`py-2 flex justify-center  w-20 items-center  ${
                                item.status == true ? "bg-primary" : "bg-gray-300"
                              } px-4`}
                              style={{ borderRadius: 10 }}
                            >
                              {item.status == true ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="flex gap-3 items-center justify-center ">
                            <IconButton
                              onMouseDown={(e) => {
                                openEditReminderFunction(e)
                                setEditMode(true)
                                setReminderId(item.id)
                              }} 
                            >
                              <GrEdit 
                                size={13}
                              />
                            </IconButton>
                            <IconButton
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleDisableReminder(item)
                              }}
                              className="toggle"
                            >
                              {item.status 
                                ? <ToggleOn
                                    sx={{fontSize: '28px', color: "#FAA21B"}} 
                                  /> 
                                : <ToggleOff
                                    sx={{fontSize: '28px', color: "#424242"}} 
                                  />}
                            </IconButton>
                          </td>
                        </tr>
                      </tbody>
                    );
                  }))
                }
              </table>
            </div>

            <div className="flex items-center gap-3">
              {filteredData.length !== 0 && (<Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />)}
            </div>
          </div>
        </Box>
      </Modal>

      <AddNewReminderModal
        openNewReminder={openEditReminder}
        setOpenNewReminder={setOpenEditReminder}
        reminderId={reminderId}
        setReminderId={setReminderId}
        editMode={editMode}
        setEditMode={setEditMode}
      />

      <NewReminderModal
        openNewReminder={openNewReminder}
        setOpenNewReminder={setOpenNewReminder}
      />
    </>
  );
};

export default ReminderModal;
