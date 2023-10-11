import React, { useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
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
import AppBtn from "../../components/AppBtn/AppBtn";
import useNewCustomer from "../../hooks/useNewCustomer";
import Pagination from "../../components/Pagination/Pagination";
import { current } from "@reduxjs/toolkit";
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
import { importCustomerAction } from "../../store/actions/customerActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import Joi from 'joi'
import { showMessage } from "../../helpers/notification";
import { clearImportCustomerStatus } from "../../store/reducers/customerReducer";
import settings from "../../config/settings";

const API_ROOT = settings.api.baseURL;

const headers = [
  { label: "First Name", key: "firstname" },
  { label: "Last Name", key: "lastname" },
  { label: "Email", key: "email" },
  { label: "Phone", key: "phone" },
  { label: "Address", key: "address" }
];

const data = [
  { 
    firstname: "Ahmed", 
    lastname: "Tomi", 
    email: "ah@smthing.co.com",
    phone: "080319675678",
    address: "abc street abuja"
  },
];

const Customers = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const [customerId, setCustomerId] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    accounts: [],
  });
  const dispatch = useAppDispatch();
  const customerReducer = useAppSelector(state => state.customerReducer);
  const { rows } = useNewCustomer();
  const navigate = useNavigate();
  const refOne = useRef(null);
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenImport(false);
      setForm({...form, accounts: []})
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

  const closeDeleteModal = (event, id) => {
    setCustomerId(id)
    event.stopPropagation();
    setDeletemodal(!deletemodal);
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
    const cleanedInput = inputValue.replace(/[^a-zA-Z ]/g, '');

    setSearchQuery(cleanedInput);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  // Function to filter data based on the search query
  const filteredData = rows.filter((item) =>
    item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = filteredData.length === rows.length ? 10 : filteredData.length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCreate = async ()=>{
    // check if all entry are valid
    const {error} = Joi.object({
        accounts: Joi.array().required().label("Account File")
    }).validate(form)

    // console.log(error)
    if(error){
        setError({message: error.message})
        return
    }

    // // @ts-ignore
    dispatch(importCustomerAction(form))
  }

  const parsePhone = (phone) => {
    if (!phone) {
      return "";
    }

    if (phone.startsWith("0")) return phone.replace("0", "234");
    if (!phone.startsWith("0")) {
      return "234" + phone;
    }

    return phone;
  };

  const handleChange = (e) => {
    const file = (e.target.files[0]);

    const fileReader = new FileReader();

    if(file.type === 'text/csv'){
      setIsLoading(true)
      fileReader.readAsText(file, "utf-8"); 
      fileReader.onload = function() {
        try{
          const values = fileReader?.result.split('\n').map(value => value.replace(/"/g, ''));
          const _temp = values.slice(1).map((_res)=>{
            const _object = _res.split(',');
            return {
              firstName: _object[0],
              lastName: _object[1],
              email: _object[2],
              phone: parsePhone(_object[3]),
              address: _object[4]
            }
          })
  
        setForm({...form, accounts: _temp})
        }catch(error){
          console.log(error)
        }
        
        setIsLoading(false)
      }; 
    } else {
      setIsLoading(true)
      fileReader.readAsBinaryString(file); 
      fileReader.onload = (evt) => { // evt = on_file_select event
        /* Parse data */
        // @ts-ignore
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws);

        try{
          const _item = (data.toString() || '').split("\n");
          const _temp = _item.slice(1).map((_res)=>{
            const _object = _res.split(',');
            return {
              firstName: _object[0],
              lastName: _object[1],
              email: _object[2],
              phone: parsePhone(_object[3]),
              address: _object[4]
            }
          })

        setForm({...form, accounts: _temp});
        }catch(error){
          console.log(error)
        }
        setIsLoading(false)
      };
    }

    fileReader.onerror = function() {
      setIsLoading(false)
      alert(fileReader.error);
    };

    // setIsLoading(false)
  }

  useEffect(() => {
    if(customerReducer.importCustomerStatus === 'completed') {
      showMessage(
        "Import customer",
        customerReducer.importCustomerSuccess,
        "success"
      )
      setOpenImport(false)
      setForm({...form, accounts: []})
    } else if(customerReducer.importCustomerStatus === 'failed') {
      showMessage(
        "Import customer",
        customerReducer.importCustomerError,
        "error"
      )
      setOpenImport(false)
      setForm({...form, accounts: []})
    }

    return () => {
      dispatch(clearImportCustomerStatus())
    }
  },[customerReducer.importCustomerStatus]);

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
                  <CSVLink
                    data={data} 
                    headers={headers} 
                    className="font-semibold"
                    filename={"customer_template.csv"}
                  >
                    Download Template
                  </CSVLink>
                </span>

                {/* <input type="file" id="cac-btn" hidden accept={".csv"}
                  onChange={e => handleChange(e)}
                /> */}
                <input
                  type="file"
                  id="cac-btn"
                  hidden
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={e => handleChange(e)}
                />
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
                  {form.accounts.length !== 0 && (<span className="text-[8px] font-montserrat font-bold text-[red]">
                      Sending ({form.accounts.length}) customer(s) for registration
                    </span>)
                  }
                </label>

                <AppBtn
                  type="submit"
                  title="CREATE"
                  className="mt-5 w-full"
                  titleClassName="font-medium"
                  onClick={() => {
                    handleCreate()
                  }}
                  spinner={isLoading || customerReducer.importCustomerStatus === 'loading'}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-5 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput
              handleSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />
          </div>

          <TableCountTitile
            title={`Showing ${itemsPerPage} 
            results out of ${rows.length}`}
          />
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
              <th className="font-montserrat text-xs text-left">Email</th>
              <th className="font-montserrat text-xs text-left">Address</th>
              <th className="font-montserrat text-xs text-left">Action</th>
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
                  <tbody key={index}>
                    <tr
                      onClick={() => navigate(`/autoHyveProfile/${item.id}`, { state: { item } })}
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
                          src={ item.profileImageUrl ? `${API_ROOT}/${item.profileImageUrl}` : profilePicx }
                          alt=""
                          className="w-[20px] h-[20px]"
                        />
                        <span>{item.title || ''} {item.firstName} {item.lastName || ''}</span>
                      </td>
                      <td className="font-montserrat text-xs">
                        {item.companyName ? item.companyName : ''}
                      </td>
                      <td className="font-montserrat text-xs">{ item.phone }</td>
                      <td className="font-montserrat text-xs">
                        {item.email}
                      </td>
                      <td className="font-montserrat text-xs">
                        {item.contacts[0].address}
                      </td>

                      <td className="flex gap-3 items-center justify-center ">
                        <HiOutlineTrash
                          size={15}
                          className="text-center cursor-pointer"
                          onClick={(event, id) => closeDeleteModal(event, item.id)}
                        />
                      </td>
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

        <CreateAutoHyveCustomerModal
          openCreatCustomer={openCreatCustomer}
          setOpenCreatCustomer={setOpenCreatCustomer}
        />

        <DeleteModal
          customerId={customerId}
          setCustomerId={setCustomerId}
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
