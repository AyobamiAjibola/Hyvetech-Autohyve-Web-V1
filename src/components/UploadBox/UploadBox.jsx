import React, { useState } from "react";
import InputHeader from "../InputHeader/InputHeader";

const UploadBox = ({ title }) => {
  const [imgName, setImgName] = useState(null);
  return (
    <div className="w-full mb-5 md:mb-5">
      <InputHeader text={title} />

      {/* <br /> */}
      <div className="mt-1">
        <label class="custom-file-upload w-25 font-montserrat text-[14px]">
          <input
            type="file"
            onChange={(e) => setImgName(e.target.files[0].name)}
          />
          {imgName != null ? (
            imgName
          ) : (
            <>
              Drop your file here, or{" "}
              <span className="primary-color">Browse</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default UploadBox;
