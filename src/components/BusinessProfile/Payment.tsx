import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TabBtn from "../TabBtn/TabBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import AppBtn from "../AppBtn/AppBtn";
import ActivateAccountModal from "../modals/ActivateAccountModal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputHeader from "../InputHeader/InputHeader";
import Select from "react-select";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getAllBankAction } from "../../store/actions/autoHyveActions";
import { customStyles } from "../../contsants/customStyles";
import axiosClient from "../../config/axiosClient";
import settings from "../../config/settings";
import { showMessage } from "../../helpers/notification";

interface IProps {
    data: any
}

const tabsItems = ["HyvePay", "Other account"];

const Payment = ({data}: IProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    bank: { label: '', value: '' },
    accountNumber: "",
    accountName: ""
  });
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.autoHyveReducer);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllBankAction());
  }, []);

  useEffect(() => {
    setFormState({
        bank: {label: data?.partner?.bankName, value: data?.partner?.bankName },
        accountName: data?.partner?.accountName,
        accountNumber: data?.partner?.accountNumber
    })
  },[data])

  const handleSubmit = async (values: any) => {
    
    try {
        setLoading(true)
        await axiosClient.put(`${settings.api.rest}/partner/secondary/bank`, {
            bank: values.bank.label,
            accountName: values.accountName,
            accountNumber: values.accountNumber
        });
        
        showMessage('', 'Bank details saved successfully', 'success')
        setLoading(false)
    } catch (error: any) {
        showMessage('', error.response.data.message, 'error')
        setLoading(false)
    }
    
    setLoading(false)
  }

  return (
    <>
        <Box>
          <div className="flex gap-3 mt-5 border-[1px] w-[100%] md:w-[40%] rounded-[21px] p-1 border-[#CACACA]">
            {tabsItems.map((item, index) => {
              return (
                <TabBtn
                  title={item}
                  onClick={() => setActiveTab(index)}
                  key={index}
                  className={
                    activeTab === index
                      ? "btn-primary  w-[80%]"
                      : "btn-secondary w-[80%]"
                  }
                />
              );
            })}
          </div>

          {(activeTab === 0) && (
            <>
              <div>
                {data?.partner?.isAccountProvisioned === 'true'
                    ? (<div className="flex flex-col mt-4">
                        <div className="flex flex-col md:flex-row  mt-5 w-full gap-5">
                            <div className="w-full">
                                <AppInput
                                    hasPLaceHolder={true}
                                    placeholderTop="Bank Name"
                                    placeholder="Bank Name"
                                    value={data?.partner?.bankName}
                                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                                />
                            </div>
                            <div className="w-full">
                                <AppInput
                                    hasPLaceHolder={true}
                                    placeholderTop="Account Name"
                                    placeholder="Account Name"
                                    value={data?.partner?.accountName}
                                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row  mt-5 w-full gap-5">
                            <div className="w-full">
                                <AppInput
                                    hasPLaceHolder={true}
                                    placeholderTop="Account Number"
                                    placeholder="Account Number"
                                    value={data?.partner?.accountNumber}
                                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                                />
                            </div>
                            <div className="w-full" />
                        </div>
                      </div>)
                    : (<>
                        <div className="flex flex-col mt-8 justify-center items-center">
                            <span className=" font-montserrat text-small">
                                Activate your HyvePay account to use it as your preferred payment method.
                            </span>

                            <AppBtn
                                title="Activate Account"
                                className="btn-primary text-[#000] mt-8"
                                onClick={() => setShowAccountModal(true)}
                                disabled
                            />
                        </div>
                      </>)
                }
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Formik
                enableReinitialize
                initialValues={formState}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
                validationSchema={
                    Yup.object({
                        // bank: Yup.string().required().label('Bank Name'),
                        accountName: Yup.string().required().label('Account Name'),
                        accountNumber: Yup.string().required().label('Account Name')
                    })
                }
              >
                {({ setFieldValue, values, handleChange, handleBlur }) => (
                  <Form>
                    <div className="flex flex-col mt-4">
                        <div className="flex flex-col md:flex-row  mt-5 w-full gap-5">
                            <div className="w-full">
                                <InputHeader text="Bank Name" />
                                <Select
                                    options={state.banks.map((item) => ({
                                        label: item.bankName,
                                        value: item.bankCode,
                                    }))}
                                    styles={customStyles}
                                    name="bank"
                                    value={values.bank}
                                    onChange={(item) => {
                                        console.log(item?.label, 'yt')
                                        setFieldValue("bank.label", item?.label);
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <MyTextInput
                                    hasPLaceHolder={true}
                                    placeholderTop="Account Name"
                                    placeholder="Account Name"
                                    name="accountName"
                                    value={values.accountName}
                                    nBlur={handleBlur}
                                    onChange={handleChange}
                                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row  mt-5 w-full gap-5">
                            <div className="w-full">
                                <MyTextInput
                                    hasPLaceHolder={true}
                                    placeholderTop="Account Number"
                                    placeholder="Account Number"
                                    name="accountNumber"
                                    value={values.accountNumber}
                                    nBlur={handleBlur}
                                    onChange={handleChange}
                                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                                />
                            </div>
                            <div className="w-full" />
                        </div>

                        <div className="flex justify-end item-end w-[100%]">
                            <AppBtn
                                title="Save"
                                className="btn-primary text-[#000] mt-8 md:w-[200px] w-[100%]"
                                spinner={loading}
                            />
                        </div>
                        
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </Box>

        <ActivateAccountModal
            isVisible={showAccountModal}
            onCancel={() => setShowAccountModal(false)}
            onOk={() => setShowAccountModal(false)}
        />
    </>
  );
};

export default Payment;
