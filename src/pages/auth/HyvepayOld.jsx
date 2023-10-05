import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Dashboard/Card";
import SearchIcon from "../../assets/svgs/vuesax/linear/search-normal.svg";
import DownloadIcon from "../../assets/svgs/download-icon.svg";
import DocumentIcon from "../../assets/svgs/document.svg";
import AppBtn from "../../components/AppBtn/AppBtn";
import ActivateAccountModal from "../../components/modals/ActivateAccountModal";
import CustomDatePickerModal from "../../components/modals/CustomDatePickerModal";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import AppCalender from "../../components/AppCalender/AppCalender";
import { format, addDays } from "date-fns";
import HyvePayHomeCard from "../../components/HyvePayHomeCard/HyvePayHomeCard";
import InputHeader from "../../components/InputHeader/InputHeader";

const Hyvepay = () => {
  const [accountDetails, showAccountDetails] = useState(false);
  const [activate, setActivate] = useState(false);
  const [headerText, setHeaderText] = useState(0);
  const [openDate, setOpenDate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calender, setCalender] = useState("");
  const [calenderEnd, setCalenderEnd] = useState("");
  const [openStart, setOpenStart] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [openEnd, setOpenEnd] = useState(false);
  const refOne = useRef(null);
  const navigation = useNavigate();

  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(!modal);
  const activation = () => {
    setActivate(!activate);
    setModal(!modal);
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenStart(false);
      showAccountDetails(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal]);

  useEffect(() => {
    if (openDate) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openDate]);

  return (
    <>
      <div className="mb-20 mt-10 md:mt-32 w-full">
        <div className="flex justify-between items-center  flex-col md:flex-row">
          <h5 className="font-semibold font-montserrat text-xl md:mb-0 mb-10 flex-1">
            Account Information
          </h5>

          <div className="flex gap-4  item-wrapper flex-col md:flex-row bg">
            <AppTabBtn
              title="Activate Account"
              className="bg-[#FAA21B] text-[#000] "
              onClick={() => setModal(!modal)}
            />
            <AppTabBtn
              title=" Initiate Transaction"
              className="  text-[#000] btn-secondary"
              onClick={() => navigation("/hyvepay/initiate-transaction")}
            />
            <div className="">
              <AppTabBtn
                title="View Account Details"
                className="  text-[#000] btn-secondary"
                onClick={() => showAccountDetails(!accountDetails)}
              />

              {accountDetails && (
                <div
                  className="account-dropdown z-50 w-full flex w flex-col justify-center items-center px-8 mt-4 p-6"
                  ref={refOne}
                >
                  <div className="w-full">
                    <h5 className="font-bold text-left ">Account Details</h5>
                  </div>

                  <div className="flex justify-between w-full mt-6">
                    <div>
                      <p>
                        <span className="text-sm mr-2 mb-0 font-montserrat">
                          Account Number
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-sm mr-2 font-montserrat">
                          $9,700
                        </span>
                      </p>
                    </div>
                    <img src={DocumentIcon} alt="" className="cursor-pointer" />
                  </div>

                  <div className="flex justify-between w-full mt-6">
                    <div>
                      <p>
                        <span className="text-sm mr-2 mb-0 font-montserrat">
                          Account Name
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-sm mr-2 font-montserrat">
                          David James
                        </span>
                      </p>
                    </div>
                    <img src={DocumentIcon} alt="" className="cursor-pointer" />
                  </div>

                  <div className="flex justify-between w-full mt-6">
                    <div>
                      <p>
                        <span className="text-sm mr-2 mb-0 font-montserrat">
                          Bank Name
                        </span>
                      </p>
                      <p>
                        <span className="font-bold text-sm mr-2 font-montserrat">
                          Fidelity Bank
                        </span>
                      </p>
                    </div>
                    <img src={DocumentIcon} alt="" className="cursor-pointer" />
                  </div>

                  <AppBtn
                    onClick={() => navigation("/hyvepay/saved-beneficiaries")}
                    title=" View saved beneficiaries"
                    className="btn-secondary mt-4 "
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 overflow-x-scroll mt-10">
          <HyvePayHomeCard
            name={"Available Balance"}
            price={"0.00"}
            qty={""}
            color={"#FFF2DD"}
          />
          <HyvePayHomeCard
            name={"Total Credit"}
            price={"0.00"}
            qty={"2"}
            color={"#F1F3FF"}
          />
          <HyvePayHomeCard
            name={"Total Debit"}
            price={"0.00"}
            qty={"1"}
            color={"#FFEDED"}
          />
        </div>

        <h5 className="heading-five font-montserrat">Transaction History</h5>

        <div className="flex justify-between  mt-8 flex-wrap items-center">
          <div className="search w-full md:w-2/4 mb-3">
            <form action="">
              <div className="prepend">
                <img src={SearchIcon} alt="" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 w-full md:w-2/3 searchInput"
                  style={{ border: 0 }}
                />
              </div>
            </form>
          </div>

          <div
            className="flex items-center mt-5 md:mt-0 mb-5 gap-4"
            ref={refOne}
          >
            <div className="relative flex flex-col">
              <InputHeader text="Start Date" />
              <button
                className="btn btn-secondary font-montserrat"
                onClick={() => setOpenStart(!openStart)}
              >
                {format(range[0].startDate, "MM/dd/yyyy")}
              </button>
              {openStart && (
                <AppCalender
                  setOpenStart={setOpenStart}
                  openStart={openStart}
                  range={range}
                  setRange={setRange}
                />
              )}
            </div>
            <span className="mt-5">-</span>

            <div className="relative flex flex-col">
              <InputHeader text="End Date" />
              <button
                className="btn btn-secondary font-montserrat"
                onClick={() => setOpenStart(!openStart)}
              >
                {format(range[0].endDate, "MM/dd/yyyy")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4" style={{ overflowX: "scroll" }}>
          <table border={1} style={{ borderRadius: 20, overflow: "clip" }}>
            <thead>
              <th className="font-montserrat    text-xs">Date</th>
              <th className="font-montserrat    text-xs ">Account Name</th>
              <th className="font-montserrat      text-xs ">Account Number</th>
              <th className="font-montserrat     text-xs ">Amount</th>
              <th className="font-montserrat    text-xs ">Balance</th>
              <th className="font-montserrat   text-xs ">Narration</th>
              <th className="font-montserrat  text-xs ">Type</th>
              <th className="font-montserrat text-xs ">Status</th>
            </thead>
            <tbody>
              <tr>
                <td className="font-montserrat text-xs">07-06-2023</td>
                <td className="font-montserrat text-xs">David James</td>
                <td className="font-montserrat text-xs">7593542382</td>
                <td className="font-montserrat text-xs">₦50,000</td>
                <td className="font-montserrat text-xs">₦900,000</td>
                <td className="font-montserrat text-xs">N/A</td>
                <td className="font-montserrat text-xs">Transfer</td>
                <td>
                  <span
                    className="py-2 px-4"
                    style={{ backgroundColor: "#FF8282", borderRadius: 10 }}
                  >
                    Failed
                  </span>
                </td>
              </tr>

              <tr>
                <td className="font-montserrat text-xs">06-06-2023</td>
                <td className="font-montserrat text-xs">Ayo Testa</td>
                <td className="font-montserrat text-xs">0024784244</td>
                <td className="font-montserrat text-xs">₦457,900</td>
                <td className="font-montserrat text-xs">₦1,342,100</td>
                <td className="font-montserrat text-xs">N/A</td>
                <td className="font-montserrat text-xs">Transfer</td>
                <td>
                  <span
                    className="py-2 px-4 bg-primary"
                    style={{ borderRadius: 10 }}
                  >
                    Successful
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button className="gap-1 btn btn-secondary flex items-center">
              <img src={DownloadIcon} className="mr-3 font-montserrat" alt="" />
              <span className="text-sm font-montserrat font-medium">
                Download Statement
              </span>
            </button>
          </div>
        </div>
      </div>

      <ActivateAccountModal
        modal={modal}
        setModal={setModal}
        closeModal={closeModal}
        activation={activation}
      />

      <CustomDatePickerModal openDate={openDate} setOpenDate={setOpenDate} />
    </>
  );
};

export default Hyvepay;
