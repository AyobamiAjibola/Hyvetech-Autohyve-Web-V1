import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import { MyTextInput } from "../AppInput/AppInput";
import { ErrorMessage, Field, Form, Formik } from "formik";
import useAppSelector from "../../hooks/useAppSelector";
import * as Yup from "yup";
import useAppDispatch from "../../hooks/useAppDispatch";
import { showMessage } from "../../helpers/notification";
import {Util} from "../../helpers/Util";
import InputHeader from "../InputHeader/InputHeader";
import { initiateAccountTranfer, initiateBulkAccountTransfer } from "../../store/actions/autoHyveActions";
import { clearPerformBulkAccountEnquiryStatus } from "../../store/reducers/autoHyveReducer";
import SuccessfulPaymentModal from "./SuccessfulPaymentModal";

const ConfirmPaymentModal = ({
  confirmationmodal,
  setConfirmationmodal,
  isBulkTransfer
}: any) => {
  const [successModal, setSuccessModal] = useState(false);
  const closeSuccessModal = () => setSuccessModal(!successModal);

  const state = useAppSelector((state) => state.autoHyveReducer);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state.requestAccountTransferStatus === "completed" || state.performBulkAccountTransferRequestStatus === "completed") {
      // showMessage("Transfer successful", "", "success");
      setSuccessModal(true);
      setConfirmationmodal(false);
    } else if (state.requestAccountTransferStatus === "failed") {
      setConfirmationmodal(false);
      showMessage(state.requestAccountTransferError, "", "error");
    } else if (state.performBulkAccountTransferRequestStatus === "failed") {
      setConfirmationmodal(false);
      // setIsBulkTransfer(false);
      showMessage(state.performBulkAccountTransferRequestError, "", "error");
    }
  }, [
    state.requestAccountTransferStatus,
    state.performBulkAccountTransferRequestStatus
  ]);

  const handleOnSubmit = (values: any) => {
    dispatch(
      initiateAccountTranfer({
        amount: +(state.accountTransferInfo?.amount as string) * 100,
        beneficiaryAccount: state.accountTransferInfo?.accountNumber as string,
        beneficiaryBankCode: state.accountTransferInfo?.bank.value as string,
        beneficiaryName: state.accountHolder?.beneficiaryName as string,
        narration: state.accountTransferInfo?.narration as string,
        NameEnquirySessionID: state.accountHolder?.sessionID as string,
        saveAsBeneficiary: state.accountTransferInfo?.saveAsBeneficiary,
        bankName: state.accountTransferInfo?.bank.label as string,
        pin: values.pin,
      })
    );
  };

  const handleBulkTransferOnSubmit = (values: any) => {
    sessionStorage.setItem('bulk-narration', values.narration)
    dispatch(
      initiateBulkAccountTransfer({
        narration: values.narration,
        BeneficiaryPaymentData: state.bulkAccountTransferInfo as any,
        pin: values.pin,
      })
    );
  };
  
  let totalAmount: number = 0;
  state.bulkAccountTransferInfo.forEach((elem: any) => {
    totalAmount += +elem.amount
  });

  useEffect(() => {
    if(state.performBulkAccountEnquiryStatus === 'completed') {
        dispatch(clearPerformBulkAccountEnquiryStatus())
      }
  },[state.performBulkAccountEnquiryStatus]);

  return (
    <>
      <SuccessfulPaymentModal
        successModal={successModal}
        closeSuccessModal={closeSuccessModal}
        totalAmount={totalAmount}
        setSuccessModal={setSuccessModal}
      />
      {confirmationmodal && (
        <Formik
          initialValues={{ pin: "" }}
          validationSchema={Yup.object({
            pin: Yup.string()
              .matches(/^[0-9]+$/, "PIN should be only digits")
              .length(4, "PIN must be 4 digits")
              .required("PIN is required"),
          })}
          onSubmit={isBulkTransfer ? handleBulkTransferOnSubmit : handleOnSubmit}
        >
          <Form>
            <div
              className="overlay h-screen w-screen flex fixed justify-center items-center"
              style={{ zIndex: 4000 }}
            >
              <div className="modal bg-white py-8 px-3">
                <div className="modal-header pt-0 bg-white px-8">
                  <div className="flex justify-end w-full">
                    <button onClick={() => setConfirmationmodal(false)}>
                      <img src={CloseIcon} alt="" />
                    </button>
                  </div>

                  <div>
                    <h5 className="text-center heading-five">
                      Confirm Payment
                    </h5>
                    {!isBulkTransfer && <h5 className="text-center text-sm gray-color">
  You're about to send {Util.formAmount(Number(state.accountTransferInfo?.amount))} to {state.accountTransferInfo?.accountName}.<br />
  Enter your PIN below to confirm and complete this transaction
                    </h5>}
                    {isBulkTransfer && <h5 className="text-center text-sm gray-color">
  You're about to send {Util.formAmount(totalAmount)} to {state.bulkAccountTransferInfo.length} account(s).<br />
  Enter your PIN below to confirm and complete this transaction
                    </h5>}
                    {/* </div> */}
                  </div>
                </div>
                <div className="body">
                  {/* view */}

                  <div className=" flex flex-col mt-4 justify-center items-center px-4 md:px-10">
                    <div className="w-full mb-1 md:mb-2">
                      <MyTextInput
                        type="password"
                        placeholderTop=" Enter your pin"
                        placeholder="Enter your pin"
                        hasPLaceHolder={true}
                        className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                        name="pin"
                        maxLength={4}
                      />
                    </div>

                    {isBulkTransfer &&
                      <div className="w-full mb-3 md:mt-0 md:mb-6">
                        <InputHeader text="Narration" />
            
                        <Field
                          name="narration"
                          required
                          id="bulk-narration"
                          as="textarea"
                          cols={30}
                          rows={3}
                          maxLength={20}
                          placeholder="Enter your message"
                          className="bg-gray-100 w-full p-4"
                          style={{ borderRadius: 18, border: 0 }}
                        />
                        <ErrorMessage name="narration" component="div" />
            
                      </div>
                    }

                    <div className="form-group w-full justify-center">
                      {!isBulkTransfer && <AppBtn
                        title="Confirm payment"
                        className="text-[#000] w-full bg-[#FAA21B] mt-2"
                        type={"submit"}
                        spinner={
                          state.requestAccountTransferStatus ===
                          "loading"
                        }
                      />}
                      {isBulkTransfer && <AppBtn
                        title="Confirm bulk payment"
                        className="text-[#000] w-full bg-[#FAA21B] mt-2"
                        type={"submit"}
                        spinner={
                          state.performBulkAccountTransferRequestStatus === "loading"
                        }
                      />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default ConfirmPaymentModal;
