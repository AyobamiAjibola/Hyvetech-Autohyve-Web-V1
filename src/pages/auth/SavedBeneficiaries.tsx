import TransactCard from "../../components/Dashboard/TransactCard";
import AppBtn from "../../components/AppBtn/AppBtn";

import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import { FaChevronLeft } from "react-icons/fa";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { createBeneficiaryAction, getBeneficiariesAction } from "../../store/actions/autoHyveActions";
import { Box, Modal, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Form, Formik } from "formik";
import { showMessage } from "../../helpers/notification";
import { clearCreateBeneficiaryStatus } from "../../store/reducers/autoHyveReducer";
import ModalHeaderTitle from "../../components/ModalHeaderTitle/ModalHeaderTitle";
import { MyTextInput } from "../../components/AppInput/AppInput";
import InputHeader from "../../components/InputHeader/InputHeader";
import Select from "react-select";
import { customStyles } from "../../contsants/customStyles";
import { useLocation } from "react-router-dom";
import SearchInput from "../../components/SearchInput/SearchInput";
import Pagination from "../../components/Pagination/Pagination";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";

const SavedBeneficiaries = () => {
  const dispatch = useAppDispatch();
  const [newBeneficiary, setNewBeneficiary] = useState(false);
  const bankState = useAppSelector((state) => state.autoHyveReducer);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [name, setName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState({
    bankName: '',
    bankCode: ''
  });
  const store = useAppSelector(state => state.expenseReducer);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation()

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

  const getBeneficiaries = useCallback(() => {
    dispatch(getBeneficiariesAction());
  }, []);

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
    getBeneficiaries();
  }, []);

  useEffect(() => {
    if (store.createBeneficiaryStatus === 'completed') {
      setBank({...bank, bankName: '', bankCode: ''});
      setName('');
      setAccountName('');
      setAccountNumber('');
      setNewBeneficiary(false);
      dispatch(getBeneficiariesAction());
      showMessage('', 'Beneficiary created successfully', 'success');
    } else if (store.createBeneficiaryStatus === 'failed') {
      showMessage('Expense', store.createBeneficiaryError, 'error');
    }

    return () => {
      dispatch(clearCreateBeneficiaryStatus());
    }
  }, [store.createBeneficiaryStatus]);

    // Function to handle changes in the search input
    const handleSearchChange = (e: any) => {
      const inputValue = e.target.value;
      const cleanedInput = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');
  
      setSearchQuery(cleanedInput);
      setCurrentPage(1); // Reset to the first page when the search query changes
    };
  
    // Function to filter data based on the search query
    const filteredData = bankState.beneficiaries.filter((item) =>
      item.accountName.toLowerCase().includes(searchQuery.toLowerCase())
      // item.code.includes(searchQuery)
    );
  
    const itemsPerPage = filteredData.length === bankState.beneficiaries.length ? 10 : filteredData.length;
  
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const currentData = filteredData.slice(startIndex, endIndex);
  
    const handlePageChange = (newPage: any) => {
      setCurrentPage(newPage);
    };
  
  return (
    <>
      <div className="w-full">
        <div className="w-full flex h-10  md:hidden items-center mt-20 mb-5 cursor-pointer">
          <FaChevronLeft onClick={() => window.history.back()} />
          <span className="font-montserrat inline-block ml-5">Back</span>
        </div>
        <div>
          <div className="flex flex-col md:flex-row gap-5 justify-between items-center md:mt-28 w-full">
            <div className="search w-[100%] md:w-2/4 ">
              <SearchInput
                handleSearchChange={handleSearchChange}
                searchQuery={searchQuery}
              />
            </div>

            {location.pathname === '/hyvepay/saved-beneficiaries' && (<AppBtn
              title="Add New Beneficiary"
              onClick={() => setNewBeneficiary(!newBeneficiary)}
              className="text-[#000] w-full md:0  md:w-[25%] bg-[#FAA21B]"
            />)}
          </div>
          <div
            className="flex justify-start items-start mt-10 ml-2"
          >
            <TableCountTitile className={''}
              title={`Showing ${startIndex + 1} - ${endIndex} of ${filteredData.length} results`}
            />
          </div>
          
        </div>

        {/* <div className="grid grid-cols-2 md:grid-cols-5  w-[100%] gap-1  mt-14 "> */}
        <div className="flex justify-start gap-3 flex-wrap mt-5 ">
          {/* <div className="grid pb-20 grid-cols-2 md:grid-cols-3  w-[100%] md:w-[60%] gap-3 md:gap-16 mt-14 "> */}

          {currentData?.map((item: any, i: any) => (
            <TransactCard
              key={i}
              name={item.accountName}
              accountnum={item.accountNumber}
              bankName={item.bankName}
              beneficiaryId={item.id}
            />
          ))}
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

      <Modal
        open={newBeneficiary}
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

                    <button onClick={() => setNewBeneficiary(!newBeneficiary)}>
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
                        options={bankState.banks.map(option => ({ value: option.bankCode, label: option.bankName }))}
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
    </>
  );
};

export default SavedBeneficiaries;
