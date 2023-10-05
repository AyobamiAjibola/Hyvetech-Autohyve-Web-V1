import React, { FC, useState } from "react";
import InputHeader from "../InputHeader/InputHeader";
import { useFormikContext } from "formik";

interface IProps {
  title: string;
  name: string;
}

const UploadBox: FC<IProps> = ({ title, name }) => {
  const [imgName, setImgName] = useState<any>(null);
  const { setFieldValue } = useFormikContext();
  return (
    <div className="w-full mb-5 md:mb-5">
      <InputHeader text={title} />

      {/* <br /> */}
      <div className="mt-1">
        <label className="custom-file-upload w-25 font-montserrat text-[14px]">
          <input
            type="file"
            name={name}
            onChange={(e: any) => {
              setImgName(e.target.files[0].name);
              setFieldValue(name, e.target.files[0]);
            }}
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
