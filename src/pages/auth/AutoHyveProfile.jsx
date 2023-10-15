import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import TabBtn from "../../components/TabBtn/TabBtn";
import HyveUserProfile from "../../components/HyveUserProfile/HyveUserProfile";
import AutoHyveVehicles from "../../components/AutoHyveVehicles/AutoHyveVehicles";
import ServiceReminder from "../../components/ServiceReminder/ServiceReminder";
import GenerateEstimateModal from "../../components/AutoHyveModals/GenerateEstimateModal";
import GenerateEstimate from "./GenerateEstimate";
import { useNavigate, useParams } from "react-router-dom";
import { getReminderAction } from "../../store/actions/serviceReminderActions";
import useAppDispatch from "../../hooks/useAppDispatch";

const AutoHyveProfile = () => {
  const data = ["Profile", "Vehicles", "Service Reminder"];
  const [view, setView] = useState(0);
  const [showEstimate, setShowEstimate] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(view === 2) {
      dispatch(getReminderAction())
    }
  },[view]);

  const params = useParams();

  return (
    <DashboardWrapper>
      <>
        <div className="flex  flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-3">
            {data.map((item, index) => {
              return (
                <TabBtn
                  title={item}
                  onClick={() => setView(index)}
                  key={index}
                  className={
                    view === index
                      ? "btn-primary md:w-[210px] w-full"
                      : "btn-secondary md:w-[210px] w-full"
                  }
                />
              );
            })}
          </div>

          {view === 0 && (
            <TabBtn
              title="Generate Estimate"
              className="btn-secondary md:w-[200px] w-full md:mt-0 mt-3"
              onClick={() => {
                sessionStorage.setItem("customerId", params.id ), 
                navigate("/generate-estimate")}}
            />
          )}
        </div>
        <div>
          {view === 0 && <HyveUserProfile />}
          {view === 1 && <AutoHyveVehicles />}
          {view === 2 && <ServiceReminder />}
          {view === 3 && <GenerateEstimate />}
        </div>

        <GenerateEstimateModal
          showEstimate={showEstimate}
          setShowEstimate={setShowEstimate}
        />
      </>
    </DashboardWrapper>
  );
};

export default AutoHyveProfile;
