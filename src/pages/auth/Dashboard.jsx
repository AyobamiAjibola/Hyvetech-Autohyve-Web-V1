import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import Card from "../../components/Dashboard/Card";
import { LuSettings2 } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import SingleAppCalender from "../../components/AppCalender/SingleAppCalender";
import { BsChevronDown } from "react-icons/bs";
import CustomBarChart from "../../components/BarChart/CustomBarChart";
import useAppSelector from "../../hooks/useAppSelector";
import { clearLoginStatus } from "../../store/reducers/authenticationReducer";
import useAppDispatch from "../../hooks/useAppDispatch";
import { Box, Skeleton } from "@mui/material";
import useAdmin from "../../hooks/useAdmin";
import { getTechAnalyticsAction } from "../../store/actions/dashboardActions";
import { DatePicker } from 'antd';
import DateRangeAppCalender from "../../components/AppCalender/DateRangeAppCalender";
import { Util } from "../../helpers/Util";
import { clearGetTechAnalyticsStatus } from "../../store/reducers/dashboardReducer";
import moment from "moment";
import { MONTHS } from '../../config/constants';
import YearPicker from "../../components/YearPicker/YearPicker";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [openStart, setOpenStart] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [calenderStart, setCalenderStart] = useState("");
  const [calenderEnd, setCalenderEnd] = useState("");
  const dispatch = useAppDispatch();
  const authReducer = useAppSelector(state => state.authenticationReducer);
  const {user} = useAdmin();
  const techDashboardReducer = useAppSelector(state => state.dashboardReducer.techAnalytics);
  const techDashboardReducerMain = useAppSelector(state => state.dashboardReducer);
  const [start_date, setStart_date] = useState(null);
  const [end_date, setEnd_date] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(()=>{
    if( techDashboardReducerMain.getTechAnalyticsStatus === 'idle' || start_date || end_date || selectedYear) {
      dispatch(getTechAnalyticsAction({
        start_date: start_date?.toISOString(),
        end_date: end_date?.toISOString(),
        year: selectedYear
      }))
    }
  }, [start_date, end_date, selectedYear, techDashboardReducerMain.getTechAnalyticsStatus]);

  useEffect(() => {
    if(techDashboardReducerMain.getTechAnalyticsStatus === 'completed') {
      setOpenStart(false);
      setStart_date(null);
      setEnd_date(null);
      setSelectedYear(null);
    }
  },[techDashboardReducerMain.getTechAnalyticsStatus])

  useEffect(() => {
    dispatch(clearLoginStatus());
  },[]);

  const cardContent = [
    {
      name: "Total Sales",
      price: Util.formAmount(techDashboardReducer?.mRevenue, false) || 0,
      qty: "",
      color: "#FFF2DD"
    },
    {
      name: "Total Receipts",
      price: Util.formAmount(techDashboardReducer?.mReceipt, false) || 0,
      qty: "",
      color: "#F1F3FF"
    },
    {
      name: "Total Expense",
      price: Util.formAmount(techDashboardReducer?.mExpenses, false) || 0,
      qty: "",
      color: "#FFEDED"
    },
    {
      name: "Estimate Sent",
      price: techDashboardReducer?.mEstimate || 0,
      qty: "",
      color: "#F3F3F3"
    },
    {
      name: "Invoices Generated",
      price: techDashboardReducer?.mInvoice || 0,
      qty: "",
      color: "#F3F3F3"
    },
    {
      name: "Total Receivables",
      price: Util.formAmount(techDashboardReducer?.mReceivable, false) || 0,
      qty: "",
      color: "#F3F3F3"
    },
    {
      name: "Service(s) Due",
      price: techDashboardReducer?.mReminder || 0,
      qty: "",
      color: "#FFF6D4"
    },
    {
      name: "Profit / Loss",
      price: Util.formAmount(techDashboardReducer?.mRevenue, false) || 0,
      qty: "",
      color: "#F1F3FF"
    }
  ]
  
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
                {`${calenderStart || "Filter"} - ${calenderEnd}`}
              </span>
              <BsChevronDown color="#A5A5A5" />
            </div>

            {openStart && (
              <div className="absolute right-[60px]">
                <DateRangeAppCalender
                  setCalenderStart={setCalenderStart}
                  setCalenderEnd={setCalenderEnd}
                  setOpenStart={setOpenStart}
                  openStart={openStart}
                  startDate={start_date}
                  endDate={end_date}
                  setStartDate={setStart_date}
                  setEndDate={setEnd_date}
                />
              </div>
            )}
            
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 overflow-x-scroll mt-10">
            {cardContent.map((card, index) => 
              <div key={index}>
                {techDashboardReducerMain.getTechAnalyticsStatus === 'loading' || 
                 techDashboardReducerMain.getTechAnalyticsStatus === 'idle' && 
                  <Box
                    style={{
                      backgroundColor: '#F4F4F4',
                      height: "140px",
                      borderRadius: 34,
                      color: "#494949",
                      display: "flex",
                      flexDirection: 'column',
                      justifyContent: 'center',
                      paddingLeft: 30
                    }}
                  >
                    <Skeleton width={'40%'}/>
                    <Skeleton width={'80%'}/>
                    <Skeleton width={'80%'}/>
                  </Box>
                }
                {techDashboardReducerMain.getTechAnalyticsStatus === 'completed' && <Card
                  name={card.name}
                  price={card.price}
                  qty={card.qty}
                  color={card.color}
                  showEye={false}
                  showCredit={false}
                />}
              </div>
            )}
          </div>
        </div>

        <div>
          <h5 className="font-semibold font-montserrat text-xl">Analytics</h5>
          <div
            className="bg-[#F5F5F5] rounded-2xl px-10 mt-5"
            style={{ width: "100%" }}
          >
            <div>
              <p className="font-montserrat font-medium pt-5"></p>
              <YearPicker
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            </div>
            
            <div className="h-[500px]">
              {techDashboardReducerMain.getTechAnalyticsStatus === 'loading' || 
                techDashboardReducerMain.getTechAnalyticsStatus === 'idle' && <Skeleton width={'100%'} height={'100%'} />}
              <CustomBarChart
                categories={MONTHS}
                series={techDashboardReducer?.seriesNew || []}
              />
            </div>
          </div>
        </div>
      </>
    </DashboardWrapper>
  );
};

export default Dashboard;
