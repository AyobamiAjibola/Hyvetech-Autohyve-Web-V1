import React, { useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppBtn from "../../components/AppBtn/AppBtn";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import { AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { BsDownload, BsFillExclamationCircleFill } from "react-icons/bs";
import Sorting from "../../components/Sorting/Sorting";
import documentupload from "../../assets/images/document-upload.png";
import CreateAutoHyveCustomerModal from "../../components/AutoHyveModals/CreateAutoHyveCustomerModal";
import SearchInput from "../../components/SearchInput/SearchInput";
import DownloadIcon from "../../assets/images/export.png";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "../../components/modals/DeleteModal";
import profilePicx from "../../assets/images/profilePicx.png";
import { Link, useNavigate } from "react-router-dom";
import AddNewExpensesModal from "../../components/AutoHyveModals/AddNewExpensesModal";
import { GrEdit } from "react-icons/gr";
import AppSwitch from "../../components/AppSwitch/AppSwitch";
import AddNewReminderModal from "../../components/AutoHyveModals/AddNewReminderModal";
import ReminderSummaryModal from "../../components/AutoHyveModals/ReminderSummaryModal";
import CustomDate from "../../components/CustomDate/CustomDate";
import TableActionButton from "../../components/TableActionButton/TableActionButton";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import useReminder from "../../hooks/useReminder";
import moment from "moment";
import { IconButton } from "@mui/material";
import Pagination from "../../components/Pagination/Pagination";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { getReminderAction, toggleReminderStatusAction } from "../../store/actions/serviceReminderActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import { clearToggleReminderStatus } from "../../store/reducers/serviceReminderReducer";

const Reminder = () => {
  const [openNewReminder, setOpenNewReminder] = useState(false);
  const [openReminderSummary, setOpenReminderSummary] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [openEditReminder, setOpenEditReminder] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const navigate = useNavigate();
  const refOne = useRef(null);
  const tableData = Array(3).fill("");
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenImport(false);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { reminders } = useReminder();
  const [editMode, setEditMode] = useState(false);
  const [reminderId, setReminderId] = useState(-1);
  const dispatch = useAppDispatch();
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer)

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

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

  const openReminderSummaryFunction = (e, id) => {
    e.stopPropagation();
    setOpenReminderSummary(!openNewReminder);
    setReminderId(id)
  };

  const closeDeleteModal = (event) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
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
  const filteredData = reminders.filter((item) =>
    item.reminderType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = filteredData.length === reminders.length ? 10 : filteredData.length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
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
  // const data = {
  //   open_modal: undefined,
  //   id: undefined
  // }

  // useEffect(() => {
  //   if(removeSessionStorage){
  //     Object.keys(data).forEach(key => {
  //       sessionStorage.removeItem(key);
  //     });
  //   }
  // }, [removeSessionStorage])

  // useEffect(() => {
  //   if(sessionStorage.getItem('open_modal') === 'true'){
  //     reminder.setShowCreate(true)
  //   }
  // },[]);

  // // remove open modal and id from session storage on page reload
  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     sessionStorage.removeItem('open_modal');
  //     sessionStorage.removeItem('id');
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const overDue = reminders.filter(reminder => reminder.reminderStatus.startsWith("Overdue"));
  const dueWeek = reminders.filter(reminder => reminder.reminderStatus === "Due in [1] week(s)");
  const dueMonth = reminders.filter(reminder => reminder.reminderStatus === "Due in [1] month(s)");

  useEffect(() => {
    if (reminderReducer.deleteReminderStatus === 'completed') {
      showMessage(
          "Reminder",
          "Reminder deleted successfully",
          "success"
      )
      dispatch(getReminderAction());
    } else if(reminderReducer.deleteReminderStatus === 'failed') {
      showMessage(
        "Reminder",
        reminderReducer.deleteReminderError,
        "error"
      )
    }
  }, [reminderReducer.deleteReminderStatus]);

  return (
    <DashboardWrapper>
      <>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-5 justify-between mb-5 md:flex-row md:hidden  flex-col w-full mt-4">
            <TableActionButton icon={DownloadIcon} title="Export Items" />

            <AppTabBtn
              icon={<AiOutlinePlus />}
              title="New Reminder"
              className="w-full text-[#000] btn-secondary block md:hidden"
              onClick={() => {
                setEditMode(false)
                setOpenEditReminder(true)
              }}
            />
          </div>
          <Sorting
            items={items}
            select={select}
            setSelect={setSelect}
            className="w-[100%]"
          />
          <div className="flex gap-3">
            <AppTabBtn
              icon={<AiOutlinePlus />}
              title="New Reminder"
              className="w-[200px] text-[#000] btn-secondary hidden md:flex"
              onClick={() => {
                setEditMode(false)
                setOpenEditReminder(true)
              }}
            />
          </div>
        </div>
        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-0 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput
              handleSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />
          </div>

          <div className="flex w-full md:w-[50%] items-start md:items-center font-montserrat md:flex-row flex-col  text-[11px] gap-4 text-gray-500">

            <div className="flex items-center border-[1px] md:w-[65%] w-[100%] border-[#CACACA] px-3 py-3 rounded-[15px]">
              <BsFillExclamationCircleFill
                color="#FAA21B"
                className="mr-2 text-[25px]"
              />
              <span className="text-[#3E3E3E] text-xs md:text-[9px]  md:font-semibold font-normal">
                {overDue.length} services overdue, {dueWeek.length} services due this week, {dueMonth.length} services due
                this month
              </span>
            </div>
            <TableCountTitile
              title={`Showing ${startIndex + 1} - ${endIndex} of ${filteredData.length} results`}
            />
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
                      onClick={(e) => {
                        if (!e.target.closest(".toggle")) {
                          openReminderSummaryFunction(e, item.id)
                        }
                      }}
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

        <div className="flex gap-5 justify-between md:flex-row flex-col w-full mt-4">
          <TableActionButton
            icon={DownloadIcon}
            title="Export Items"
            className="md:flex hidden"
          />

          <div className="flex items-center gap-3">
            {filteredData.length !== 0 && (<Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />)}
          </div>
        </div>
              
        <DeleteModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Delete Record Expenses"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
        />

        <AddNewReminderModal
          openNewReminder={openEditReminder}
          setOpenNewReminder={setOpenEditReminder}
          reminderId={reminderId}
          setReminderId={setReminderId}
          editMode={editMode}
          setEditMode={setEditMode}
        />

        <ReminderSummaryModal
          openReminderSummary={openReminderSummary}
          setOpenReminderSummary={setOpenReminderSummary}
          reminderId={reminderId}
          setReminderId={setReminderId}
        />
      </>
    </DashboardWrapper>
  );
};

export default Reminder;
