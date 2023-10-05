import React from 'react';
import * as Yup from "yup";
import Media from "react-media";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import AppBtn from "../../../components/AppBtn/AppBtn";
// import ConfirmPaymentModal from "../Dashboard/ConfirmPaymentModal";
import { Formik } from "formik";
import useAppDispatch from "../../../hooks/useAppDispatch";
import BulkTransferForm from "../../../components/BulkTransferForm/BulkTransferForm";
import SavedBulkBeneficiaryTransferForm from "../../../components/BulkTransferForm/SavedBulkBeneficiaryTransfer";
import useAppSelector from "../../../hooks/useAppSelector";
import ConfirmPaymentModal from "../../../components/Dashboard/ConfirmPaymentModal";
import { performBulkNameEnquiryAction } from "../../../store/actions/autoHyveActions";
import { saveBulkAccountTransferInfo } from '../../../store/reducers/autoHyveReducer';

const AccountTransferSchema = Yup.object({
    accountNumber: Yup.string().required("Account number is required"),
    accountName: Yup.string().required("Account name is required"),
    bank: Yup.object({
      value: Yup.string().required("Bank is required"),
    }),
    amount: Yup.string()
      .matches(/^[0-9]+$/, "Amount should be only digits")
      .required("Amount is required"),
    narration: Yup.string().max(20, "Narration exceeds 20 characters")
      .optional(),
    email: Yup.string(),
  });

function BulkTransaction({
  activeTab,
  inputValues,
  handleInputChange,
  handleInputChangeSelect,
  setInputValues,
  handleBeneficiaryInputChangeSelect,
  handleInputChangeCheckBox
}: any) {
    const [confirmationmodal, setConfirmationmodal] = useState(false);
    const [selected, setSelected] = useState("New Beneficiary");
    const [clearField, setClearField] = useState<boolean>(false);
    const [isBulkTransfer, setIsBulkTransfer] = useState<boolean>(false);
    // const [nameEnquiry, setNameEnquiry] = useState<boolean>(false);

    const state = useAppSelector((state) => state.autoHyveReducer);

    const [formState] = useState({
        accountNumber: "",
        bank: {
          label: "",
          value: "",
        },
        accountName: "",
        amount: "",
        narration: "",
        saveAsBeneficiary: false,
        nameEnquirySessionId: ""
      });
    
      const tab = ["New Beneficiary", "Saved Beneficiary"];
    
      const dispatch = useAppDispatch();

      const handleBulkTransfer = () => {
        // setConfirmationmodal(true);
        dispatch(saveBulkAccountTransferInfo(Object.values(inputValues)));
        dispatch(performBulkNameEnquiryAction({Data: Object.values(inputValues)}))
        setIsBulkTransfer(true)
        
      };

      const handleTabBtn = (item: any) => {
        setSelected(item)
        setClearField(true)
      };

    useEffect(() => {
      if(state.performBulkAccountEnquiryStatus === 'completed') {
        const data = Object.values(inputValues);
        //@ts-ignore
        const beneficiaries = state.bulkAccountHolder?.data.beneficiaries;

        const dataMap = {} as any;
        beneficiaries.forEach((item: any) => {
          dataMap[item.accountNumber] = item.nameEnquirySessionId;
        });

        const updatedResource = data.map((item: any) => ({
          ...item,
          nameEnquirySessionId: dataMap[item.accountNumber] || item.nameEnquirySessionId,
        }));

        dispatch(saveBulkAccountTransferInfo(updatedResource));
      }

    },[state.performBulkAccountEnquiryStatus])

    useEffect(() => {
      if(state.performBulkAccountEnquiryStatus === 'completed') {
        setConfirmationmodal(true);
      }
    }, [state.performBulkAccountEnquiryStatus]);

    return (
        <div className="body">
            
            <Media query="(max-width: 600px)">
                {(matches) =>
                  matches ? (
                    <div>
                      <Tabs
                        defaultActiveKey={selected[activeTab]}
                        items={[
                          {
                            label: "New Beneficiary",
                            key: "New Beneficiary",
                            children: null,
                          },
                          {
                            label: "Saved Beneficiary",
                            key: "Saved Beneficiary",
                            children: null,
                          },
                        ]}
                        activeKey={selected}
                        onChange={(key) => setSelected(key)}
                      />
                    </div>
                  ) : (
                    <div className=" border-[#CACACA] border-[1px] p-2 w-[100%] mx-auto  md:w-[90%] gap-3 rounded-[15px] tabWrapper items-center justify-between flex self-center">
                      {tab.map((item, _) => {
                        return (
                          <AppBtn
                            className={`text-[#000] w-[48%] customBtnText] ${selected === item
                              ? "bg-[#FAA21B] "
                              : "bg-[#fff] border-[#CACACA] border-[1px]"
                              } `}
                            title={item}
                            // savedBen={item === 'Saved Beneficiary'}
                            onClick={() => handleTabBtn(item)}
                          />
                        );
                      })}
                    </div>
                  )
                }
            </Media>

            <div className="flex justify-center "></div>

            {/* view */}
            <div className="form-modal">
            {selected === "New Beneficiary" ? (
                <Formik
                    enableReinitialize
                    initialValues={formState}
                    onSubmit={handleBulkTransfer}
                    validationSchema={AccountTransferSchema}
                >
                    <BulkTransferForm
                      activeTab={activeTab}
                      inputValues={inputValues}
                      handleInputChange={handleInputChange}
                      handleInputChangeSelect={handleInputChangeSelect}
                      setInputValues={setInputValues}
                      clearField={clearField}
                      setClearField={setClearField}
                      handleInputChangeCheckBox={handleInputChangeCheckBox}
                    />
                </Formik>
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={{
                      ...formState,
                      beneficiary: { label: "", value: "" },
                    }}
                    onSubmit={handleBulkTransfer}
                    validationSchema={AccountTransferSchema}
                >
                    <SavedBulkBeneficiaryTransferForm
                      activeTab={activeTab}
                      inputValues={inputValues}
                      handleInputChange={handleInputChange}
                      handleInputChangeSelect={handleBeneficiaryInputChangeSelect}
                      setInputValues={setInputValues}
                      clearField={clearField}
                      setClearField={setClearField}
                    />
                </Formik>
            )}
            </div>

          <div
            className="flex justify-center"
          >
            <AppBtn
              title="Send Money"
              className="text-[#000] w-[86%] bg-[#FAA21B] mt-2"
              onClick={handleBulkTransfer}
              spinner={state.requestNameEnquiryStatus === "loading" || state.performBulkAccountEnquiryStatus === "loading"}
            />
          </div>

          <ConfirmPaymentModal
            confirmationmodal={confirmationmodal}
            setConfirmationmodal={setConfirmationmodal}
            isBulkTransfer={isBulkTransfer}
          />

          {/* <NameEnquiryModal 
            nameEnquiry={nameEnquiry}
            setNameEnquiry={setNameEnquiry}
            inputValues={inputValues}
            setConfirmationmodal={setConfirmationmodal}
          /> */}
          
        </div>
    )
}

export default BulkTransaction;