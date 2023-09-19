import React, { useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";

const AddRoleModal = ({ addrolemodal, setAddrolemodal, title }) => {
  const [successModal, setSuccessModal] = useState(false);

  const closeSuccessModal = () => setSuccessModal(!successModal);
  return (
    <>
      <SuccessfulPaymentModal
        successModal={successModal}
        closeSuccessModal={closeSuccessModal}
      />
      {addrolemodal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className=" rounded-lg w-[90%] md:w-[40%] bg-white py-8 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-between w-full">
                <h5 className="text-center font-medium font-montserrat">
                  {title}
                </h5>
                <button onClick={() => setAddrolemodal()}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="mt-8 flex gap-8 flex-col justify-center">
                <div>
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Role Name"
                    placeholder="choose role name"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>

                <div className="-mt-5">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Role permission selection"
                    placeholder="choose your permission"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>
            </div>
            <div className="body">
              {/* view */}

              <div className=" flex gap-4 mt-8 justify-center md:justify-end  items-center px-4 md:px-10">
                <AppBtn
                  title="SUBMIT"
                  className="font-medium  w-[90%] md:w-[100px]  md:mt-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRoleModal;
