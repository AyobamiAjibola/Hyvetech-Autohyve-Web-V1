import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput from "../AppInput/AppInput";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { FaCalendarAlt } from "react-icons/fa";
import SingleAppCalender from "../AppCalender/SingleAppCalender";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CustomDate from "../CustomDate/CustomDate";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useItemStock from "../../hooks/useItemStock";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { getItemsAction } from "../../store/actions/itemStockAction";

const AddNewQuantityModal = ({ addNewQuantity, setAddNewQuantity, item, setOpenItem }) => {
  const handleClose = () => setAddNewQuantity(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { handleAddStock } = useItemStock();
  const dispatch = useAppDispatch()
  const [data, setData] = useState({
    id: -1,
    quantity: 0
  });
  const itemReducer = useAppSelector(state => state.itemStockReducer);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "50%" : "90%",
    // height: 520,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "20px" : "10px",
    py: 5,
  };

  useEffect(() => {
    setData({...data, id: item?.id})
  },[item]);

  useEffect(() => {
    if(itemReducer.addStockStatus === 'completed') {
      setAddNewQuantity(false)
      setOpenItem(false)
    }

    dispatch(getItemsAction())
  },[itemReducer.addStockStatus])

  return (
    <>
      <Modal
        open={addNewQuantity}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title=" Add New Quantity" />
            <button onClick={() => setAddNewQuantity(false)}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="mt-8 gap-8 flex-col justify-center">
            {/* <div className="mt-10 w-[100%] md:w-[50%] mb-5">
              <InputHeader text="Date" />
              <CustomDate />
            </div> */}
            <div className=" w-full">
              <div className="w-full">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Quantity"
                  placeholder="Quantity"
                  type="number"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                  onChange={(e) => {
                    setData({...data, quantity: +e.target.value})
                  }}
                />
              </div>

              {/* <div className="w-full mt-5">
                <AppInput
                  hasPLaceHolder={true}
                  placeholderTop="Cost"
                  placeholder="Labels"
                  className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                />
              </div> */}
            </div>
          </div>

          <div className="body">
            {/* view */}

            <AppBtn
              title="SAVE"
              className="font-medium w-[90%] md:w-[300px] mt-5"
              onClick={() => {handleAddStock(data)}}
              spinner={itemReducer.addStockStatus === 'loading'}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default AddNewQuantityModal;
