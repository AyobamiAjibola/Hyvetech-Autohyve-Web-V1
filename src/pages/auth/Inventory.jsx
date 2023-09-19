import React, { useState } from "react";
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

const Inventory = () => {
  const tableData = Array(3).fill("");
  const [select, setSelect] = useState("Sort By");
  const [deletemodal, setDeletemodal] = useState(false);
  const closeDeleteModal = (event) => {
    event.stopPropagation();
    setDeletemodal(!deletemodal);
  };
  const [openEditInventory, setOpenInventory] = useState(false);
  const [openAddNewItem, setOpenAddNewItem] = useState(false);
  const [openItem, setOpenItem] = useState(false);

  const openEditItems = (event) => {
    event.stopPropagation();
    setOpenInventory(!openEditInventory);
  };

  const items = [
    "Name (Ascending)",
    "Name (Descending)",
    "Date (Ascending)",
    "Date (Descending)",
  ];

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
          onClick={() => setOpenAddNewItem(true)}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Sorting
          items={items}
          select={select}
          setSelect={setSelect}
          className="w-[100%]"
        />
        <div className="flex gap-3">
          <AppTabBtn
            icon={<AiOutlinePlus />}
            title="Add New Items"
            className="w-[200px] text-[#000] btn-secondary hidden md:flex"
            onClick={() => setOpenAddNewItem(true)}
          />
        </div>
      </div>

      <div className="flex justify-between md:flex-row flex-col items-start md:items-center mt-1 md:mt-16">
        <div className="w-[100%] md:w-[50%]">
          <SearchInput />
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

          {tableData.map((item, index) => {
            return (
              <tbody>
                <tr
                  onClick={() => setOpenItem(true)}
                  style={{ zIndex: 10 }}
                  className="cursor-pointer table-hover"
                >
                  <td className="font-montserrat text-xs cursor-pointer">
                    {index + 1}
                  </td>
                  <td className="font-montserrat flex items-center gap-2 text-xs">
                    <span>Brake Pads (Front)</span>
                  </td>
                  <td className="font-montserrat text-xs">Range Rover, BMW</td>
                  <td className="font-montserrat text-xs">Part</td>
                  <td className="font-montserrat text-xs">EBC124YG</td>
                  <td className="font-montserrat text-xs">45,0000</td>
                  <td className="font-montserrat text-xs">
                    <span
                      className={`py-2 flex justify-center  w-20 items-center  ${
                        index == 1 ? "bg-primary" : "bg-gray-300"
                      } px-4`}
                      style={{ borderRadius: 10 }}
                    >
                      {index == 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="font-montserrat text-xs">
                    <span>pcs</span>
                  </td>
                  <td className="font-montserrat text-xs">
                    <span>10,500</span>
                  </td>
                  <td className="font-montserrat flex items-center gap-3 text-xs">
                    <span>2</span>

                    <img
                      src={TrashIcon}
                      alt=""
                      className="w-[15px] cursor-pointer"
                      onClick={closeDeleteModal}
                    />

                    <GrEdit size={13} onClick={openEditItems} />

                    <AppSwitch />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>

      <div className="flex gap-5 justify-between md:flex-row flex-col w-full mt-4">
        <TableActionButton
          icon={DownloadIcon}
          title=" Export Items"
          className="hidden md:flex"
        />

        <div className="flex items-center gap-3">
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
      </div>
      <DeleteModal
        deletemodal={deletemodal}
        setDeletemodal={setDeletemodal}
        title="Delete Record Inventory "
        description="Are you sure you want to carry out this action? If you proceed, you will not be able to undo this action."
        closeDeleteModal={closeDeleteModal}
      />

      <EditInventory
        title="Edit Inventory Items"
        btnTitle="SAVE"
        openEditInventory={openEditInventory}
        setOpenInventory={setOpenInventory}
      />

      <EditInventory
        title="Create New Inventory  Items"
        btnTitle="CREATE"
        openEditInventory={openAddNewItem}
        setOpenInventory={setOpenAddNewItem}
      />
      <ItemDetailsModal openItem={openItem} setOpenItem={setOpenItem} />
    </DashboardWrapper>
  );
};

export default Inventory;
