import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const SingleAppCalender = ({ setCalender, setOpenStart }) => {
  const dateRef = useRef(null);
  const handleSelect = (date) => {
    setCalender(format(date, "MM/dd/yyyy"));
  };

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

  return (
    <div style={{ zIndex: 999 }} className="absolute" ref={dateRef}>
      <Calendar className="calenderElement2" onChange={handleSelect} />
    </div>
  );
};

export default SingleAppCalender;
