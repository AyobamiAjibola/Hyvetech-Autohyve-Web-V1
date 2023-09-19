import React, { useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppBtn from "../../components/AppBtn/AppBtn";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import TrashIcon from "../../assets/svgs/vuesax/linear/trash.svg";
import { BsDownload } from "react-icons/bs";
import Sorting from "../../components/Sorting/Sorting";
import documentupload from "../../assets/images/document-upload.png";
import CreateAutoHyveCustomerModal from "../../components/AutoHyveModals/CreateAutoHyveCustomerModal";
import SearchInput from "../../components/SearchInput/SearchInput";
import DownloadIcon from "../../assets/images/export.png";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "../../components/modals/DeleteModal";
import profilePicx from "../../assets/images/profilePicx.png";
import { Link, useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import EstimateDetailsModal from "../../components/AutoHyveModals/EstimateDetailsModal";
import AddPaymentModal from "../../components/AutoHyveModals/AddPaymentModal";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import TableActionButton from "../../components/TableActionButton/TableActionButton";
import AppSwitch from "../../components/AppSwitch/AppSwitch";
import PaymentDetails from "../../components/AutoHyveModals/PaymentDetails";

const Payment = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [openPaymentDetails, setOpenPaymentDetails] = useState(false);

  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const [openEstimateDetails, setOpenEstimateDetails] = useState(false);
  const navigate = useNavigate();
  const refOne = useRef(null);
  const tableData = Array(3).fill("");
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenImport(false);
    }
  };

  const items = [
    "Name (Ascending)",
    "Name (Descending)",
    "Date (Ascending)",
    "Date (Descending)",
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
    setOpenPaymentDetails(!openPaymentDetails);
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
            icon={<BsDownload />}
            title="Export Items"
            className="w-full md:hidden flex text-[#000] btn-secondary"
            // onClick={() => navigate("/generate-invoice")}
          />

          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Add New Payment"
            className="md:w-[250px] w-[100%] mt-3 text-[#000] btn-secondary  flex"
            onClick={() => setOpenAddPayment(true)}
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
            className="md:w-[100%] w-[1200px]"
            border={1}
            style={{ borderRadius: 20, overflow: "clip" }}
          >
            <thead>
              <th className="font-montserrat    text-xs text-left">
                <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
              </th>
              <th className="font-montserrat    text-xs text-left">Date</th>
              <th className="font-montserrat text-xs text-left">Receipt #</th>
              <th className="font-montserrat     text-xs text-left">
                Customer Name
              </th>
              <th className="font-montserrat    text-xs text-left">
                Reference
              </th>
              <th className="font-montserrat   text-xs text-left">
                Mode of Payment
              </th>
              <th className="font-montserrat  text-xs text-left">
                Amount Paid
              </th>
              <th className="font-montserrat  text-xs text-left">Action</th>
            </thead>

            {tableData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={openDetails}
                    className="table-hover cursor-pointer"
                  >
                    <td
                      className="font-montserrat text-xs table-hover cursor-pointer"
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

                    <td className="font-montserrat text-xs">24/05/2023</td>
                    <td className="font-montserrat text-xs">EST-53019</td>
                    <td className="font-montserrat flex items-center gap-2 text-xs">
                      <img
                        src={profilePicx}
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <span>Mr Olusola Segun</span>
                    </td>
                    <td className="font-montserrat text-xs">INV-53003</td>
                    <td className="font-montserrat text-xs">Transfer</td>
                    <td className="font-montserrat text-xs">140,184.00</td>

                    <td className="flex gap-3 items-center justify-center ">
                      <img
                        src={TrashIcon}
                        alt=""
                        className="w-[15px] cursor-pointer"
                        onClick={closeDeleteModal}
                      />
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>

        <div className="md:block gap-3 flex flex-col">
          <div className="flex justify-between mb-10  w-full mt-4">
            <AppTabBtn
              icon={<BsDownload />}
              title="Export Items"
              className="w-full md:flex hidden text-[#000] btn-secondary"
              // onClick={() => navigate("/generate-invoice")}
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
        </div>

        <DeleteModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Delete Payment"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
        />
        <AddPaymentModal
          openAddPayment={openAddPayment}
          setOpenAddPayment={setOpenAddPayment}
        />

        <PaymentDetails
          openPaymentDetails={openPaymentDetails}
          setOpenPaymentDetails={setOpenPaymentDetails}
        />
      </>
    </DashboardWrapper>
  );
};

export default Payment;
