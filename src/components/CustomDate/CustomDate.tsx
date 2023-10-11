import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputHeader from "../InputHeader/InputHeader";
// import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";
// import SaveIcon from "@mui/icons-material/Save";
// import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { FaCalendarAlt } from "react-icons/fa";
// import IconButton from "@mui/material/IconButton";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import TextField from "@mui/material/TextField";

const CustomDate = ({ 
  placeholder, 
  className,
  lastDate, onChange
}: any) => {
  // console.log(new Date(lastDate), moment(lastDate).format('YYYY-MM-DD'), 'val')
  return (
    <div
      className={
        `w-full relative flex
    } ` + className
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <InputHeader text={placeholder} />
        <MobileDatePicker
          value={lastDate}
          onChange={onChange}
          sx={{
            width: "100%",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent", // Remove border color
            },
            "& label": {
              fontSize: "10px",
              fontFamily: "montserrat",
              color: "#A5A5A5",
              paddingTop: "5px",
              paddingLeft: "17px",
            },
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent", // Remove border color on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent", // Remove border color on focus
              },
              borderRadius: "20px",
              backgroundColor: "#F5F5F5",

              borderColor: "transparent",
              height: "53px",
              border: "none",
            },
          }}
        />
      </LocalizationProvider>
      <FaCalendarAlt className="absolute right-5 top-4" color="#ccc" />
    </div>
  );
};

export default CustomDate;
