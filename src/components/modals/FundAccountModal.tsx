import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import ConfirmPaymentModal from "../Dashboard/ConfirmPaymentModal";
import { Formik } from "formik";
import SingleTransferForm from "../SingleTransferForm/SingleTransferForm";
import SavedBeneficiaryTransferForm from "../SingleTransferForm/SavedBeneficiaryTransfer";
import useAppDispatch from "../../hooks/useAppDispatch";
import * as Yup from "yup";
import Media from "react-media";
import { Tabs } from "antd";
import { clearRequestNameEnquiryStatus, saveAccountTransferInfo } from "../../store/reducers/autoHyveReducer";
import useAppSelector from "../../hooks/useAppSelector";
import { setExpenseData } from "../../store/reducers/expenseReducer";
import { showMessage } from "../../helpers/notification";

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
    .required("Narration is required"),
  email: Yup.string(),
});

interface IProps {
  openSingleModal: boolean;
  setOpenSingleModal: any;
}

const FundAccountModal = ({
  openSingleModal,
  setOpenSingleModal,
}: IProps) => {
  const [confirmationmodal, setConfirmationmodal] = React.useState(false);
  const [selected, setSelected] = useState("New Beneficiary");
  const expenseReducer = useAppSelector(state => state.expenseReducer);
  const state = useAppSelector((state) => state.autoHyveReducer);

  const [formState, setFormState] = useState({
    accountNumber: "",
    bank: {
      label: "",
      value: "",
    },
    accountName: "",
    amount: "",
    narration: "",
    saveAsBeneficiary: false,
  });

  const tab = ["New Beneficiary", "Saved Beneficiary"];

  const dispatch = useAppDispatch();

  if (openSingleModal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e: any) => {
    if (e.target.id === "modalWrapperId") {
      // setOpenSingleModal(!modal);
    }
  };

  const handleSingleTransfer = (values: any) => {
    // console.log(values);
    dispatch(saveAccountTransferInfo(values));
    setOpenSingleModal(false);
    setConfirmationmodal(true);
  };

  useEffect(() => {
    if(expenseReducer.expenseData?.openModal) {
      setOpenSingleModal(true)
      setFormState({...formState, 
        accountNumber: expenseReducer.expenseData?.accountNumber as string,
        narration: expenseReducer.expenseData?.narration as string,
        amount: expenseReducer.expenseData?.amount as any,
        bank: expenseReducer.expenseData?.bank as any
      });
      
    }
  },[expenseReducer.expenseData?.openModal]);

  const handleClose = () => {
    setOpenSingleModal(false)
    dispatch(setExpenseData({
      id: -1,
      accountName: '',
      bank: {
          bankName: '',
          bankCode: ''
      },
      amount: 0,
      narration: '',
      openModal: false
    }))
  }

  useEffect(() => {
    if(state.requestNameEnquiryStatus === 'completed') {
      setConfirmationmodal(false);
      dispatch(clearRequestNameEnquiryStatus())
    } else if(state.requestNameEnquiryStatus === 'failed') {
      showMessage('', state.requestNameEnquiryError, 'error')
      dispatch(clearRequestNameEnquiryStatus())
    }

  },[state.requestNameEnquiryStatus]);

  return (
    <>
      {openSingleModal && (
        <div
          id="modalWrapperId"
          className="fixed top-0 inset-0 bg-black bg-opacity-70 flex justify-center items-center customModal"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-2 relative w-[90%] md:w-[50%] xs:w-[30%] overflow-y-auto pb-5 xs:pb-2 rounded-md h-[90%]"
            style={{ maxWidth: 600 }}
          >
            <div className="body">
              <div className="flex justify-end w-full">
                <button onClick={handleClose}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>
              <div>
                <h5 className="text-center heading-five mb-5">
                  Transfer Funds
                </h5>
              </div>

              <Media query="(max-width: 600px)">
                {(matches) =>
                  matches ? (
                    <div>
                      <Tabs
                        defaultActiveKey={selected}
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
                        tabBarStyle={{
                          fontFamily: 'montserrat',
                          alignSelf: 'center'
                        }}
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
                            onClick={() => setSelected(item)}
                          />
                        );
                      })}
                    </div>
                  )
                }
              </Media>

              <div className="flex justify-center "></div>

              {/* view */}
              <div className={`form-modal`}>
                {selected === "New Beneficiary" ? (
                  <Formik
                    enableReinitialize
                    initialValues={formState}
                    onSubmit={handleSingleTransfer}
                    validationSchema={AccountTransferSchema}
                  >
                    <SingleTransferForm />
                  </Formik>
                ) : (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      ...formState,
                      beneficiary: { label: "", value: "" },
                    }}
                    onSubmit={handleSingleTransfer}
                    validationSchema={AccountTransferSchema}
                  >
                    <SavedBeneficiaryTransferForm />
                  </Formik>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmPaymentModal
        confirmationmodal={confirmationmodal}
        setConfirmationmodal={setConfirmationmodal}
      />
    </>
  );
};

export default FundAccountModal;
