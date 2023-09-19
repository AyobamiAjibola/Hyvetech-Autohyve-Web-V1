import React, { useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppBtn from "../../components/AppBtn/AppBtn";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import { AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
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
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import TableActionButton from "../../components/TableActionButton/TableActionButton";

const Customers = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
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

  const closeDeleteModal = (event) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
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
          <Sorting
            items={items}
            select={select}
            setSelect={setSelect}
            className="w-[100%]"
          />
          <div className="flex w-full gap-3 items-end justify-end">
            <AppTabBtn
              icon={<AiOutlinePlus />}
              title="Add Customer"
              className=" text-[#000] btn-secondary  md:w-[210px] w-[100%]"
              onClick={() => setOpenCreatCustomer(true)}
            />

            <AppTabBtn
              icon={<BsDownload />}
              title="Import Customers"
              className=" text-[#000] btn-secondary relative  md:w-[210px] w-[100%]"
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
                    <span className="text-[#FAA21B] font-semibold">Browse</span>{" "}
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
        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-5 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput />
          </div>

          <TableCountTitile />
        </div>

        <div className="mt-4" style={{ overflowX: "scroll" }}>
          <table border={1} className="paymentTableCustomer w-[1200px]">
            <thead>
              <th className="font-montserrat    text-xs text-left">
                <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
              </th>
              <th className="font-montserrat    text-xs text-left">
                Full name
              </th>
              <th className="font-montserrat text-xs text-left">
                Company’s name
              </th>
              <th className="font-montserrat     text-xs text-left">
                Phone number
              </th>
              <th className="font-montserrat    text-xs text-left">Email</th>
              <th className="font-montserrat   text-xs text-left">Address</th>
              <th className="font-montserrat  text-xs text-left">Action</th>
            </thead>

            {tableData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={() => navigate("/autoHyveProfile")}
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
                      <img
                        src={profilePicx}
                        alt=""
                        className="w-[20px] h-[20px]"
                      />
                      <span>David James</span>
                    </td>
                    <td className="font-montserrat text-xs">
                      StellarTech Solutions
                    </td>
                    <td className="font-montserrat text-xs">08123456789</td>
                    <td className="font-montserrat text-xs">
                      ejikeemmanuel880@gmail.com
                    </td>
                    <td className="font-montserrat text-xs">
                      Jabi Lake Mall (FCT)
                    </td>

                    <td className="flex gap-3 items-center justify-center ">
                      <HiOutlineTrash
                        size={15}
                        className="text-center cursor-pointer"
                        onClick={closeDeleteModal}
                      />
                      {/* <Link to="/autoHyveProfile">
                        <AiOutlineEye size={15} className="cursor-pointer" />
                      </Link> */}
                    </td>
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

        <CreateAutoHyveCustomerModal
          openCreatCustomer={openCreatCustomer}
          setOpenCreatCustomer={setOpenCreatCustomer}
        />

        <DeleteModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Delete Customer"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
        />
      </>
    </DashboardWrapper>
  );
};

export default Customers;
