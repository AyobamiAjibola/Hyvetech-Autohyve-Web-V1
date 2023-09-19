import React from "react";
import SuccessIcon from "../../assets/svgs/success-icon.svg";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import HyveIcon2 from "../../assets/svgs/hyve-icon2.svg";
import hyvePay from "../../assets/images/hyvePay.png";

const SuccessfulPaymentModal = ({ successModal, closeSuccessModal }) => {
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
                <button onClick={() => closeSuccessModal()}>
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
                <h5 className="text-center md:text-sm text-[9px] max-w-[95%]  text-[#494949] font-montserrat">
                  Yay! Congratulations... ₦50,000 was successfully sent <br />
                  to (Beneficiary 1 GTBank 0357935792)
                </h5>
                {/* </div> */}
              </div>
            </div>
            <div className="body">
              {/* view */}

              <div className=" flex flex-col mt-4 justify-center items-center px-4 md:px-10">
                <div className="w-full receipt-preview mt-4 p-3 md:p-8 mb-1 md:mb-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[#494949] text-[14px] font-semibold">
                      Transaction Receipt
                    </h5>
                    <img src={hyvePay} alt="" style={{ width: 30 }} />
                  </div>

                  <div className="my-8">
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        {" "}
                        Transaction Date:
                      </p>
                      <p className="text-[10px] font-montserrat">12-06-2023</p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        {" "}
                        Reference Number:
                      </p>
                      <p className="text-[10px] font-montserrat">
                        REF897/386753434354
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Amount:</p>
                      <p className="text-[10px] font-montserrat">₦50,000.00</p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Sender:</p>
                      <p className="text-[10px] font-montserrat">
                        DEMO WORKSHOP
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Recipient:</p>
                      <p className="text-[10px] font-montserrat">DAVID JAMES</p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        {" "}
                        Recipient Bank Name:
                      </p>
                      <p className="text-[10px] font-montserrat w-[105px]">
                        Guaranty Trust Bank (GTBank)
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[11px] font-montserrat">
                        {" "}
                        Account Number:
                      </p>
                      <p className="text-[11px] font-montserrat">0564784545</p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Narration:</p>
                      <p className="text-[10px] font-montserrat w-[150px] text-right">
                        Refund from your excess payment for engine
                      </p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat">
                        {" "}
                        Transfer Fees:
                      </p>
                      <p className="text-[10px] font-montserrat">₦0.00</p>
                    </div>
                    <div className="flex justify-between mb-2 items-center">
                      <p className="text-[10px] font-montserrat"> Status:</p>
                      <p className="text-[10px] font-montserrat">Successful</p>
                    </div>
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
                  <button className="btn btn-secondary">Download PDF</button>

                  <div>
                    <button className="btn btn-secondary">Share PDF</button>
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
