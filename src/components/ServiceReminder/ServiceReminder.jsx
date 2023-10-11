import React, { useEffect, useState } from "react";
import DashboardWrapper from "../DashboardWrapper/DashboardWrapper";
import SearchInput from "../SearchInput/SearchInput";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import DownloadIcon from "../../assets/images/export.png";
import { Link, useLocation } from "react-router-dom";
import TableCountTitile from "../TableCountTitile/TableCountTitile";
import TableActionButton from "../TableActionButton/TableActionButton";
import useAppSelector from "../../hooks/useAppSelector";
import useReminder from "../../hooks/useReminder";
import useAdmin from "../../hooks/useAdmin";
import Pagination from "../Pagination/Pagination";
import moment from "moment";

const ServiceReminder = () => {
  const tableData = Array(3).fill("");
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const reminderReducer = useAppSelector(state => state.serviceReminderReducer);
  const { reminders } = useReminder();
  const location = useLocation();
  const [customer, setCustomer] = useState();
  const admin = useAdmin();
  const [_reminders, _setReminders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      setCustomer(state.item);
    }
  }, [location.state]);

  useEffect(() => {
    const temp = reminders.filter(reminder => {
      return reminder.customerId == customer.id && reminder.partnerId === admin.user?.partner?.id;
    });

    _setReminders(temp);
  }, [reminders]);

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

    // Function to handle changes in the search input
    const handleSearchChange = (e) => {
      const inputValue = e.target.value;
      const cleanedInput = inputValue.replace(/[^a-zA-Z ]/g, '');
  
      setSearchQuery(cleanedInput);
      setCurrentPage(1); // Reset to the first page when the search query changes
    };
  
    // Function to filter data based on the search query
    const filteredData = _reminders.filter((item) =>
      item.reminderType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const itemsPerPage = filteredData.length === _reminders.length ? 10 : filteredData.length;
  
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

  return (
    <DashboardWrapper>
      <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-0 md:mt-16">
        <div className="w-[100%] md:w-[50%]">
          <SearchInput 
            handleSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <TableCountTitile />
      </div>
      {/* <div className="flex justify-between items-center mt-16">
        <div className="w-[60%]">
          <SearchInput />
        </div>

        <TableCountTitile />
      </div> */}

      <div className="mt-4" style={{ overflowX: "scroll" }}>
        <table border={1} className="paymentTable">
          <thead>
            <th className="font-montserrat    text-xs text-left">
              <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
            </th>
            <th className="font-montserrat    text-xs text-left">Type</th>
            <th className="font-montserrat text-xs text-left">Customer name</th>
            <th className="font-montserrat     text-xs text-left">Vehicle</th>
            <th className="font-montserrat    text-xs text-left">
              Last service date
            </th>
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
                  <tr>
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
                      <span>{item.reminderType}</span>
                    </td>
                    <td className="font-montserrat text-xs">
                      {item.customer.firstName} {item.customer.lastName}
                    </td>
                    <td className="font-montserrat text-xs">{item.customer.phone}</td>

                    <td className="flex gap-3 text-left ">{ moment(item.lastServiceDate).format('YYYY-MM-DD') }</td>
                  </tr>
                </tbody>
              );
            }))
          }
        </table>
      </div>
      <div className="flex justify-between flex-col md:flex-row  w-[99%] mt-4">
        <TableActionButton icon={DownloadIcon} title=" Export Customers" />

        <div className="flex items-center gap-3 order-1 md:order-2 md:mt-0 mb-5">
          {filteredData.length !== 0 && (<Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />)}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default ServiceReminder;
