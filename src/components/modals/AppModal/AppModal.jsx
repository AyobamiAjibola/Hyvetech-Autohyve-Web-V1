import React, { useState } from "react";

const AppModal = ({ open, setOpen, children }) => {
  if (open) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  const toggleModal = (e) => {
    if (e.target.id === "modalWrapperId") {
      setOpen(!open);
    }
  };

  return (
    <>
      {open && (
        <div
          id="modalWrapperId"
          onClick={toggleModal}
          className="overlay h-screen w-screen flex fixed justify-center items-center"
        >
          {children}
        </div>
      )}
    </>
  );
};

export default AppModal;
