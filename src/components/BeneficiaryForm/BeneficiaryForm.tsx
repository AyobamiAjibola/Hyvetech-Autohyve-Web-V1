import React from 'react';
import { Form, FormikContextType, useFormikContext } from "formik";
import AppBtn from "../AppBtn/AppBtn";
import { MySelect, MyTextInput } from "../AppInput/AppInput";
import { customStyles } from "../../contsants/customStyles";
import InputHeader from "../InputHeader/InputHeader";
import { useEffect } from "react";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { clearAccountHolderDetail } from "../../store/reducers/autoHyveReducer";
import { getAllBankAction, performNameEnquiryAction } from "../../store/actions/autoHyveActions";

const BeneficiaryForm = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.autoHyveReducer);
  useEffect(() => {
    dispatch(getAllBankAction());
  }, []);

  const { values, setFieldValue } =
    useFormikContext() as FormikContextType<any>;
  useEffect(() => {
    if (
      values.accountNumber.length < 10 ||
      values.bankName?.value?.trim() === ""
    )
      return;
    dispatch(clearAccountHolderDetail());
    dispatch(
      performNameEnquiryAction({
        beneficiaryBankCode: values.bankName.value,
        beneficiaryAccountNumber: values.accountNumber,
      })
    );
  }, [values.accountNumber, values.bank?.value]);

  useEffect(() => {
    if (!state.accountHolder) {
      setFieldValue("accountName", "");
      return;
    }

    setFieldValue("accountName", state.accountHolder.beneficiaryName);
  }, [state.accountHolder]);
  return (
    <Form>
      <div className="body">
        <div className="flex flex-col mt-8 justify-center items-center px-4 md:px-10">
          <div className="form-group flex-col w-full justify-center">
            <div className="w-full">
              <MyTextInput
                hasPLaceHolder={true}
                placeholder="John Doe"
                placeholderTop="Beneficiary Name"
                className="bg-[#F5F5F5] border-[#F5F5F5]"
                type="text"
                name="name"
              />
            </div>
            <div className="w-full">
              <InputHeader text="Bank" />
              <MySelect
                hasPLaceHolder={true}
                placeholder=""
                className="bg-[#F5F5F5] border-[#F5F5F5]"
                name="bankName"
                options={
                  state.banks?.map((item) => ({
                    label: item.bankName,
                    value: item.bankCode,
                  })) || []
                }
                styles={customStyles}
              />
              <br />
            </div>
            <div className="form-group flex-col md:flex-row  w-full justify-center">
              <div className="w-full">
                <MyTextInput
                  hasPLaceHolder={true}
                  placeholder="Enter your account number"
                  placeholderTop="Recipient's Account Number"
                  className="bg-[#F5F5F5] border-[#F5F5F5]"
                  type="text"
                  name="accountNumber"
                />
              </div>

              {/* <div className="w-full mb-3 md:mb-6">
                        <AppDropDown className="border-[#F5F5F5]" />
                      </div> */}
            </div>

            <div className="form-group flex-col md:flex-row  w-full justify-center">
              <div className="w-full">
                <MyTextInput
                  hasPLaceHolder={true}
                  placeholder="Enter your account Name"
                  placeholderTop="Recipient's Account Name"
                  className="bg-[#F5F5F5] border-[#F5F5F5]"
                  type="text"
                  name="accountName"
                  disabled
                />
              </div>

              {/* <div className="w-full mb-3 md:mb-6">
                        <AppDropDown className="border-[#F5F5F5]" />
                      </div> */}
            </div>

            <div className="form-group w-full justify-center">
              <AppBtn
                className="bg-[#FAA21B] text-[#000] w-full mt-5 mb-10"
                title="Save beneficiary"
                type="submit"
                spinner={
                  state.createBeneficiaryStatus === "loading" ||
                  state.requestNameEnquiryStatus === "loading"
                }
              />
              {/* <button className="btn btn-primary uppercase font-bold w-full">
                    
                  </button> */}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default BeneficiaryForm;
