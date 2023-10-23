import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { defaultStaticRanges } from "./defaultRanges";
import { format } from "date-fns";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import "./Datepicker.css";

import PropTypes from "prop-types";
import AppBtn from "../../components/AppBtn/AppBtn";

const DateRangeSelector = ({ ranges, onChange, onSubmit, setCalenderStart, setCalenderEnd, 
     setOpenStart, setStartDate, setEndDate, startDate, endDate, setReload, ...rest }) => {
     const [selectedDateRange, setSelectedDateRange] = useState({
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
          color: '#faa21b'
     });

     function formatDateDisplay(date, defaultText) {
          if (!date) return defaultText;
          return format(date, "MM/DD/YYYY");
     }

     const handleSelect = ranges => {
          setSelectedDateRange(ranges.selection);
          setStartDate(ranges.selection.startDate);
          setEndDate(ranges.selection.endDate);
          setCalenderStart(format(ranges.selection.startDate, "MM/dd/yyyy"));
          setCalenderEnd(format(ranges.selection.endDate, "MM/dd/yyyy"));

     };

     const dateRef = useRef(null);
   
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

     const onClickClear = () => {
          setSelectedDateRange({
               startDate: new Date(),
               endDate: new Date(),
               key: "selection"
          });
          setCalenderStart('')
          setCalenderEnd('')
          setStartDate(null)
          setEndDate(null)
          setOpenStart(false)
          setReload(true)
     };

     return (
          <React.Fragment>
               <div className="shadow d-inline-block" ref={dateRef}>
                    <DateRangePicker
                         onChange={handleSelect}
                         showSelectionPreview={true}
                         moveRangeOnFirstSelection={false}
                         months={1}
                         ranges={[selectedDateRange]}
                         direction="vertical"
                    />
                    <div className="mt-2 flex justify-end items-end pb-1 gap-4 pr-2">
                         <AppBtn
                              title={"Close"}
                              className='btn-primary'
                              onClick={() => setOpenStart(false)}
                         />
                         <AppBtn
                              title={"Clear"}
                              className='btn-primary'
                              onClick={onClickClear}
                         />
                    </div>
               </div>
          </React.Fragment>
     );
};

DateRangeSelector.defaultProps = {
     ranges: defaultStaticRanges
};

DateRangeSelector.propTypes = {
     /**
      * On Submit
      */
     onSubmit: PropTypes.func
};

export default DateRangeSelector;
