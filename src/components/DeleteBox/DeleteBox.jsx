import { IconButton } from "@mui/material";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
const DeleteBox = ({onClick}) => {
  return (
    <div className="trash-btn flex items-center justify-center p-3 rounded-[15px] h-12">
      <IconButton onClick={onClick}>
        <HiOutlineTrash color="#fff" size={20} />
      </IconButton>
    </div>
  );
};

export default DeleteBox;
