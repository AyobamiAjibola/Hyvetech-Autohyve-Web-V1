import React from "react";
import { Field, Form } from "formik";
import { MyTextInputBulk } from "../AppInput/AppInput";
import InputHeader from "../InputHeader/InputHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import Select from "react-select";
import { clearAccountHolderDetail } from "../../store/reducers/autoHyveReducer";
import { getAllBankAction, getBeneficiariesAction, performNameEnquiryAction } from "../../store/actions/autoHyveActions";

const SavedBulkBeneficiaryTransferForm = ({
    activeTab,
    inputValues,
    handleInputChange,
    handleInputChangeSelect,
    setInputValues,
    clearField, setClearField
  }: any ) => {
  const dispatch = useAppDispatch();

  // const { _, __ } =
  //   useFormikContext() as FormikContextType<any>;

  const state = useAppSelector((state) => state.autoHyveReducer);

  useEffect(() => {
    dispatch(clearAccountHolderDetail());
    if (inputValues[activeTab].beneficiary) {
      const data = state.beneficiaries.find(
        (item) => item.accountNumber === inputValues[activeTab].beneficiary.value
      );

      if (data && data.accountName !== '' && data.accountNumber !== '') {
        dispatch(
          performNameEnquiryAction({
            beneficiaryAccountNumber: data.accountNumber,
            beneficiaryBankCode: data.bankCode as string,
          })
        );
        setInputValues((prevInputValues: any) => ({
          ...prevInputValues,
          [activeTab]: {
            ...prevInputValues[activeTab],
            accountName: data.accountName,
            bank: { label: data.bankName, value: data.bankCode },
            accountNumber: data.accountNumber
          },
        }));
      } else {
        setInputValues((prevInputValues: any) => ({
          ...prevInputValues,
          [activeTab]: {
            ...prevInputValues[activeTab],
            accountName: '',
            bank: { label: '', value: '' },
            accountNumber: ''
          },
        }));
      }
    }
  }, [inputValues[activeTab].beneficiary]);

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
          narration: '',
          amount: ''
        },
      }));
    }

    setClearField(false)
  },[clearField]);

  return (
    <Form>
      <div className="flex flex-col mt-8 justify-center items-center px-4 md:px-10">
        <div className="w-full mb-3 md:mb-6">
          <label>Choose Beneficiary</label>
          <Select
            options={state.beneficiaries.map((item) => ({
                label: item.accountName,
                value: item.accountNumber,
              }))}
            className="bg-[#F5F5F5] border-[#F5F5F5]"
            name="beneficiary"
            placeholder="Select Beneficiary"
            value={inputValues[activeTab].beneficiary}
            onChange={handleInputChangeSelect}
        />
        </div>
        <div className="form-group flex-col md:flex-row w-full justify-center">
          <div className="w-full mb-3 mt-5 md:mt-0 md:mb-6">
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
                isDisabled
            />
          </div>

          <div className="w-full mb-3 md:mb-6">
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
        </div>

        <div className="form-group flex-col md:flex-row  w-full justify-center">
          <div className="w-full md:mt-0 mt-5 mb-0 md:mb-6">
            <MyTextInputBulk
              type="text"
              placeholderTop="Recipient's Account Number"
              placeholder="Enter account number"
              hasPLaceHolder={true}
              className="bg-[#F5F5F5] border-[#F5F5F5]"
              name="accountNumber"
              value={inputValues[activeTab].accountNumber}
              onChange={handleInputChange}
              disabled
            />
          </div>

          <div className="w-full mb-3 md:mb-6">
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
              value={inputValues[activeTab].narration}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* <div className="w-full mb-3 md:mb-6">
                    <input type="checkbox" name="" id="" className="mr-2" />
                    Save Beneficiary
                  </div> */}

        {/* <AppBtn
          title="Send Money"
          className="text-[#000] w-full bg-[#FAA21B] mt-2"
        // onClick={() => {
        //   setConfirmationmodal(!confirmationmodal);
        //   setOpenSingleModal(false);
        //   // setModal(false);
        // }}
        /> */}
      </div>
    </Form>
  );
};

export default SavedBulkBeneficiaryTransferForm;
