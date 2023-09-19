import React, { useState } from "react";
import DashboardWrapper from "../DashboardWrapper/DashboardWrapper";
import SearchInput from "../SearchInput/SearchInput";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import DownloadIcon from "../../assets/images/export.png";
import { Link } from "react-router-dom";
import TableCountTitile from "../TableCountTitile/TableCountTitile";
import TableActionButton from "../TableActionButton/TableActionButton";

const ServiceReminder = () => {
  const tableData = Array(3).fill("");
  const [checkBoxValue, setCheckBoxValue] = useState([]);

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
  return (
    <DashboardWrapper>
      <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-0 md:mt-16">
        <div className="w-[100%] md:w-[50%]">
          <SearchInput />
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

          {tableData.map((item, index) => {
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
                    <span>David James</span>
                  </td>
                  <td className="font-montserrat text-xs">
                    StellarTech Solutions
                  </td>
                  <td className="font-montserrat text-xs">08123456789</td>

                  <td className="flex gap-3 text-left ">12/02/1992</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div className="flex justify-between flex-col md:flex-row  w-[99%] mt-4">
        <TableActionButton icon={DownloadIcon} title=" Export Customers" />

        <div className="flex items-center gap-3 order-1 md:order-2 md:mt-0 mb-5">
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
    </DashboardWrapper>
  );
};

export default ServiceReminder;
