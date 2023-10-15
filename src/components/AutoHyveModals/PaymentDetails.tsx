import React, { useMemo } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import logoEstimate from "../../assets/images/logoEstimate.png";
import documentdownload from "../../assets/images/document-download.png";
import mingcutelinkfill from "../../assets/images/mingcute_link-fill.png";
import mdi_share from "../../assets/images/mdi_share.png";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { hashString } from "react-hash-string";
import useAdmin from "../../hooks/useAdmin";
import { wordBreaker } from "../../utils/generic";
import moment from "moment";
import { Util } from "../../helpers/Util";

const PaymentDetails = ({ 
  openPaymentDetails, 
  setOpenPaymentDetails, 
  setItem, item,
  _downloading,
  _generateDownload,
  handleShareLink,
  handleShareLinkNoMessage,
  handleSharePdf,
  downloading
}: any) => {
  const tableData = Array(3).fill("");
  const handleClose = () => {
    setItem(null)
    setOpenPaymentDetails(false)
  };
  const { user } = useAdmin();

  const partnerName = (user?.partner?.name || " ")

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 900 : "95%",
    height: 650,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "50px" : "30px",
    py: 5,
  };

  const partnerAddress = wordBreaker(user?.partner?.contact?.address as string, 5);
  const parts = item?.invoice?.estimate?.parts.map(JSON.parse);
  const labours = item?.invoice?.estimate?.labours.map(JSON.parse);

  const amountDue = useMemo(() => {
    let amount;
    if(item?.invoice?.grandTotal === item?.amount) {
      amount = 0
    } else if (item?.invoice?.grandTotal < item.amount) {
      amount = item?.invoice?.grandTotal - item.amount
    } else if (item?.invoice?.grandTotal > item.amount) {
      amount = item?.invoice?.grandTotal - item.amount
    }
    return amount;
  },[item?.invoice?.grandTotal, item?.amount]);

  return (
    <>
      <Modal
        open={openPaymentDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0">
            <div className="flex justify-between w-full">
              <div className="top-10 relative">
                <img src={logoEstimate} alt="" className="w-[80px]" />
              </div>
              <button onClick={handleClose}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>
          </div>

          {/* <div className="md:flex  w-[100%] md:items-end md:justify-end top-20 md:mt-0 mt-20 md:relative">
            <Sorting items={items} select={select} setSelect={setSelect} />
          </div> */}

          <div className="flex justify-between flex-col md:flex-row  mt-20">
            <div className="flex-1">
              <div className="flex flex-col">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Payment Receipt
                </h5>
                <span className="text-sm font-montserrat font-light">
                  {`${partnerName[0]}RC-${hashString(`${partnerName[0]}C${item?.id}`)}`}
                </span>
              </div>

              <div className="flex flex-col mt-5 text-left w-[100%] ">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Demo Workshop
                </h5>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {partnerAddress}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {user?.partner?.contact?.state}, {user?.partner?.contact?.country}.
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {user?.partner?.phone
                    ? `${user?.partner?.phone?.startsWith('0')}`
                      ? `${user?.partner?.phone}`
                      : `+${user?.partner?.phone}` 
                    : ''}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {user?.partner.email}
                </span>
              </div>
            </div>

            <div className="mt-5 md:mt-24">
              <div className="flex flex-col  justify-start md:justify-end text-left md:text-right">
                <h5 className="text-base pb-1  font-montserrat font-semibold">
                  Billing Information
                </h5>
                <span className="text-sm pb-1 font-montserrat font-light">
                  {item?.customer?.title || ''} {item?.customer?.firstName} {item?.customer?.lastName}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {wordBreaker(item?.customer?.contacts.address, 5)}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {item?.customer?.contacts.state} {item?.customer?.contacts.country || ''}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {item?.customer?.email}
                </span>
                <span className="text-sm pb-1  font-montserrat font-light">
                  {item?.customer?.phone
                    ? `${item?.customer?.phone?.startsWith('0')}`
                      ? `${item?.customer?.phone}`
                      : `+${item?.customer?.phone}` 
                    : ''}
                </span>
              </div>
            </div>
          </div>

          <hr className="mt-5" />
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 py-5 md:items-center">
            <div className="flex gap-20">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium font-montserrat">
                  Invoice Date
                </span>
                <span className="text-sm font-light font-montserrat">
                  {moment(item?.invoice.updatedAt).format('DD/MM/YYYY')}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium font-montserrat">
                  Payment Date
                </span>
                <span className="text-sm font-light font-montserrat">
                  {moment(item?.paidAt).format('DD/MM/YYYY')}
                </span>
              </div>
            </div>

            <div className="flex gap-20">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium font-montserrat">
                  Mode of payment
                </span>
                <span className="text-sm font-light font-montserrat">
                  {item?.type}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium font-montserrat">
                  Payment Reference
                </span>
                <span className="text-sm font-light font-montserrat">
                  {`${partnerName[0]}RC-${hashString(`${partnerName[0]}C${item?.id}`)}`}
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
                <th className="font-montserrat    text-xs text-left">Qty</th>
                <th className="font-montserrat text-xs text-left">Rate</th>
                <th className="font-montserrat     text-xs text-left">
                  Amount
                </th>
              </thead>

              {parts?.length > 0 &&
                parts?.map((item: any, index: number) => {
                  return (
                    <tbody>
                      <tr
                        // onClick={() => setOpenItem(true)}
                        className="cursor-pointer table-hover"
                      >
                        <td className="font-montserrat text-xs cursor-pointer">
                          {index + 1}
                        </td>
                        <td className="font-montserrat flex items-center gap-2 text-xs">
                          <span>{item.name}</span>
                        </td>
                        <td className="font-montserrat text-xs">{item.quantity.quantity} {item.quantity.unit}</td>
                        <td className="font-montserrat text-xs">
                          {Util.formAmount(+item.price)}
                        </td>
                        <td className="font-montserrat text-xs">{Util.formAmount(+item.amount)}</td>
                      </tr>
                    </tbody>
                  );
                })
              }

            {labours?.length > 0 &&
              labours?.map((item: any, index: number) => {
                return (
                  <tbody>
                    <tr
                      // onClick={() => setOpenItem(true)}
                      className="cursor-pointer table-hover"
                    >
                      <td className="font-montserrat text-xs cursor-pointer">
                        {index + 1}
                      </td>
                      <td className="font-montserrat flex items-center gap-2 text-xs">
                        <span>{item.title}</span>
                      </td>
                      <td className="font-montserrat text-xs" />
                      <td className="font-montserrat text-xs"/>
                      <td className="font-montserrat text-xs">{Util.formAmount(+item.cost)}</td>
                    </tr>
                  </tbody>
                );
              })
            }
            </table>
          </div>

          <div className="flex flex-col md:flex-row gap-10 justify-between mt-8">
            <div className="w-[100%] mt-16 md:w-[50%]">
              <span className="font-montserrat font-medium">
                Thanks for your patronage
              </span>
            </div>

            <div className="w-[100%] md:w-[50%] px-0 md:px-5">
              <div className=" border-[1px] py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Sub-Total:</span>
                  <span className="text-sm">{Util.formAmount(item?.invoice?.estimate.laboursTotal + item?.invoice?.estimate.partsTotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">VAT:</span>
                  <span className="text-sm">{Util.formAmount(item?.invoice?.estimate.tax + item?.invoice?.estimate.taxPart)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Discount:</span>
                  <span className="text-sm">{Util.formAmount(item?.invoice?.estimate.discount)}</span>
                </div>
              </div>
              <p className="text-xs font-light font-montserrat text-right mt-1">
                Job Duration: {item?.invoice?.estimate.jobDurationValue} {item?.invoice?.estimate.jobDurationUnit}(s)
              </p>

              <div className=" border-[1px] mt-5 py-4 border-[#CACACA] px-10  rounded-[20px]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Paid:</span>
                  <span className="text-sm">{Util.formAmount(item?.amount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Balance Due:</span>
                  <span className="text-sm">{Util.formAmount(amountDue)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Refund Due:</span>
                  <span className="text-sm">{Util.formAmount(amountDue && amountDue < 0 ? amountDue : 0)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-light">Grand Total:</span>
                  <span className="text-sm">{Util.formAmount(item?.invoice?.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row  justify-end gap-3 md:gap-10 mr-5 mt-5">
            <div className="border-[1px] mt-5 cursor-pointer py-4 border-[#CACACA] gap-3 px-10  rounded-[20px] flex items-center"
              onClick={() => _generateDownload()}
            >
              <img
                src={documentdownload}
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="text-[11px] font-montserrat font-semibold">
                {_downloading ? 'Downloading...' : 'Download PDF'}
              </span>
            </div>
            <div className="border-[1px] cursor-pointer mt-5 py-4 flex items-center gap-3 border-[#CACACA] px-10  rounded-[20px]"
              onClick={() => {document.documentElement.clientWidth <= 912 ? handleShareLink() : handleShareLinkNoMessage()}}
            >
              <img
                src={mingcutelinkfill}
                alt=""
                className="w-[24px] h-[24px]"
              />
              <span className="text-[11px] font-montserrat font-semibold">
                {downloading ? 'Sharing...' : 'Share unique link'}
              </span>
            </div>
            <div className="border-[1px] mt-5 py-4 cursor-pointer flex items-center gap-3 border-[#CACACA] px-10  rounded-[20px]"
              onClick={() => handleSharePdf()}
            >
              <img src={mdi_share} alt="" className="w-[24px] h-[24px]" />
              <span className="text-[11px] font-montserrat font-semibold">
                Share PDF
              </span>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentDetails;
