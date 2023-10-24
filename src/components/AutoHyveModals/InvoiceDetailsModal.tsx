import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Hypelogo from "../../assets/images/Hypelogo.png";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import settings from "../../config/settings";
import { Util } from "../../helpers/Util";
import { INVOICE_STATUS } from "../../config/constants";
import { IEstimate, IInvoice } from "@app-models";
import capitalize from "capitalize";
import { ILabour, IPart } from "../Forms/models/estimateModel";
import useAppSelector from "../../hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAdmin from "../../hooks/useAdmin";
import moment from "moment";
import axiosClient from "../../config/axiosClient";
import { makeStyles } from "@mui/styles";
import { setInvoiceCode } from "../../store/reducers/expenseReducer";
import { getExpensesAction } from "../../store/actions/expenseAction";
import { getInvoicesAction, getSingleInvoice } from "../../store/actions/invoiceActions";
import { wordBreaker } from "../../utils/generic";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AddPaymentModal from "./AddPaymentModal";
import AddNewExpensesModal from "./AddNewExpensesModal";
import AddNewReminderModal from "./AddNewReminderModal";
import { getPreferencesActions } from "../../store/actions/partnerActions";

const useStyles = makeStyles({
  select: {
    "&:hover": {
      background: "#F1F0F1",
    },
  },
});

const API_ROOT = settings.api.rest;
const BASE_URL = settings.api.baseURL;

const InvoiceDetailsModal = ({ 
  openInvoiceDetails, 
  setOpenInvoiceDetails, 
  invoiceId, 
  setInvoiceId }: any) => {
  const [toggleReport, setToggleReport] = useState(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const classes = useStyles();
  const [estimate, setEstimate] = useState<IEstimate | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>();
  const [owner, setOwner] = useState<string>("");
  const [parts, setParts] = useState<IPart[]>([]);
  const [labours, setLabours] = useState<ILabour[]>([]);
  const [_driver, setDriver] = useState<any>(null);
  const [billingInformation, setBillingInformation] =
    useState<any>();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [newExpenses, setNewExpenses] = useState<boolean>(false);
  const [openNewReminder, setOpenNewReminder] = useState<boolean>(false);
  const [preference, setPreference] = useState('');

  const { isTechAdmin } = useAdmin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const store = useAppSelector((state) => state.invoiceReducer);
  const expenseReducer = useAppSelector((state) => state.expenseReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);

  const [showRecordPayment, setShowRecordPayment] = useState<boolean>(false);
  const [recording, setRecording] = useState<any>(false);
  const [recordData, setRecordData] = useState<{
    amount: string | number;
    type: string;
  }>({
    amount: "",
    type: "Cash",
  });
  const [fromInvoice, setFromInvoice] = useState<boolean>(false);

  const generateExpense = () => {
    dispatch(setInvoiceCode(invoice?.code));
    setNewExpenses(true)
  };

  // @ts-ignore
  const [downloading, setDownloading] = useState<any>(false);
  const [_downloading, _setDownloading] = useState<any>(false);
  const [showMessage, setshowMessage] = useState<boolean>(false);
  const [_dueAmt, _setDueAmt] = useState<any>();

  useEffect(() => {
    dispatch(getSingleInvoice(invoiceId));
  }, [invoiceId]);

  useEffect(() => {
    setInvoice(store.invoice);
    setEstimate(store.invoice?.estimate);
  }, [store.invoice]);

  useEffect(() => {
    if (estimate && invoice) {
      const driver = estimate.rideShareDriver;
      const customer = estimate.customer;

      const _owner = driver
        ? `${driver.firstName} ${driver.lastName}`
        : `${customer.firstName} ${customer.lastName}`;

      let _parts: IPart[];
      let _labours: ILabour[];

      if (
        invoice.edited &&
        invoice.updateStatus === INVOICE_STATUS.update.draft
      ) {
        _parts = !invoice.draftInvoice.parts?.length
          ? []
          : (invoice.draftInvoice.parts as unknown as IPart[]);
        _labours = !invoice.draftInvoice.labours?.length
          ? []
          : (invoice.draftInvoice.labours as unknown as ILabour[]);
      } else if (
        invoice.edited &&
        invoice.updateStatus === INVOICE_STATUS.update.sent
      ) {
        _parts = !invoice.parts?.length
          ? []
          : (invoice.parts as unknown as IPart[]);
        _labours = !invoice.labours?.length
          ? []
          : (invoice.labours as unknown as ILabour[]);
      } else {
        _parts = !estimate.parts?.length
          ? []
          : (estimate.parts as unknown as IPart[]);
        _labours = !estimate.labours?.length
          ? []
          : (estimate.labours as unknown as ILabour[]);
      }

      setParts(_parts);
      setDriver(driver || customer);
      setLabours(_labours);
      setOwner(capitalize.words(_owner));
      setBillingInformation(estimate);
    }
  }, [estimate, invoice]);

  const subTotal = useMemo(() => {
    if (invoice && estimate) {
      const laboursTotal = invoice.edited
        ? invoice.updateStatus === INVOICE_STATUS.update.draft
          ? invoice.draftInvoice.laboursTotal
          : invoice.laboursTotal
        : estimate.laboursTotal;
      const partsTotal =
        invoice && invoice.edited
          ? invoice.updateStatus === INVOICE_STATUS.update.draft
            ? invoice.draftInvoice.partsTotal
            : invoice.partsTotal
          : estimate.partsTotal;

      return laboursTotal + partsTotal;
    }
    return 0;
  }, [estimate, invoice]);

  const grandTotal = useMemo(() => {
    if (invoice && estimate) {
      return invoice.edited
        ? invoice.updateStatus === INVOICE_STATUS.update.draft
          ? invoice.draftInvoice.grandTotal
          : invoice.grandTotal
        : estimate.grandTotal; //estimate.partsTotal + estimate.laboursTotal
      // return estimate.partsTotal + estimate.laboursTotal;
    }
    return 0;
  }, [estimate, invoice]);

  const [refundAmount, setRefundable] = useState(0);
  const [balance, setDueBalance] = useState(0);

  useEffect(() => {
    const _depositAmount = invoice?.depositAmount || 0;
    const _dueBalance = grandTotal - _depositAmount;

    setDueBalance(_dueBalance);

    if (_depositAmount > grandTotal) {
      setRefundable(_depositAmount - grandTotal);
      setDueBalance(0);
    } else {
      setRefundable(0);
    }
  }, [grandTotal, invoice]);

  const generateDownload = async () => {
    // const rName = Math.ceil(Math.random() * 999 + 1100) + '.pdf';
    const rName = invoice?.code + ".pdf";
    // @ts-ignore
    const payload = {
      type: "INVOICE",
      id: invoice?.id || -1,
      rName,
    };
    setDownloading(true);

    try {
      const response = await axiosClient.post(
        `${API_ROOT}/request-pdf`,
        payload
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      setDownloading(false);
      window.open(`${settings.api.baseURL}/uploads/pdf/${rName}`);
      setSelectedValue("");
    }, 3000);
  };

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    () => {
      setErrorMessage("");
    };
  }, []);

  const handlePaymentRecord = async () => {
    setRecording(true);
    try {
      const payload = {
        invoiceId: invoice?.id || 0,
        customerId: _driver.id,
        amount: recordData.amount,
        type: recordData.type,
      };

      const response = await axiosClient.post(
        `${API_ROOT}/transactions/update-invoice-payment-manually`,
        payload
      );
      console.log(response.data);
      // @ts-ignore
      dispatch(getInvoicesAction());
      setshowMessage(true);

      setTimeout(() => {
        setshowMessage(false);
        window.history.back();
      }, 3000);
    } catch (e: any) {
      setErrorMessage(
        e.response?.data?.message || "Unable able to process please try again"
      );
      console.log(e);
    }
    setRecording(false);
    setSelectedValue("");
  };

  const calculateDiscount = ({
    total,
    discount,
    discountType,
  }: {
    total: number;
    discount: number | undefined;
    discountType: string | undefined;
  }) => {
    if (!discount) return 0;
    if (!discountType) return 0;

    if (discountType === "exact") {
      return discount;
    }

    return Math.ceil(total * (discount / 100));
  };

  const calculateTaxTotal = (estimate: IInvoice | undefined) => {
    if (!estimate) return 0;

    if (estimate.updateStatus === INVOICE_STATUS.update.draft) {
      if (estimate.draftInvoice.taxPart && estimate.draftInvoice.tax)
        return (
          parseFloat(`${estimate?.draftInvoice?.tax}`.split(",").join("")) +
          parseFloat(`${estimate?.draftInvoice?.taxPart}`.split(",").join(""))
        );

      if (estimate.draftInvoice.tax && !estimate.draftInvoice.taxPart)
        return parseFloat(`${estimate?.draftInvoice?.tax}`.split(",").join(""));

      if (!estimate.draftInvoice.tax && estimate.draftInvoice.taxPart)
        return parseFloat(
          `${estimate?.draftInvoice?.taxPart}`.split(",").join("")
        );
    }

    if (estimate.updateStatus === INVOICE_STATUS.update.sent) {
      if (estimate.taxPart && estimate.tax)
        return (
          parseFloat(`${estimate?.tax}`.split(",").join("")) +
          parseFloat(`${estimate?.taxPart}`.split(",").join(""))
        );

      if (estimate.tax && !estimate.taxPart)
        return parseFloat(`${estimate?.tax}`.split(",").join(""));

      if (!estimate.tax && estimate.taxPart)
        return parseFloat(`${estimate?.taxPart}`.split(",").join(""));
    }

    //calculating tax if updateStatus is null
    if (!estimate.updateStatus) {
      if (estimate.estimate.taxPart && estimate.estimate.tax)
        return (
          parseFloat(`${estimate?.estimate?.tax}`.split(",").join("")) +
          parseFloat(`${estimate?.estimate?.taxPart}`.split(",").join(""))
        );

      if (estimate.estimate.tax && !estimate.estimate.taxPart)
        return parseFloat(`${estimate?.estimate?.tax}`.split(",").join(""));

      if (!estimate.estimate.tax && estimate.estimate.taxPart)
        return parseFloat(`${estimate?.estimate?.taxPart}`.split(",").join(""));
    }

    return 0;
  };

  //share pdf logic --- start
  const _generateDownload = async () => {
    const rName = invoice?.code + ".pdf";
    // @ts-ignore
    const payload = {
      type: "INVOICE",
      id: invoice?.id || -1,
      rName,
    };
    _setDownloading(true);

    try {
      const response = await axiosClient.post(
        `${API_ROOT}/request-pdf`,
        payload
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      _setDownloading(false);
      setSelectedValue("");
    }, 1000);
  };
  const handleShareLink = async () => {
    _generateDownload();

    const fileUrl = `${settings.api.baseURL}/uploads/pdf/${invoice?.code}.pdf`;
    const message =
      `${
        invoice?.estimate?.partner.name
      } has sent you an invoice.\nAmount Paid: NGN${
        invoice?.depositAmount && Util.formAmount(invoice?.depositAmount)
      }\n\n` + fileUrl;

    try {
      const shareData = {
        title: "Invoice",
        text: `${message}`,
        // url: fileUrl
      };

      await navigator.share(shareData);

      console.log("File shared successfully");
    } catch (error: any) {
      console.error("Error sharing file:", error);
    }
  };

  const handleShareLinkNoMessage = async () => {
    _generateDownload();

    const fileUrl = `${settings.api.baseURL}/uploads/pdf/${invoice?.code}.pdf`;

    try {
      const shareData = {
        title: "Invoice",
        // text: `${message}`
        url: fileUrl,
      };

      await navigator.share(shareData);

      console.log("File shared successfully");
    } catch (error: any) {
      console.error("Error sharing file:", error);
    }
  };

  const handleSharePdf = async () => {
    _generateDownload();
    const fileUrl = `${settings.api.baseURL}/uploads/pdf/${invoice?.code}.pdf`;
    const message = `${invoice?.estimate?.partner.name} has sent you an invoice.`;

    try {
      const response = await axiosClient.get(fileUrl, { responseType: "blob" });
      const blob = response.data;
      const file = new File(
        [blob],
        `${message} - ${invoice?.code}_invoice.pdf`,
        { type: "application/pdf" }
      );

      const shareData = {
        title: "Invoice",
        text: `${message}`,
        // url: fileUrl
        files: [file],
      };

      await navigator.share(shareData);

      console.log("File shared successfully");
    } catch (error: any) {
      console.error("Error sharing file:", error);
    }
  };

  //share pdf logic --- end
  const data: any = {
    open_modal: "true",
    invoiceId: invoice?.id,
  };

  const generateReminder = () => {
    // setInvoiceId(invoice?.id)
    setOpenNewReminder(true)
  }

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedValue(value);
    if (value === "Share unique link") {
      document.documentElement.clientWidth <= 912
        ? handleShareLink()
        : handleShareLinkNoMessage();
    }
    if (value === "Record Payment") {
      setShowRecordPayment(true)
      setFromInvoice(true);
      dispatch(setInvoiceCode(invoice?.code))
    }
    if (value === "Record Expenses") {
      generateExpense();
    }
    if (value === "Download Pdf") {
      generateDownload();
    }
    if (value === "Share PDF") {
      handleSharePdf();
    }
    if (value === "Add Reminder") {
      generateReminder()
    }
    if (value === "Edit Invoice") {
      navigate("/edit-invoice");
      Object.entries(data).forEach(([key, value]) => {
        //@ts-ignore
        sessionStorage.setItem(key, value);
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSelectedValue('')
    },1000)
  },[selectedValue]);

  useEffect(() => {
    dispatch(getExpensesAction());
  }, [dispatch]);

  const totalExpensesAmount = useMemo(() => {
    if (expenseReducer.getExpensesStatus === "completed") {
      const filteredExpenses = expenseReducer.expenses.filter(
        (expense: any) => expense.invoiceCode === invoice?.code
      );

      const amount = filteredExpenses.reduce(
        (total: any, expense: any) => total + expense.amount,
        0
      );
      return amount;
    }
  }, [
    expenseReducer.getExpensesStatus,
    expenseReducer.expenses,
    invoice?.code,
  ]);

  const expensesNumber = useMemo(() => {
    if (expenseReducer.getExpensesStatus === "completed") {
      const filteredExpenses = expenseReducer.expenses.filter(
        (expense: any) => expense.invoiceCode === invoice?.code
      );

      return filteredExpenses ? filteredExpenses.length : 0;
    }
  }, [
    expenseReducer.getExpensesStatus,
    expenseReducer.expenses,
    invoice?.code,
  ]);

  const totalTransactionAmount = useMemo(() => {
    if (invoice?.transactions) {
      let amount = 0;
      invoice?.transactions.forEach((tranx) => {
        amount += tranx.amount;
      });
      return amount;
    }
    return 0;
  }, [invoice?.transactions]);

  useEffect(() => {
    if (showRecordPayment) {
      invoice?.updateStatus === "Draft"
        ? _setDueAmt(invoice.draftInvoice.dueAmount)
        : _setDueAmt(invoice?.dueAmount);
    }
  }, [showRecordPayment]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "900px" : "95%",
    height: 650,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => {
    setInvoiceId(-1)
    setInvoice(null)
    setEstimate(null)
    setOpenInvoiceDetails(false)
  };
  const partnerAddress = wordBreaker(estimate?.partner?.contact?.address as string, 5)
  const customerAddress = wordBreaker(billingInformation?.address as string, 5)

  useEffect(() => {
    if (partnerReducer.preference) {
      setPreference(partnerReducer.preference.termsAndCondition);
    }
  }, [partnerReducer.preference]);

  const getPreferences = useCallback(() => {
    dispatch(getPreferencesActions({}));
  }, []);

  useEffect(() => {
    getPreferences();
  }, []);

  return (
    <>
      <Modal
        open={openInvoiceDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 px-8">
            <div className="flex justify-between w-full">
              <div className="top-10 relative md:block hidden">
                <img
                  src={ invoice?.estimate?.partner?.logo 
                          ? `${BASE_URL}/${invoice?.estimate?.partner?.logo}` 
                          : Hypelogo }
                  crossOrigin="anonymous"
                  alt="logo" 
                  className="w-[80px] rounded-full h-[80px]" 
                />
              </div>
              <button onClick={() => {setInvoiceId(-1), setOpenInvoiceDetails(false)}}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>
          </div>

          <div className="mb-5 md:mb-0 md:flex item-center justify-center md:items-end md:justify-end top-20 md:mt-0 mt-10 md:relative">
            {/* <Sorting items={items} select={select} setSelect={setSelect} className={""} /> */}
            <FormControl className="md:w-[23%] w-[100%]">
              <InputLabel
                id="demo-simple-select-helper-label"
                focused={true}
                sx={{
                  color: 'black', 
                  fontSize: '14px', 
                  fontFamily: 'montserrat',
                  '&.Mui-focused': {
                    color: 'black',
                  },
                }}
              >Select an action</InputLabel>
              <Select
                sx={{
                  borderRadius: '20px',
                  backgroundColor: '#F5F5F5',
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent"
                  },
                  "& label": {
                    fontSize: "12px",
                    fontFamily: "montserrat",
                    color: "#A5A5A5"
                  },
                  "& input": {
                    fontSize: "12px",
                    fontFamily: "montserrat",
                    borderRadius: '20px',
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent", // Remove border color on focus
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent", // Remove border color on hover
                  },
                }}
                className="w-[100%] md:w-[195px] font-montserrat rounded-[20px]"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectedValue}
                label="Select an action"
                onChange={handleChange}>
                <MenuItem value="">...</MenuItem>
                <MenuItem value={'Share unique link'} className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Share unique link
                </MenuItem>
                <MenuItem value={'Record Payment'} className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Record Payment
                </MenuItem>
                <MenuItem value={'Record Expenses'} className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Record Expenses
                </MenuItem>
                <MenuItem value={'Download Pdf'} className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  {downloading ? 'Downloading...' : 'Download Pdf'}
                </MenuItem>
                <MenuItem
                  className={classes.select}
                  value={'Share PDF'}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                  disabled={estimate?.sentStatus !== 'Sent' || document.documentElement.clientWidth > 912}>
                  Share PDF
                </MenuItem>
                <MenuItem
                  className={classes.select}
                  value={'Add Reminder'}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Add Reminder
                </MenuItem>
                <MenuItem
                  className={classes.select}
                  value={'Edit Invoice'}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Edit Invoice
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mb-3 relative md:hidden">
            <img
              src={ invoice?.estimate?.partner?.logo 
                      ? `${BASE_URL}/${invoice?.estimate?.partner?.logo}` 
                      : Hypelogo }
              crossOrigin="anonymous"
              alt="logo" 
              className="w-[80px] rounded-full h-[80px]" 
            />
          </div>

          <div>
            <div className="flex-1">
              <div className="flex flex-col">
                <h5 className="text-base pb-1 font-montserrat font-semibold">
                  Invoice
                </h5>
                <span className="text-sm font-montserrat font-light">
                  #{invoice?.code.split('_')[0]}
                </span>
                <span className="text-sm font-montserrat font-light">
                  {moment(invoice?.createdAt).format('DD-MM-YYYY')}
                </span>
              </div>
            </div>

            <div className="flex justify-between flex-col md:flex-row mt-2 md:mt-10">
              <div className="flex flex-col mt-5 text-left w-[100%] ">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  {estimate?.partner?.name}
                </h5>
                {partnerAddress.length > 0 && partnerAddress.map((sentence, index) => {
                  return (
                    <span key={index} className="text-sm pb-1 font-montserrat font-light">
                      {sentence}
                    </span>
                  )
                })}
                <span className="text-sm pb-1 font-montserrat font-light">
                  {estimate?.partner?.contact?.district}, {estimate?.partner?.contact?.state || ''} {estimate?.partner?.contact?.country}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {estimate?.partner?.phone
                    ? `${estimate?.partner?.phone?.startsWith('0')}`
                      ? `${estimate?.partner?.phone}`
                      : `+${estimate?.partner?.phone}` 
                    : ''}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {estimate?.partner?.email}
                </span>
              </div>

              <div className="flex flex-col mt-5 justify-start text-left md:justify-end md:text-right  w-[100%]">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Billing Information
                </h5>
                <span className="text-sm pb-1 font-montserrat font-light">
                  {estimate?.customer?.title || ''} {owner}
                </span>
                {customerAddress.length > 0 &&
                  customerAddress?.map((sentence, index) => {
                    return (
                      <span key={index}className="text-sm pb-1  font-montserrat font-light">
                        {sentence}
                      </span>
                    )
                  })
                }
                <span className="text-sm pb-1  font-montserrat font-light">
                  {billingInformation?.customer?.email}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {billingInformation?.customer?.phone
                    ? `${billingInformation?.customer?.phone?.startsWith('0')}`
                      ? `${billingInformation?.customer?.phone}`
                      : `+${billingInformation?.customer?.phone}` 
                    : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-5">
            <div
              onClick={() => setToggleReport(!toggleReport)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="font-montserrat">
                {toggleReport ? " Hide Report" : "Show Report"}
              </span>

              {toggleReport ? <BsChevronUp /> : <BsChevronDown />}
            </div>
          </div>

          {isTechAdmin && (<>          
            {/* {toggleReport && (
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-[100%]">
                  <CustomBarChart />
                </div>

                <div className="w-[100%]">
                  <RoundChat />
                </div>
              </div>
            )} */}
          
            {toggleReport && (
              <div className="w-[100%] md:w-[100%] overflow-x-scroll border-[1px] rounded-3xl  flex mt-8  px-5 flex-col py-5  border-[#CACACA]">
                <div className="w-[700px] md:w-[100%]">
                  <div className="flex justify-between">
                    <div className="flex items-center md:w-[200px] gap-2">
                      <span className="text-sm font-ligt font-montserrat">
                        Total Sales:
                      </span>
                      <span className="font-montserrat font-semibold">
                        {Util.formAmount(grandTotal)}
                      </span>
                    </div>
                    <div className="flex w-[200px] gap-2">
                      <span className="text-sm font-light font-montserrat">
                        Total Amount Paid:
                      </span>
                      <span className="text-sm font-semibold font-montserrat">
                        {Util.formAmount(totalTransactionAmount)}
                      </span>
                    </div>
                    <div className="flex w-[144px] md:w-[201px] gap-4">
                      <span className="text-sm font-light font-montserrat">
                        Total Expenses:
                      </span>
                      <span className="text-sm font-semibold font-montserrat">
                        {totalExpensesAmount
                          ? Util.formAmount(totalExpensesAmount)
                          : '₦0.00'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-5">
                    <div className="flex gap-2 w-[205px]">
                      <span className="text-sm font-light font-montserrat">
                        Payments recorded:
                      </span>
                      <span className="text-sm font-semibold font-montserrat">
                        {invoice?.transactions.length}
                      </span>
                    </div>
                    <div className="flex w-[170px] md:w-[200px] gap-2">
                      <span className="text-sm font-light font-montserrat">
                        Expenses recorded:
                      </span>
                      <span className="text-sm font-semibold font-montserrat">
                        {expensesNumber}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm font-light font-montserrat">
                        Total Receivable:
                      </span>
                      <span className="text-sm font-semibold font-montserrat">
                        {Util.formAmount(grandTotal - totalTransactionAmount)}
                      </span>
                    </div>
                  </div>
                  <hr className="mt-5" />
                  <div className="flex justify-between items-center mt-5">
                    <div className="flex gap-2">
                      <span className="text-sm font-light  font-montserrat">
                        Book Profit:
                      </span>
                      <span className="text-sm font-semibold  font-montserrat">
                        {Util.formAmount(
                          grandTotal -
                            (totalExpensesAmount ? totalExpensesAmount : 0)
                        )}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-sm font-light font-montserrat">
                        Profit/ Loss:
                      </span>
                      <span className={`text-sm font-semibold font-montserrat
                        ${Math.sign(
                          totalTransactionAmount -
                            (totalExpensesAmount && totalExpensesAmount)
                        ) === -1 ? 'text-[red] font-montserrat' : 'text-[black] font-montserrat'}
                      `}>
                        {Util.formAmount(
                          totalTransactionAmount -
                            (totalExpensesAmount ? totalExpensesAmount : 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>)}

          <hr className="mt-8" />
          <div className="flex md:flex-row flex-col py-5 gap-10 md:gap-24 items-start md:items-center">
            <div className="flex  md:gap-24">
              <div className="flex md:w-[100%] gap-1 w-[200px] flex-col">
                <span className="text-sm font-medium  font-montserrat">
                  Vehicle
                </span>
                <span className="md:text-sm text-xs font-ligh font-montserrat font-montserratt">
                  {estimate?.vehicle.modelYear} {estimate?.vehicle.make}{" "}
                  {estimate?.vehicle.model}
                </span>
              </div>
              <div className="flex  gap-1  flex-col">
                <span className="text-sm font-medium  font-montserrat">
                  Reg.No
                </span>
                <span className="md:text-sm text-xs font-light  font-montserrat">
                  {estimate?.vehicle.plateNumber}
                </span>
              </div>
            </div>

            <div className="flex  md:gap-24">
              <div className="flex flex-col md:w-[100%] w-[200px] gap-1">
                <span className="text-sm font-medium font-montserrat">
                  Mileage
                </span>
                <span className="md:text-sm text-xs font-light font-montserrat">
                  {estimate?.vehicle.mileageValue} {estimate?.vehicle.mileageUnit}
                </span>
              </div>
              <div className="flex  gap-1 flex-col">
                <span className="text-sm font-medium font-montserrat">VIN</span>
                <span className="md:text-sm text-xs font-light font-montserrat">
                  {estimate?.vehicle.vin}
                </span>
              </div>
            </div>
          </div>

          <hr />

          <div className="mt-10" style={{ overflowX: "scroll" }}>
            <table className="paymentTable mb-10">
              <thead>
                <th className="font-montserrat    text-xs text-left">#</th>
                <th className="font-montserrat    text-xs text-left">
                  Item Description
                </th>
                <th className="font-montserrat    text-xs text-left">
                  Warranty
                </th>
                <th className="font-montserrat text-xs text-left">
                  Unit Cost x{" "}
                </th>
                <th className="font-montserrat     text-xs text-left">
                  Amount
                </th>
              </thead>

              {!parts.length
                ? null
                : parts.map((part, index) => {
                  return (
                    <tbody key={index}>
                      <tr
                        // onClick={() => setOpenItem(true)}
                        className="cursor-pointer table-hover"
                      >
                        <td className="font-montserrat text-xs cursor-pointer">
                          {index + 1}
                        </td>
                        <td className="font-montserrat flex items-center gap-2 text-xs">
                          <span>{part && part.name}</span>
                        </td>
                        <td className="font-montserrat text-xs">{part?.warranty?.warranty} {part?.warranty?.interval}</td>
                        <td className="font-montserrat text-xs">
                          {" "}
                          {Util.formAmount(+part.price)} x{" "}
                          {part?.quantity?.quantity || ""}{" "}
                          {part?.quantity?.unit || 0}
                        </td>
                        <td className="font-montserrat text-xs">{Util.formAmount(+part.amount)}</td>
                      </tr>
                    </tbody>
                  );
              })}

              {!labours.length
                ? null
                : labours.map((labour, index) => {
                  return (
                    <tbody key={index}>
                      <tr
                        // onClick={() => setOpenItem(true)}
                        className="cursor-pointer table-hover"
                      >
                        <td className="font-montserrat text-xs cursor-pointer">
                          {parts.length + index + 1}
                        </td>
                        <td className="font-montserrat flex items-center gap-2 text-xs">
                          <span>{labour && labour.title}</span>
                        </td>
                        <td className="font-montserrat text-xs" />
                        <td className="font-montserrat text-xs">
                          {" "}
                          {Util.formAmount(+labour.cost)} x 1
                        </td>
                        <td className="font-montserrat text-xs">{Util.formAmount(+labour.cost)}</td>
                      </tr>
                    </tbody>
                  );
              })}
            </table>
          </div>

          <div className="flex flex-col md:flex-row gap-10 justify-between mt-8">
            <div className="w-[100%] md:w-[50%]">
              <textarea
                className="custom-textarea2 bg-[#f5f5f5]"
                placeholder="labels"
                style={{ width: "100%", height: "150px" }}
                defaultValue={estimate?.note}
              ></textarea>
              <textarea
                className="custom-textarea2 bg-[#f5f5f5]"
                placeholder="labels"
                style={{ width: "100%", height: "150px" }}
                defaultValue={estimate?.internalNote}
              ></textarea>
            </div>

            <div className="w-[100%] md:w-[50%] px-0 md:px-5">
              <div className=" border-[1px] py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Sub-Total:</span>
                  <span className="text-sm">{Util.formAmount(subTotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">VAT:</span>
                  <span className="text-sm">{Util.formAmount(calculateTaxTotal(invoice as IInvoice))}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Discount:</span>
                  <span className="text-sm">{
                    // @ts-ignore
                    `(${Util.formAmount(
                      calculateDiscount({
                        total: !invoice?.updateStatus
                          //@ts-ignore
                          ? estimate?.laboursTotal + estimate?.partsTotal
                          : subTotal, //grandTotal
                        discount: invoice?.edited
                          ? invoice?.updateStatus === INVOICE_STATUS.update.draft
                            ? invoice?.draftInvoice.discount
                            : invoice?.discount
                          : estimate?.discount,
                        discountType: invoice?.edited
                          ? invoice?.updateStatus === INVOICE_STATUS.update.draft
                            ? invoice?.draftInvoice.discountType
                            : invoice?.discountType
                          : estimate?.discountType,
                      })
                    )})`}
                    </span>
                </div>
              </div>
              <p className="text-xs font-light font-montserrat text-right mt-1">
                Job Duration: {invoice?.jobDurationValue} {invoice?.jobDurationUnit}(s)
              </p>

              <div className=" border-[1px] mt-5 py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Paid:</span>
                  <span className="text-sm">{Util.formAmount(invoice?.depositAmount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Balance Due:</span>
                  <span className="text-sm">
                    {Math.sign(balance) === -1
                      ? "0.00"
                      : Util.formAmount(balance)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Refund Due:</span>
                  <span className="text-sm">{Util.formAmount(refundAmount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Grand Totel:</span>
                  <span className="text-sm">{Util.formAmount(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="mt-10" />
          <div className="flex flex-col mt-10">
            <span className="text-lg font-bold font-montserrat mb-2">
              Terms and Conditions
            </span>
            <div
              dangerouslySetInnerHTML={{ __html: preference }}
            >
            
            </div>
          </div>
        </Box>
      </Modal>

      <AddPaymentModal
        openAddPayment={showRecordPayment}
        setOpenAddPayment={setShowRecordPayment}
        fromInvoice={fromInvoice}
        setFromInvoice={setFromInvoice}
      />

      <AddNewExpensesModal
        newExpenses={newExpenses}
        setNewExpenses={setNewExpenses}
      />

      <AddNewReminderModal
        openNewReminder={openNewReminder}
        setOpenNewReminder={setOpenNewReminder}
        invoiceId={invoiceId}
        generatePayment={true}
        editMode={false}
        setOpenInvoiceDetails={setOpenInvoiceDetails}
      />
    </>
  );
};

export default InvoiceDetailsModal;
