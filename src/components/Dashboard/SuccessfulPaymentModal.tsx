import React, { useEffect, useState } from "react";
import SuccessIcon from "../../assets/svgs/success-icon.svg";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import hyvePay from "../../assets/images/hyvePay.png";
import messenger from "../../assets/images/messenger.png"
import gmail from "../../assets/images/gmail.png"
import whatsapp from "../../assets/images/whatsapp.png"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import useAppSelector from "../../hooks/useAppSelector";
import moment from "moment";
import { Util } from "../../helpers/Util";
import { Link } from "react-router-dom";
import useAdmin from "../../hooks/useAdmin";


const { VITE_TRANSFER_FEE } = import.meta.env

const SuccessfulPaymentModal = ({
  successModal,
  // closeSuccessModal,
  totalAmount,
  setSuccessModal
}: any) => {
  const state = useAppSelector((state) => state.autoHyveReducer);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };
  const [isBulkPayment, setIsBulkPayment] = useState<boolean>(false);

  const { user } = useAdmin()

  const handlePDFDownload = () => {
    const pdfview = document.querySelector("#pdfView") as HTMLElement;
    const pdf = new jsPDF() as any;
    html2canvas(pdfview).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "JPEG", 12, 12, 180, 180);
      pdf.save("receipt.pdf");
    });
  };

  useEffect(() => {
    if (state.performBulkAccountTransferRequestStatus === "completed") {
      setIsBulkPayment(true)
    }
  },[state.performBulkAccountTransferRequestStatus]);

  return (
    <>
      {successModal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 5000 }}
        >
          <div
            className="modal bg-white py-8 px-3"
            style={{ maxHeight: "90%", overflowY: "scroll" }}
          >
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full">
                <button onClick={() => {
                    setSuccessModal(false)
                    setIsBulkPayment(false)
                    sessionStorage.removeItem('bulk-narration')
                  }}
                >
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div>
                <div className="flex justify-center">
                  <img src={SuccessIcon} style={{ maxWidth: 70 }} alt="" />
                </div>
                <h5 className="text-center mt-3 text-[#494949] text-[14px] font-semibold">
                  Payment Successful
                </h5>
                {!isBulkPayment && <h5 className="text-center md:text-sm text-[9px] max-w-[95%]  text-[#494949] font-montserrat">
                  Yay! Congratulations...&nbsp;
                  {Util.CurrencyDisplay(
                    Number(state.accountTransferInfo?.amount)
                  )}&nbsp;
                  was successfully sent <br />
                  to{" "}
                  <strong>
                    {state.accountTransferInfo?.accountName} |{" "}
                    {state.accountTransferInfo?.bank.label} |
                    {state.accountHolder?.beneficiaryAccountNumber}
                  </strong>
                </h5>}
                {isBulkPayment && <h5 className="text-center md:text-sm text-[9px] max-w-[95%]  text-[#494949] font-montserrat">
                  Yay! Congratulations...&nbsp;
                  {Util.CurrencyDisplay(totalAmount)}&nbsp;
                  was successfully sent to{" "}
                  <strong>
                    {state.bulkAccountTransferInfo.length}{" "}Account(s)
                  </strong>
                </h5>}
              </div>
            </div>
            <div className="body">

              <div className=" flex flex-col mt-4 justify-center items-center px-4 md:px-10">
                <div
                  id="pdfView"
                  className="w-full receipt-preview mt-4 p-3 md:p-8 mb-1 md:mb-3"
                >
                  <div className="flex justify-between items-center">
                    <h5 className="text-[#494949] text-[14px] font-semibold">
                      Transaction Receipt
                    </h5>
                    <img src={hyvePay} alt="" style={{ width: 30 }} />
                  </div>

                  <div className="my-8">
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Transaction Date:
                      </p>
                      <p className="text-[10px] font-montserrat">
                        {moment().format("DD-MM-YYYY")}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Reference Number:
                      </p>
                      {!isBulkPayment && <p className="text-[10px] font-montserrat">
                        {state.accountTranferResponse?.transactionReference}
                      </p>}
                      {isBulkPayment && <p className="text-[10px] font-montserrat">
                        {state.bulkAccountTransferResponse?.requestReference}
                      </p>}
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Amount:</p>
                      {!isBulkPayment && <p className="text-[10px] font-montserrat">
                        {Util.CurrencyDisplay(
                          Number(state.accountTransferInfo?.amount)
                        )}
                      </p>}
                      {isBulkPayment && <p className="text-[10px] font-montserrat">
                        {Util.CurrencyDisplay(totalAmount)}
                      </p>}
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Sender:</p>
                      <p className="text-[10px] font-montserrat">
                        {user?.companyName}
                      </p>
                    </div>
                    {!isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Recipient:</p>
                      <p className="text-[10px] font-montserrat">
                        {state.accountHolder?.beneficiaryName}
                      </p>
                    </div>}
                    {!isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Recipient Bank Name:
                      </p>
                      <p
                        style={{ textAlign: "right" }}
                        className="text-[10px] font-montserrat w-[105px]"
                      >
                        {state.accountTransferInfo?.bank.label}
                      </p>
                    </div>}
                    {!isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[11px] font-montserrat">
                        {" "}
                        Account Number:
                      </p>
                      <p className="text-[11px] font-montserrat">
                        {state.accountHolder?.beneficiaryAccountNumber}
                      </p>
                    </div>}
                    {!isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Narration:</p>
                      <p className="text-[10px] font-montserrat w-[150px] text-right">
                        {state.accountTransferInfo?.narration}
                      </p>
                    </div>}
                    {isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Narration:</p>
                      <p className="text-[10px] font-montserrat w-[150px] text-right">
                        {sessionStorage.getItem('bulk-narration')}
                      </p>
                    </div>}
                    {!isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Transfer Fees:
                      </p>
                      <p className="text-[10px] font-montserrat">
                        {Util.CurrencyDisplay(VITE_TRANSFER_FEE)}
                      </p>
                    </div>}
                    {isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Transfer Fees:
                      </p>
                      <p className="text-[10px] font-montserrat">
                        {Util.CurrencyDisplay(VITE_TRANSFER_FEE * state.bulkAccountTransferInfo.length)}
                      </p>
                    </div>}
                    {!isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Status:</p>
                      <p className="text-[10px] font-montserrat">
                        {state.accountTranferResponse?.status}
                      </p>
                    </div>}
                    {isBulkPayment && <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Status:</p>
                      <p className="text-[10px] font-montserrat">
                        {state.bulkAccountTransferResponse?.status && 'Successful'}
                      </p>
                    </div>}
                  </div>

                  <hr className="mb-4" />

                  <p className="md:text-xs text-[5px]  text-gray-500  font-montserrat">
                    {" "}
                    <b>Disclaimer:</b> Enjoy customized banking experienced with
                    HyvePay. HyvePay financial serves are backed by Kuda
                    Microfinance Bank, regulated by CBN and insured by NDIC. And
                    all transactions are subject to the CBN regulations.
                  </p>
                </div>

                <div className="flex gap-4 justify-around mt-5">
                  <button
                    onClick={handlePDFDownload}
                    className="btn btn-secondary"
                  >
                    Download PDF
                  </button>

                  <div className="share-button-container">
                    <button className={`btn btn-secondary`} onClick={toggleShareMenu}>
                      {!showShareMenu && (<span>Share PDF</span>)}
                      {showShareMenu && (
                        <div className={`space-x-4 flex`}>

                          <button><Link to="#" title="whatsapp icons"><img src={whatsapp} width="20" height="20" /></Link></button>
                          <button><Link to="#IG" className="social-icon"><img src={gmail} width="20" height="20" /></Link></button>
                          <button><Link to="#LI" className="social-icon"><img src={messenger} width="20" height="20" /></Link></button>


                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessfulPaymentModal;
