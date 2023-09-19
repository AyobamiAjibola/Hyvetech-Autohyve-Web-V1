import React, { useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppBtn from "../../components/AppBtn/AppBtn";
import DownloadIcon from "../../assets/images/export.png";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import Sorting from "../../components/Sorting/Sorting";
import CreateAutoHyveCustomerModal from "../../components/AutoHyveModals/CreateAutoHyveCustomerModal";
import SearchInput from "../../components/SearchInput/SearchInput";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "../../components/modals/DeleteModal";
import profilePicx from "../../assets/images/profilePicx.png";
import { Link, useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import AppSwitch from "../../components/AppSwitch/AppSwitch";
import InvoiceDetailsModal from "../../components/AutoHyveModals/InvoiceDetailsModal";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import TableActionButton from "../../components/TableActionButton/TableActionButton";
import { BsDownload } from "react-icons/bs";

const Invoice = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const [openInvoiceDetails, setOpenInvoiceDetails] = useState(false);
  const navigate = useNavigate();
  const refOne = useRef(null);
  const tableData = Array(3).fill("");
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenImport(false);
    }
  };

  const items = [
    "Record Payment",
    "Record expenses",
    "Download PDF",
    "Share",
    "Add Reminder",
    "Edit Invoice",
  ];

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

  const closeDeleteModal = (event) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
  };

  const openDetails = (event) => {
    event.stopPropagation();
    setOpenInvoiceDetails(!openInvoiceDetails);
  };

  return (
    <DashboardWrapper>
      <>
        <div className="flex flex-col md:flex-row">
          <Sorting
            className="w-full"
            items={items}
            select={select}
            setSelect={setSelect}
          />

          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Generate Invoice"
            className="md:w-[200px] w-[100%] text-[#000] btn-secondary flex"
            onClick={() => navigate("/generate-invoice")}
          />
          <AppTabBtn
            icon={<BsDownload />}
            title="Export Items"
            className="w-full text-[#000] btn-secondary mt-5 md:hidden flex"
            onClick={() => setOpenImport(!openImport)}
          />
        </div>

        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-5 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput />
          </div>

          <TableCountTitile />
        </div>

        <div className="mt-4" style={{ overflowX: "scroll" }}>
          <table
            border={1}
            style={{ borderRadius: 20, overflow: "clip" }}
            className="w-[1600px]"
          >
            <thead>
              <th className="font-montserrat    text-xs text-left">
                <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
              </th>
              <th className="font-montserrat    text-xs text-left">Date</th>
              <th className="font-montserrat text-xs text-left">Invoice#</th>
              <th className="font-montserrat     text-xs text-left">
                Full name
              </th>
              <th className="font-montserrat    text-xs text-left">Vehicle</th>
              <th className="font-montserrat   text-xs text-left">
                Grand Total
              </th>
              <th className="font-montserrat  text-xs text-left">
                Amount paid
              </th>
              <th className="font-montserrat  text-xs text-left">Receivable</th>
              <th className="font-montserrat  text-xs text-left">
                Receivable Due
              </th>
              <th className="font-montserrat  text-xs text-left">Status</th>
              <th className="font-montserrat  text-xs text-left">Action</th>
            </thead>

            {tableData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={openDetails}
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

                    <td className="font-montserrat text-xs">26/04/2023</td>
                    <td className="font-montserrat text-xs">INV-530001</td>
                    <td className="font-montserrat flex items-center gap-2 text-xs">
                      <img
                        src={profilePicx}
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <span>Mr Olusola Segun</span>
                    </td>
                    <td className="font-montserrat text-xs">
                      2009 MAZDA CX-954
                    </td>
                    <td className="font-montserrat text-xs">₦140,184.00</td>

                    <td className="font-montserrat text-xs">₦140,184.00</td>
                    <td className="font-montserrat text-xs">₦140,184.00</td>
                    <td className="font-montserrat text-xs">₦140,184.00</td>
                    <td className="font-montserrat text-xs">
                      <span
                        className={`py-2 flex justify-center  w-20 items-center  ${
                          index == 1 ? "bg-primary" : "bg-gray-300"
                        } px-4`}
                        style={{ borderRadius: 10 }}
                      >
                        {index == 1 ? "Sent" : "Draft"}
                      </span>
                    </td>

                    <td className="flex gap-3 items-center justify-center ">
                      <GrEdit
                        size={13}
                        onClick={() => navigate("/edit-invoice")}
                      />
                      <AppSwitch />
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>

        <div className="gap-3 flex  flex-col">
          <div className="flex mb-10  justify-between w-full mt-4">
            <AppTabBtn
              icon={<BsDownload />}
              title="Export Items"
              className="w-full text-[#000] btn-secondary mt-5 md:flex hidden"
              onClick={() => setOpenImport(!openImport)}
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
          <div>
            {/* <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Generate Invoice"
            className="w-full  text-[#000] btn-secondary"
            onClick={() => navigate("/generate-invoice")}
          /> */}
          </div>
        </div>

        <CreateAutoHyveCustomerModal
          openCreatCustomer={openCreatCustomer}
          setOpenCreatCustomer={setOpenCreatCustomer}
        />

        <DeleteModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Are you sure you want to delete this Estimate"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
        />

        <InvoiceDetailsModal
          openInvoiceDetails={openInvoiceDetails}
          setOpenInvoiceDetails={setOpenInvoiceDetails}
        />
      </>
    </DashboardWrapper>
  );
};

export default Invoice;
