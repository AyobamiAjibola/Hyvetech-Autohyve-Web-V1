import React from "react";
import "./modal.css";
import AppBtn from "../AppBtn/AppBtn";

const CustomModal = () => {
  return (
    <div className="fixed top-0 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center customModal">
      <div className="bg-white p-2 rounded-sm h-[50%] w-[80%] md:w-[30%] overflow-y-auto ">
        <div className="">
          <div className=" flex flex-col mt-4 justify-center items-center px-4 md:px-10">
            <div className="w-full mb-1 md:mb-3">
              <label className="text-sm font-montserrat" htmlFor="">
                {" "}
                Business Name
              </label>{" "}
              <br />
              <input
                type="text"
                placeholder="Enter business name"
                className="bg-gray-100 w-full sm"
                style={{ border: 0 }}
              />
            </div>

            <div className="w-full mb-1 md:mb-1">
              <label htmlFor="" className="font-montserrat">
                {" "}
                Valid Identity Card (Front)
              </label>{" "}
              <br />
              <div className="mt-1">
                <label class="custom-file-upload w-25 font-montserrat">
                  <input type="file" />
                  Drop your file here, or{" "}
                  <span className="primary-color">Browse</span>
                </label>
              </div>
            </div>

            <div className="w-full mb-1 md:mb-1">
              <label htmlFor="" className="font-montserrat">
                {" "}
                Valid Identity Card (Back)
              </label>{" "}
              <br />
              <div className="mt-1">
                <label className="custom-file-upload w-25 font-montserrat">
                  <input type="file" />
                  Drop your file here, or{" "}
                  <span className="primary-color font-montserrat">Browse</span>
                </label>
              </div>
            </div>

            <div className="w-full mb-1 md:mb-1">
              <label htmlFor="" className="font-montserrat">
                {" "}
                CAC Document
              </label>{" "}
              <br />
              <div className="mt-1">
                <label class="custom-file-upload w-25">
                  <input type="file" />
                  Drop your file here, or{" "}
                  <span className="primary-color font-montserrat">Browse</span>
                </label>
              </div>
            </div>

            <div className="w-full mb-1 md:mb-1">
              <label htmlFor="" className="font-montserrat">
                {" "}
                National Identity Number(NIN)
              </label>{" "}
              <br />
              <input
                type="number"
                placeholder="Enter NIN"
                className="bg-gray-100 w-full sm"
                style={{ border: 0 }}
              />
            </div>

            <div className="w-full mb-1 md:mb-2">
              <label htmlFor="" className="font-montserrat">
                BVN
              </label>{" "}
              <br />
              <input
                type="number"
                placeholder="Enter BVN"
                className="bg-gray-100 w-full sm"
                style={{ border: 0 }}
              />
            </div>

            <AppBtn
              title="Activate"
              className="bg-[#FAA21B] text-[#000] w-full mt-5"
              onClick={() => activation()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
