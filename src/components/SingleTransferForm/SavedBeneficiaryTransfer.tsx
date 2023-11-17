import React from 'react';
import { Field, Form, FormikContextType, useFormikContext } from "formik";
import { MySelect, MyTextInput } from "../AppInput/AppInput";
import InputHeader from "../InputHeader/InputHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import AppBtn from "../AppBtn/AppBtn";
import { clearAccountHolderDetail } from "../../store/reducers/autoHyveReducer";
import { getAllBankAction, getBeneficiariesAction, performNameEnquiryAction } from "../../store/actions/autoHyveActions";

const SavedBeneficiaryTransferForm = () => {
  const dispatch = useAppDispatch();

  const { values, setFieldValue } =
    useFormikContext() as FormikContextType<any>;

  const state = useAppSelector((state) => state.autoHyveReducer);

  useEffect(() => {
    dispatch(clearAccountHolderDetail());
    if (values.beneficiary) {
      const data = state.beneficiaries.find(
        (item) => item.accountNumber === values.beneficiary.value
      );

      if (data && data.accountName !== '' && data.accountNumber !== '') {
        dispatch(
          performNameEnquiryAction({
            beneficiaryAccountNumber: data.accountNumber,
            beneficiaryBankCode: data.bankCode as string,
          })
        );
        setFieldValue("bank", { label: data.bankName, value: data.bankCode });
        setFieldValue("accountName", data.accountName);
        setFieldValue("accountNumber", data.accountNumber);
      } else {
        setFieldValue("bank", { label: "", value: "" });
        setFieldValue("accountName", "");
        setFieldValue("accountNumber", "");
      }
    }
  }, [values.beneficiary]);

  const getBanks = useCallback(() => {
    dispatch(getAllBankAction());
    dispatch(getBeneficiariesAction());
  }, []);

  useEffect(() => {
    getBanks();
  }, [getBanks]);
  const dropdownRef = useRef<any>(null);
  const [_, setIsOpen] = useState(false);
  const [__, setIsOpenBeneficiary] = useState(false);
  const hideOnClickOutside = (e: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
      setIsOpenBeneficiary(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);
  return (
    <Form>
      <div className="flex flex-col mt-8 justify-center items-center px-4 md:px-10">
        <div className="w-full mb-3 md:mb-6">
          <label>Choose Beneficiary</label>
          <MySelect
            options={state.beneficiaries.map((item) => ({
              label: item.accountName,
              value: item.accountNumber,
            }))}
            placeholderTop="Beneficiary"
            placeholder="Select Beneficiary"
            name="beneficiary"
          />
        </div>
        <div className="form-group flex-col md:flex-row w-full justify-center">
          <div className="w-full mb-3 mt-5 md:mt-0 md:mb-6">
            <MySelect
              options={state.banks.map((item) => ({
                label: item.bankName,
                value: item.bankCode,
              }))}
              label="Recipient’s Bank Name"
              name="bank"
              disabled
            />
          </div>

          <div className="w-full mb-3 md:mb-6">
            <MyTextInput
              type="text"
              placeholderTop="Account Name"
              placeholder="Enter your account name"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountName"
              disabled
            />
          </div>
        </div>

        <div className="form-group flex-col md:flex-row  w-full justify-center">
          <div className="w-full md:mt-0 mt-5 mb-0 md:mb-6">
            <MyTextInput
              type="text"
              placeholderTop="Recipient's Account Number"
              placeholder="Enter account number"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountNumber"
              disabled
            />
          </div>

          <div className="w-full mb-3 md:mb-6">
            <MyTextInput
              type="text"
              placeholderTop="Enter Amount"
              placeholder="Enter an amount"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="amount"
            />
          </div>
        </div>

        <div className="form-group w-full justify-center">
          <div className="w-full mb-3 mt-5 md:mt-0 md:mb-6">
            <InputHeader text="Narration" />

            <Field
              name="narration"
              id=""
              as="textarea"
              cols={30}
              rows={3}
              maxLength={25}
              placeholder="Enter your message"
              className="bg-gray-100 w-full p-4"
              style={{ borderRadius: 18, border: 0 }}
            />
          </div>
        </div>

        {/* <div className="w-full mb-3 md:mb-6">
                    <input type="checkbox" name="" id="" className="mr-2" />
                    Save Beneficiary
                  </div> */}

        <AppBtn
          title="Send Money"
          className="text-[#000] w-full bg-[#FAA21B] mt-2"
        // onClick={() => {
        //   setConfirmationmodal(!confirmationmodal);
        //   setOpenSingleModal(false);
        //   // setModal(false);
        // }}
        />
      </div>
    </Form>
  );
};

export default SavedBeneficiaryTransferForm;
