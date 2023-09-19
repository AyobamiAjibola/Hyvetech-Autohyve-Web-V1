import JoditEditor from "jodit-react";
import "./Prefrences.css";
import React, { useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const Prefrences = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("");
  const [checkBoxValue, setCheckBoxValue] = useState([]);
  const data = ["Estimate", "Invoices", "Both"];
  const notificationSettings = ["SMS (N3/sms applies)", "Email", "None"];
  const expenses = [
    " Direct cost (billable)",
    "Indirect cost (non-billable)",
    "Overhead/running cost",
    "Other",
  ];
  const customerNotification = [
    "SMS (carrier charges apply, N3/sms)",
    "SMS (carrier charges apply, N3/sms)",
    "Email",
  ];

  const toggleCarts = (id) => {
    if (checkBoxValue.includes(id)) {
      // already exist
      let _tmp = [];
      for (let i = 0; i < checkBoxValue.length; i++) {
        const __data = checkBoxValue[i];
        console.log(__data, "data", id);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h5 className="font-bold font-montserrat">Terms and Conditions</h5>

        <div>
          <span className="inline-block mb-5 mt-5 text-sm font-montserrat">
            Visibility Settings
          </span>
          <div>
            <div className="dropdown">
              <div
                className="dropdown-btn flex justify-between cursor-pointer"
                onClick={() => setActive(!active)}
              >
                {selected || "Select"}

                <BiChevronDown />
              </div>
              {active && (
                <div className="dropdown-content">
                  {data.map((item, index) => {
                    return (
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          setSelected(item);
                          setActive(!active);
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => {
          setContent(newContent);
        }}
      />

      <div className="flex gap-3 mt-10">
        {notificationSettings.map((item, i) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleCarts(i)}
            >
              {[
                checkBoxValue.includes(i) ? (
                  <div className="w-[31px] h-[31px] flex items-center justify-center border-[#FAA21B] border-[1px] rounded-[8px]">
                    <div className="w-[25px] h-[25px] rounded-[8px] bg-[#FAA21B] border-[1px]"></div>
                  </div>
                ) : (
                  <div className="w-[31px] h-[31px] border-[#000] border-[1px] rounded-[8px]"></div>
                ),
              ]}

              <span className="text-black inline-block pl-5">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Prefrences;
