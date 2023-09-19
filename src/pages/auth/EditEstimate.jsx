import React, { useEffect, useRef, useState } from "react";

import { FaCalendarAlt } from "react-icons/fa";
import AppInput from "../../components/AppInput/AppInput";
import AppInputWithPhone from "../../components/AppInputWithPhone/AppInputWithPhone";
import InputHeader from "../../components/InputHeader/InputHeader";

import DropDownHalf from "../../components/DropDownHalf/DropDownHalf";
import DeleteBox from "../../components/DeleteBox/DeleteBox";
import CustomTextArea from "../../components/CustomTextArea/CustomTextArea";
import AppBtn from "../../components/AppBtn/AppBtn";
import ReminderModal from "../../components/AutoHyveModals/ReminderModal";
import AppDropDown from "../../components/AppDropDown/AppDropDown";
import CustomDate from "../../components/CustomDate/CustomDate";

const GenerateEstimate = () => {
  const data = ["Individual", "Co-operate"];
  const [openStart, setOpenStart] = useState(false);
  const [calender, setCalender] = useState("");
  const [openReminder, setOpenReminder] = useState();
  const [check, setCheck] = useState(false);

  const years = ["Year(s)", "Month(s)", "Week(s)", "Day(s)"];
  const quantityData = ["Pcs", "Kg", "Set", "Pair", "Litres", "Kit"];
  const milesData = ["Miles", "Km"];
  const discountData = ["%", "₦"];
  const daysData = ["Hour(s)", "Day(s)", "Week(s)", "Month(s)", "Year(s)"];

  return (
    <>
      <div>
        <div className="rounded-2xl mt-10  bg-white py-8 px-3">
          <div className="mt-10">
            <div className="md:w-[40%] w-[100%]">
              <InputHeader text="Date" />
              <CustomDate />
            </div>

            {/* <div className="mt-10 w-[30%]">
              <InputHeader text="Date" />
              <div
                className="bg-[#F5F5F5] flex p-3 relative py-4 rounded-xl items-center justify-between"
                onClick={() => setOpenStart(!openStart)}
              >
                <span className="text-sm text-[#A5A5A5]">{calender}</span>
                <FaCalendarAlt color="#A5A5A5" />
              </div>

              {openStart && (
                <SingleAppCalender
                  setCalender={setCalender}
                  setOpenStart={setOpenStart}
                  openStart={openStart}
                />
              )}
            </div> */}

            <div className=" w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
              <h5 className="font-semibold font-montserrat">
                Customer Informationsss
              </h5>
              <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="First Name"
                    placeholder="Enter First name"
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

              <div className="flex flex-col md:flex-row w-full mt-2 gap-5">
                <div className=" mt-5 flex-1">
                  <AppInputWithPhone
                    hasPLaceHolder={true}
                    placeholder="Phone Number"
                    placeholderTop="Phone Number"
                  />
                </div>

                <div className="flex-1 md:mt-5 mt-0">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Enter Address"
                    placeholder="Enter customer address"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5 mt-5">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Vehicle Identification Number"
                    placeholder="Enter Vin"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Model Year"
                    placeholder="Enter model year"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Make"
                    placeholder="Enter vehicle make"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>

                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Model"
                    placeholder="Enter vehicle Model"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  mt-5  gap-5 md:w-[50%] w-[100%]">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Plate Number"
                    placeholder="Enter vehicle plate number"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>{" "}
                <div className="w-full">
                  <DropDownHalf
                    title="Mileage Value"
                    placeholder="Miles"
                    placeholderInput="N/A"
                    data={milesData}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  mt-5  gap-5 md:w-[75%] w-[100%]">
                <div className="w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Plate Number"
                    placeholder="Enter vehicle plate number"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                  <div
                    onClick={() => setOpenReminder(true)}
                    className="flex items-center mt-3 gap-4 font-montserrat cursor-pointer text-[#FAA21B]"
                  >
                    <span>View Reminder</span>
                    <FaCalendarAlt />
                  </div>
                </div>
                <div className="w-full">
                  <DropDownHalf
                    title="Mileage Value"
                    placeholder="Miles"
                    placeholderInput="N/A"
                  />
                  {/* <p className="flex items-center mt-3 gap-4 cursor-pointer font-montserrat text-[#FAA21B]">
                    View Vehicle History
                  </p> */}
                </div>

                <div className="w-full">
                  <AppDropDown
                    title="View Vehicle History"
                    data={["CarFax Report", "VHve Report"]}
                    placeholder="Select Vehicle History"
                  />
                </div>
              </div>
            </div>

            <div className=" w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
              <h5 className="font-semibold font-montserrat">Parts</h5>
              <div className="flex flex-col items-start md:items-center md:flex-row  mt-5  gap-5 w-[100%]">
                <div className="md:flex-1 w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Name"
                    placeholder="Enter part name"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
                <div className="md:flex-1 w-full">
                  <DropDownHalf
                    title="Warranty"
                    placeholder="Years"
                    placeholderInput="Warranty"
                    data={years}
                  />
                </div>
                <div className="md:flex-1 w-full">
                  <DropDownHalf
                    title="Quantity"
                    placeholder="Years"
                    placeholderInput="quantity"
                    data={quantityData}
                  />
                </div>

                <div className="md:flex-1 w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Price (₦)"
                    placeholder="Enter price"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>

                <div className="md:flex-1 w-full">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Amount (₦)"
                    placeholder="Enter Amount"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  />
                </div>
                <div className="mt-5 w-full flex justify-between items-center  md:hidden">
                  <InputHeader
                    text=" Add new part"
                    className="text-[#FAA21B]"
                  />
                  <DeleteBox />
                </div>
                <div className="mt-5  md:block hidden">
                  <DeleteBox />
                </div>
              </div>

              <div className="flex justify-between mt-5 md:mt-10">
                <InputHeader
                  text=" Add new part"
                  className="text-[#FAA21B] md:block hidden"
                />
                <span className="font-montserrat font-semibold">
                  Total Part (s): ₦0.00
                </span>
              </div>

              <hr className="mt-10" />

              <div className="flex justify-between items-start md:items-center flex-col md:flex-row w-[100% mt-10">
                <div className="flex items-center gap-3">
                  <div onClick={() => setCheck(!check)} className="flex-1">
                    {check ? (
                      <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                        <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                      </div>
                    ) : (
                      <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                    )}
                  </div>
                  <div className="font-montserrat font-medium text-xs">
                    Apply VAT
                  </div>
                </div>

                <div className="md:mt-0 mt-8 w-full md:w-[30%]">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="VAT 7.5% (₦)"
                    placeholder="Enter a value to apply VAT"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                  />
                </div>
              </div>
            </div>

            <div className="w-[100%] border-[1px] rounded-3xl  flex mt-8  px-3 md:px-5 flex-col py-5  border-[#CACACA]">
              <h5 className="font-semibold font-montserrat">Service Items</h5>

              <div className="flex flex-col md:flex-row w-[100%] items-end md:items-center gap-10 mt-5">
                <div className="md:w-[35%] w-[100%] -mb-5 md:mb-0">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Title"
                    placeholder="Enter Title"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                  />
                </div>
                <div className="md:w-[35%] w-[100%]">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Cost (₦)"
                    placeholder="Enter cost"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                  />
                </div>
                <div className="md:mt-5 -mt-5">
                  <DeleteBox />
                </div>
              </div>
              <div className="flex flex-col md:flex-row w-[100%] items-end md:items-center gap-10 mt-5">
                <div className="md:w-[35%] w-[100%] -mb-5 md:mb-0">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Title"
                    placeholder="Enter Title"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                  />
                </div>
                <div className="md:w-[35%] w-[100%]">
                  <AppInput
                    hasPLaceHolder={true}
                    placeholderTop="Cost (₦)"
                    placeholder="Enter cost"
                    className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                  />
                </div>

                <div className="md:mt-5 -mt-5">
                  <DeleteBox />
                </div>
              </div>

              <span className="font-montserrat inline-block mt-5 text-[#FAA21B]">
                Add new part
              </span>
              <hr className="mt-10 hidden md:block" />

              <div className="flex items-center gap-3 mt-5">
                <div onClick={() => setCheck(!check)}>
                  {check ? (
                    <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                      <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                    </div>
                  ) : (
                    <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                  )}
                </div>
                <span className="font-montserrat font-medium text-xs">
                  Apply VAT
                </span>
              </div>
            </div>

            <div className="w-[100%] md:border-[1px] rounded-3xl  flex mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
              <h5 className="font-semibold font-montserrat">Job Information</h5>

              <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                <div className=" mt-5 md:w-[40%] w-[100%] rounded-3xl md:py-0 py-5 border-[#CACACA] md:px-0 px-3 border-[1px] md:border-[0px] md:border-[#fff]">
                  <div className="md:mt-2 mt-0">
                    <CustomTextArea
                      topTitle="Notes/Remarks"
                      placeholder="Note"
                    />
                  </div>

                  <div className="mt-8">
                    <DropDownHalf
                      title="Job Duration"
                      placeholder="Day"
                      placeholderInput="Enter Duration"
                      data={daysData}
                    />
                  </div>

                  <div className="mt-8">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Deposit Amount"
                      placeholder="Enter deposit amount"
                      className="bg-[#F5F5F5] border-[#F5F5F5] h-14 "
                    />
                  </div>
                </div>

                <div className="side-divider md:block hidden" />

                <div className="mt-5 md:w-[40%] w-[100%] rounded-3xl md:py-0 py-5 border-[#CACACA] md:px-0 px-3 border-[1px] md:border-[0px] md:border-[#fff]">
                  <div className="md:mt-7 mt-0">
                    <DropDownHalf
                      title="Discount"
                      placeholder="Day(s)"
                      placeholderInput="Enter discount"
                      data={discountData}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between my-5">
                      <InputHeader text="Sub-Total" />
                      <InputHeader text="₦0.00" />
                    </div>
                    <div className="flex justify-between my-5">
                      <InputHeader text="VAT" />
                      <InputHeader text="₦0.00" />
                    </div>
                    <div className="flex justify-between my-5">
                      <InputHeader text="Discount" />
                      <InputHeader text="₦0.00" />
                    </div>
                    <div className="flex justify-between my-5">
                      <InputHeader text="Due Balance" />
                      <InputHeader text="₦0.00" />
                    </div>
                    <div className="flex justify-between my-5">
                      <InputHeader text="Refundable" />
                      <InputHeader text="₦0.00" />
                    </div>

                    <hr />
                    <div className="flex justify-between my-5">
                      <InputHeader text="Grand-Total" className="font-bold" />
                      <InputHeader text="₦0.00" className="font-bold" />
                    </div>

                    <div className="flex items-center gap-3 mt-10">
                      <div onClick={() => setCheck(!check)}>
                        {check ? (
                          <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                            <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                          </div>
                        ) : (
                          <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                        )}
                      </div>
                      <span className="font-montserrat font-medium text-xs">
                        customername@gmail.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end flex-col md:flex-row mt-10 gap-5">
              <AppBtn title="SEND" className="btn-secondary font-semibold" />
              <AppBtn title="SAVE" className="font-semibold" />
            </div>
          </div>
        </div>
      </div>
      <ReminderModal
        openReminder={openReminder}
        setOpenReminder={setOpenReminder}
      />
    </>
  );
};

export default GenerateEstimate;
