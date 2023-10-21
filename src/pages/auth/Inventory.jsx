import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../components/DashboardWrapper/DashboardWrapper";
import AppBtn from "../../components/AppBtn/AppBtn";
import { AiOutlinePlus } from "react-icons/ai";
import AppTabBtn from "../../components/AppTabBtn/AppTabBtn";
import Sorting from "../../components/Sorting/Sorting";
import TrashIcon from "../../assets/svgs/vuesax/linear/trash.svg";
import DownloadIcon from "../../assets/images/export.png";
import SearchInput from "../../components/SearchInput/SearchInput";
import { HiChevronLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import { GrEdit } from "react-icons/gr";
import AppSwitch from "../../components/AppSwitch/AppSwitch";
import DeleteModal from "../../components/modals/DeleteModal";
import EditInventory from "../../components/AutoHyveModals/EditInventory";
import ItemDetailsModal from "../../components/AutoHyveModals/ItemDetailsModal";
import TableCountTitile from "../../components/TableCountTitile/TableCountTitile";
import TableActionButton from "../../components/TableActionButton/TableActionButton";
import useItemStock from "../../hooks/useItemStock";
import Pagination from "../../components/Pagination/Pagination";
import { Util } from "../../helpers/Util";
import { IconButton } from "@mui/material";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import { getItemsAction, updateItemStatusAction } from "../../store/actions/itemStockAction";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { showMessage } from "../../helpers/notification";
import { clearCreateItemStatus, clearDeleteItemStatus, clearItemActiveStatus, clearUpdateItemStatus } from "../../store/reducers/itemStockReducer";

const Inventory = () => {
  const [select, setSelect] = useState("Sort By");
  const [deletemodal, setDeletemodal] = useState(false);
  const closeDeleteModal = (event) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
  };
  const [openAddNewItem, setOpenAddNewItem] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const { items } = useItemStock();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const itemReducer = useAppSelector(state => state.itemStockReducer);
  const [editMode, setEditMode] = useState(false);
  const [itemId, setItemId] = useState(-1);
  const [active, setActive] = useState(false);

  const item = [
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
  const filteredData = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.partNumber.includes(searchQuery)
  );

  const itemsPerPage = filteredData.length === items.length ? 10 : filteredData.length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDisableItem = (item) => {
    item.active ? setActive(true) : setActive(false)
    dispatch(updateItemStatusAction({ itemId: item.id }));
  };

  useEffect(() => {
    if(itemReducer.createItemActiveStatus === 'completed') {
      showMessage(
        "Item",
        `${active ? 'Item disabled successfully' : 'Item enabled successfully'}`,
        "success"
      )
      dispatch(getItemsAction());
    } else if (itemReducer.createItemActiveStatus === 'failed') {
      showMessage(
        "Item",
        itemReducer.createItemActiveError,
        "error"
      )
    }

    return () => {
      dispatch(clearItemActiveStatus())
    }
  },[itemReducer.createItemActiveStatus]);

  useEffect(() => {
    if (itemReducer.updateItemStatus === 'completed') {
      showMessage(
        "Item stock",
        itemReducer.updateItemSuccess,
        "success"
      )

      dispatch(getItemsAction());
    }

    return () => {
      dispatch(clearUpdateItemStatus())
    }
  }, [itemReducer.updateItemStatus]);

  useEffect(() => {
    if (itemReducer.createItemStatus === 'completed') {
      showMessage(
        "Item stock",
        itemReducer.createItemSuccess,
        "success"
      )
      dispatch(getItemsAction());
    }

    return () => {
      dispatch(clearCreateItemStatus())
    }
  }, [itemReducer.createItemStatus]);

  useEffect(() => {
    if (itemReducer.deleteItemStatus === 'completed') {
      showMessage(
        "Item stock",
        "Item deleted successfully",
        "success"
      )
      dispatch(getItemsAction());
    } else if (itemReducer.deleteItemStatus === 'failed') {
        showMessage(
          "Item stock",
          itemReducer.deleteItemError,
          "error"
        )
    }

    return () => {
      dispatch(clearDeleteItemStatus())
    }
  }, [itemReducer.deleteItemStatus]);

  return (
    <DashboardWrapper>
      <div className="gap-5 mb-5 justify-between md:flex-row flex-col w-full mt-4 flex md:hidden">
        <TableActionButton
          icon={DownloadIcon}
          title=" Export Items"
          className="md:hidden block"
        />

        <AppTabBtn
          icon={<AiOutlinePlus />}
          title="Add New Items"
          className="w-full text-[#000] btn-secondary block md:hidden"
          onClick={() => setOpenAddNewItem}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Sorting
          items={item}
          select={select}
          setSelect={setSelect}
          className="w-[100%]"
        />
        <div className="flex gap-3">
          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Add New Items"
            className="w-[200px] text-[#000] btn-secondary hidden md:flex"
            onClick={() => {
              setEditMode(false)
              setOpenAddNewItem(true)
            }}
          />
        </div>
      </div>

      <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-1 md:mt-16">
        <div className="w-[100%] md:w-[50%]">
          <SearchInput
            handleSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />
        </div>

        <TableCountTitile />
      </div>

      <div className="mt-4" style={{ overflowX: "scroll" }}>
        <table
          className="w-[1600px]"
          border={1}
          style={{ borderRadius: 20, overflow: "clip" }}
        >
          <thead>
            <th className="font-montserrat    text-xs text-left">S/N</th>
            <th className="font-montserrat    text-xs text-left">Name</th>
            <th className="font-montserrat    text-xs text-left">
              Description
            </th>
            <th className="font-montserrat text-xs text-left">Type</th>
            <th className="font-montserrat     text-xs text-left">
              Part number
            </th>
            <th className="font-montserrat    text-xs text-left">
              Selling rate/price
            </th>
            <th className="font-montserrat   text-xs text-left">Status</th>
            <th className="font-montserrat   text-xs text-left">Item Unit</th>
            <th className="font-montserrat   text-xs text-left">
              Buying Rate/Price
            </th>
            <th className="font-montserrat  text-xs text-left">Qty in Stock</th>
          </thead>

          {filteredData.length === 0 ? (
            <tbody>
              <tr>
                <td className="font-montserrat font-bold">No data found</td>
              </tr>
            </tbody>
            ) : (
            currentData.map((item, index) => {
              return (
                <tbody>
                  <tr
                    onClick={(e) => {
                      if (!e.target.closest(".toggle")) {
                        setOpenItem(true);
                        setItemId(item.id)
                      }
                    }}
                    style={{ zIndex: 10 }}
                    className="cursor-pointer table-hover"
                  >
                    <td className="font-montserrat text-xs cursor-pointer">
                      {index + 1}
                    </td>
                    <td className="font-montserrat flex items-center gap-2 text-xs">
                      <span>{ item.name }</span>
                    </td>
                    <td className="font-montserrat text-xs">{ item.description }</td>
                    <td className="font-montserrat text-xs">{ item.type }</td>
                    <td className="font-montserrat text-xs">{ item.partNumber }</td>
                    <td className="font-montserrat text-xs">{ Util.formAmount(item.sellingPrice) }</td>
                    <td className="font-montserrat text-xs">
                      <span
                        className={`py-2 flex justify-center  w-20 items-center  ${
                          item.active == true ? "bg-primary" : "bg-gray-300"
                        } px-4`}
                        style={{ borderRadius: 10 }}
                      >
                        {item.active == true ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="font-montserrat text-xs">
                      <span>{ item.unit }</span>
                    </td>
                    <td className="font-montserrat text-xs">
                      <span>{ Util.formAmount(item.buyingPrice) }</span>
                    </td>
                    <td className="font-montserrat flex items-center text-xs gap-3"
                      // style={{ pointerEvents: 'none' }}
                    >
                      <span>{ item.quantity }</span>
                      <IconButton className="delete-item"
                        onMouseDown={(e) => {
                          closeDeleteModal(e)
                          setItemId(item.id)
                        }}
                      >
                        <img
                          src={TrashIcon}
                          alt=""
                          className="w-[15px] cursor-pointer"
                        />
                      </IconButton>

                      <IconButton
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          setEditMode(true);
                          setOpenAddNewItem(true);
                          setItemId(item.id)
                        }}
                      >
                        <GrEdit
                          size={13}
                          className="cursor-pointer"
                        />
                      </IconButton>

                      <IconButton
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleDisableItem(item)
                        }}
                        className="toggle"
                      >
                        {item.active 
                          ? <ToggleOn
                              sx={{fontSize: '28px', color: "#FAA21B"}} 
                            /> 
                          : <ToggleOff
                              sx={{fontSize: '28px', color: "#424242"}} 
                            />}
                      </IconButton>
                    </td>
                  </tr>
                </tbody>
              );
            }))
          }
        </table>
      </div>

      <div className="flex gap-5 justify-between md:flex-row flex-col w-full mt-4">
        <TableActionButton
          icon={DownloadIcon}
          title=" Export Items"
          className="hidden md:flex"
        />

        <div className="flex items-center gap-3">
          {filteredData.length !== 0 && (<Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />)}
        </div>
      </div>
      <DeleteModal
        deletemodal={deletemodal}
        setDeletemodal={setDeletemodal}
        title="Delete Record Inventory "
        description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
        closeDeleteModal={closeDeleteModal}
        itemId={itemId}
        setItemId={setItemId}
      />

      <EditInventory
        editMode={editMode}
        setEditMode={setEditMode}
        openEditInventory={openAddNewItem}
        setOpenInventory={setOpenAddNewItem}
        itemId={itemId}
        setItemId={setItemId}
      />
      <ItemDetailsModal
        openItem={openItem}
        setOpenItem={setOpenItem}
        itemId={itemId}
        setItemId={setItemId}
      />
    </DashboardWrapper>
  );
};

export default Inventory;
