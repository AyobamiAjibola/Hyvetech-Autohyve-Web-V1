import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import AppDropDown from "../AppDropDown/AppDropDown";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CustomDate from "../CustomDate/CustomDate";
import DeleteBox from "../DeleteBox/DeleteBox";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { clearGetExpenseStatus } from "../../store/reducers/expenseReducer";
import { getExpenseCategories, getExpenseTypesActions, getSingleExpenseAction } from "../../store/actions/expenseAction";
import Select from "react-select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { customStyles } from "../../contsants/customStyles";
import { getBeneficiariesAction } from "../../store/actions/autoHyveActions";
import { getInvoicesAction } from "../../store/actions/invoiceActions";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

const ExpensesDetailsModal = ({
  expenseDetailmodal,
  setExpenseDetailmodal,
  setItem,
  item
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  const [expense, setExpense] = useState();
  const [edit, setEdit] = useState(false)
  const [formData, setFormData] = useState({
    note: "",
    invoiceCode: "",
    amount: "",
    category: "",
    reference: "",
    type: "",
    invoice: null,
    setDate: ""
  })

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 800 : "95%",
    height: 600,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const handleClose = () => {
    setItem(null)
    setExpenseDetailmodal(false)
  };

  useEffect(() => {
    if(store.getExpensesStatus === 'completed'){
      setExpense(store.expense);
    }
    dispatch(clearGetExpenseStatus())
  }, [dispatch, store.getExpensesStatus]);

  useEffect(() => {
    dispatch(getSingleExpenseAction(item?.id));
  }, [item]);

  useEffect(() => {
    setFormData({
      note: store?.expense?.note,
      invoiceCode: store?.expense?.invoiceCode,
      amount: store?.expense?.amount.toString(),
      category: store?.expense?.category,
      reference: store?.expense?.reference,
      type: store?.expense?.type,
      invoice: store?.expense?.invoice,
      date: store?.expense?.dateModified
    })
  },[store]);

  useEffect(() => {
    dispatch(getBeneficiariesAction());
    dispatch(getExpenseCategories());
    dispatch(getExpenseTypesActions());
    dispatch(getInvoicesAction());
    // dispatch(getPayStackBanksAction());
  }, [dispatch]);

  const getOptionLabel = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.name) {
      return option.name;
    }
    return '';
  };

  const getOptionLabelInv = (option) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.code) {
      return option.code.split('_')[0];
    }
    return '';
  };

  const isOptionEqualToValue = (option, value) => {
    return option === value || option.name === value
  }

  const isOptionEqualToValueInv = (option, value) => {
    return option === value || option.code === value
  }

  console.log(formData, 'data')
  return (
    <>
      <Modal
        open={expenseDetailmodal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between w-full">
            <ModalHeaderTitle title={`Summary ${item?.code}`}  />

            <button onClick={() => handleClose()}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col mt-5">
            <h3 className="text-lg text-[#494949] font-semibold font-montserrat">
              {item?.beneficiary.name}
            </h3>
            <span className="text-base font-montserrat">{item?.beneficiary.accountNumber}</span>
            <span className="text-base font-montserrat">{item?.beneficiary.bankName}</span>
          </div>

          <Formik
            enableReinitialize
            initialValues={formData}
            onSubmit={(values) => {
              console.log(values)
            }}
            validationSchema={
              Yup.object({
                note: Yup.string().required().label("Note"),
                invoiceCode: Yup.string().required().label("Invoice Code"),
                amount: Yup.number().label("Amount"),
                // category: Yup.string().required().label("Category"),
                // type: Yup.string().label("Expense type"),
                reference: Yup.string().label("Reference"),
                date: Yup.date().label(Date)
              })
            }
          >
            {({ setFieldValue, values, handleChange, handleBlur }) => (
              <Form>
                <>
                  <div className="mt-10 w-[100%] md:w-[47%]">
                    <InputHeader text="Date" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`}
                        disableFuture
                        minDate={new Date('2023/01/01')}
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={new Date(values.date)}
                        onChange={(date) => setFieldValue('date', date) }
                        sx={{
                          width: "100%",
              
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color
                          },
                          "& label": {
                            fontSize: "10px",
                            fontFamily: "montserrat",
                            color: "#A5A5A5",
                            paddingTop: "5px",
                            paddingLeft: "17px",
                          },
                          "& .MuiOutlinedInput-root": {
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent", // Remove border color on hover
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent", // Remove border color on focus
                            },
                            borderRadius: "20px",
                            backgroundColor: "#F5F5F5",
              
                            borderColor: "transparent",
                            height: "53px",
                            border: "none",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="flex md:flex-row flex-col items-start   md:items-center mt-5 gap-5">
                    <div className="md:flex-1 w-full">
                      <InputHeader text="Expense Category" />
                      <Autocomplete
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color
                            fontSize: "14px"
                          },
                          "& label": {
                            fontSize: "12px",
                            fontFamily: "montserrat",
                            color: "#A5A5A5",
                            paddingTop: '4px'
                          },
                          "& input": {
                            fontSize: "12px",
                            fontFamily: "montserrat",
                            marginRight: '-50px'
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color on focus
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color on hover
                          },
                        }}
                        renderInput={props => (
                          <TextField
                            className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                              placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                              font-montserrat`
                            }
                            {...props}
                            label=""
                            name="category.name"
                            InputProps={{
                              ...props.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {store.getExpensesStatus === 'loading' ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {props.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        // defaultValue={values.category?.name}
                        onChange={handleChange}
                        options={store.expenseCategories}
                        value={values.category?.name}
                      />
                    </div>

                    <div className="md:flex-1 w-full mt-5">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Amount"
                        placeholder="Amount"
                        name="amount"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.amount}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="flex items-center flex-col md:flex-row mt-5 gap-5">
                    <div className="md:flex-1 w-full">
                      <InputHeader text="Expense Type/Name" />
                      <Autocomplete
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={isOptionEqualToValue}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color
                            fontSize: "14px"
                          },
                          "& label": {
                            fontSize: "12px",
                            fontFamily: "montserrat",
                            color: "#A5A5A5",
                            paddingTop: '4px'
                          },
                          "& input": {
                            fontSize: "12px",
                            fontFamily: "montserrat",
                            marginRight: '-50px'
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color on focus
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color on hover
                          },
                        }}
                        renderInput={props => (
                          <TextField
                            className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                              placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                              font-montserrat`
                            }
                            {...props}
                            label=""
                            InputProps={{
                              ...props.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {store.getExpensesStatus === 'loading' ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {props.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        // defaultValue={edit ? category?.name : category}
                        onChange={handleChange}
                        options={store.expenseTypes}
                      />
                    </div>

                    <div className="md:flex-1 w-full mt-5">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Payment reference"
                        placeholder="Payment reference"
                        name="reference"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.reference}
                      />
                    </div>
                  </div>
                  <div className="flex items-center flex-col md:flex-row mt-5 gap-5">
                    <div className="md:flex-1 w-full">
                      <Autocomplete
                        getOptionLabel={getOptionLabelInv}
                        isOptionEqualToValue={isOptionEqualToValueInv}
                        fullWidth
                        disabled={values.category?.name === "Others" || values.category?.name === "Overhead"}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color
                            fontSize: "14px"
                          },
                          "& label": {
                            fontSize: "12px",
                            fontFamily: "montserrat",
                            color: "#A5A5A5",
                            paddingTop: '4px'
                          },
                          "& input": {
                            fontSize: "12px",
                            fontFamily: "montserrat",
                            marginRight: '-50px'
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color on focus
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent", // Remove border color on hover
                          },
                        }}
                        renderInput={props => (
                          <TextField
                            className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                              placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                              font-montserrat`
                            }
                            {...props}
                            label="Invoice"
                            disabled={values.category?.name === "Others" || values.category?.name === "Overhead"}
                            InputProps={{
                              ...props.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {store.getExpensesStatus === 'loading' ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {props.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                        // defaultValue={edit ? invoice?.code.split('_')[0] : invoice}
                        onChange={handleChange}
                        options={invoiceStore.invoices}
                        value={values.invoiceCode}
                      />
                    </div>

                    <div className="md:flex-1 w-full">
                      <CustomTextArea
                        topTitle="Notes/Remarks" 
                        placeholder="Note" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.note}
                        name="note"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col  mt-8 gap-5">
                    <AppBtn title="EDIT" className="btn-secondary" />
                    <AppBtn title="SAVE"/>
                  </div>
                </>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default ExpensesDetailsModal;
