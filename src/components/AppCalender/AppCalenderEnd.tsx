import React from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const AppCalenderEnd = ({ setCalender, setOpenStart, openStart }: any) => {
  const handleSelect = (date: any) => {
    setCalender(format(date, "MM/dd/yyyy"));
    setOpenStart(!openStart);
  };
  return (
    <div>
      <Calendar className="calenderElement2" onChange={handleSelect} />
    </div>
  );
};

export default AppCalenderEnd;
