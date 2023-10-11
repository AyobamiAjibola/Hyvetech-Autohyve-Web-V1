import React from "react";
import SearchIcon from "../../assets/svgs/vuesax/linear/search-normal.svg";

const SearchInput = ({ placeholder = "search", handleSearchChange, searchQuery }) => {
  return (
    <div className="search w-[100%] mb-3">
      <form action="">
        <div className="prepend">
          <img src={SearchIcon} alt="" />
          <input
            type="text"
            placeholder={placeholder}
            className="bg-gray-100 w-full md:w-2/3 h-[50px] searchInput"
            style={{ border: 0 }}
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
