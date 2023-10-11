import React, { useEffect, useState } from "react";
import SearchInput from "../SearchInput/SearchInput";
import DashboardWrapper from "../DashboardWrapper/DashboardWrapper";
import SingleVhicle from "./SingleVhicle";
import { useLocation, useNavigate } from "react-router-dom";
import { getCustomerVehiclesAction } from "../../store/actions/customerActions";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";

const AutoHyveVehicles = () => {
  const location = useLocation();
  const [customer, setCustomer] = useState();
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const customerReducer = useAppSelector(state => state.customerReducer);

  useEffect(() => {
    if (customer) {
      dispatch(getCustomerVehiclesAction(customer.id));
    }
  }, [customer, dispatch]);

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      setCustomer(state.item);
    }
  }, [location.state]);

  useEffect(() => {
    if (customerReducer.getCustomerVehiclesStatus === 'completed') {
      setVehicles(customerReducer.vehicles);
    }
  }, [customerReducer.getCustomerVehiclesStatus]);

  // Function to handle changes in the search input
  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    const cleanedInput = inputValue.replace(/[^a-zA-Z ]/g, '');

    setSearchQuery(cleanedInput);
    // setCurrentPage(1); // Reset to the first page when the search query changes
  };

  // Function to filter data based on the search query
  const filteredData = vehicles.filter((item) =>
    item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.modelYear.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardWrapper>
      <>
        <div className="w-[100%] md:w-[60%]">
          <SearchInput 
            handleSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <div className={`flex md:justify-start gap-3 flex-wrap justify-center`}>
        {filteredData.map((vehicle, index) => {
          return (
            <div key={index}>
            <SingleVhicle
              vehicleName={vehicle.make}
              make={vehicle.make}
              year={vehicle.modelYear}
              plateNumber={vehicle.plateNumber}
            />
            </div>
          )})}
          </div>
      </>
    </DashboardWrapper>
  );
};

export default AutoHyveVehicles;
