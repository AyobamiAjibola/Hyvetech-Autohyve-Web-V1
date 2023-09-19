import React from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppInput from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import AppBtn from "../AppBtn/AppBtn";
import AppInputWithPhone from "../AppInputWithPhone/AppInputWithPhone";

const AddNewBeneficiaryModal = ({
  newBeneficiary,
  setnewBeneficiary,
  title = "Add New Beneficiary",
}) => {
  if (newBeneficiary) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setnewBeneficiary(!newBeneficiary);
    }
  };
  return (
    <>
      {newBeneficiary && (
        <div
          id="modalWrapperId"
          className="fixed top-0 inset-0 bg-black bg-opacity-70 flex justify-center items-center customModal"
          onClick={toggleModal}
        >
          <div className="bg-white p-2 relative h-[70%] pt-10 w-[80%] md:w-[50%] overflow-y-auto pb-10  rounded-md">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full relative -top-5">
                <button onClick={() => setnewBeneficiary(!newBeneficiary)}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div>
                <h5 className="text-center heading-five">{title}</h5>
              </div>
            </div>
            <div className="body">
              {/* view */}

              <div className="flex flex-col mt-8 justify-center items-center px-4 md:px-10">
                <div className="form-group flex-col md:flex-row w-full justify-center">
                  <div className="w-full -mb-5 md:mb-6">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholder="Enter account name"
                      placeholderTop="Account Name"
                      className="bg-[#F5F5F5] border-[#F5F5F5]"
                      type="text"
                    />
                  </div>

                  <div className="w-full mb-5 md:mb-3">
                    {/* <label htmlFor="" className="base-text font-montserrat">
                      Phone Number*
                    </label>
                    <div
                      className="prepend phone w-full bg-[#F5F5F5]"
                      style={{ borderRadius: 20 }}
                    >
                      <select
                        name="country-code"
                        className="bg-[#F5F5F5]"
                        id=""
                      >
                        <option value="+234">NG (+234)</option>
                      </select>

                      <input
                        type="number"
                        className="w-full mt-1 bg-[#F5F5F5]"
                        style={{ border: 0 }}
                        placeholder="Phone number"
                      />
                    </div> */}
                    <AppInputWithPhone
                      placeholderTop="Phone Number*"
                      placeholder="Phone Number"
                      hasPLaceHolder={true}
                      className="bg-[#F5F5F5] border-[#F5F5F5]"
                    />
                  </div>
                </div>

                <div className="form-group flex-col md:flex-row  w-full justify-center">
                  <div className="w-full -mb-5 md:mb-6">
                    {/* <label htmlFor=""> Recipient's Account Number</label> <br />
                    <input
                      type="number"
                      placeholder="Enter your account number"
                      className="bg-gray-100 w-full"
                      style={{ border: 0 }}
                    /> */}
                    <AppInput
                      hasPLaceHolder={true}
                      placeholder="Enter your account number"
                      placeholderTop="Recipient's Account Number"
                      className="bg-[#F5F5F5] border-[#F5F5F5]"
                      type="text"
                    />
                  </div>

                  <div className="w-full mb-3 md:mb-6">
                    <AppDropDown className="border-[#F5F5F5]" />
                  </div>
                </div>

                <div className="form-group w-full justify-center">
                  <AppBtn
                    className="bg-[#FAA21B] text-[#000] w-full mt-5 mb-10"
                    title="Save beneficiary"
                  />
                  {/* <button className="btn btn-primary uppercase font-bold w-full">
                    
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNewBeneficiaryModal;
