import React, { useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";

const EditRoleModal = ({ editRole, setEditRole }) => {
  return (
    <>
      {editRole && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className="rounded-2xl md:w-[40%] w-[90%]  md:h-auto overflow-y-auto bg-white py-8 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-between w-full">
                <h5 className="text-center font-semibold font-montserrat">
                  Edit Role
                </h5>
                <button onClick={() => setEditRole()}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="mt-8 flex gap-8 flex-col justify-center">
                <div className="flex flex-col  w-full gap-4">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Role Name"
                      placeholder="Super"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Role Permission Selection"
                      placeholder="choose your permission"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="body">
              {/* view */}
              <div className=" flex gap-4 md:mt-5 justify-center md:justify-start items-center px-4 md:px-10">
                <AppBtn
                  title="SUBMIT"
                  className="font-medium w-[90%] md:w-[100px] "
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditRoleModal;
