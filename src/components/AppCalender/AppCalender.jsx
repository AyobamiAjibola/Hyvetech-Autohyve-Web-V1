import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const AppCalender = ({ range, setRange }) => {
  const [orientation, checkOrientation] = useState();

  useEffect(() => {
    checkOrientation(
      window.matchMedia("(max-width: 700px)").matches
        ? "vertical"
        : "horizontal"
    );
  }, [orientation]);

  return (
    <div className="bg-black">
      <DateRange
        onChange={(item) => setRange([item.selection])}
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        ranges={range}
        months={2}
        direction={orientation}
        className="calenderElement"
        rangeColors={["#FAA21B"]}
      />
    </div>
  );
};

export default AppCalender;
