import React, { useCallback, useEffect, useMemo, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import logoEstimate from "../../assets/images/logoEstimate.png";
import documentdownload from "../../assets/images/document-download.png";
import mingcutelinkfill from "../../assets/images/mingcute_link-fill.png";
import mdi_share from "../../assets/images/mdi_share.png";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import moment from "moment";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { makeStyles } from '@mui/styles';
import settings from "../../config/settings";
import { Util } from "../../helpers/Util";
import axiosClient from '../../config/axiosClient';
import { showMessage } from "../../helpers/notification";
import { wordBreaker } from "../../utils/generic";
import { IEstimate } from "@app-models";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getInvoicesAction } from "../../store/actions/invoiceActions";
import DownloadEstimateModal from "../modals/DownloadEstimateModal";
import { getPreferencesActions } from "../../store/actions/partnerActions";

const useStyles = makeStyles({
  select: {
    '&:hover': {
      background: '#F1F0F1',
      fontWeight: 400,
      color: '#FAA21B'
    }
  }
});

const API_BASEURL = settings.api.baseURL
const API_ROOT = settings.api.rest;

const EstimateDetailsModal = ({
  openEstimateDetails,
  setOpenEstimateDetails,
  estimate, setEstimate
}: any ) => {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [downloading, setDownloading] = useState<any>(false);
  const [generating, setGenerating] = useState<any>(false);
  const [downloadEstimateModal, setDownloadEstimateModal] = useState<boolean>(false);
  const [preference, setPreference] = useState('');

  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const partnerReducer = useAppSelector(state => state.partnerReducer);
  const dispatch = useAppDispatch();

  const closeDownloadEstimateModal = (e: any) => {
    e.stopPropagation()
    setDownloadEstimateModal(!downloadEstimateModal)
  }

  const handleClose = () => {
    setEstimate(null)
    setOpenEstimateDetails(false)
    setSelectedValue('')
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "70%" : "95%",
    height: 650,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const customerAddress = wordBreaker(estimate?.address, 5)

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

    if (discountType === 'exact') {
      return discount;
    }

    return Math.ceil(total * (discount / 100));
  };

  const calculateTaxTotal = (estimate: IEstimate | undefined) => {
    if (!estimate) return 0;
    const tax =
      parseFloat(`${estimate?.tax}`.split(',').join('')) + parseFloat(`${estimate?.taxPart}`.split(',').join(''));
    return tax;
  };

  const generateInvoice = async () => {
    try {
      const payload = {
        id: estimate?.id,
      };
      setGenerating(true);

      const response = await axiosClient.post(`${API_ROOT}/transactions/generate-invoice-manually`, payload);
      const code = response.data.invoiceCode;
      console.log(code);
      // window.location.href = ('/invoices/'+code);
      window.location.replace('/invoices');
    } catch (e: any) {
      showMessage("Error", e.response.data.message, "error");
    }

    setGenerating(false);
    setSelectedValue('')
  };

  const generateDownload = async () => {
    // const rName = Math.ceil(Math.random() * 999 + 1100) + '.pdf';
    const rName = estimate?.code + '.pdf';
    // @ts-ignore
    const payload = {
      type: 'ESTIMATE',
      id: estimate?.id || -1,
      rName,
    };
    setDownloading(true);

    try {
      const response = await axiosClient.post(`${API_ROOT}/request-pdf`, payload);
      console.log(response.data);
      // window.open(`${settings.api.baseURL}/uploads/pdf/${response.data.name}`)
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      setDownloading(false);
      window.open(`${settings.api.baseURL}/uploads/pdf/${rName}`);
      // setSelectedValue('');
    }, 3000);
  };

  const checkInvoiceCount = () => {
    if (estimate?.count && estimate?.count >= 1) {
      setDownloadEstimateModal(true);
    }

    if (estimate?.count === 0 || estimate?.count === null) {
      generateInvoice();
    }
  };

    //share pdf logic --- start
    const handleShareLink = async () => {
      const fileUrl = `${settings.api.baseURL}/uploads/pdf/${estimate?.code}.pdf`;
      const message =
        `${estimate?.partner.name} has sent you an estimate.\nAmount Due: NGN${
          estimate?.grandTotal && Util.formAmount(estimate?.grandTotal)
        }\n\n` + fileUrl;
  
      try {
        const shareData = {
          title: 'Estimate',
          text: `${message}`,
          // url: fileUrl
        };
  
        await navigator.share(shareData);
  
        console.log('File shared successfully');
      } catch (error) {
        console.error('Error sharing file:', error);
      }
    };
  
    const handleShareLinkNoMessage = async () => {
      const fileUrl = `${settings.api.baseURL}/uploads/pdf/${estimate?.code}.pdf`;
      // const message = `${estimate?.partner.name} has sent you an estimate.\n Amount Due: NGN${estimate?.grandTotal && formatNumberToIntl(estimate?.grandTotal)}\n\n` + fileUrl
  
      try {
        const shareData = {
          title: 'Estimate',
          // text: `${message}`
          url: fileUrl,
        };
  
        await navigator.share(shareData);
  
        console.log('File shared successfully');
      } catch (error) {
        console.error('Error sharing file:', error);
      }
    };
  
    const handleSharePdf = async () => {
      const fileUrl = `${settings.api.baseURL}/uploads/pdf/${estimate?.code}.pdf`;
      const message = `${estimate?.partner.name} has sent you an estimate.`;
  
      try {
        const response = await axiosClient.get(fileUrl, { responseType: 'blob' });
        const blob = response.data;
        const file = new File([blob], `${message} - ${estimate?.code.split('_')[0]}_estimate.pdf`, {
          type: 'application/pdf',
        });
  
        const shareData = {
          title: 'Estimate',
          text: `${message}`,
          // url: fileUrl
          files: [file],
        };
  
        await navigator.share(shareData);
  
        console.log('File shared successfully');
      } catch (error) {
        console.error('Error sharing file:', error);
      }
    };

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    console.log(value, 'value')
    setSelectedValue(value);
    // if (value === 'Share unique link') {
    //   document.documentElement.clientWidth <= 912 ? handleShareLink() : handleShareLinkNoMessage();
    //   setTimeout(() => {
    //     setSelectedValue('');
    //   }, 3000);
    // }
    if (value === 'Generate Invoice') {
      checkInvoiceCount();
    }
    // if (value === 'Download Pdf') {
    //   generateDownload();
    // }
    // if (value === 'Share PDF') {
    //   handleSharePdf();
    //   setTimeout(() => {
    //     setSelectedValue('');
    //   }, 3000);
    // }
  };

  useEffect(() => {
    dispatch(getInvoicesAction())
  },[]);

  const invoice = invoiceReducer.invoices.filter(invoice => invoice?.estimate?.id === estimate?.id);

  const amountPaid = useMemo(() => {
    let total = 0;
    invoice.forEach(inv => total += inv.paidAmount)

    return total
  },[invoice])

  const refundable = estimate?.grandTotal - amountPaid;
  
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
        open={openEstimateDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 px-8">
            <div className="flex justify-between w-full">
              <div className="top-10 relative">
                <img
                  src={ estimate?.partner?.logo ? `${API_BASEURL}/${estimate?.partner?.logo}` : logoEstimate }
                  alt="company logo"
                  crossOrigin="anonymous"
                  className="w-[80px] rounded-full h-[80px]"
                />
              </div>
              <button onClick={handleClose}>
                <img
                  src={CloseIcon}
                  alt="" 
                />
              </button>
            </div>
          </div>

          <div className="md:flex w-[100%] md:items-end md:justify-end top-20 md:mt-0 mt-20 md:relative">
            <FormControl>
              <InputLabel
                id="demo-simple-select-helper-label"
                focused={true} // To style the label as focused initially
                sx={{
                  color: 'black', 
                  fontSize: '14px', 
                  fontFamily: 'montserrat',
                  '&.Mui-focused': {
                    color: 'black', // Change the label color when focused
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
                <MenuItem value={'Generate Invoice'} className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  {generating ? 'Generating...' : 'Generate Invoice'}
                </MenuItem>
                <MenuItem value={'Duplicate Estimate'} disabled className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Duplicate Estimate
                </MenuItem>
                <MenuItem value={'Duplicate Estimate'} disabled className={classes.select}
                  sx={{fontSize: "14px",
                  fontFamily: "montserrat"}}
                >
                  Mark as sent
                </MenuItem>
                {/* <MenuItem value={'Download Pdf'} className={classes.select}>
                  {downloading ? 'Downloading...' : 'Download Pdf'}
                </MenuItem>
                <MenuItem
                  value={'Share unique link'}
                  className={classes.select}
                  disabled={estimate?.sentStatus !== 'Sent'}>
                  Share unique link
                </MenuItem>
                <MenuItem
                  className={classes.select}
                  value={'Share PDF'}
                  disabled={estimate?.sentStatus !== 'Sent' || document.documentElement.clientWidth > 912}>
                  Share PDF
                </MenuItem> */}
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-between flex-col md:flex-row  mt-10">
            <div className="flex-1">
              <div className="flex flex-col">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Estimate
                </h5>
                <span className="text-sm font-montserrat font-light">
                  {`#${estimate?.code.split('_')[0]}`}
                </span>
                <span className="text-sm font-montserrat font-light">
                  {moment(estimate?.createdAt).format('DD-MM-YYYY')}
                </span>
              </div>

              <div className="flex flex-col mt-5 text-left w-[100%] ">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Demo Workshop
                </h5>
                <span className="text-sm pb-1 font-montserrat font-light w-[50%]">
                  {estimate?.partner?.contact?.address}
                </span>
                <span className="text-sm pb-1 font-montserrat font-light">
                {estimate?.partner?.contact?.district} {estimate?.partner?.contact?.state}, Nigeria
                </span>
                <span className="text-sm pb-1 font-montserrat font-light">
                  +{estimate?.partner?.phone}
                </span>
                <span className="text-sm pb-1 font-montserrat font-light">
                  {estimate?.partner?.email}
                </span>
              </div>
            </div>

            <div className="mt-5 md:mt-24">
              <div className="flex flex-col  justify-start md:justify-end text-left md:text-right">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Billing Information
                </h5>
                {customerAddress.length > 0 &&
                  customerAddress?.map((sentence, index) => {
                    return (
                      <span key={index} className="text-sm pb-1 font-montserrat font-light">
                        {sentence}
                      </span>
                    )
                  })
                }
                <span className="text-sm pb-1  font-montserrat font-light">
                  {estimate?.email}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {estimate?.customer?.phone
                    ? `${estimate?.customer?.phone?.startsWith('0')}`
                      ? `${estimate?.customer?.phone}`
                      : `+${estimate?.customer?.phone}` 
                    : ''}
                </span>
              </div>
            </div>
          </div>

          <hr className="mt-5" />
          <div className="flex flex-col md:flex-row py-5 gap-10 md:gap-28  md:items-center">
            <div className="flex gap-24 md:gap-20">
              <div className="flex flex-col">
                <span className="text-sm font-medium font-montserrat">
                  Vehicle
                </span>
                <span className="text-sm font-light font-montserrat">
                  {estimate?.vehicle?.modelYear} {estimate?.vehicle?.make} {estimate?.vehicle?.model}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium font-montserrat">
                  Reg.No
                </span>
                <span className="text-sm font-light font-montserrat">
                  {estimate?.vehicle?.plateNumber}
                </span>
              </div>
            </div>

            <div className="flex gap-28">
              <div className="flex flex-col  w-[50%]">
                <span className="text-sm font-medium font-montserrat">
                  Mileage
                </span>
                <span className="text-sm font-light font-montserrat">
                  {estimate?.vehicle?.mileageValue || 'N/A'} {estimate?.vehicle?.mileageUnit || ''}
                </span>
              </div>
              <div className="flex flex-col  w-[50%]">
                <span className="text-sm font-medium font-montserrat">VIN</span>
                <span className="text-sm font-light font-montserrat">
                  {estimate?.vehicle?.vin}
                </span>
              </div>
            </div>
          </div>
          <hr />

          <div className="mt-10" style={{ overflowX: "scroll" }}>
            <table border={1} style={{ borderRadius: 20, overflow: "clip" }}>
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

              {estimate?.parts?.map((part: any, index: number) => {
                return (
                  <tbody>
                    <tr>
                      <td className="font-montserrat text-xs cursor-pointer">
                        {index + 1}
                      </td>
                      <td className="font-montserrat flex items-center gap-2 text-xs">
                        <span>{part.name}</span>
                      </td>
                      <td className="font-montserrat text-xs">{part.warranty.warranty} {part.warranty.interval}</td>
                      <td className="font-montserrat text-xs">
                        {" "}
                        {Util.formAmount(part.price)} x {part.quantity.quantity} {part.quantity.unit}
                      </td>
                      <td className="font-montserrat text-xs">{Util.formAmount(part.amount)}</td>
                    </tr>
                  </tbody>
                );
              })}
              {estimate?.labours?.map((labour: any, index: number) => {
                return (
                  <tbody>
                    <tr>
                      <td className="font-montserrat text-xs cursor-pointer">
                        {estimate?.parts?.length + index + 1}
                      </td>
                      <td className="font-montserrat flex items-center gap-2 text-xs">
                        <span>{labour.title}</span>
                      </td>
                      <td className="font-montserrat text-xs"/>
                      <td className="font-montserrat text-xs">
                        {" "}
                        {Util.formAmount(labour.cost)} x 1
                      </td>
                      <td className="font-montserrat text-xs">{Util.formAmount(labour.cost)}</td>
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
                placeholder="Note/Remarks"
                style={{ width: "100%", height: "150px" }}
                defaultValue={estimate?.note}
              ></textarea>
              <textarea
                className="custom-textarea2 bg-[#f5f5f5]"
                placeholder="Internal Note"
                style={{ width: "100%", height: "150px" }}
                defaultValue={estimate?.internalNote}
              />
              {/* <CustomTextArea placeholder="Labels" className="h-52" /> */}
            </div>
              
            <div className="w-[100%] md:w-[50%] px-0 md:px-5">
              <div className=" border-[1px] py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Sub-Total:</span>
                  <span className="text-sm">{Util.formAmount(estimate?.partsTotal + estimate?.laboursTotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">VAT:</span>
                  <span className="text-sm">{Util.formAmount(calculateTaxTotal(estimate))}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Discount:</span>
                  <span className="text-sm">{Util.formAmount(calculateDiscount({
                    total: estimate?.partsTotal + estimate?.laboursTotal,
                    discount: estimate?.discount,
                    discountType: estimate?.discountType,
                  }))}</span>
                </div>
              </div>
              <p className="text-xs font-light font-montserrat text-right mt-1">
                Job Duration: {estimate?.jobDurationValue} {estimate?.jobDurationUnit}(s)
              </p>

              <div className=" border-[1px] mt-5 py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Paid:</span>
                  <span className="text-sm">{Util.formAmount(amountPaid)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Balance Due:</span>
                  <span className="text-sm">{Util.formAmount(estimate?.grandTotal - amountPaid)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Refund Due:</span>
                  <span className="text-sm">{
                    refundable < 0 ? Util.formAmount(refundable) : '₦0.00'
                  }</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-0 md:gap-5 mt-5">
            <div className="border-[1px] mt-5 cursor-pointer py-4 border-[#CACACA] gap-3 px-10  rounded-[20px] flex items-center"
              onClick={generateDownload}
            >
              <img
                src={documentdownload}
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="text-[11px] font-montserrat font-semibold">
                {downloading ? 'Downloading...' : 'Download Pdf'}
              </span>
            </div>
            <div className="border-[1px] cursor-pointer mt-5 py-4 flex items-center gap-3 border-[#CACACA] px-10  rounded-[20px]"
              onClick={() => {
                document.documentElement.clientWidth <= 912 
                  ? handleShareLink() 
                  : handleShareLinkNoMessage();
              }}
            >
              <img
                src={mingcutelinkfill}
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="text-[11px] font-montserrat font-semibold">
                Share Unique Link
              </span>
            </div>
            <div className="border-[1px] mt-5 py-4 cursor-pointer flex items-center gap-3 border-[#CACACA] px-10  rounded-[20px]"
              onClick={() => {
                handleSharePdf()
              }}
            >
              <img src={mdi_share} alt="" className="w-[24px] h-[24px]" />
              <span className="text-[11px] font-montserrat font-semibold">
                Share PDF
              </span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-16 mt-10">
            <div className="flex flex-col">
              <span className="text-sm">Account Name</span>
              <span className="text-sm font-light font-montserrat">
                {estimate?.partner?.accountName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Bank Name</span>
              <span className="text-sm font-light font-montserrat">
                {estimate?.partner?.bankName}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">Account Number</span>
              <span className="text-sm font-light font-montserrat">
                {estimate?.partner?.accountNumber}
              </span>
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

      <DownloadEstimateModal
        downloadEstimateModal={downloadEstimateModal}
        setDownloadEstimateModal={setDownloadEstimateModal}
        title={"Are you sure you want to generate invoice."}
        closeDeleteModal={closeDownloadEstimateModal}
        generateInvoice={generateInvoice}
        setSelectedValue={setSelectedValue}
      />
    </>
  );
};

export default EstimateDetailsModal;
