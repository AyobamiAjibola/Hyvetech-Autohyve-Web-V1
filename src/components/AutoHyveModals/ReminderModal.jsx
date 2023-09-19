import React, { useState } from "react";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import Sorting from "../Sorting/Sorting";
import SearchInput from "../SearchInput/SearchInput";
import { GrEdit } from "react-icons/gr";
import AppSwitch from "../AppSwitch/AppSwitch";
import NewReminderModal from "./NewReminderModal";
import ModalHeaderTitle from "../ModalHeaderTitle/ModalHeaderTitle";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TableCountTitile from "../TableCountTitile/TableCountTitile";

const ReminderModal = ({ openReminder, setOpenReminder }) => {
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const [openNewReminder, setOpenNewReminder] = useState(false);
  const [select, setSelect] = useState("Sort By");
  const tableData = Array(3).fill("");

  // const node = useRef();
  const data = [
    "Independent Technician",
    "Single workshop",
    "Workshop Chain",
    "Others",
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 600,
    outline: "none",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "transparent",
    borderRadius: 5,
    boxShadow: 24,
    py: 5,
    pr: 2,
    pl: 2,
  };

  const handleClose = () => setOpenReminder(false);

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

  const items = [
    "Name (Ascending)",
    "Name (Descending)",
    "Date (Ascending)",
    "Date (Descending)",
  ];

  return (
    <>
      <Modal
        open={openReminder}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header pt-0 bg-white px-8">
            <div className="flex justify-between w-full">
              <ModalHeaderTitle title="Reminders" />

              <button onClick={() => setOpenReminder(false)}>
                <img src={CloseIcon} alt="" />
              </button>
            </div>

            <div className="mt-10">
              <Sorting items={items} select={select} setSelect={setSelect} />
            </div>

            <div className="mt-8 flex gap-8 flex-col justify-center">
              <div className="flex flex-col md:flex-row items-center justify-between  w-full gap-4">
                <div className="w-[60%]">
                  <SearchInput />
                </div>

                <TableCountTitile />
              </div>
            </div>

            <div className="mt-4" style={{ overflowX: "scroll" }}>
              <table
                className="w-[1600px]"
                border={1}
                style={{
                  borderRadius: 20,
                  overflow: "clip",
                }}
              >
                <thead>
                  <th className="font-montserrat    text-xs text-left">
                    <div className="w-[20px] h-[18px] border-[#000] border-[1px] rounded-[5px]"></div>
                  </th>
                  <th className="font-montserrat    text-xs text-left">S/N</th>
                  <th className="font-montserrat    text-xs text-left">Type</th>
                  <th className="font-montserrat    text-xs text-left">
                    Customer Name
                  </th>
                  <th className="font-montserrat text-xs text-left">Type</th>
                  <th className="font-montserrat     text-xs text-left">
                    Vehicle
                  </th>
                  <th className="font-montserrat    text-xs text-left">
                    Last Service Date
                  </th>
                  <th className="font-montserrat   text-xs text-left">
                    Status
                  </th>
                  <th className="font-montserrat   text-xs text-left">
                    Status
                  </th>

                  <th className="font-montserrat  text-xs text-left">
                    Actions
                  </th>
                </thead>

                {tableData.map((item, index) => {
                  return (
                    <tbody>
                      <tr
                        //   onClick={() => setOpenItem(true)}
                        className="cursor-pointer table-hover"
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
                          <span>{index + 1}</span>
                        </td>
                        <td className="font-montserrat text-xs">
                          Brake Service
                        </td>
                        <td className="font-montserrat text-xs">
                          Demo Customer
                        </td>
                        <td className="font-montserrat text-xs">EBC124YG</td>
                        <td className="font-montserrat text-xs">
                          1983 Mercedes-Benz 240
                        </td>
                        <td className="font-montserrat text-xs">
                          <span>16/05/2023</span>
                        </td>
                        <td className="font-montserrat text-xs">
                          <span>Overdue by 1 week(s)</span>
                        </td>
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

                        <td className="font-montserrat flex items-center gap-3 text-xs">
                          <GrEdit
                            size={13}
                            onClick={() => setOpenNewReminder(true)}
                          />

                          <AppSwitch />
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </Box>
      </Modal>

      <NewReminderModal
        openNewReminder={openNewReminder}
        setOpenNewReminder={setOpenNewReminder}
      />
    </>
  );
};

export default ReminderModal;
