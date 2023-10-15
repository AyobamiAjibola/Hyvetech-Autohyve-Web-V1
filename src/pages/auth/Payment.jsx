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
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import useAdmin from "../../hooks/useAdmin";
import settings from "../../config/settings";
import axiosClient from '../../config/axiosClient';
import { getpaymentRecievedAction } from "../../store/actions/transactionActions";
import Pagination from "../../components/Pagination/Pagination";
import moment from "moment";
import { 
  hashString, 
} from 'react-hash-string'
import { Util } from "../../helpers/Util";
import { IconButton } from "@mui/material";
import DeletePaymentModal from "../../components/modals/DeletePaymentModal";

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
  const transactionReducer = useAppSelector(state => state.transactionReducer);
  const dispatch = useAppDispatch();
  const [records, setRecords] = useState([])
  const { isTechAdmin, user } = useAdmin();
  const [receiptData, setReceiptData] = useState(null)
  const [activeRecord, setactiveRecord] = useState(null)
  const [receiptId, setReceiptId] = useState()
  const [_downloading, _setDownloading] = useState(false)
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [transaction, setTransaction] = useState(null);

  const partnerName = (user?.partner?.name || " ")

  const tableData = Array(3).fill("");

  useEffect(()=>{
    // reverse
    const temp = [];
    const __old = transactionReducer?.paymentRecieve || [];

    for (let index = (__old.length - 1); index >= 0; index--) {
      const element = __old[index];
      temp.push(element);
    }

    setRecords(temp);

  }, [transactionReducer?.paymentRecieve]);

  useEffect(()=>{
    if( transactionReducer.deletePaymentRecievedStatus == "completed" ){
      // @ts-ignore
      dispatch(getpaymentRecievedAction());
    }

  }, [transactionReducer.deletePaymentRecievedStatus])

  useEffect(()=>{
    // @ts-ignore
    dispatch(getpaymentRecievedAction());
  }, [dispatch]);

  const _generateDownload = async () => {
    const rName = `${partnerName[0]}RC-${hashString(`${partnerName[0]}C${receiptData?.id}`)}` + '.pdf';

    // @ts-ignore
    const payload = {
      type: 'RECEIPT',
      id: receiptId || -1,
      rName,
    };
    _setDownloading(true);

    try {
      const response = await axiosClient.post(`${settings.api.rest}/request-pdf`, payload);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      _setDownloading(false);
      window.open(`${settings.api.baseURL}/uploads/pdf/${rName}`);
      setShowReceipt(false);
    }, 3000);
  };

    //share pdf logic --- start
  const generateDownload = async () => {
    const rName = `${partnerName[0]}RC-${hashString(`${partnerName[0]}C${receiptData?.id}`)}` + '.pdf';
    // @ts-ignore
    const payload = {
      type: 'RECEIPT',
      id: receiptId || -1,
      rName,
    };
    setDownloading(true);

    try {
      const response = await axiosClient.post(`${settings.api.rest}/request-pdf`, payload);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }

    // setTimeout(() => {
      setDownloading(false);
      setShowReceipt(false);
      dispatch(getpaymentRecievedAction());
    // }, 1000);
  };
  const handleShareLink = async () => {

    generateDownload()

    const fileName = `${partnerName[0]}RC-${hashString(`${partnerName[0]}C${receiptData?.id}`)}`
    const fileUrl  = `${settings.api.baseURL}/uploads/pdf/${fileName}.pdf`;
    const message = `${receiptData?.invoice?.estimate?.partner.name} has sent you a receipt.\nAmount Paid: NGN${formatNumberToIntl(receiptData?.amount)}\n\n` + fileUrl

    try {

      const shareData = {
        title: 'Receipt',
        text: `${message}`
        // url: fileUrl
      };

      await navigator.share(shareData);

      console.log('File shared successfully');
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  const handleShareLinkNoMessage = async () => {

    generateDownload()

    const fileName = `${partnerName[0]}RC-${hashString(`${partnerName[0]}C${receiptData?.id}`)}`
    const fileUrl  = `${settings.api.baseURL}/uploads/pdf/${fileName}.pdf`;

    try {
      const shareData = {
        title: 'Receipt',
        // text: `${message}`
        url: fileUrl
      };

      await navigator.share(shareData);

      console.log('File shared successfully');
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  const handleSharePdf = async () => {
    generateDownload()

    const fileName = `${partnerName[0]}RC-${hashString(`${partnerName[0]}C${receiptData?.id}`)}`
    const fileUrl  = `${settings.api.baseURL}/uploads/pdf/${fileName}.pdf`;
    const message = `${receiptData?.invoice?.estimate?.partner.name} has sent you a receipt.`

    try {
      const response = await axiosClient.get(fileUrl, { responseType: 'blob' });
      const blob = response.data;
      const file = new File([blob], `${message} - ${fileName}_receipt.pdf`, { type: 'application/pdf' });

      const shareData = {
        title: 'Receipt',
        text: `${message}`,
        // url: fileUrl
        files: [file]
      };

      await navigator.share(shareData);

      console.log('File shared successfully');
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };
  //share pdf logic --- end


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

    // Function to handle changes in the search input
    const handleSearchChange = (e) => {
      const inputValue = e.target.value;
      const cleanedInput = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
  
      setSearchQuery(cleanedInput);
      setCurrentPage(1); // Reset to the first page when the search query changes
    };
  
    // Function to filter data based on the search query
    const filteredData = records.filter((item) =>
      item.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoice.code.includes(searchQuery) 
    );
  
    const itemsPerPage = filteredData.length === records.length ? 10 : filteredData.length;
  
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

            {currentData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={(e) => {
                      openDetails(e)
                      setTransaction(item)
                    }}
                    className="table-hover cursor-pointer"
                    key={index}
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

                    <td className="font-montserrat text-xs">{moment(item.updatedAt).format('DD/MM/YYYY')}</td>
                    <td className="font-montserrat text-xs">{`${partnerName[0]}RC-${hashString(`${partnerName[0]}C${item.id}`)}`}</td>
                    <td className="font-montserrat flex items-center gap-2 text-xs">
                      <img
                        src={ item.customer.profileImageUrl ? `${API_ROOT}/${item.customer.profileImageUrl}` : profilePicx }
                        alt="customer photo"
                        crossOrigin="anonymous"
                        className="w-[20px] h-[20px]"
                      />
                      <span>{`${item.customer?.firstName || ""} ${item.customer?.lastName || ""}`}</span>
                    </td>
                    <td className="font-montserrat text-xs">{item.invoice.code.split('_')[0]}</td>
                    <td className="font-montserrat text-xs">{item.type}</td>
                    <td className="font-montserrat text-xs">{Util.formAmount(item.amount)}</td>

                    <td className="flex gap-3 items-center justify-center ">
                      <IconButton
                        onClick={(e) => {closeDeleteModal(e), 
                          setTransaction(item)
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

        <div className="md:block gap-3 flex flex-col">
          {filteredData.length !== 0 && (<Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />)}
        </div>

        <DeletePaymentModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Delete Payment"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
          setItem={setTransaction}
          item={transaction}
        />
        <AddPaymentModal
          openAddPayment={openAddPayment}
          setOpenAddPayment={setOpenAddPayment}
        />

        <PaymentDetails
          openPaymentDetails={openPaymentDetails}
          setOpenPaymentDetails={setOpenPaymentDetails}
          setItem={setTransaction}
          item={transaction}
          _downloading={_downloading}
          _generateDownload={_generateDownload}
          handleShareLink={handleShareLink}
          handleShareLinkNoMessage={handleShareLinkNoMessage}
          handleSharePdf={handleSharePdf}
          downloading={downloading}
        />
      </>
    </DashboardWrapper>
  );
};

export default Payment;
