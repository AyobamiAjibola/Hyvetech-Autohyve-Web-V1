import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import itemModel from "../Forms/models/itemModel"
import useItemStock from "../../hooks/useItemStock";
import { customStyles } from "../../contsants/customStyles";
import InputHeader from "../InputHeader/InputHeader";
import Select from "react-select";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";

const { fields } = itemModel

const createItemSchema = Yup.object({
  name: Yup.string().nullable().label(fields.name.label),
  description: Yup.string().nullable().label(fields.description.label),
  unit: Yup.string().nullable().label(fields.unit.label),
  buyingPrice: Yup
  .number()
  .nullable()
  .label(fields.buyingPrice.label)
  .min(1, 'Buying price must be at least 1'),
  sellingPrice: Yup
  .number()
  .nullable()
  .label(fields.sellingPrice.label)
  .min(1, 'Selling price must be at least 1'),
  quantity: Yup.number().nullable().label(fields.quantity.label),
  type: Yup.string().nullable().label(fields.type.label),
  partNumber: Yup.string().nullable().label(fields.partNumber.label)
})

const EditInventory = ({
  openEditInventory,
  setOpenInventory,
  setEditMode,
  editMode, itemId, setItemId
}) => {
  const [successModal, setSuccessModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();
  const types = ["part", "service"];
  const itemUnits = ["pcs", "litre", "pair", "set", "gallon", "g", "cm", "pair", "kg", "hrs", "kit"];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { 
    initialValues, 
    handleCreateItem, 
    save, setSave, 
    setInitialValues,
    onEdit, handleUpdateItem
  } = useItemStock();
  const itemReducer = useAppSelector(state => state.itemStockReducer);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? "60%" : "95%",
    outline: "none",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "10px",
    py: 5,
  };

  const handleClose = () => setModal(false);

  useEffect(() => {
    if(itemReducer.createItemStatus === 'completed' || itemReducer.updateItemStatus === 'completed') {
      setInitialValues(initialValues)
      setOpenInventory(false)
    }
  },[itemReducer.createItemStatus, itemReducer.updateItemStatus]);

  useEffect(() => {
    if(itemId) {
      onEdit(itemId)
    }
  },[itemId]);

  return (
    <>
      <Modal
        open={openEditInventory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title={!editMode ? "Create New Inventory Items" : "Edit Inventory Items"} />

            <button onClick={() => {setEditMode(false), setOpenInventory(false), setItemId(-1)}}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, formikHelpers) => {
              if(editMode) {
                if(+values.sellingPrice < +values.buyingPrice)
                  return showMessage(
                    "Item",
                    `Selling price must be greater than Buying price`,
                    "error"
                  )
                handleUpdateItem(values, formikHelpers)
              };
              if(!editMode) {
                if(+values.sellingPrice < +values.buyingPrice)
                  return showMessage(
                    "Item",
                    `Selling price must be greater than Buying price`,
                    "error"
                  )
                handleCreateItem(values, formikHelpers)
              };
            }}
            validationSchema={createItemSchema}
          >
            {({ setFieldValue, values, handleChange, handleBlur }) => (
              <Form>
                <div>
                  <div className="mt-8 flex gap-8 flex-col justify-center">
                    <div className="flex flex-col md:flex-row  w-full gap-4">
                      <div className="w-full">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop={fields.name.label}
                          placeholder={fields.name.label}
                          name={fields.name.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                        />
                      </div>

                      <div className="w-full">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop={fields.sellingPrice.label}
                          placeholder={fields.sellingPrice.label}
                          name={fields.sellingPrice.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.sellingPrice}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row  w-full gap-4">
                      <div className="w-full">
                        <InputHeader text={fields.type.label} />
                        <Select
                          options={types.map(option => ({ value: option, label: option }))}
                          onChange={(item) => {
                            setFieldValue(fields.type.name, String(item?.value));
                          }}
                          styles={customStyles}
                          placeholder="Choose type"
                          name={fields.type.name}
                          onBlur={handleBlur}
                          value={{
                            value: values.type,
                            label: values.type,
                          }}
                        />
                      </div>

                      <div className={`w-full ${values.type === "service" ? 'hidden' : 'block'}`}>
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop={fields.buyingPrice.label}
                          placeholder={fields.buyingPrice.label}
                          name={fields.buyingPrice.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.buyingPrice}
                          // disabled={values.type === "service"}
                        />
                      </div>
                    </div>

                    <div className={`flex flex-col md:flex-row  w-full gap-4 ${values.type === "service" ? 'hidden' : 'block'}`}>
                      <div className="w-full">
                        <InputHeader text={fields.unit.label} />
                        <Select
                          options={itemUnits.map(option => ({ value: option, label: option }))}
                          onChange={(item) => {
                            setFieldValue(fields.unit.name, String(item?.value));
                          }}
                          styles={customStyles}
                          placeholder={fields.unit.label}
                          name={fields.unit.name}
                          onBlur={handleBlur}
                          value={{
                            value: values.unit,
                            label: values.unit,
                          }}
                        />
                      </div>

                      <div className="w-full">
                        <MyTextInput
                          hasPLaceHolder={true}
                          placeholderTop={fields.quantity.label}
                          placeholder={fields.quantity.label}
                          name={fields.quantity.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.quantity}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`w-full ${values.type === "service" ? 'hidden' : 'block'} mt-7`}>
                    <MyTextInput
                      hasPLaceHolder={true}
                      placeholderTop={fields.partNumber.label}
                      placeholder={fields.partNumber.label}
                      name={fields.partNumber.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.partNumber}
                    />
                  </div>

                  <div className="w-full mt-10">
                    <CustomTextArea
                      topTitle="Note/Remark"
                      placeholder="Note/Remark"
                      name={fields.description.name}
                      onChange={handleChange}
                      value={values.description}
                    />
                  </div>

                  {/* view */}
                  <div className=" flex gap-4 mt-8 justify-center md:justify-start items-center">
                    <AppBtn
                      title={!editMode ? "CREATE" : "SAVE"}
                      className="font-medium w-[90%] md:w-[300px]"
                      spinner={itemReducer.createItemStatus === 'loading' || itemReducer.updateItemStatus === 'loading' }
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default EditInventory;
