import TransactCard from "../../components/Dashboard/TransactCard";
import AppBtn from "../../components/AppBtn/AppBtn";

import React, { useCallback, useEffect, useState } from "react";
import AddNewBeneficiaryModal from "../../components/modals/AddNewBeneficiaryModal";
import { FaChevronLeft } from "react-icons/fa";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { getBeneficiariesAction } from "../../store/actions/autoHyveActions";

const SavedBeneficiaries = () => {
  const dispatch = useAppDispatch();

  const bankState = useAppSelector((state) => state.autoHyveReducer);
  const getBeneficiaries = useCallback(() => {
    dispatch(getBeneficiariesAction());
  }, []);

  useEffect(() => {
    getBeneficiaries();
  }, []);
  const [newBeneficiary, setnewBeneficiary] = useState(false);
  return (
    <>
      <div className="w-full">
        <div className="w-full flex h-10  md:hidden items-center mt-20 mb-5 cursor-pointer">
          <FaChevronLeft onClick={() => window.history.back()} />
          <span className="font-montserrat inline-block ml-5">Back</span>
        </div>
        <div>
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center md:mt-28 w-full">
            <div className="search w-[100%] md:w-2/4 ">
              <form action="">
                <div className="prepend">
                  {/* <img src={SearchIcon} alt="" /> */}
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 w-[100%] md:w-2/3 searchInput"
                    style={{ border: 0 }}
                  />
                </div>
              </form>
            </div>

            <AppBtn
              title="Add New Beneficiary"
              onClick={() => setnewBeneficiary(!newBeneficiary)}
              className="text-[#000] w-full md:0  md:w-[25%] bg-[#FAA21B]"
            />
          </div>
        </div>

        {/* <div className="grid grid-cols-2 md:grid-cols-5  w-[100%] gap-1  mt-14 "> */}
        <div className="flex justify-start gap-3 flex-wrap mt-14 ">
          {/* <div className="grid pb-20 grid-cols-2 md:grid-cols-3  w-[100%] md:w-[60%] gap-3 md:gap-16 mt-14 "> */}

          {bankState.beneficiaries?.map((item: any, i: any) => (
            <TransactCard
              key={i}
              name={item.accountName}
              accountnum={item.accountNumber}
              bankName={item.bankName}
            />
          ))}
        </div>
      </div>

      <AddNewBeneficiaryModal
        newBeneficiary={newBeneficiary}
        setnewBeneficiary={setnewBeneficiary}
      />
    </>
  );
};

export default SavedBeneficiaries;
