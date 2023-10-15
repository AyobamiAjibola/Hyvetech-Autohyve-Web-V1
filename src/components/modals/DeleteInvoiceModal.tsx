import React, { useEffect } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import useAppSelector from "../../hooks/useAppSelector";
import useInvoice from "../../hooks/useInvoice";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getInvoicesAction } from "../../store/actions/invoiceActions";
import { showMessage } from "../../helpers/notification";
import { clearDeleteEstimateStatus } from "../../store/reducers/estimateReducer";

interface IProps {
  deletemodal: boolean;
  itemId: number,
  setItemId: any,
  setCustomerId?: any,
  closeDeleteModal?: any,
  title: string,
  setDeletemodal?: any
}

const DeleteInvoiceModal = ({
  deletemodal,
  itemId,
  setItemId,
  setCustomerId,
  closeDeleteModal,
  title, setDeletemodal
}: IProps ) => {
  const { handleDelete } = useInvoice();
  const invoiceReducer = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();

  const handleDeleteItem = () => {
    handleDelete(itemId)
  }

  useEffect(() => {
    if(invoiceReducer.deleteInvoiceStatus === 'completed') {
      setItemId(-1)
      setDeletemodal(false)
      dispatch(getInvoicesAction())
      showMessage(
        "Invoice",
        "Invoice deleted successfully",
        "success"
      )
    } else if(invoiceReducer.deleteInvoiceStatus === 'failed') {
      showMessage(
        "Invoice",
       invoiceReducer.deleteInvoiceError,
        "error"
      )
      setItemId(-1)
      setDeletemodal(false)
    }

    return () => {
      dispatch(clearDeleteEstimateStatus())
    }
  },[invoiceReducer.deleteInvoiceStatus]);

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
                <button onClick={(event) => {closeDeleteModal(event), setCustomerId(-1), setItemId(-1)}}>
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
                  onClick={(event) => {closeDeleteModal(event), setItemId(-1)}}
                  className="btn btn-secondary uppercase"
                >
                  Cancel
                </button>
                <button className="btn btn-primary uppercase bg-primary"
                  onClick={handleDeleteItem}
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

export default DeleteInvoiceModal;
