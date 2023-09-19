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
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";

const Estimates = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
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
    setOpenEstimateDetails(!openEstimateDetails);
  };

  return (
    <DashboardWrapper>
      <>
        <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
          <AppTabBtn
            icon={<BsDownload />}
            title="Export Items"
            className="w-full text-[#000] btn-secondary md:hidden flex"
            onClick={() => setOpenImport(!openImport)}
          />
          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Generate Estimate"
            className="w-full  text-[#000] btn-secondary md:hidden flex"
            onClick={() => navigate("/generate-estimate-estimate")}
          />
          <Sorting
            items={items}
            select={select}
            setSelect={setSelect}
            className="w-[100%]"
          />
          <div className="md:flex gap-3 hidden">
            <AppTabBtn
              icon={<AiOutlinePlus />}
              title="Generate Estimate"
              className="w-[200px]  text-[#000] btn-secondary"
              onClick={() => navigate("/generate-estimate-estimate")}
            />
            <div className="relative">
              <AppTabBtn
                icon={<BsDownload />}
                title="Export Items"
                className="w-[200px] text-[#000] btn-secondary"
                onClick={() => setOpenImport(!openImport)}
              />
              {openImport && (
                <div
                  ref={refOne}
                  className="upload-dropdown   text-center z-50 w-full flex w flex-col justify-center items-center px-8 mt-4 p-6"
                >
                  <h1 className="font-montserrat font-semibold text-base mb-1">
                    Import Customers
                  </h1>
                  <span className="text-[10px] font-montserrat">
                    We advise our template be downloaded as a guide on what is
                    required, re-fill with real data only.{" "}
                    <span className="font-semibold">Download Template</span>
                  </span>

                  <input type="file" id="cac-btn" hidden />
                  <label
                    htmlFor="cac-btn"
                    className="dotted-box py-6 flex flex-col mt-4 cursor-pointer"
                  >
                    <img
                      src={documentupload}
                      alt=""
                      className="w-[30px] h-[30px]"
                    />

                    <p className="text-xs font-montserrat mt-2">
                      Drop your file here, or{" "}
                      <span className="text-[#FAA21B] font-semibold">
                        Browse
                      </span>{" "}
                    </p>
                    <span className="text-[8px] text-[#3E3E3E]">
                      Maximum file size is 50mb
                    </span>
                  </label>

                  <AppBtn
                    title="CREATE"
                    className="mt-5 w-full"
                    titleClassName="font-medium"
                  />
                </div>
              )}
            </div>
          </div>
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
              <th className="font-montserrat text-xs text-left">Estimate</th>
              <th className="font-montserrat     text-xs text-left">
                Full name
              </th>
              <th className="font-montserrat    text-xs text-left">Vehicle</th>
              <th className="font-montserrat   text-xs text-left">
                Grand Total
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
                    <td className="font-montserrat text-xs">EST-53019</td>
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
                        onClick={() => navigate("/edit-estimate")}
                      />
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

        <div className="md:flex hidden  mb-10 justify-end w-full mt-4">
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

        <div className="md:hidden gap-3 flex flex-col">
          <div className="flex justify-start mb-10 md:justify-end w-full mt-4">
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

        <EstimateDetailsModal
          openEstimateDetails={openEstimateDetails}
          setOpenEstimateDetails={setOpenEstimateDetails}
        />
      </>
    </DashboardWrapper>
  );
};

export default Estimates;
