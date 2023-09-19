import React, { useState } from "react";
// import dayjs from "dayjs";

import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import CloseIcon from "../../assets/svgs/close-circle.svg";
import { generateDate, months } from "../utils/calender";
import cn from "../utils/cn";

const CustomDatePickerModal = ({ openDate, setOpenDate }) => {
  if (openDate) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setOpenDate(!openDate);
    }
  };

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  // const currentDate = dayjs();
  const currentDate = '';
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);

  if (!openDate) {
    return null;
  }

  return (
    <div
      id="modalWrapperId"
      className="fixed top-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center customModal"
      onClick={toggleModal}
    >
      <div className="flex gap-10 sm:divide-x justify-center md:w-auto w-[90%]  sm:w-1/2 mx-auto rounded-md py-10 h-auto items-center sm:flex-row flex-col bg-white p-2 relative">
        <div className=" ">
          <button
            onClick={() => setOpenDate(false)}
            className="absolute right-5 top-2"
          >
            <img src={CloseIcon} alt="" />
          </button>
          <div className="flex justify-between items-center mt-10">
            <h1 className="select-none font-semibold">
              {months[today.month()]}, {today.year()}
            </h1>
            <div className="flex gap-10 items-center ">
              <GrFormPrevious
                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(today.month(today.month() - 1));
                }}
              />
              <h1
                className=" cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(currentDate);
                }}
              >
                Today
              </h1>
              <GrFormNext
                className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setToday(today.month(today.month() + 1));
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-7 ">
            {days.map((day, index) => {
              return (
                <h1
                  key={index}
                  className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
                >
                  {day}
                </h1>
              );
            })}
          </div>

          <div className=" grid grid-cols-7">
            {generateDate(today.month(), today.year()).map(
              ({ date, currentMonth, today }, index) => {
                return (
                  <div
                    key={index}
                    className="p-2 text-center h-14 grid place-content-center text-sm border-t"
                  >
                    <h1
                      className={cn(
                        currentMonth ? "" : "text-gray-400",
                        today ? "bg-red-600 text-white" : "",
                        selectDate.toDate().toDateString() ===
                          date.toDate().toDateString()
                          ? "bg-black text-white"
                          : "",
                        "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                      )}
                      onClick={() => {
                        setSelectDate(date);
                      }}
                    >
                      {date.date()}
                    </h1>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDatePickerModal;
