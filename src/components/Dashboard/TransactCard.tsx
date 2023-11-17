import React, { useEffect, useState } from "react";
import OptionIcon from "../../assets/svgs/option.svg";
import AddNewBeneficiaryModal from "../modals/AddNewBeneficiaryModal";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { deleteBeneficiaryAction } from "../../store/actions/expenseAction";
// import { showMessage } from "../../helpers/notification";
import { clearDeleteBeneficiaryStatus } from "../../store/reducers/expenseReducer";
import { getBeneficiariesAction } from "../../store/actions/autoHyveActions";

const TransactCard = ({ name, accountNumber, bankName, phone, beneficiaryId }: any) => {
  const [option, setOption] = useState(false);
  const [beneficiary, setBeneficiary] = useState(false);

  const dispatch = useAppDispatch();
  const expenseReducer = useAppSelector(state => state.expenseReducer);

  useEffect(() => {
    if(expenseReducer.deleteBeneficiaryStatus === 'completed') {
      setOption(false);
      // showMessage('', expenseReducer.deleteBeneficiarySuccess, 'success')
      dispatch(getBeneficiariesAction());
      dispatch(clearDeleteBeneficiaryStatus())
    } else if(expenseReducer.deleteBeneficiaryStatus === 'failed'){
      setOption(false);
      // showMessage('', expenseReducer.deleteBeneficiaryError, 'error')
      dispatch(clearDeleteBeneficiaryStatus())
    }
  },[expenseReducer.deleteBeneficiaryStatus]);

  return (
    <>
      <AddNewBeneficiaryModal
        newBeneficiary={beneficiary}
        setnewBeneficiary={setBeneficiary}
        title={"Edit Beneficiary"}
      />

      <div className="p-8 py-4 transact-card bg-gray-100">
        <div className="w-full flex justify-end">
          <div style={{ position: "relative" }}>
            <button className="px-4 py-3" onClick={() => setOption(!option)}>
              <img src={OptionIcon} alt="" style={{ width: 20 }} />
            </button>

            {option && (
              <ul className="option-dropdown">
                {/* <li>
                  <button
                    onClick={() => {
                      setOption(false);
                      setBeneficiary(!beneficiary);
                    }}
                  >
                    Edit
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => {
                      dispatch(deleteBeneficiaryAction(beneficiaryId))
                    }}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        <h5 className="font-bold mb-6 uppercase" style={{ width: "70%" }}>
          {/* David <br /> James */}
          {name}
        </h5>

        <p className="text-sm font-montserrat text-[11px]">{accountNumber}</p>
        <p className="text-sm font-montserrat text-[11px]">{bankName}</p>
        <p className="text-sm font-montserrat text-[11px]">{phone}</p>
      </div>
    </>
  );
};

export default TransactCard;
