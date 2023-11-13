import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box, Modal } from "@mui/material";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import SearchInput from "../SearchInput/SearchInput";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { deleteExpenseAction, getExpensesAction } from "../../store/actions/expenseAction";
import TableCountTitile from "../TableCountTitile/TableCountTitile";
import moment from "moment";
import { EXPENSE_STATUS } from "../../config/constants";
import { Util } from "../../helpers/Util";
import Pagination from "../Pagination/Pagination";
import { performNameEnquiryAction } from "../../store/actions/autoHyveActions";
import { showMessage } from "../../helpers/notification";
import { clearRequestNameEnquiryStatus, saveAccountTransferInfo } from "../../store/reducers/autoHyveReducer";
import ClipLoader from "react-spinners/ClipLoader";
import ConfirmPaymentModal from "../Dashboard/ConfirmPaymentModal";
import { clearDeleteExpenseStatus } from "../../store/reducers/expenseReducer";

interface IProps {
    setExpenses: any;
    expenses: boolean;
}

const ExpensesModal = ({expenses, setExpenses}: IProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmationmodal, setConfirmationmodal] = useState<boolean>(false);
    const [values, setValues] = useState({
        bankName: '',
        amount: 0,
        narration: '',
        accountName: ''
    });
    const [expenseId, setExpenseId] = useState<number>(-1);
    const [loadingButton, setLoadingButton] = useState<number>(-1);
    const [loadingDelButton, setLoadingDelButton] = useState<number>(-1);
    
    const expenseReduder = useAppSelector(state => state.expenseReducer);
    const autoHyveReducer = useAppSelector(state => state.autoHyveReducer);
    const dispatch = useAppDispatch();

    const handleSearchChange = (e: any) => {
        const inputValue = e.target.value;
        const cleanedInput = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
    
        setSearchQuery(cleanedInput);
        setCurrentPage(1); // Reset to the first page when the search query changes
    };

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

      // Function to filter data based on the search query
    const filteredData = expenseReduder.expenses.filter((item) =>
        item.status === EXPENSE_STATUS.unpaid && item.code.includes(searchQuery)
    );
    
    const itemsPerPage = filteredData.length === expenseReduder.expenses.length ? 10 : filteredData.length;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const currentData = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        dispatch(getExpensesAction());
    }, []);

    useEffect(() => {
        if(autoHyveReducer.requestNameEnquiryStatus === 'completed') {
            dispatch(saveAccountTransferInfo({
                amount: values.amount,
                narration: values.narration as string,
                saveAsBeneficiary: false,
                accountName: values.accountName,
                bank: {
                    label: values.bankName as string,
                    value: autoHyveReducer.accountHolder?.beneficiaryBankCode as string,
                },
                accountNumber: autoHyveReducer.accountHolder?.beneficiaryAccountNumber as string,
            }))
            setConfirmationmodal(!confirmationmodal);
            setExpenses(!expenses)
            dispatch(clearRequestNameEnquiryStatus())
        } else if(autoHyveReducer.requestNameEnquiryStatus === 'failed') {
            showMessage('', autoHyveReducer.requestNameEnquiryError, 'error')
            dispatch(clearRequestNameEnquiryStatus())
        }

    },[autoHyveReducer.requestNameEnquiryStatus]);

    useEffect(() => {
        if (expenseReduder.deleteExpenseStatus === 'failed') {
          showMessage(
            'Expense',
            expenseReduder.deleteExpenseError,
            'error'
          );
        } else if (expenseReduder.deleteExpenseStatus === 'completed') {
          showMessage(
            'Expense',
            'Expense delined successfully',
            'success'
          );
          setLoadingDelButton(-1)
          dispatch(getExpensesAction());
        }
    
        return () => {
          dispatch(clearDeleteExpenseStatus());
        }
    }, [expenseReduder.deleteExpenseStatus]);

    return (
        <div>
            <ConfirmPaymentModal
                confirmationmodal={confirmationmodal}
                setConfirmationmodal={setConfirmationmodal}
                expenseId={expenseId}
            />
            <Modal
                open={expenses}
                onClose={() => setExpenses(!expenses)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="modal-header pt-0 bg-white ">
                        <div className="flex justify-between w-full">
                        <ModalHeaderTitle title="Expenses" />

                        <button onClick={() => setExpenses(!expenses)}>
                            <img src={CloseIcon} alt="" />
                        </button>
                        </div>

                        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-5 md:mt-16">
                            <div className="w-[100%] md:w-[50%]">
                                <SearchInput
                                handleSearchChange={handleSearchChange}
                                searchQuery={searchQuery}
                                />
                            </div>

                            <TableCountTitile
                                title={`Showing ${startIndex + 1} - ${endIndex} of ${filteredData.length} results`}
                                className={''}
                            />
                        </div>

                        <div className="mt-4" style={{ overflowX: "scroll" }}>
                        <table border={1} className="paymentTableCustomer w-[1200px]">
                            <thead>
                                <th className="font-montserrat    text-xs text-left">Date</th>
                                <th className="font-montserrat text-xs text-left">Expense #</th>
                                <th className="font-montserrat     text-xs text-left">
                                    Category
                                </th>
                                <th className="font-montserrat    text-xs text-left">Amount</th>
                                <th className="font-montserrat   text-xs text-left">
                                    Beneficiary
                                </th>
                                <th className="font-montserrat   text-xs text-left">Invoice</th>
                                <th className="font-montserrat  text-xs text-left">
                                    Payment Reference
                                </th>
                                <th className="font-montserrat  text-xs text-left">Status</th>
                                <th className="font-montserrat  text-xs text-left">Action</th>
                                {/* <th className="font-montserrat  text-xs text-left"/> */}
                            </thead>

                            {currentData.length > 0 &&
                            currentData.map((item, index) => {
                            return (
                                <tbody>
                                    <tr className="cursor-pointer table-hover"
                                        key={index}
                                    >
                                        <td className="font-montserrat flex items-center gap-2 text-xs">
                                        {moment(item.dateModified).format('DD/MM/YYYY')}
                                        </td>
                                        <td className="font-montserrat text-xs">{item.code}</td>
                                        <td className="font-montserrat text-xs">{item.category.name}</td>
                                        <td className="font-montserrat text-xs">{Util.formAmount(item.amount)}</td>
                                        <td className="font-montserrat text-xs">{item.beneficiary.name}</td>
                                        <td className="font-montserrat text-xs">{item.invoiceCode?.split('_')[0]}</td>
                                        <td className="font-montserrat text-xs">
                                            {item.reference}
                                        </td>
                                        <td className="font-montserrat text-xs">
                                            <span
                                                className={`py-2 flex justify-center  w-20 items-center  ${
                                                item.status == EXPENSE_STATUS.paid ? "bg-primary" : "bg-gray-300"
                                                } px-4`}
                                                style={{ borderRadius: 10 }}
                                            >
                                                {item.status == EXPENSE_STATUS.paid ? "PAID" : "UNPAID"}
                                            </span>
                                        </td>
                                        <td className="font-montserrat text-xs flex flex-row gap-5">
                                            <span
                                                className={`py-2 flex justify-center w-30 items-center bg-primary w-[100px] gap-2`}
                                                style={{ borderRadius: 10 }}
                                                onClick={() => {
                                                    setLoadingButton(item.id);
                                                    setValues({
                                                        bankName: item.beneficiary.bankName,
                                                        narration: item.note,
                                                        amount: item.amount,
                                                        accountName: item.beneficiary.accountName
                                                    })
                                                    dispatch(
                                                        performNameEnquiryAction({
                                                          beneficiaryBankCode: item.beneficiary.bankCode as string,
                                                          beneficiaryAccountNumber: item.beneficiary.accountNumber as string,
                                                        })
                                                    );
                                                    setExpenseId(item.id)
                                                }}
                                            >
                                                Approve 
                                                {loadingButton === item.id && (<ClipLoader
                                                    loading={autoHyveReducer.requestNameEnquiryStatus === 'loading'}
                                                    size={10}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                    className="mr-1 flex relative"
                                                />)}
                                            </span>
                                            <span
                                                className={`py-2 flex justify-center w-30 items-center bg-[white] 
                                                w-[100px] gap-2 border border-solid border-1 border-[#CCCCCC]`}
                                                style={{ borderRadius: 10 }}
                                                onClick={() => {
                                                    setLoadingDelButton(item.id);
                                                    dispatch(deleteExpenseAction({id: item.id}));
                                                }}
                                            >
                                                Decline 
                                                {loadingDelButton === item.id && (<ClipLoader
                                                    loading={expenseReduder.deleteExpenseStatus === 'loading'}
                                                    size={10}
                                                    aria-label="Loading Spinner"
                                                    data-testid="loader"
                                                    className="mr-1 flex relative"
                                                />)}
                                            </span>
                                            
                                        </td>
                                    </tr>
                                </tbody>
                            );
                            })}
                        </table>
                        </div>
                        <div className="md:block gap-3 flex flex-col mt-6">
                          <div className="flex justify-end">
                            {filteredData.length !== 0 && (<Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            />)}
                          </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ExpensesModal;