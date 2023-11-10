import React, { useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import AppBtn from "../AppBtn/AppBtn";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextArea from "../CustomTextArea/CustomTextArea";
import InputHeader from "../InputHeader/InputHeader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import AppTabBtn from "../AppTabBtn/AppTabBtn";
import { AiOutlinePlus } from "react-icons/ai";
import useAppSelector from "../../hooks/useAppSelector";
import { IBeneficiary, IExpenseCategory, IExpenseType, IInvoice, IPayStackBank } from "@app-models";
import useAppDispatch from "../../hooks/useAppDispatch";
import { clearCreateBeneficiaryStatus, clearCreateExpenseCategoryStatus, clearCreateExpenseTypeStatus, setInvoiceCode } from "../../store/reducers/expenseReducer";
import { showMessage } from "../../helpers/notification";
import { 
  createBeneficiaryAction, 
  createExpenseAction, 
  createExpenseCategoryAction, 
  createExpenseTypeAction, 
  getBeneficiariesAction, 
  getExpenseCategories, 
  getExpenseTypesActions 
} from "../../store/actions/expenseAction";
import { getInvoicesAction } from "../../store/actions/invoiceActions";
import { getPayStackBanksAction } from "../../store/actions/miscellaneousActions";
import { Form, Formik } from "formik";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MySelect, MyTextInput } from "../AppInput/AppInput";
import { Add } from "@mui/icons-material";
import { getAllBankAction } from "../../store/actions/autoHyveActions";
import { customStyles } from "../../contsants/customStyles";
import Select from "react-select";

const AddNewExpensesModal = ({ newExpenses, setNewExpenses }: any) => {

  const [openNewBeneficiary, setOpenNewBeneficiary] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 900 : "95%",
    height: 650,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 700 : "95%",
    height: 500,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const style3 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isSmallScreen ? 400 : "95%",
    height: 300,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    padding: isSmallScreen ? "30px" : "30px",
    py: 5,
  };

  const store = useAppSelector(state => state.expenseReducer);
  const invoiceStore = useAppSelector(state => state.invoiceReducer);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [beneficiary, setValue] = useState<IBeneficiary | null>(null);
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<IExpenseCategory | null>();
  const [type, setType] = useState<IExpenseType | null>();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [bank, setBank] = useState({
    bankName: '',
    bankCode: ''
  });
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [dateModified, setDateModified] = useState(new Date());
  const expenseReducer = useAppSelector(state => state.expenseReducer);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showExpenseTypeForm, setShowExpenseTypeForm] = useState(false);

  const miscStore = useAppSelector(state => state.miscellaneousReducer);
  const state = useAppSelector((state) => state.autoHyveReducer);

  useEffect(() => {
    if (store.createExpenseStatus === 'completed') {
      setValue(null);
      setInvoice(null);
      setCategory(null);
      setType(null);
      setAmount('');
      setReference('');
      dispatch(setInvoiceCode(''))
      setNewExpenses(false)
    } else if (store.createExpenseStatus === 'failed') {
      showMessage(
        "Expense",
        store.createExpenseError,
        "error"
      )
    }
  }, [store.createExpenseStatus]);

  useEffect(() => {
    dispatch(getBeneficiariesAction());
    dispatch(getExpenseCategories());
    dispatch(getExpenseTypesActions());
    dispatch(getInvoicesAction());
    dispatch(getPayStackBanksAction());
  }, []);

  const handleDate = (newValue: any) => {
    setDateModified(newValue)
  }

  const handleFormSubmit = () => {
    if (!beneficiary) {
      return showMessage('Expense', 'Please select beneficiary', "error");
    }
    if (!amount) return showMessage('Expense', 'Please provide amount', "error");

    if (isNaN(+amount)) return showMessage('Expense', 'Amount is invalid', "error");

    if (!category) return showMessage('Expense', 'Please select category', "error");
    if (!type) return showMessage('Expense', 'Please select type', "error");

    let findRef = ''
    expenseReducer.expenses.find((value: any) => {
      value.reference === reference && (findRef = value.reference)
    })
    if (findRef !== '') return showMessage('Expense', 'This payment has already been recorded', "error");

    const invoiceCode = invoiceStore.invoices.find((inv: IInvoice) => inv.code === expenseReducer.invoiceCode)

    dispatch(
      createExpenseAction({
        category,
        type,
        reference: reference.trim() === '' ? null : reference,
        beneficiary,
        invoice: expenseReducer.invoiceCode !== '' ? invoiceCode : invoice,
        amount: +amount,
        note,
        dateModified,
      }),
    );

  };

  useEffect(() => {
    if (store.createBeneficiaryStatus === 'completed') {
      setBank({...bank, bankName: '', bankCode: ''});
      setName('');
      setAccountName('');
      setAccountNumber('');
      setOpenNewBeneficiary(false);
      dispatch(getBeneficiariesAction());
      showMessage('Expense', 'Beneficiary created successfully', 'success');
    } else if (store.createBeneficiaryStatus === 'failed') {
      showMessage('Expense', store.createBeneficiaryError, 'error');
    }

    return () => {
      dispatch(clearCreateBeneficiaryStatus());
    }
  }, [store.createBeneficiaryStatus]);

  const handleOnCreateBeneficiary = () => {
    if (!name || name.trim() === '') return showMessage('Expense', 'Please provide beneficiary name', 'error');
    if(accountNumber) {
      if (accountNumber.length < 10 || accountNumber.length > 10) return showMessage('Expense', 'Please account number must be 10 digits', 'error');
    }

    dispatch(
      createBeneficiaryAction({
        name,
        bankName: bank.bankName,
        bankCode: bank.bankCode,
        accountName,
        accountNumber,
      }),
    );
  };

  useEffect(() => {
    if (store.createExpenseTypeStatus === 'completed') {
      setName('');
      showMessage('Expense', 'Expense type created successfully', 'success');
      setShowExpenseTypeForm(false);
      dispatch(getExpenseTypesActions())
    } else if (store.createExpenseTypeStatus === 'failed') {
      showMessage('Expense', store.createExpenseTypeError, 'error');
    }

    return () => {
      dispatch(clearCreateExpenseTypeStatus());
    }
  }, [store.createExpenseTypeStatus]);

  useEffect(() => {
    if (store.createExpenseCategoryStatus === 'completed') {
      setName('');
      dispatch(getExpenseCategories());
      showMessage('Expense', 'Expense category created successfully', 'success');
      setShowCategoryForm(false);
    } else if (store.createExpenseCategoryStatus === 'failed') {
      showMessage('Expense', store.createExpenseCategoryError, 'error');
    }

    return () => {
      dispatch(clearCreateExpenseCategoryStatus());
    }
  }, [store.createExpenseCategoryStatus]);

  const handleCreateExpenseType = () => {
    dispatch(createExpenseTypeAction({ name }));
  };

  const handleCreateExpenseCategory = () => {
    dispatch(createExpenseCategoryAction({ name }));
  };

  useEffect(() => {
    if(expenseReducer.invoiceCode) {
      const invoiceCode = invoiceStore.invoices.find((inv: IInvoice) => inv.code === expenseReducer.invoiceCode)
      setInvoice(invoiceCode as IInvoice)
    }
  },[expenseReducer.invoiceCode]);

  useEffect(() => {
    dispatch(getAllBankAction());
  }, []);
  console.log(bank, 'bankee')
  return (
    <>
      <Modal
        open={newExpenses}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Formik
          initialValues={{}}
          onSubmit={() => {
            handleFormSubmit();
          }}>
          {() => (
            <Form autoComplete="off" autoCorrect="off">
              <div className="modal-header pt-0 bg-white ">
                <div className="flex justify-between w-full">
                  <ModalHeaderTitle title="Add New Expenses" />

                  <button onClick={() => {setNewExpenses(!newExpenses), dispatch(setInvoiceCode(''))}}>
                    <img src={CloseIcon} alt="" />
                  </button>
                </div>

                <div className="w-[100%] md:w-[50%] mt-10 mb-10">
                  {/* <SearchInput placeholder="Search beneficiary by First name, Last Name" /> */}
                  <Autocomplete
                    filterOptions={(options, state) => {
                      return options.filter(item => item.name.toLowerCase().startsWith(state.inputValue.toLowerCase()));
                    }}
                    inputValue={inputValue}
                    value={beneficiary}
                    loading={store.getExpensesStatus === 'loading'}
                    getOptionLabel={option => `${option.name} | ${option.bankName ? option.bankName: ''} | ${option.accountNumber ? option.accountNumber : ''}`}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
                    onChange={(_: any, newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={props => (
                      <TextField
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                          placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                          font-montserrat`
                        }
                        {...props}
                        label="Search beneficiary by First name, last name."
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
                        onChange={e => setInputValue(e.target.value)}
                      />
                    )}
                    options={store.beneficiaries || []}
                  />
                </div>

                {beneficiary && (
                  <div className="flex md:gap-14 gap-2 mt-15 w-[100%] md:flex-row flex-col">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Name</span>
                      <span className="text-sm font-light">{beneficiary?.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Account Number</span>
                      <span className="text-sm font-light">{beneficiary?.accountNumber}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Bank Name</span>
                      <span className="text-sm font-light">{beneficiary?.bankName}</span>
                    </div>
                  </div>
                )}

                <div className="mt-5 md:mt-8 gap-8 flex-col justify-center">
                  <div className="flex gap-5 md:gap-36 items-center md:flex-row flex-col justify-between">
                    <div className="w-[100%] md:w-[47%]">
                      <InputHeader text="Date" />
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                              label="Date"
                              variant="outlined"
                            />
                          }
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="flex h-[100%] w-[100%] md:w-[30%] mt-5 gap-3">
                      <AppTabBtn
                        icon={<AiOutlinePlus />}
                        type="button"
                        title="Add New Beneficiary"
                        className=" text-[#000] btn-secondary flex-1"
                        onClick={() => setOpenNewBeneficiary(true)}
                      />
                    </div>
                  </div>

                  <div className=" w-full md:flex-row flex-col flex items-center gap-5 md:gap-10 mt-10">
                    <div className="w-full">
                      <InputHeader text="Expense Category" />
                      <Autocomplete
                        getOptionLabel={option => option.name}
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
                        value={category}
                        onChange={(_: any, newValue) => {
                          setCategory(newValue);
                        }}
                        options={store.expenseCategories}
                      />
                      <span
                        className="text-[10px] mt-3 ml-1 font-bold font-montserrat text-[#FAA21B] cursor-pointer"
                        onClick={() => setShowCategoryForm(true)}
                      >
                        <Add sx={{fontSize: '16px'}}/> Add Category
                      </span>
                    </div>

                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Amount"
                        placeholder="Amount"
                        name="amount"
                        onChange={(e: any) => setAmount(e.target.value)}
                        value={amount}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className=" w-full md:flex-row flex-col flex items-center gap-5 md:gap-10 mt-3 md:mt-8">
                    <div className="w-full mt-4">
                      <InputHeader text="Expense Type/Name" />
                      <Autocomplete
                        getOptionLabel={option => option.name}
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
                        value={type}
                        onChange={(_: any, newValue) => {
                          setType(newValue);
                        }}
                        options={store.expenseTypes}
                      />
                      <span
                        className="text-[10px] mt-3 ml-1 font-bold font-montserrat text-[#FAA21B] cursor-pointer"
                        onClick={() => setShowExpenseTypeForm(true)}
                      >
                        <Add sx={{fontSize: '16px'}}/> Add Expense Type
                      </span>
                    </div>

                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Payment reference"
                        placeholder="Payment reference"
                        name="reference"
                        onChange={(e: any) => setReference(e.target.value)}
                        value={reference}
                        className="mb-[-20px]"
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col mt-8">
                    <InputHeader text="Invoice" />
                    <Autocomplete
                      //@ts-ignore
                      getOptionLabel={option => option?.code?.split('_')[0]}
                      disabled={category?.name === "Others" || category?.name === "Overhead"}
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
                      //@ts-ignore
                      // defaultValue={expenseReducer?.invoiceCode !== '' ? expenseReducer?.invoiceCode?.split('_')[0] : invoice}
                      onChange={(_: any, newValue: any) => setInvoice(newValue)}
                      value={invoice}
                      //@ts-ignore
                      options={invoiceStore.invoices}
                    />
                    {/* <div className="flex justify-end items-end w-[100%] mt-5">
                      <div className="w-[50%] md:w-[30%] flex">
                        <AppTabBtn
                          icon={<AiOutlinePlus />}
                          title="Generate Items"
                          className=" text-[#000] btn-secondary flex-1"
                          //   onClick={() => setNewExpenses(true)}
                        />
                      </div>
                    </div> */}
                  </div>

                  <div className="mt-5">
                    <CustomTextArea
                      topTitle="Notes/Remarks" 
                      placeholder="Note" 
                      value={note}
                      onChange={(e: any) => setNote(e.target.value)}
                      name="note"
                    />
                  </div>
                </div>
              </div>

              <div className=" flex gap-4 mt-10 justify-center md:justify-start items-center px-4 ">
                <AppBtn
                  title="CREATE"
                  className="font-medium w-[90%] md:w-[300px]"
                  spinner={expenseReducer.createExpenseStatus === 'loading'}
                />
              </div>
            </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Modal
        open={openNewBeneficiary}
        // onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <Formik
            initialValues={{}}
            onSubmit={() => {
              handleOnCreateBeneficiary();
            }}>
            {() => (
              <Form autoComplete="off" autoCorrect="off">
                <div className="modal-header pt-0 bg-white ">
                  <div className="flex justify-between w-full">
                    <ModalHeaderTitle title="Add New Benenficiary" />

                    <button onClick={() => setOpenNewBeneficiary(!openNewBeneficiary)}>
                      <img src={CloseIcon} alt="" />
                    </button>
                  </div>

                  <div className=" w-full flex items-center gap-10 mt-10">
                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Beneficiary Name"
                        placeholder="Beneficiary Name"
                        name="name"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        className="mb-[-20px]"
                      />
                    </div>

                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Account Name"
                        placeholder="Account Name"
                        name="accountName"
                        value={accountName}
                        onChange={(e: any) => setAccountName(e.target.value)}
                        className="mb-[-20px]"
                      />
                    </div>
                  </div>

                  <div className=" w-full flex items-center gap-10 mt-10">
                    <div className="w-full">
                      <InputHeader text={"Bank Name"} />
                      <Select
                        options={state.banks.map(option => ({ value: option.bankCode, label: option.bankName }))}
                        onChange={(item) => {
                          setBank({...bank, bankName: String(item?.label), bankCode: String(item?.value)});
                        }}
                        styles={customStyles}
                        placeholder={"Bank Name"}
                        name={"bank"}
                        value={{
                          value: bank.bankName,
                          label: bank.bankName,
                        }}
                      />
                    </div>

                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Account Number"
                        placeholder="Account Number"
                        name="accountName"
                        value={accountNumber}
                        onChange={(e: any) => setAccountNumber(e.target.value.replace(" ", ""))}
                        className="mb-[-20px]"
                      />
                    </div>
                  </div>

                  <div className=" flex gap-4 mt-10 justify-center md:justify-start items-center px-4 ">
                    <AppBtn
                      title="Save"
                      className="font-medium w-[90%] md:w-[300px]"
                      spinner={store.createBeneficiaryStatus === 'loading'}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Modal
        open={showCategoryForm}
        // onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style3}>
          <Formik
            initialValues={{}}
            onSubmit={() => {
              handleCreateExpenseCategory();
            }}>
            {() => (
              <Form autoComplete="off" autoCorrect="off">
                <div className="modal-header pt-0 bg-white ">
                  <div className="flex justify-between w-full">
                    <ModalHeaderTitle title="Add New Expense Category" />

                    <button onClick={() => setShowCategoryForm(!showCategoryForm)}
                      type='button'
                    >
                      <img src={CloseIcon} alt="" />
                    </button>
                  </div>

                  <div className=" w-full flex items-center gap-10 mt-10">
                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Expense Category"
                        placeholder="Expense Category"
                        name="name"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        className="mb-[-20px]"
                      />
                    </div>
                  </div>

                  <div className=" flex gap-4 mt-10 justify-center md:justify-start items-center px-4 ">
                    <AppBtn
                      title="Save"
                      className="font-medium w-[90%] md:w-[300px]"
                      spinner={store.createExpenseCategoryStatus === 'loading'}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      <Modal
        open={showExpenseTypeForm}
        // onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style3}>
          <Formik
            initialValues={{}}
            onSubmit={() => {
              handleCreateExpenseType();
            }}>
            {() => (
              <Form autoComplete="off" autoCorrect="off">
                <div className="modal-header pt-0 bg-white ">
                  <div className="flex justify-between w-full">
                    <ModalHeaderTitle title="Add New Expense Type" />

                    <button onClick={() => setShowExpenseTypeForm(!showExpenseTypeForm)}
                      type='button'
                    >
                      <img src={CloseIcon} alt="" />
                    </button>
                  </div>

                  <div className=" w-full flex items-center gap-10 mt-10">
                    <div className="w-full">
                      <MyTextInput
                        hasPLaceHolder={true}
                        placeholderTop="Expense Type"
                        placeholder="Expense Type"
                        name="name"
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}
                        className="mb-[-20px]"
                      />
                    </div>
                  </div>

                  <div className=" flex gap-4 mt-10 justify-center md:justify-start items-center px-4 ">
                    <AppBtn
                      title="Save"
                      className="font-medium w-[90%] md:w-[300px]"
                      spinner={store.createExpenseTypeStatus === 'loading'}
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

export default AddNewExpensesModal;
