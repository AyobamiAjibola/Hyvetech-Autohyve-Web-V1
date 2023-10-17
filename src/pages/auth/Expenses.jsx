import React, { useEffect, useRef, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppBtn from "../../components/AppBtn/AppBtn";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import { AiOutlineEye, AiOutlinePlus } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import Sorting from "../../components/Sorting/Sorting";
import documentupload from "../../assets/images/document-upload.png";
import CreateAutoHyveCustomerModal from "../../components/AutoHyveModals/CreateAutoHyveCustomerModal";
import SearchInput from "../../components/SearchInput/SearchInput";
import DownloadIcon from "../../assets/images/export.png";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import DeleteModal from "../../components/modals/DeleteModal";
import profilePicx from "../../assets/images/profilePicx.png";
import { Link, useNavigate } from "react-router-dom";
import AddNewExpensesModal from "../../components/AutoHyveModals/AddNewExpensesModal";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import TableActionButton from "../../components/TableActionButton/TableActionButton";
import ExpensesDetailsModal from "../../components/AutoHyveModals/ExpensesDetailsModal";
import useAppSelector from "../../hooks/useAppSelector";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAdmin from "../../hooks/useAdmin";
import { deleteExpenseAction, getExpensesAction, updateExpenseAction } from "../../store/actions/expenseAction";
import { showMessage } from "../../helpers/notification";
import { clearCreateEspenseStatus, clearDeleteExpenseStatus, clearUpdateExpenseDetailStatus } from "../../store/reducers/expenseReducer";
import Pagination from "../../components/Pagination/Pagination";
import { Util } from "../../helpers/Util";
import { IconButton } from "@mui/material";
import moment from "moment";
import { EXPENSE_STATUS } from "../../config/constants";
import DeleteExpenseModal from "../../components/modals/DeleteExpenseModal";

const Expenses = () => {
  const [newExpenses, setNewExpenses] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [deletemodal, setDeletemodal] = useState(false);
  const [expenseDetailmodal, setExpenseDetailmodal] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const navigate = useNavigate();
  const refOne = useRef(null);
  const tableData = Array(3).fill("");
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenImport(false);
    }
  };
  const expenseReduder = useAppSelector(state => state.expenseReducer);
  const dispatch = useAppDispatch();
  const [showAddReferenceForm, setReferenceForm] = useState(false);
  const [reference, setReference] = useState('');
  const [expenseId, setExpenseId] = useState(-1);
  const { isTechAdmin } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemId, setItemId] = useState(-1);

  useEffect(() => {
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  useEffect(() => {
    dispatch(getExpensesAction());
  }, []);

  const handleAddReference = () => {
    dispatch(updateExpenseAction({ reference, id: expenseId }));
    setExpenseId(-1);
    setReference('');
    setReferenceForm(false);
  };

  const updateExpenseReference = (expenseId) => {
    setReferenceForm(true);
    setExpenseId(expenseId);
  };

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
        'Expense deleted successfully',
        'success'
      );
      setDeletemodal(false)
      dispatch(getExpensesAction());
    }

    return () => {
      dispatch(clearDeleteExpenseStatus());
    }
  }, [expenseReduder.deleteExpenseStatus]);

  useEffect(() => {
    if (expenseReduder.updateExpenseDetailStatus === 'failed') {
      showMessage('Expense', expenseReduder.updateExpenseDetailError, 'error');
    } else if (expenseReduder.updateExpenseDetailStatus === 'completed') {
      showMessage('Expense', 'Expense updated successfully', 'success');

      dispatch(getExpensesAction());
    }

    return () => {
      dispatch(clearUpdateExpenseDetailStatus())
    }
  }, [expenseReduder.updateExpenseDetailStatus]);

  useEffect(() => {
    if (expenseReduder.createExpenseStatus === 'failed') {
      showMessage('Expense', expenseReduder.createExpenseError, 'error');
    } else if (expenseReduder.createExpenseStatus === 'completed') {
      showMessage('Expense', 'Expense created successfully', 'success');

      dispatch(getExpensesAction());
    }

    return () => {
      dispatch(clearCreateEspenseStatus());
    }
  }, [expenseReduder.createExpenseStatus]);

  const handleExpenseDelete = (id) => {
    dispatch(deleteExpenseAction({ id }));
  };

  const toggleCarts = (id) => {
    if (checkBoxValue.includes(id)) {
      // already exist
      let _tmp = [];
      for (let i = 0; i < checkBoxValue.length; i++) {
        const __data = checkBoxValue[i];

        if (__data != id) {
          _tmp.push(__data);
        }
      }
      setCheckBoxValue(_tmp);
    } else {
      // add
      setCheckBoxValue([...[id], ...checkBoxValue]);
    }
  };

  const closeDeleteModal = (event) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
  };

  const detailModal = (event) => {
    event.stopPropagation();
    setExpenseDetailmodal(!expenseDetailmodal);
  };

  const items = [
    "Name (Ascending)",
    "Name (Descending)",
    "Date (Ascending)",
    "Date (Descending)",
  ];

  // Function to handle changes in the search input
  const handleSearchChange = (e) => {
    const inputValue = e.target.value;
    const cleanedInput = inputValue.replace(/[^a-zA-Z0-9 ]/g, '');

    setSearchQuery(cleanedInput);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  // Function to filter data based on the search query
  const filteredData = expenseReduder.expenses.filter((item) =>
    // item.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.includes(searchQuery)
  );

  const itemsPerPage = filteredData.length === expenseReduder.expenses.length ? 10 : filteredData.length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <DashboardWrapper>
      <>
        <div className="flex flex-col md:flex-row">
          <Sorting
            className="w-full"
            items={items}
            select={select}
            setSelect={setSelect}
          />
          <AppTabBtn
            icon={<BsDownload />}
            title="Export Items"
            className="w-full md:hidden flex text-[#000] btn-secondary"
            // onClick={() => navigate("/generate-invoice")}
          />
          <div className="flex gap-3">
            <AppTabBtn
              icon={<AiOutlinePlus />}
              title="Add New Payment"
              className="w-[200px] text-[#000] btn-secondary hidden md:flex"
              onClick={() => setNewExpenses(true)}
            />
          </div>
        </div>

        <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-5 md:mt-16">
          <div className="w-[100%] md:w-[50%]">
            <SearchInput 
              handleSearchChange={handleSearchChange}
              searchQuery={searchQuery}
            />
          </div>

          <TableCountTitile />
        </div>

        <div className="mt-4" style={{ overflowX: "scroll" }}>
          <table border={1} className="paymentTableCustomer w-[1200px]">
            <thead>
              <th className="font-montserrat    text-xs text-left">
                <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
              </th>
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
            </thead>

            {currentData.length > 0 &&
            currentData.map((item, index) => {
              return (
                <tbody 
                  onClick={(e) => {
                    detailModal(e), setItemId(item.id)}}>
                  <tr className="cursor-pointer table-hover"
                    key={index}
                  >
                    <td
                      className="font-montserrat text-xs cursor-pointer"
                      onClick={() => toggleCarts(index)}
                    >
                      {[
                        checkBoxValue.includes(index) ? (
                          <div className="w-[20px] h-[18px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[5px]">
                            <div className="w-[15px] h-[15px] rounded-[6px] bg-[#FAA21B] border-[1px]"></div>
                          </div>
                        ) : (
                          <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                        ),
                      ]}
                    </td>
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

                    <td className="flex gap-3 items-center justify-center ">
                      <IconButton
                        onClick={(e) => {
                          setExpenseId(item.id)
                          closeDeleteModal(e)}}
                      >
                        <HiOutlineTrash
                          size={15}
                          className="text-center cursor-pointer"
                        />
                      </IconButton>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
        <div className="md:block gap-3 flex flex-col">
          {filteredData.length !== 0 && (<Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />)}
        </div>
        {/* <div className="flex justify-between flex-col md:flex-row md:gap-0 gap-5 w-[99%] mt-10">
          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Add New Expenses"
            className="w-full text-[#000] btn-secondary flex md:hidden order-2"
            onClick={() => setNewExpenses(true)}
          />

          <TableActionButton
            icon={DownloadIcon}
            title="Export Items"
            className="order-2"
          />

          <div className="flex items-center mb-8 md:mb-0 order-1 gap-3">
            <div className="border-[1px] rounded-[5px] p-3 border-[#D9D9D9] cursor-pointer">
              <HiChevronLeft color="#D9D9D9" />
            </div>
            <div className="border-[1px] rounded-[5px] px-5 py-2 border-[#D9D9D9]">
              1
            </div>
            <div className="border-[1px] rounded-[5px] p-3 border-[#D9D9D9] cursor-pointer">
              <HiChevronRight color="#D9D9D9" />
            </div>
          </div>
        </div> */}

        <AddNewExpensesModal
          newExpenses={newExpenses}
          setNewExpenses={setNewExpenses}
        />

        <ExpensesDetailsModal
          expenseDetailmodal={expenseDetailmodal}
          setExpenseDetailmodal={setExpenseDetailmodal}
          itemId={itemId}
          setItemId={setItemId}
        />

        <DeleteExpenseModal
          deletemodal={deletemodal}
          setDeletemodal={setDeletemodal}
          title={"Delete Record Expenses"}
          description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
          closeDeleteModal={closeDeleteModal}
          setExpenseId={setExpenseId}
          expenseId={expenseId}
          handleExpenseDelete={handleExpenseDelete}
        />
      </>
    </DashboardWrapper>
  );
};

export default Expenses;
