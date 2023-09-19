import React, { useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import Card from "../../components/Dashboard/Card";
import { LuSettings2 } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import SingleAppCalender from "../../components/AppCalender/SingleAppCalender";
import { BsChevronDown } from "react-icons/bs";
import CustomBarChart from "../../components/BarChart/CustomBarChart";

const Dashboard = () => {
  const [openStart, setOpenStart] = useState(false);
  const [calender, setCalender] = useState("");
  return (
    <DashboardWrapper>
      <>
        <div className="flex items-center justify-between">
          <h5 className="font-semibold font-montserrat text-xl">Overview</h5>

          <div>
            <div
              className="border-[#CACACA] border-[1px] cursor-pointer gap-2 flex p-3 relative py-4 rounded-2xl items-center"
              onClick={() => setOpenStart(!openStart)}
            >
              <LuSettings2 />
              <span className="text-sm text-[#000]">
                {calender || "Filter"}
              </span>
              <BsChevronDown color="#A5A5A5" />
            </div>

            {openStart && (
              <div className="absolute right-[350px]">
                <SingleAppCalender
                  setCalender={setCalender}
                  setOpenStart={setOpenStart}
                  openStart={openStart}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 overflow-x-scroll mt-10">
            <Card
              name={"Total Sales"}
              price={"₦ 242, 525.00"}
              qty={""}
              color={"#FFF2DD"}
              showEye={false}
              showCredit={false}
            />
            <Card
              name={"Total Receipts"}
              price={"₦ 65,000.00"}
              qty={"2"}
              color={"#F1F3FF"}
              showEye={false}
              showCredit={false}
            />

            <Card
              name={"Total Expenses"}
              price={"₦ 70,000.00"}
              qty={"1"}
              color={"#FFEDED"}
              showEye={false}
              showCredit={false}
            />
            <Card
              name={"Estimates Sent"}
              price={"4"}
              qty={"1"}
              color={"#F3F3F3"}
              showEye={false}
              showCredit={false}
            />
            <Card
              name={"Invoices Generated"}
              price={"5"}
              qty={"1"}
              color={"#F3F3F3"}
              showEye={false}
              showCredit={false}
            />
            <Card
              name={"Total Receivable"}
              price={"₦ 177,525.00"}
              qty={"1"}
              color={"#F3F3F3"}
              showEye={false}
              showCredit={false}
            />
            <Card
              name={"Service(s) Due"}
              price={"2"}
              qty={"1"}
              color={"#FFF6D4"}
              showEye={false}
              showCredit={false}
            />
            <Card
              name={"Profit / Loss"}
              price={"₦ 0"}
              qty={"1"}
              color={"#F1F3FF"}
              showEye={false}
              showCredit={false}
            />
          </div>
        </div>

        <div>
          <h5 className="font-semibold font-montserrat text-xl">Analytics</h5>
          <div
            className="bg-[#F5F5F5] rounded-2xl px-10 mt-5"
            style={{ width: "100%" }}
          >
            <p className="font-montserrat font-medium pt-5">May 24th, 2023</p>
            <div className="h-[500px]">
              <CustomBarChart />
            </div>
          </div>
        </div>
      </>
    </DashboardWrapper>
  );
};

export default Dashboard;
