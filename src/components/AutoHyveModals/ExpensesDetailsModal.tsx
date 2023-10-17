import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import AppInput, { MyTextInput } from "../AppInput/AppInput";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import { Form, Formik } from "formik";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import { clearGetExpenseStatus } from "../../store/reducers/expenseReducer";
import { 
  getExpenseCategories, 
  getExpenseTypesActions, 
  getSingleExpenseAction, 
  updateExpenseDetailAction 
} from "../../store/actions/expenseAction";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getBeneficiariesAction } from "../../store/actions/autoHyveActions";
import { getInvoicesAction } from "../../store/actions/invoiceActions";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { IExpense, IExpenseCategory, IExpenseType, IInvoice } from "@app-models";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../helpers/notification";
import { formatDate } from "../../utils/generic";
import { Add } from "@mui/icons-material";
import AddReferenceModal from "../modals/AddReferenceModal";
import { getPayStackBanksAction } from "../../store/actions/miscellaneousActions";

const ExpensesDetailsModal = ({
  expenseDetailmodal,
  setExpenseDetailmodal,
  setItemId,
  itemId
}: any) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  const [expense, setExpense] = useState<IExpense | null>();
  const [edit, setEdit] = useState<boolean>(false)
  const [date, setDate] = useState<any | null>(new Date())
  const [dateModified, setDateModified] = useState(new Date(date));
  const [reference, setReference] = useState<string | undefined>('');
  const [note, setNote] = useState<string | undefined>('');
  const [amount, setAmount] = useState<string | undefined>('');
  const [invoiceCode, setInvoiceCode] = useState<string | undefined>('');
  const [category, setCategory] = useState<IExpenseCategory | null>();
  const [type, setType] = useState<IExpenseType | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>();
  const navigate = useNavigate();
  const [referenceForm, setReferenceForm] = useState<boolean>(false);

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

  useEffect(() => {
    if (store.updateExpenseDetailStatus === 'completed') {
      setType(null);
      setInvoice(null);
      setCategory(null);
      setNote('');
      setAmount('');
      navigate('/expenses');
      setEdit(false)
      setItemId(-1)
      setExpenseDetailmodal(false)
    } else if (store.updateExpenseDetailStatus === 'failed') {
      showMessage('Expenses', store.updateExpenseDetailError, 'error');
    }
  }, [store.updateExpenseDetailStatus]);

  const handleClose = () => {
    setItemId(-1)
    setEdit(false)
    setExpenseDetailmodal(false)
  };

  useEffect(() => {
    if(store.getExpensesStatus === 'completed'){
      setExpense(store.expense);
    }
    dispatch(clearGetExpenseStatus())
  }, [dispatch, store.getExpensesStatus]);

  useEffect(() => {
    dispatch(getSingleExpenseAction(itemId));
  }, [itemId]);

  useEffect(() => {
    setNote(expense?.note);
    setInvoiceCode(expense?.invoiceCode);
    setAmount(expense?.amount?.toString());
    setCategory(expense?.category);
    setReference(expense?.reference);
    setType(expense?.type)
    setInvoice(expense?.invoice)
    setDate(expense?.dateModified)
  },[expense, store])

  useEffect(() => {
    dispatch(getBeneficiariesAction());
    dispatch(getExpenseCategories());
    dispatch(getExpenseTypesActions());
    dispatch(getInvoicesAction());
    dispatch(getPayStackBanksAction());
  }, [dispatch]);

  useEffect(() => {
    setDateModified(new Date(date))
  }, [date])
  console.log(itemId, edit, 'id')
  const handleDate = (newValue: any) => {
    setDateModified(newValue)
  }

  const handleFormSubmit = () => {
    if (!amount) return showMessage('Expense', 'Please provide amount', 'error');

    if (isNaN(+amount)) return showMessage('Expense', 'Amount is invalid', 'error');

    if (!category) return showMessage('Expense', 'Please select category', 'error');
    if (type === null) return showMessage('Expense', 'Please select type', 'error');

    dispatch(
      updateExpenseDetailAction({
        category,
        id: itemId,
        note,
        type,
        invoice,
        dateModified,
        amount: amount === undefined ? null : +amount
      }),
    );
  };

  const getOptionLabel = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.name) {
      return option.name;
    }
    return '';
  };

  const getOptionLabelInv = (option: any) => {
    if (typeof option === 'string') {
      return option;
    }
    if (option && option.code) {
      return option.code.split('_')[0];
    }
    return '';
  };

  const isOptionEqualToValue = (option: any, value: any) => {
    return option === value || option.name === value
  }

  const isOptionEqualToValueInv = (option: any, value: any) => {
    return option === value || option.code === value
  }

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
            <ModalHeaderTitle title={`Summary ${expense?.code}`}  />

            <button onClick={() => handleClose()}>
              <img src={CloseIcon} alt="" />
            </button>
          </div>

          <div className="flex flex-col mt-5">
            <h3 className="text-lg text-[#494949] font-semibold font-montserrat">
              {expense?.beneficiary?.name}
            </h3>
            <span className="text-base font-montserrat">{expense?.beneficiary?.accountNumber}</span>
            <span className="text-base font-montserrat">{expense?.beneficiary?.bankName}</span>
          </div>

          <Formik
            initialValues={{}}
            onSubmit={() => {
              handleFormSubmit();
            }}
          >
            {() => (
              <Form>
                <>
                  <div className="mt-10 w-[100%] md:w-[47%]">
                    <InputHeader text="Date" />
                    {!edit &&
                      <AppInput
                        value={formatDate(date)}
                        hasPLaceHolder={true}
                        placeholderTop="Date Created"
                        placeholder="Date Created"
                        className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                        disabled={!edit}
                      />
                    }
                   {edit && <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`}
                        disableFuture
                        minDate={new Date('2000/01/01')}
                        openTo="year"
                        views={['year', 'month', 'day']}
                        value={dateModified}
                        onChange={ handleDate }
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
                        //@ts-ignore
                        renderInput={(params: any) =>
                          <TextField
                            {...params}
                            fullWidth
                            label="Date Created"
                            variant="outlined"
                            className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                              placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                              font-montserrat`
                            }
                          />
                        }
                      />
                    </LocalizationProvider>}
                  </div>
                  <div className="flex md:flex-row flex-col items-start   md:items-center mt-5 gap-5">
                    <div className="md:flex-1 w-full">
                      <InputHeader text="Expense Category" />
                      {edit && <Autocomplete
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
                        defaultValue={edit ? category?.name : category}
                        onChange={(_: any, newValue: any) => {
                          setCategory(newValue);
                        }}
                        options={store.expenseCategories}
                      />
                    }
                    {!edit && 
                      <AppInput
                        value={expense?.category?.name}
                        hasPLaceHolder={true}
                        placeholderTop="Expense category"
                        placeholder="Expense category"
                        className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                        disabled={!edit}
                      />
                    }
                    </div>

                    <div className="md:flex-1 w-full mt-5">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Amount"
                        placeholder="Amount"
                        name="amount"
                        onChange={(e: any) => setAmount(e.target.value)}
                        value={amount}
                        type="number"
                        disabled={!edit}
                      />
                    </div>
                  </div>

                  <div className="flex items-center flex-col md:flex-row mt-5 gap-5">
                    <div className="md:flex-1 w-full">
                      <InputHeader text="Expense Type/Name" />
                      {!edit && 
                        <AppInput
                          value={expense?.type?.name}
                          hasPLaceHolder={true}
                          placeholderTop="Expense Type/Name"
                          placeholder="Expense Type/Name"
                          className="bg-[#F5F5F5] border-[#F5F5F5] h-14"
                          disabled={!edit}
                          />
                      }
                      {edit && <Autocomplete
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
                        defaultValue={edit ? type?.name : type}
                        onChange={(_: any, newValue: any) => {
                          setType(newValue);
                        }}
                        options={store.expenseTypes}
                      />
                    }
                    </div>

                    <div className="md:flex-1 w-full mt-5">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Payment reference"
                        placeholder="Payment reference"
                        name="reference"
                        onChange={(e: any) => setReference(e.target.value)}
                        value={reference}
                        disabled={!edit}
                        className="mb-[-20px]"
                      />
                      {expense?.status === 'UNPAID' && <span
                        className="text-[10px] mt-3 ml-3 font-bold font-montserrat text-[#FAA21B] cursor-pointer"
                        onClick={() => setReferenceForm(true)}
                      >
                        <Add sx={{fontSize: '16px'}}/> Add reference
                      </span>}
                      {/* {expense?.status === 'PAID' && <span
                        className="text-[10px] mt-3 ml-3 font-bold font-montserrat text-[#FAA21B] cursor-pointer"
                        onClick={() => setReferenceForm(true)}
                      >
                        <Edit sx={{fontSize: '12px'}}/> Change reference
                      </span>} */}
                    </div>
                  </div>
                  <div className="flex items-center flex-col md:flex-row mt-5 gap-5">
                    <div className="md:flex-1 w-full">
                      {!edit && <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Payment reference"
                        placeholder="Payment reference"
                        name="invoice"
                        value={invoiceCode ? invoiceCode : ''}
                        onChange={(e: any) => setInvoiceCode(e.target.value)}
                        disabled={!edit}
                      />}
                      {edit && <Autocomplete
                        getOptionLabel={getOptionLabelInv}
                        isOptionEqualToValue={isOptionEqualToValueInv}
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
                        disabled={category?.name === "Others" || category?.name === "Overhead"}
                        renderInput={props => (
                          <TextField
                            className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                              placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                              font-montserrat`
                            }
                            {...props}
                            label="Invoice"
                            disabled={category?.name === "Others" || category?.name === "Overhead"}
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
                        defaultValue={edit ? invoice?.code.split('_')[0] : invoice}
                        onChange={(_: any, newValue: any) => {
                          setInvoice(newValue);
                        }}
                        options={invoiceStore.invoices}
                      />
                      }
                    </div>

                    <div className="md:flex-1 w-full">
                      <CustomTextArea
                        topTitle="Notes/Remarks" 
                        placeholder="Note" 
                        value={note}
                        onChange={(e: any) => setNote(e.target.value)}
                        name="note"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col  mt-8 gap-5">
                    {expense?.status === "UNPAID" && <AppBtn 
                      title="EDIT" 
                      className="btn-secondary" 
                      type="button"
                      disabled={edit}
                      onClick={() => setEdit(true)}
                    />}
                    {edit && <AppBtn title="SAVE"
                      spinner={store.updateExpenseDetailStatus === 'loading'}
                      disabled={expense?.status === 'PAID'}
                    />}
                  </div>
                </>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <AddReferenceModal 
        referenceForm={referenceForm}
        setReferenceForm={setReferenceForm}
        itemId={itemId}
        title="Add reference."
      />
    </>
  );
};

export default ExpensesDetailsModal;
