import React, { useEffect } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getpaymentRecievedAction } from "../../store/actions/transactionActions";
import { resetPaymentRecieveStatus } from "../../store/reducers/transactionReducer";
import { deleteSingleTransactionAction } from "../../store/actions/transactionActions";

interface IProps {
  deletemodal: boolean;
  item: any,
  setItem: any,
  closeDeleteModal?: any,
  title: string,
  setDeletemodal?: any
}

const DeletePaymentModal = ({
  deletemodal,
  item,
  setItem,
  closeDeleteModal,
  title, setDeletemodal
}: IProps ) => {
  const transactionReducer = useAppSelector(state => state.transactionReducer);
  const dispatch = useAppDispatch();

  const handleDeleteItem = () => {
    dispatch(deleteSingleTransactionAction({
      trans_id: item.id,
      amount: item.amount,
      invoice: item.invoice
    }))
  }

  useEffect(() => {
    if(transactionReducer.deletePaymentRecievedStatus === 'completed') {
      setItem(null)
      setDeletemodal(false)
      showMessage(
        "Payment",
        "Successfully deleted.",
        "success"
      ) 
      dispatch(getpaymentRecievedAction())
    } else if(transactionReducer.deletePaymentRecievedStatus === 'failed') {
      showMessage(
        "Payment",
        transactionReducer.deletePaymentRecievedError,
        "error"
      ) 
      setItem(null)
      setDeletemodal(false)
    }

    return () => {
      dispatch(resetPaymentRecieveStatus())
    }
  },[transactionReducer.deletePaymentRecievedStatus]);

  return (
    <>
      {deletemodal && (
        <div
          className="overlay h-screen w-screen flex fixed justify-center items-center"
          style={{ zIndex: 4000 }}
        >
          <div className=" rounded-md bg-white py-8 px-3">
            <div className="modal-header pt-0 bg-white px-8">
              <div className="flex justify-end w-full">
                <button onClick={(event) => {closeDeleteModal(event), setItem(null)}}>
                  <img src={CloseIcon} alt="" />
                </button>
              </div>

              <div className="flex flex-col justify-center mt-5">
                <h5 className="text-center font-semibold font-montserrat">
                  {title}
                </h5>
                <h5 className="text-center text-[10px] md:text-sm gray-color font-montserrat">
                  {/* {description} */}
                  Are you sure you want to carry out this action? <br /> If you
                  proceed, you will not be able to undo this action
                </h5>
                {/* </div> */}
              </div>
            </div>
            <div className="body">
              {/* view */}

              <div className=" flex gap-4 mt-4 justify-center items-center px-4 md:px-10">
                <button
                  onClick={(event) => {closeDeleteModal(event), setItem(null)}}
                  className="btn btn-secondary uppercase"
                >
                  Cancel
                </button>
                <button className="btn btn-primary uppercase bg-primary"
                  onClick={() => handleDeleteItem()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePaymentModal;
