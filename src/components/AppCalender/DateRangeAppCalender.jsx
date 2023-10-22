import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const DateRangeAppCalender = ({ 
  setCalenderStart, setCalenderEnd, 
  setOpenStart, setStartDate, setEndDate, startDate, endDate 
}) => {
  const dateRef = useRef(null);
  // const handleSelect = (date) => {
  //   setCalender(format(date, "MM/dd/yyyy"));
  // };

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideClickOutside, true);
  }, []);

  const hideClickOutside = (e) => {
    if (dateRef.current && !dateRef.current.contains(e.target)) {
      setOpenStart(false);
    }
  };
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpenStart(false);
    }
  };

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
    setCalenderStart(format(ranges.selection.startDate, "MM/dd/yyyy"));
    setCalenderEnd(format(ranges.selection.endDate, "MM/dd/yyyy"));
  };

  const customStaticRanges = [
    {
      label: 'Custom Range',
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
    },
  ];

  return (
    <div style={{ zIndex: 999 }} ref={dateRef}>
      <DateRangePicker
        className="calenderElement2"
        maxDate={new Date()}
        ranges={[
          {
            startDate,
            endDate,
            key: "selection",
            color: '#faa21b'
          },
        ]}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        showSelectionPreview={false}
        showMonthAndYearPickers={false}
      />
    </div>
  );
};

export default DateRangeAppCalender;
