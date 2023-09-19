import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
const DeleteBox = () => {
  return (
    <div className="trash-btn flex items-center justify-center p-3 rounded-[15px] h-12">
      <HiOutlineTrash color="#fff" size={20} />
    </div>
  );
};

export default DeleteBox;
