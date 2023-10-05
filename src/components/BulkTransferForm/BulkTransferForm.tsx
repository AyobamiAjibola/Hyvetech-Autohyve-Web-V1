import React from "react";
import { ErrorMessage, Field, Form, FormikContextType, useFormikContext } from "formik";
import { MyTextInputBulk } from "../AppInput/AppInput";
import InputHeader from "../InputHeader/InputHeader";
import { useEffect } from "react";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import Select from "react-select";
import { getAllBankAction, performNameEnquiryAction } from "../../store/actions/autoHyveActions";
import { clearAccountHolderDetail } from "../../store/reducers/autoHyveReducer";

const BulkTransferForm = ({
  activeTab,
  inputValues,
  handleInputChange,
  handleInputChangeSelect,
  setInputValues,
  clearField, setClearField,
  handleInputChangeCheckBox
}: any) => {
  const { setFieldValue } =
  useFormikContext() as FormikContextType<any>;

  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.autoHyveReducer);

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

  useEffect(() => {
    if (inputValues[activeTab].accountNumber.length < 10 || inputValues[activeTab].bank?.value?.trim() === "")
      return;
    dispatch(clearAccountHolderDetail());
    dispatch(
      performNameEnquiryAction({
        beneficiaryBankCode: inputValues[activeTab].bank.value,
        beneficiaryAccountNumber: inputValues[activeTab].accountNumber,
      })
    );
  }, [
    inputValues[activeTab].accountNumber,
    inputValues[activeTab].bank?.value
  ]);

  useEffect(() => {
    if (!state.accountHolder) {
      setInputValues((prevInputValues: any) => ({
        ...prevInputValues,
        [activeTab]: {
          ...prevInputValues[activeTab],
          accountName: '',
        },
      }));
      return;
    }
  
    setInputValues((prevInputValues: any) => ({
      ...prevInputValues,
      [activeTab]: {
        ...prevInputValues[activeTab],
        accountName: state.accountHolder && state.accountHolder.beneficiaryName
      },
    }));
  }, [state.accountHolder, activeTab]);

  useEffect(() => {
    if(clearField) {
      setInputValues((prevInputValues: any) => ({
        ...prevInputValues,
        [activeTab]: {
          ...prevInputValues[activeTab],
          accountName: '',
          bank: { label: '', value: '' },
          beneficiary: { label: '', value: '' },
          accountNumber: '',
          amount: '',
          saveAsBeneficiary: false,
          narration: '',
          nameEnquirySessionId: ''
        },
      }));
    }

    setClearField(false)
  },[clearField]);

  return (
    <Form>
      <div className="flex flex-col mt-8 justify-center items-center px-4 md:px-10">
        <div className="form-group flex-col md:flex-row w-full justify-center">
          <div className="w-full">
            <MyTextInputBulk
              type="text"
              placeholderTop="Recipient's Account Number"
              placeholder="Enter account number"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountNumber"
              value={inputValues[activeTab].accountNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <InputHeader text="Recipient’s Bank Name" />
            <Select
                options={state.banks.map((item) => ({
                    label: item.bankName,
                    value: item.bankCode,
                  }))}
                className="bg-[#F5F5F5] border-[#F5F5F5]"
                name="bank"
                value={inputValues[activeTab].bank}
                onChange={handleInputChangeSelect}
            />
          </div>
        </div>

        <div className="form-group flex-col md:flex-row  w-full justify-center">
          <div className="w-full ">
             <MyTextInputBulk
              type="text"
              placeholderTop=" Account Name"
              placeholder="Enter your account Name"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountName"
              disabled
              value={inputValues[activeTab].accountName}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <MyTextInputBulk
              type="text"
              placeholderTop="Enter Amount"
              placeholder="Enter an amount"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="amount"
              value={inputValues[activeTab].amount}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group w-full justify-center">
          <div className="w-full mb-3 md:mt-0 md:mb-6">
            <InputHeader text="Narration" />

            <Field
              name="narration"
              id=""
              as="textarea"
              cols={30}
              rows={3}
              maxLength={20}
              placeholder="Enter your message"
              className="bg-gray-100 w-full p-4"
              style={{ borderRadius: 18, border: 0 }}
              value={inputValues[activeTab].narration}
              onChange={handleInputChange}
            />
            <ErrorMessage name="narration" component="div" />
          </div>
        </div>

        <div className="w-full mb-3 md:mb-6">
          <Field
            name="saveAsBeneficiary"
            type="checkbox"
            checked={inputValues[activeTab].saveAsBeneficiary}
            onChange={handleInputChangeCheckBox}
          />
          <span className="pl-2">Save Beneficiary</span>
        </div>

        {/* <AppBtn
          title="Send Money"
          className="text-[#000] w-full bg-[#FAA21B] mt-2"
          type="submit"
          spinner={state.performAccountEnquiryStatus === "loading"}
        /> */}
      </div>
    </Form>
  );
};

export default BulkTransferForm;