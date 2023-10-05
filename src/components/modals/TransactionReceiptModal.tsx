import React, { useState } from "react";
import SuccessIcon from "../../assets/svgs/success-icon.svg";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import hyvePay from "../../assets/images/hyvePay.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import useAppSelector from "../../hooks/useAppSelector";
import moment from "moment";
import { Util } from "../../helpers/Util";
import { Link } from "react-router-dom";
import messenger from "../../assets/images/messenger.png"
import gmail from "../../assets/images/gmail.png"
import whatsapp from "../../assets/images/whatsapp.png"
import useAdmin from "../../hooks/useAdmin";

const { VITE_TRANSFER_FEE } = import.meta.env


const TransactionReceiptModal = ({
  successModal,
  closeSuccessModal,
  rowData,
}: any) => {

  const state = useAppSelector((state) => state.autoHyveReducer);
  // const { user } = useUser();
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

  const [showShareMenu, setShowShareMenu] = useState(false);
  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };


  return (
    <>
      {successModal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 5000 }}
        >
          <div
            className="modal bg-white py-8 px-3"
            style={{ maxHeight: "70%", overflowY: "scroll" }}
          >
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full">
                <button onClick={() => closeSuccessModal()}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div>
                <div className="flex justify-center">
                  <img src={SuccessIcon} style={{ maxWidth: 70 }} alt="" />
                </div>
                <h5 className="text-center mt-3 text-[#494949] text-[14px] font-semibold">
                  Transaction Receipt
                </h5>
              </div>
            </div>
            <div className="body">
              {/* view */}

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
                      <p className="text-[10px] font-montserrat">
                        {rowData.referenceNumber}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Amount:</p>
                      <p className="text-[10px] font-montserrat">
                        {/* {Util.CurrencyDisplay(Number(rowData.amount))} */}
                        {Util.formAmount(rowData.amount, true)}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Sender:</p>
                      <p className="text-[10px] font-montserrat">
                        {user?.companyName}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Recipient:</p>
                      <p className="text-[10px] font-montserrat">
                        {rowData.beneficiaryName}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Recipient Bank Name:
                      </p>
                      <p
                        style={{ textAlign: "right" }}
                        className="text-[10px] font-montserrat w-[105px]"
                      >
                        {rowData.merchant}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[11px] font-montserrat">
                        {" "}
                        Account Number:
                      </p>
                      <p className="text-[11px] font-montserrat">
                        {rowData.beneficiaryReference}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Narration:</p>
                      <p className="text-[10px] font-montserrat w-[150px] text-right">
                        {rowData.narration}
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        Transfer Fees:
                      </p>
                      <p className="text-[10px] font-montserrat">

                        {Util.CurrencyDisplay(VITE_TRANSFER_FEE)}


                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Status:</p>
                      <p className="text-[10px] font-montserrat">
                        {state.accountTranferResponse?.status}
                      </p>
                    </div>
                  </div>

                  <hr className="mb-4" />
                </div>

                <div className="flex gap-4 justify-around mt-5">
                  <button
                    onClick={handlePDFDownload}
                    className="btn btn-secondary"
                  >
                    Download PDF
                  </button>



                  <div className="share-button-container">
                    <button className="btn btn-secondary" onClick={toggleShareMenu}>
                      {!showShareMenu && (<span>Share PDF</span>)}
                      {showShareMenu && (
                        <div className={`space-x-4 flex`}>

                          <button><Link to="#WA" title="whatsapp icons"><img src={whatsapp} width="20" height="20" /></Link></button>
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
        </div >
      )}
    </>
  );
};

export default TransactionReceiptModal;
