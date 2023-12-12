import React, { useCallback, useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import Sorting from "../../components/Sorting/Sorting";
import CreateAutoHyveCustomerModal from "../../components/AutoHyveModals/CreateAutoHyveCustomerModal";
import SearchInput from "../../components/SearchInput/SearchInput";
import profilePicx from "../../assets/images/profilePicx.png";
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import TrashIcon from "../../assets/svgs/vuesax/linear/trash.svg";
import InvoiceDetailsModal from "../../components/AutoHyveModals/InvoiceDetailsModal";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import { BsDownload } from "react-icons/bs";
import Pagination from "../../components/Pagination/Pagination";
import useInvoice from "../../hooks/useInvoice";
import DeleteInvoiceModal from "../../components/modals/DeleteInvoiceModal";
import moment from "moment";
import settings from "../../config/settings";
import { Util } from "../../helpers/Util";
import { INVOICE_STATUS, LOCAL_STORAGE } from "../../config/constants";
import { IconButton } from "@mui/material";
import useAppSelector from "../../hooks/useAppSelector";
import useRouterQuery from "../../hooks/useRouterQuery";
import useAppDispatch from "../../hooks/useAppDispatch";
import { resetInitRefundCustomerStatus, resetVerifyRefundCustomerStatus, setOpenTransactionPopup } from "../../store/reducers/transactionReducer";
import { verifyRefundCustomerAction } from "../../store/actions/transactionActions";
import { getInvoicesAction } from "../../store/actions/invoiceActions";
import { clearSendInvoiceStatus } from "../../store/reducers/invoiceReducer";

const Invoices = () => {
  const [openCreatCustomer, setOpenCreatCustomer] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const [openInvoiceDetails, setOpenInvoiceDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceId, setInvoiceId] = useState<number>(-1);
  const navigate = useNavigate();

  const transactionReducer = useAppSelector((state) => state.transactionReducer);
  const invoiceReducer = useAppSelector(state => state.invoiceReducer)

  const routerQuery = useRouterQuery();
  const dispatch = useAppDispatch();

  const {
    invoices
  } = useInvoice()
  
  const refOne = useRef<any>(null);
  const hideOnClickOutside = (e: any) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenImport(false);
    }
  };

  const items = [
    "Record Payment",
    "Record expenses",
    "Download PDF",
    "Share",
    "Add Reminder"
  ];

  // Function to handle changes in the search input
  const handleSearchChange = (e: any) => {
    const inputValue = e.target.value;
    const cleanedInput = inputValue.replace(/[^a-zA-Z ]/g, '');

    setSearchQuery(cleanedInput);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  // Function to filter data based on the search query
  const filteredData = invoices.filter((item) =>
    item.estimate.customer?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.estimate.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.estimate.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.includes(searchQuery)
  );

  const itemsPerPage = filteredData.length === invoices.length ? 10 : filteredData.length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const toggleCarts = (id: any) => {
    //@ts-ignore
    if (checkBoxValue.includes(id)) {
      // already exist
      let _tmp: any = [];
      for (let i = 0; i < checkBoxValue.length; i++) {
        const __data = checkBoxValue[i];

        if (__data != id) {
          _tmp.push(__data);
        }
      }
      setCheckBoxValue(_tmp);
    } else {
      // add
      //@ts-ignore
      setCheckBoxValue([...[id], ...checkBoxValue]);
    }
  };

  const closeDeleteModal = (event: any) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
  };

  const openDetails = (event: any) => {
    event.stopPropagation();
    setOpenInvoiceDetails(!openInvoiceDetails);
  };

  useEffect(() => {
    const reference = routerQuery.get("reference");
    const cancelPayment = routerQuery.get("pay_canceled");

    if (reference) {
      localStorage.setItem(LOCAL_STORAGE.referenceNumber, reference);
    }

    if (cancelPayment) {
      localStorage.setItem(LOCAL_STORAGE.payCancelled, cancelPayment);
    }
  }, [routerQuery]);

  const handleClosePaymentModal = useCallback(() => {
    dispatch(resetInitRefundCustomerStatus());
    dispatch(resetVerifyRefundCustomerStatus());
    dispatch(setOpenTransactionPopup(false));
  }, [dispatch]);

  const handleLocalStorage = useCallback(
    (ev: StorageEvent) => {
      if (
        ev.key === LOCAL_STORAGE.referenceNumber &&
        ev.newValue &&
        transactionReducer.invoiceId
      ) {
        void dispatch(
          verifyRefundCustomerAction({
            reference: ev.newValue,
            invoiceId: transactionReducer.invoiceId,
          })
        );
      }

      if (ev.key === LOCAL_STORAGE.payCancelled && ev.newValue) {
        handleClosePaymentModal();
      }
    },
    [dispatch, handleClosePaymentModal, transactionReducer.invoiceId]
  );

  useEffect(() => {
    window.addEventListener("storage", handleLocalStorage);

    return () => {
      window.removeEventListener("storage", handleLocalStorage);
    };
  }, [handleLocalStorage]);

  useEffect(() => {
    if (transactionReducer.verifyRefundCustomerStatus === "completed") {
      localStorage.removeItem(LOCAL_STORAGE.referenceNumber);
      localStorage.removeItem(LOCAL_STORAGE.payCancelled);
      handleClosePaymentModal();
      dispatch(getInvoicesAction());
    }
  }, [
    dispatch,
    handleClosePaymentModal,
    transactionReducer.authorizationUrl,
    transactionReducer.verifyRefundCustomerStatus,
  ]);

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

          {/* <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Generate Invoice"
            className="md:w-[200px] w-[100%] text-[#000] btn-secondary flex"
            onClick={() => navigate("/generate-invoice")}
          /> */}
          <AppTabBtn
            icon={<BsDownload />}
            title="Export Items"
            className="w-full text-[#000] btn-secondary mt-5 md:hidden flex"
            onClick={() => setOpenImport(!openImport)}
          />
        </div>

        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-5 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput 
              handleSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />
          </div>

          <TableCountTitile 
            title={`Showing ${startIndex + 1} - ${endIndex} of ${filteredData.length} results`}
            className=''
          />
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

            {currentData?.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={(e) => {setInvoiceId(item.id), openDetails(e)}}
                    className="cursor-pointer table-hover"
                    key={index}
                  >
                    <td
                      className="font-montserrat text-xs cursor-pointer"
                      // onClick={() => toggleCarts(index)}
                    >
                      {/* {[
                        //@ts-ignore
                        checkBoxValue.includes(index) ? (
                          <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                            <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                          </div>
                        ) : (
                          <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                        ),
                      ]} */}
                      <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                    </td>

                    <td className="font-montserrat text-xs">{moment(item.createdAt).format('DD-MM-YYYY')}</td>
                    <td className="font-montserrat text-xs">{item.code.split('_')[0]}</td>
                    <td className="font-montserrat flex items-center gap-2 text-xs">
                      <img
                        src={ item.estimate.customer.profileImageUrl ? `${settings.api.baseURL}/${item.estimate.customer.profileImageUrl}` : profilePicx }
                        alt=""
                        crossOrigin="anonymous"
                        className="w-[20px] h-[20px]"
                      />
                      <span>{item.estimate.customer.title || ''} {item.estimate.customer.firstName || ''} {item.estimate.customer.lastName || ''}</span>
                    </td>
                    <td className="font-montserrat text-xs">
                      {item.estimate.vehicle.modelYear || ''} {item.estimate.vehicle.make || ''} {item.estimate.vehicle.model || ''}
                    </td>
                    <td className="font-montserrat text-xs">{Util.formAmount(item.grandTotal)}</td>

                    <td className="font-montserrat text-xs">{Util.formAmount(item.paidAmount)}</td>
                    <td className="font-montserrat text-xs">{Util.formAmount(item.dueAmount)}</td>
                    <td className="font-montserrat text-xs">{Util.formAmount(item.refundable)}</td>
                    <td className="font-montserrat text-xs">
                      <span
                        className={`py-2 flex justify-center  w-22 items-center font-bold ${
                          item.status == INVOICE_STATUS.paid
                            ? "bg-[green]" 
                            : item.status === INVOICE_STATUS.deposit && item.depositAmount != 0
                              ? "bg-primary"
                              : item.status === INVOICE_STATUS.deposit && item.depositAmount == 0
                                ? "bg-[#E43434]"
                                : item.status === INVOICE_STATUS.overDue ? "bg-[red]" : null
                        } px-4`}
                        style={{ borderRadius: 10 }}
                      >
                        {item.status == INVOICE_STATUS.paid 
                          ? "Fully Paid" 
                          : item.status === INVOICE_STATUS.deposit && item.depositAmount != 0
                            ? item.depositAmount != 0 ? "Partially Paid" : ""
                            : item.status === INVOICE_STATUS.deposit && item.depositAmount == 0
                              ? item.depositAmount != 0 ? "" : "Not Paid"
                              : item.status === INVOICE_STATUS.overDue ? INVOICE_STATUS.overDue : null
                        }
                      </span>
                    </td>

                    <td className="flex gap-3 items-center justify-center ">
                      <IconButton
                        onClick={() => {
                          navigate("/edit-invoice", { state: { item } })
                          // sessionStorage.setItem('invoiceCode', item.code.split('_')[0])
                        }}
                      >
                        <GrEdit
                          size={13}
                        />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          setInvoiceId(item.id)
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

        <div className="gap-3 flex  flex-col">
          <div className="flex mb-10  justify-between w-full mt-4">
            <AppTabBtn
              icon={<BsDownload />}
              title="Export Items"
              className="w-full text-[#000] btn-secondary mt-5 md:flex hidden"
              onClick={() => setOpenImport(!openImport)}
            />
            <div className="flex items-center gap-3">
              {filteredData.length !== 0 && (<Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />)}
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

        <DeleteInvoiceModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Are you sure you want to delete this Invoice"}
          closeDeleteModal={closeDeleteModal}
          itemId={invoiceId}
          setItemId={setInvoiceId}
        />

        <InvoiceDetailsModal
          openInvoiceDetails={openInvoiceDetails}
          setOpenInvoiceDetails={setOpenInvoiceDetails}
          invoiceId={invoiceId}
          setInvoiceId={setInvoiceId}
        />
      </>
    </DashboardWrapper>
  );
};

export default Invoices;
