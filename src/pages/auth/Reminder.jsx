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

  const openReminderSummaryFunction = (e) => {
    event.stopPropagation();
    setOpenReminderSummary(!openNewReminder);
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
              onClick={() => setOpenNewReminder(true)}
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
              onClick={() => setOpenNewReminder(true)}
            />
          </div>
        </div>
        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-0 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput />
          </div>

          <div className="flex w-full md:w-[50%] items-start md:items-center font-montserrat md:flex-row flex-col  text-[11px] gap-4 text-gray-500">
            <TableCountTitile className="items-start" />
            <div className="flex items-center border-[1px] md:w-[65%] w-[100%] border-[#CACACA] px-3 py-3 rounded-[15px]">
              <BsFillExclamationCircleFill
                color="#FAA21B"
                className="mr-2 text-[25px]"
              />
              <span className="text-[#3E3E3E] text-xs md:text-[7px]  md:font-semibold font-normal">
                3 services overdue, 7 services due this week, 12 services due
                this month
              </span>
            </div>
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

            {tableData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={openReminderSummaryFunction}
                    className="cursor-pointer table-hover"
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
                    <td className="font-montserrat text-xs">Brake Service</td>
                    <td className="font-montserrat text-xs">Demo Customer</td>
                    <td className="font-montserrat text-xs">
                      1983 Mercedes-Benz 240
                    </td>
                    <td className="font-montserrat text-xs"> 26/01/2023</td>
                    <td className="font-montserrat text-xs">
                      Overdue by [1] week(s)
                    </td>

                    <td className="font-montserrat text-xs">
                      <span
                        className={`py-2 flex justify-center  w-20 items-center  ${
                          index == 1 ? "bg-primary" : "bg-gray-300"
                        } px-4`}
                        style={{ borderRadius: 10 }}
                      >
                        {index == 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="flex gap-3 items-center justify-center ">
                      <GrEdit size={13} onClick={openEditReminderFunction} />
                      <AppSwitch />
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>

        <div className="flex gap-5 justify-between md:flex-row flex-col w-full mt-4">
          <TableActionButton
            icon={DownloadIcon}
            title="Export Items"
            className="md:flex hidden"
          />

          <div className="flex items-center gap-3">
            <div className="border-[1px] rounded-[5px] p-3 border-[#D9D9D9] cursor-pointer">
              <HiChevronLeft color="#D9D9D9" />
            </div>
            <div className="border-[1px] rounded-[5px] px-5 py-2 border-[#D9D9D9]">
              1
            </div>
            <div className="border-[1px] rounded-[5px] p-3 border-[#D9D9D9] cursor-pointer">
              <HiChevronRight color="#D9D9D9" />
            </div>
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
          openNewReminder={openNewReminder}
          setOpenNewReminder={setOpenNewReminder}
          title=" New Reminders"
        />
        <AddNewReminderModal
          title="Edit Reminder"
          openNewReminder={openEditReminder}
          setOpenNewReminder={setOpenEditReminder}
        />

        <ReminderSummaryModal
          openReminderSummary={openReminderSummary}
          setOpenReminderSummary={setOpenReminderSummary}
        />
      </>
    </DashboardWrapper>
  );
};

export default Reminder;
