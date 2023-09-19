import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Lock from "../../assets/svgs/lock.svg";
import Eye from "../../assets/svgs/eye.svg";

const EditUserModal = ({
  editUser,
  setEditUser,
  title = "Add User",
  // description = 'Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action',
}) => {
  const [successModal, setSuccessModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeSuccessModal = () => setSuccessModal(!successModal);
  const data = [
    "Independent Technician",
    "Single workshop",
    "Workshop Chain",
    "Others",
  ];

  const hideOnClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  return (
    <>
      <SuccessfulPaymentModal
        successModal={successModal}
        closeSuccessModal={closeSuccessModal}
      />
      {editUser && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className="rounded-2xl md:w-[50%] w-[90%] h-[700px] md:h-auto overflow-y-auto bg-white py-8 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-between w-full">
                <h5 className="text-center font-semibold font-montserrat">
                  {title}
                </h5>
                <button onClick={() => setEditUser(false)}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="mt-8 flex gap-8 flex-col justify-center">
                <div className="flex flex-col md:flex-row  w-full gap-4">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="First Name"
                      placeholder="Enter last name"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Last Name"
                      placeholder="Enter last name"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row  w-full gap-4">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Email"
                      placeholder="Enter a valid email"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>

                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Phone Number"
                      placeholder="Phone Number"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row  w-full gap-4">
                  <div className="w-full">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Password"
                      placeholder="Enter a valid password"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                      rightImg={Eye}
                    />
                  </div>

                  <div className="w-full">
                    <AppDropDown
                      title="Role"
                      data={data}
                      placeholder="Choose Role"
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      dropdownRef={dropdownRef}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="body">
              {/* view */}
              <div className=" flex gap-4 mt-8 justify-center md:justify-end items-center px-4 md:px-10">
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

export default EditUserModal;
