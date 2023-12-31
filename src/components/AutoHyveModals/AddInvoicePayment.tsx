import { Autocomplete, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import AppInput from '../AppInput/AppInput';
import InputHeader from '../InputHeader/InputHeader';
import AppBtn from '../AppBtn/AppBtn';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getInvoicesAction, getSingleInvoice } from '../../store/actions/invoiceActions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Select from "react-select";
import { customStyles } from '../../contsants/customStyles';
import axiosClient from "../../config/axiosClient";
import settings from '../../config/settings';
import { getpaymentRecievedAction } from '../../store/actions/transactionActions';
import { showMessage } from '../../helpers/notification';
import { Util } from '../../helpers/Util';
import { IInvoice } from '@app-models';
import { setInvoiceCode } from '../../store/reducers/expenseReducer';
import moment from 'moment';

const API_ROOT = settings.api.rest;

interface IProp {
  invoiceId?: any,
  setOpenAddPayment: any,
  activeTab: any
}

function AddInvoicePayment({setOpenAddPayment, activeTab, invoiceId}: IProp)  {
    const [invoice, setInvoice] = useState<any>('');
    const paymentMode = ["Cash", "Transfer", "Check", "Payment link", "POS"];
    const invoiceStore = useAppSelector(state => state.invoiceReducer);
    const expenseReducer = useAppSelector(state => state.expenseReducer);
    const dispatch = useAppDispatch()
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [_dueAmt, _setDueAmt] = useState<any>();

    const formik = useFormik({
        initialValues: {
          type: "",
          amount: 0,
          firstName: "",
          lastName: "",
          date: new Date(),
          paymentDate: new Date()
        },
        onSubmit: (values) => {
          handlePaymentRecord(values)
        }
      })
      const values = formik.values;
      const setFieldValue = formik.setFieldValue;

      useEffect(() => {
        dispatch(getInvoicesAction());
      },[]);

      useEffect(() => {
        if(invoice) {
          setFieldValue("firstName", invoice?.estimate?.customer?.firstName)
          setFieldValue("lastName", invoice?.estimate?.customer?.lastName)
          setFieldValue("date", invoice?.createdAt)
        }
      },[setFieldValue, invoice]);

    const handlePaymentRecord = async (values: any) => {
      
      if(values.paymentDate === "") {
        return showMessage('Payment', 'Payment date is required', 'error')
      }
      setIsloading(true);
      try {
        const payload = {
          invoiceId: invoice?.id || 0,
          customerId: invoice?.estimate?.customer?.id,
          amount: values.amount,
          type: values.type,
          paymentDate: values.paymentDate
        };

        const response = await axiosClient.post(
          `${API_ROOT}/transactions/update-invoice-payment-manually`,
          payload
        );
        console.log(response.data);
        // @ts-ignore
        showMessage('Payment', 'Successful', 'success');
        dispatch(getpaymentRecievedAction())
        setOpenAddPayment(false);
        dispatch(getSingleInvoice(invoiceId))

      } catch (e: any) {
          showMessage('Payment',
            e.response?.data?.message || "Unable able to process please try again", 'error'
          );
      console.log(e);
      }
      setIsloading(false);
      dispatch(setInvoiceCode(''))
    };

    useEffect(() => {
      if (activeTab === 1) {
        invoice?.updateStatus === "Draft"
          ? _setDueAmt(invoice.draftInvoice.dueAmount)
          : _setDueAmt(invoice?.dueAmount);
      }
    }, [activeTab, invoice]);

    useEffect(() => {
      if(expenseReducer.invoiceCode) {
        const invObj = invoiceStore.invoices.find(invoice => invoice.code === expenseReducer.invoiceCode )
        setInvoice(invObj as IInvoice)
      }
    },[expenseReducer.invoiceCode]);

    useEffect(() => {
      setFieldValue("date", '')
      setFieldValue("paymentDate", "")
    },[])

    return (
      <>
        <div className="w-[100%] md:w-[30%] mt-5">
          <InputHeader text="Invoice" />
          <Autocomplete
            //@ts-ignore
            getOptionLabel={option => option?.code?.split('_')[0]}
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
                      {/* {store.getExpensesStatus === 'loading' ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {props.InputProps.endAdornment} */}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            onChange={(_: any, newValue: any) => setInvoice(newValue)}
            value={invoice}
            //@ts-ignore
            options={invoiceStore.invoices}
          />
        </div>

        <>
          <form
            autoComplete="off" autoCorrect="off"
            onSubmit={formik.handleSubmit}
          >
            <div className=" w-[100%] md:border-[1px] rounded-3xl  flex mt-3 md:mt-8  px-0 md:px-5 flex-col py-5  md:border-[#CACACA]">
                <h5 className="font-semibold font-montserrat">
                Customer Information
                </h5>
                <div className="flex flex-col md:flex-row  mt-3 w-full gap-5">
                    <div className="w-full">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop="First Name"
                        placeholder="First Name"
                        name={`firstName`}
                        onBlur={formik.handleBlur}
                        value={values.firstName}
                      />
                    </div>

                    <div className="w-full">
                      <AppInput
                        hasPLaceHolder={true}
                        placeholderTop="Last Name"
                        placeholder="Last Name"
                        name={`lastName`}
                        onBlur={formik.handleBlur}
                        value={values.lastName}
                      />
                    </div>
                </div>

                <div className="flex md:flex-row flex-col gap-5 mt-8">
                  <div className="flex-1">
                    <AppInput
                      hasPLaceHolder={true}
                      placeholderTop="Date of Invoice"
                      placeholder="Date of Invoice"
                      disabled
                      // name={`lastName`}
                      // onBlur={formik.handleBlur}
                      value={values.date ? moment(values.date).format('MM/DD/YYYY') : ''}
                    />
                    {/* <InputHeader text="Date of Invoice" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`}
                        disableFuture
                        minDate={new Date('2000/01/01')}
                        openTo="year"
                        views={['year', 'month', 'day']}
                        value={new Date(values.date)}
                        // onChange={() => setFieldValue('date', ) }
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
                              fontFamily: 'montserrat',
                              fontSize: '12px',
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
                            // value={invoice.code.splice('_')[0]}
                          />
                        }
                      />
                    </LocalizationProvider> */}
                  </div>
                  <div className="flex-1">
                    <InputHeader text="Payment Date" />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        className={`bg-[#F5F5F5] border-[#F5F5F5] h-14 w-full 
                        placeholder-[#A5A5A5] placeholderText h-[55px] rounded-[20px] 
                        font-montserrat`}
                        disableFuture
                        minDate={new Date('2000/01/01')}
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={new Date(values.paymentDate)}
                        onChange={(value) => setFieldValue('paymentDate', value)}
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
                              fontFamily: 'montserrat',
                              fontSize: '12px',
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
                            // value={invoice.code.splice('_')[0]}
                          />
                        }
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="flex-1">
                    <InputHeader text={"Mode of payment"} />
                    <Select
                      options={paymentMode.map(option => ({ value: option, label: option }))}
                      onChange={(item) => {
                        setFieldValue("type", String(item?.value));
                      }}
                      styles={customStyles}
                      placeholder={"Mode of payment"}
                      name={"type"}
                      onBlur={formik.handleBlur}
                      value={{
                        value: values.type,
                        label: values.type,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <AppInput
                      type='number'
                      hasPLaceHolder={true}
                      placeholderTop="Amount Paid (₦)"
                      placeholder={`Amount to Record Max: " + ${Util.formAmount(_dueAmt)}`}
                      name={`amount`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={values.amount}
                      disabled={_dueAmt < 0}
                    />
                    {invoice && (<span
                      className={`text-[10px] font-montserrat font-bold ${_dueAmt > 0 ? 'text-[green]' : 'text-[red]'}`}
                    >{_dueAmt > 0 ? `Amount to Record Max: ${Util.formAmount(_dueAmt)}` : `Due balance is ${Util.formAmount(_dueAmt)}`}</span>)}
                  </div>
                </div>
                
            </div>

            <div className="flex justify-start  md:justify-end mt-8">
                <AppBtn
                    title="Generate"
                    className="font-medium md:w-[25%] w-[100%]"
                    spinner={isLoading}
                />
            </div>

          </form>
          
        </>
      </>
    )
}

export default AddInvoicePayment;