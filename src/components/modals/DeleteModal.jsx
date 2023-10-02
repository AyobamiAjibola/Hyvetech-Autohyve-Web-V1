import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SuccessfulPaymentModal from "../Dashboard/SuccessfulPaymentModal";
import AppBtn from "../AppBtn/AppBtn";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { deleteUserAction, getUsersAction } from "../../store/actions/userActions";
import { showMessage } from "../../helpers/notification";
import { clearDeleteUserStatus } from "../../store/reducers/userReducer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  outline: "none",
  overflow: "auto",
  bgcolor: "background.paper",
  border: "transparent",
  borderRadius: 5,
  boxShadow: 24,
  py: 3,
  pr: 5,
  pl: 5,
};

const DeleteModal = ({
  deletemodal,
  closeDeleteModal,
  title, setDeletemodal,
  description,
  delId, setDelId
}) => {
  const [successModal, setSuccessModal] = useState(false);
  const closeSuccessModal = () => setSuccessModal(!successModal);
  const handleModalClose = () => setDeletemodal(false);
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector(state => state.userReducer);

  const handleDeleteUser = () => {
    dispatch(deleteUserAction(delId))
  }

useEffect(() => {
  if(userReducer.deleteUserStatus === 'completed'){
    showMessage(
      "Delete user",
      userReducer.deleteUserSuccess,
      "success"
    )
    dispatch(getUsersAction())
    dispatch(clearDeleteUserStatus())
    setDeletemodal(false)
    setDelId(-1)
  } else if (userReducer.deleteUserStatus === 'failed') {
    showMessage(
      "Delete user",
      userReducer.deleteUserError,
      "error"
    )
    dispatch(clearDeleteUserStatus())
    setDeletemodal(false)
    setDelId(-1)
  }
}, [userReducer.deleteUserStatus]);

  return (
    <>
      <Modal
        open={deletemodal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <SuccessfulPaymentModal
              successModal={successModal}
              closeSuccessModal={closeSuccessModal}
            />

            <div className="flex justify-end w-full">
              <button onClick={() => {setDelId(-1), setDeletemodal(false)}}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="flex flex-col justify-center">
              <h5 className="font-semibold flex text-center  justify-center mb-3 text-sm font-montserrat items-center">
                {title}
              </h5>
              <h5 className="text-center text-[10px] font-medium font-montserrat">
                {description}
              </h5>

              {/* </div> */}
            </div>

            <div className="body">
              {/* view */}

              <div className=" flex gap-4 mt-5 justify-center items-center px-4 md:px-10">
                <AppBtn
                  title="Cancel"
                  className=" btn-secondary uppercase"
                  onClick={() => closeDeleteModal()}
                />
                <AppBtn
                  title="Delete"
                  className=" uppercase"
                  spinner={userReducer.deleteUserStatus === 'loading'}
                  onClick={handleDeleteUser}
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteModal;
