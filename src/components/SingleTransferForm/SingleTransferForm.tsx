import React from 'react';
import { ErrorMessage, Field, Form, FormikContextType, useFormikContext } from "formik";
import { MySelect, MyTextInput } from "../AppInput/AppInput";
import InputHeader from "../InputHeader/InputHeader";
import { useEffect } from "react";
import AppBtn from "../AppBtn/AppBtn";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { clearAccountHolderDetail } from '../../store/reducers/autoHyveReducer';
import { getAllBankAction, performNameEnquiryAction } from '../../store/actions/autoHyveActions';
import { customStyles } from '../../contsants/customStyles';

const SingleTransferForm = () => {
  const { values, setFieldValue } =
    useFormikContext() as FormikContextType<any>;
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.autoHyveReducer);

  useEffect(() => {
    if (values.accountNumber && values.accountNumber.length < 10 || values.bank?.value?.trim() === "")
      return;
    dispatch(clearAccountHolderDetail());
    dispatch(
      performNameEnquiryAction({
        beneficiaryBankCode: values.bank.value,
        beneficiaryAccountNumber: values.accountNumber,
      })
    );
  }, [values.accountNumber, values.bank?.value]);

  useEffect(() => {
    dispatch(getAllBankAction());
  }, []);

  useEffect(() => {
    if (!state.accountHolder) {
      setFieldValue("accountName", "");
      return;
    }

    setFieldValue("accountName", state.accountHolder.beneficiaryName);
  }, [state.accountHolder]);

  return (
    <Form>
      <div className="flex flex-col mt-8 justify-center items-center px-4 md:px-10">
        <div className="form-group flex-col md:flex-row w-full justify-center">
          <div className="w-full">
            <MyTextInput
              type="text"
              placeholderTop="Recipient's Account Number"
              placeholder="Enter account number"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountNumber"
            />
          </div>

          <div className="w-full">
            <MySelect
              options={state.banks.map((item) => ({
                label: item.bankName,
                value: item.bankCode,
              }))}
              styles={customStyles}
              name="bank"
              label="Recipient’s Bank Name"
            />
          </div>
        </div>

        <div className="form-group flex-col md:flex-row  w-full justify-center">
          <div className="w-full ">
            {/* <InputHeader text="Enter your account Name" /> */}
            {/* <Field
              type="text"
              placeholderTop=" Account Name"
              placeholder="Enter your account Name"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountName"
              disabled
            /> */}
            <MyTextInput
              type="text"
              placeholderTop=" Account Name"
              placeholder="Enter your account Name"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountName"
              disabled
            />
          </div>
          <div className="w-full">
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
          <div className="w-full mb-3 md:mt-0 md:mb-6">
            <InputHeader text="Narration" />

            <Field
              name="narration"
              required
              id=""
              as="textarea"
              cols={30}
              rows={3}
              maxLength={20}
              placeholder="Enter your message"
              className="bg-gray-100 w-full p-4"
              style={{ borderRadius: 18, border: 0 }}
            />
            <ErrorMessage name="narration" component="div" className='font-montserrat text-xs text-[red]' />

          </div>
        </div>

        <div className="w-full mb-3 md:mb-6">
          <Field name="saveAsBeneficiary" type="checkbox" />
          <span className="pl-2">Save Beneficiary</span>
        </div>

        <AppBtn
          title="Send Money"
          className="text-[#000] w-full bg-[#FAA21B] mt-2"
          type="submit"
          spinner={state.requestNameEnquiryStatus === "loading"}
        />
      </div>
    </Form>
  );
};

export default SingleTransferForm;
