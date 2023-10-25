import React, { FC, useEffect, useState } from "react";
import AppBtn from "../AppBtn/AppBtn";
import { MyTextInput } from "../AppInput/AppInput";
import UploadBox from "../UploadBox/UploadBox";
import { Modal } from "antd";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { showError, showMessage } from "../../helpers/notification";
import { Uploader } from "../../helpers/Uploader";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { clearAccountActivationStatus } from "../../store/reducers/autoHyveReducer";
import { requestActivationAction } from "../../store/actions/autoHyveActions";

interface IProps {
  isVisible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  accountName: string;
}

const ActivateIndividualAccountModal: FC<IProps> = ({
  isVisible = false,
  onCancel,
  onOk,
  accountName
}) => {
  const [formState, setFormState] = useState({
    accountName: "",
    nin: "",
    bvn: "",
    pin: "",
    confirmPin: "",
    validIdFront: null,
    validIdBack: null,
    cacDoc: null,
  });

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const state = useAppSelector((state) => state.autoHyveReducer);

  useEffect(() => {
    if (state.requestAccountActivationStatus === "completed") {
      showMessage(
        "Account activation sent successfully",
        "Please wait while we review your request",
        "success"
      );
      
      onOk && onOk();
    } else if (state.requestAccountActivationStatus === "failed") {
      showMessage(state.requestAccountActivationError, "", "error");
    }

    return () => {
      dispatch(clearAccountActivationStatus());
    }
  }, [state.requestAccountActivationStatus]);

  const handleOnSubmit = async (values: any) => {

    try {
      if (!values.validIdFront)
        return showMessage(
          "Please provide the front picture of your ID",
          "",
          "warning"
        );
      if (!values.validIdBack)
        return showMessage(
          "Please provide the back picture of your ID",
          "",
          "warning"
        );

      setLoading(true);

      const formData1 = new FormData();

      formData1.append("file", values.validIdFront);

      const validIDFrontResult = await Uploader.uploadFile(formData1);

      const formData2 = new FormData();
      formData2.append("file", values.validIdBack);
      const validIDBackResult = await Uploader.uploadFile(formData2);

      // let cacDOcResult: UploadResult | null = null;
      if (values.cacDoc) {
        const formData3 = new FormData();
        formData3.append("file", values.cacDoc);

        // cacDOcResult = await Uploader.uploadFile(formData3);
      }

      setLoading(false);
      
      dispatch(
        requestActivationAction({
          businessName: values.accountName,
          cacUrl: "",
          validIdBackUrl: validIDBackResult.file.url,
          validIdFrontUrl: validIDFrontResult.file.url,
          pin: values.pin,
          nin: values.nin,
          bvn: values.bvn,
        })
      );
    } catch (error) {
      console.log(error);
      showError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormState({...formState, accountName})
  }, [accountName]);

  return (
    <Modal
      footer={null}
      width={600}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <div className="bg-white ">
        <div className="">
          <div className=" mt-4  px-4 md:px-10">
            <div className="text-center mb-8 mt-5">
              <h5 className="font-semibold font-montserrat">
                Activate Account
              </h5>
              <p className="text-[14px] font-extralight font-montserrat leading-5">
                Provide the information below to activate your account. Thank
                you!
              </p>
            </div>
            <Formik
              validationSchema={Yup.object({
                accountName: Yup.string().required(
                  "Account Name is required"
                ),
                nin: Yup.string()
                  .matches(/^[0-9]+$/, "NIN should be numbers")
                  .min(11, "NIN should be 11 digits")
                  .max(11, "NIN should be 11 digits")
                  .required("NIN is required"),
                bvn: Yup.string()
                  .matches(/^[0-9]+$/, "BVN should be numbers")
                  .min(11, "BVN should be 11 digits")
                  .max(11, "BVN should be 11 digits")
                  .required("BVN is required"),
                pin: Yup.string()
                  .min(4, "PIN should be 4 digits")
                  .max(4, "PIN should be 4 digits")
                  .required("PIN is required"),
                confirmPin: Yup.string()
                  .min(4)
                  .max(4)
                  .test(
                    "confirmPin",
                    "Confirm PIN and PIN do not match",
                    function (confirmPin) {
                      const { pin } = this.parent;
                      return confirmPin === pin;
                    }
                  ),
              })}
              enableReinitialize
              initialValues={formState}
              onSubmit={(values) => handleOnSubmit(values)}
            >
              <Form>
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholder="Enter account name"
                    placeholderTop="Account Name"
                    className="bg-[#F5F5F5]"
                    name="accountName"
                    disabled
                  />
                </div>

                <UploadBox
                  name={"validIdFront"}
                  title="Valid Identity Card (Front)"
                />
                <UploadBox
                  name={"validIdBack"}
                  title="Valid Identity Card (Back)"
                />
                {/* <UploadBox name={"cacDoc"} title="CAC Document" /> */}
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholder="Enter NIN"
                    placeholderTop="National Identity Number(NIN)"
                    className="bg-[#F5F5F5]"
                    name="nin"
                  />
                </div>
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholder="Enter BVN"
                    placeholderTop="BVN"
                    className="bg-[#F5F5F5]"
                    name="bvn"
                  />
                </div>
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholder="Enter PIN"
                    placeholderTop="PIN"
                    className="bg-[#F5F5F5]"
                    name="pin"
                    type="password"
                  />
                </div>
                <div className="w-full">
                  <MyTextInput
                    hasPLaceHolder={true}
                    placeholder="Confirm  PIN"
                    placeholderTop="Confirm PIN"
                    className="bg-[#F5F5F5]"
                    name="confirmPin"
                    type="password"
                  />
                </div>
                <AppBtn
                  title="Activate"
                  className="bg-[#FAA21B] text-[#000] w-full my-5"
                  type={"submit"}
                  spinner={
                    state.requestAccountActivationStatus === "loading" || loading
                  }
                />
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ActivateIndividualAccountModal;
