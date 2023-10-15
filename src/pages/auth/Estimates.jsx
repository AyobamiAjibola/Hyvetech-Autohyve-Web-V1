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
import useEstimate from "../../hooks/useEstimate";
import Pagination from "../../components/Pagination/Pagination";
import moment from "moment";
import settings from "../../config/settings";
import { Util } from "../../helpers/Util";
import { ESTIMATE_STATUS } from "../../config/constants";
import { IconButton } from "@mui/material";
import DeleteEstimateModal from "../../components/modals/DeleteEstimateModal";

const API_ROOT = settings.api.baseURL;

const Estimates = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const [openEstimateDetails, setOpenEstimateDetails] = useState(false);
  const navigate = useNavigate();
  const refOne = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemId, setItemId] = useState(-1);
  const [estimate, setEstimate] = useState(null)
  const { 
    estimates, 
    onDelete, 
    setShowDelete, 
    showDelete
  } = useEstimate();
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
    // setDeletemodal(!deletemodal);
    setShowDelete(!showDelete)
  };

  const openDetails = (e) => {
    e.stopPropagation();
    setOpenEstimateDetails(!openEstimateDetails);
  };

    // Function to handle changes in the search input
    const handleSearchChange = (e) => {
      const inputValue = e.target.value;
      const cleanedInput = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
  
      setSearchQuery(cleanedInput);
      setCurrentPage(1); // Reset to the first page when the search query changes
    };
  
    // Function to filter data based on the search query
    const filteredData = estimates.filter((item) =>
      item.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const itemsPerPage = filteredData.length === estimates.length ? 10 : filteredData.length;
  
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

  return (
    <DashboardWrapper>
      <>
        <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
          {/* <AppTabBtn
            icon={<BsDownload />}
            title="Export Items"
            className="w-full text-[#000] btn-secondary md:hidden flex"
            onClick={() => setOpenImport(!openImport)}
          />
          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Generate Estimate"
            className="w-full  text-[#000] btn-secondary md:hidden flex"
            onClick={() => navigate("/generate-estimate")}
          /> */}
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
              onClick={() => navigate("/generate-estimate")}
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
            <SearchInput
              handleSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />
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

            {currentData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={(e) => {openDetails(e), setEstimate(item)}}
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

                    <td className="font-montserrat text-xs">{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                    <td className="font-montserrat text-xs">{item.code.split('_')[0]}</td>
                    <td className="font-montserrat flex items-center gap-2 text-xs">
                      <img
                        src={ item.profileImageUrl ? `${API_ROOT}/${item.profileImageUrl}` : profilePicx }
                        alt="customer photo"
                        crossOrigin="anonymous"
                        className="w-[20px] h-[20px]"
                      />
                      <span>{item.customer.title || ''} {item.customer.firstName || ''} {item.customer.lastName || ''}</span>
                    </td>
                    <td className="font-montserrat text-xs">
                      {item.vehicle 
                        ? `${item.vehicle.modelYear} 
                            ${item.vehicle.make}
                            ${item.vehicle.model}
                          ` 
                        : ''}
                    </td>
                    <td className="font-montserrat text-xs">{Util.formAmount(item.grandTotal)}</td>
                    <td className="font-montserrat text-xs">
                      <span
                        className={`py-2 flex justify-center  w-20 items-center  ${
                          item.status === ESTIMATE_STATUS.sent
                            ? "bg-primary" 
                            : item.status === ESTIMATE_STATUS.draft 
                              ? "bg-gray-300"
                              : "bg-[green]"
                        } px-4`}
                        style={{ borderRadius: 10 }}
                      >
                        {item.status === ESTIMATE_STATUS.sent 
                          ? "Sent" 
                          : item.status === ESTIMATE_STATUS.draft
                            ? "Draft"
                            : "Invoiced"
                        }
                      </span>
                    </td>

                    <td className="flex gap-3 items-center justify-center ">
                      <IconButton
                        onClick={() => {
                          navigate("/edit-estimate", { state: { item } })
                          sessionStorage.setItem('estimateCode', item.code.split('_')[0])
                        }}
                      >
                        <GrEdit
                          size={13}
                        />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          setItemId(item.id)
                          closeDeleteModal(e)
                        }}
                      >
                        <img
                          src={TrashIcon}
                          alt=""
                          className="w-[15px] cursor-pointer"
                        />
                      </IconButton>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>

        <div className="md:flex hidden  mb-10 justify-end w-full mt-4">
          {filteredData.length !== 0 && (<Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />)}
        </div>

        <div className="md:hidden gap-3 flex flex-col">
          {filteredData.length !== 0 && (<Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />)}
        </div>

        <CreateAutoHyveCustomerModal
          openCreatCustomer={openCreatCustomer}
          setOpenCreatCustomer={setOpenCreatCustomer}
        />

        <DeleteEstimateModal
          deletemodal={showDelete}
          setDeletemodal={setShowDelete}
          title={"Are you sure you want to delete this Estimate"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
          itemId={itemId}
          setItemId={setItemId}
        />

        <EstimateDetailsModal
          openEstimateDetails={openEstimateDetails}
          setOpenEstimateDetails={setOpenEstimateDetails}
          estimate={estimate}
          setEstimate={setEstimate}
        />
      </>
    </DashboardWrapper>
  );
};

export default Estimates;
