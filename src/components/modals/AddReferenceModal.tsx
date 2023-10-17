import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import { updateExpenseAction } from "../../store/actions/expenseAction";
import useAppDispatch from "../../hooks/useAppDispatch";
import AppInput from "../AppInput/AppInput";
import { Box, Modal, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import useAppSelector from "../../hooks/useAppSelector";
import { getSingleExpenseAction } from "../../store/actions/expenseAction";
import { showMessage } from "../../helpers/notification";
import { clearUpdateExpenseStatus } from "../../store/reducers/expenseReducer";
import { getExpensesAction } from "../../store/actions/expenseAction";
import AppBtn from "../AppBtn/AppBtn";

interface IProps {
  referenceForm: boolean;
  itemId: number,
  title: string,
  setReferenceForm?: any
}

const AddReferenceModal = ({
  setReferenceForm,
  itemId,
  referenceForm,
  title
}: IProps ) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [reference, setReference] = useState<string>('');
  const dispatch = useAppDispatch()
  const expenseReducer = useAppSelector(state => state.expenseReducer);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 500 : "95%",
    height: 350,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleAddReference = () => {
    dispatch(updateExpenseAction({ reference: reference, id: itemId }));
  };

  const handleClose = () => setReferenceForm(false)

  useEffect(() => {
    if(expenseReducer.updateExpenseStatus === 'completed') {
      dispatch(getSingleExpenseAction(itemId));
      dispatch(getExpensesAction());
      setReferenceForm(false)
    } else if(expenseReducer.updateExpenseStatus === 'failed') {
      showMessage(
        'Expense',
        expenseReducer.updateExpenseError,
        "error"
      )
    }

    return () => {
      dispatch(clearUpdateExpenseStatus())
    }
  },[expenseReducer.updateExpenseStatus]);

  return (
    <>
      <Modal
        open={referenceForm}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-end w-full">

            <button onClick={() => handleClose()}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <ModalHeaderTitle title={title}  />

          <h5 className="text-center text-[10px] mb-2 mt-3 md:text-sm gray-color font-montserrat">
            Please enter the correct reference number.
          </h5>

          <AppInput
            value={reference}
            hasPLaceHolder={true}
            name='reference'
            placeholderTop=""
            placeholder="Payment Reference"
            className="bg-[#F5F5F5] border-[#F5F5F5] h-14 mb-5"
            onChange={(e: any) => setReference(e.target.value)}
          />

          <div className=" flex gap-4 mt-4 justify-center items-center px-4 md:px-10">
            <button
              onClick={() => {setReferenceForm(false)}}
              className="btn btn-secondary uppercase"
            >
              Cancel
            </button>
            <AppBtn title="SAVE"
              onClick={handleAddReference}
              spinner={expenseReducer.updateExpenseStatus === 'loading'}
            />
          </div>

        </Box>
      </Modal>
    </>
  );
};

export default AddReferenceModal;
