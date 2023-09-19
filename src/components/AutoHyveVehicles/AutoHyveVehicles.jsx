import React from "react";
import SearchInput from "../SearchInput/SearchInput";
import DashboardWrapper from "../DashboardWrapper/DashboardWrapper";
import SingleVhicle from "./SingleVhicle";

const AutoHyveVehicles = () => {
  return (
    <DashboardWrapper>
      <>
        <div className="w-[100%] md:w-[60%]">
          <SearchInput />
        </div>

        <SingleVhicle
          vehicleName="Masarati"
          make="Toyota"
          year="2020"
          plateNumber="EBC12YG4"
        />
      </>
    </DashboardWrapper>
  );
};

export default AutoHyveVehicles;
