import React, { FC, useState } from "react";
import { BsEyeSlash } from "react-icons/bs";
import InputHeader from "../InputHeader/InputHeader";
import { useField, useFormikContext } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { EyeOutlined } from "@ant-design/icons";

interface IAppInputProps {
  rightImg?: any;
  leftImg?: any;
  placeholderTop: string;
  hasPLaceHolder: boolean;
  placeholder: string;
  value: any;
  onChange?: any;
  className?: any;
  type?: string;
  disabled?: boolean
  name?: any
  onBlur?: any
}

const AppInput = ({
  rightImg,
  leftImg,
  placeholderTop,
  hasPLaceHolder,
  placeholder,
  value,
  onChange,
  className,
  type = "text",
  disabled = false,
  name, onBlur
}: IAppInputProps) => {
  const [pwdfield, setPwdfield] = React.useState(false);

  const togglePassword = (e: any, val: any) => {
    e.preventDefault();

    setPwdfield(val);
  };

  return (
    <>
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}

      <div className="prepend w-full">
        <img src={leftImg} alt="" className="pr-10  inline-block" />
        <input
          onBlur={onBlur}
          name={name}
          disabled={disabled}
          type={pwdfield ? "password" : type}
          className={
            `w-full placeholder-[#A5A5A5] placeholderText h-[55px] font-montserrat
          } ` + className
          }
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
        <button onClick={(e) => togglePassword(e, !pwdfield)}>
          {pwdfield ? (
            <BsEyeSlash color="black" size={25} />
          ) : (
            <img src={rightImg} alt="" />
          )}
        </button>
      </div>
    </>
  );
};

export const SearchAppInput: FC<any> = ({
  rightImg,
  leftImg,
  placeholderTop,
  hasPLaceHolder,
  placeholder,
  className,
  onChange,
  type = "text",
}) => {
  const [pwdfield, setPwdfield] = React.useState(false);

  const togglePassword = (e: any, val: any) => {
    e.preventDefault();

    setPwdfield(val);
  };

  return (
    <>
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}

      <div className="prepend w-full">
        <img src={leftImg} alt="" className="pr-10  inline-block" />
        <input
          type={pwdfield ? "password" : type}
          className={
            `search-input w-full placeholder-[#A5A5A5] placeholderText h-[55px] font-montserrat
          } ` + className
          }
          placeholder={placeholder}
          onChange={onChange}
        />
        <button onClick={(e) => togglePassword(e, !pwdfield)}>
          {pwdfield ? (
            <BsEyeSlash color="black" size={25} />
          ) : (
            <img src={rightImg} alt="" />
          )}
        </button>
      </div>
    </>
  );
};

export const AppInputFormik: FC<any> = ({
  rightImg,
  leftImg,
  placeholderTop,
  hasPLaceHolder,
  placeholder,
  className,
  name = "",
  type = "text",
  formik = null,
  ...props 
}) => {
  const [pwdField, setPwdField] = useState(false);

  const [field, meta] = useField({ ...props,name });


  const togglePassword = (e: any, _: any) => {
    e.preventDefault();

    setPwdField((state) => !state);
  };

  return (
    <div className="mb-5">
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}

      <div className="prepend w-full mb-0">
        <img src={leftImg} alt="" />
        <input
          type={pwdField ? "text" : type}
          className={
            `w-full placeholder-[#A5A5A5] placeholderText font-montserrat
          } ` + className
          }
          placeholder={placeholder}
          {...field}
          {...props}
          value={field.value[name]}
        />

        {type === "password" && (
          <button onClick={(e) => togglePassword(e, !pwdField)}>
            {pwdField ? (
              <BsEyeSlash color="black" size={25} />
            ) : (
              <img src={rightImg} alt="password" />
            )}
          </button>
        )}
      </div>
      {meta?.touched && meta.error ? <div className="error">{}</div> : null}
    </div>
  );
};

export const MyTextInput = ({
  label,
  className,
  leftImg,
  hasPLaceHolder,
  placeholderTop,
  rightImg,
  type = "text",
  disabled = false,
  min,
  ...props
}: any) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [pwdfield, setPwdfield] = useState(false);
  const [field, meta] = useField({...props});
  const togglePassword = (e: any, _: any) => {
    e.preventDefault();

    setPwdfield((state) => !state);
  };

  return (
    <div className="mb-5">
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}
      <div className="prepend w-full mb-0">
        {/* <img src={leftImg} alt="" /> */}
        <input
          className={
            `w-full placeholder-[#A5A5A5] placeholderText font-montserrat
          } ` + className
          }
          {...field}
          {...props}
          type={pwdfield ? "text" : type}
          disabled={disabled}
          min={min}
        />
        {type === "password" && (
          <button onClick={(e) => togglePassword(e, !pwdfield)}>
            {pwdfield ? (
              <BsEyeSlash color="black" size={25} />
            ) : (
              <EyeOutlined color="black" size={25} />
            )}
          </button>
        )}
      </div>

      {meta.touched && meta.error ? (
        <div className="error-input-field text-[red] text-[13px]">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyChangePassInput = ({
  label,
  className,
  leftImg,
  hasPLaceHolder,
  placeholderTop,
  rightImg,
  type = "text",
  disabled = false,
  ...props
}: any) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [pwdfield, setPwdfield] = useState(false);
  const [field, meta] = useField({...props});
  const togglePassword = (e: any, _: any) => {
    e.preventDefault();

    setPwdfield((state) => !state);
  };

  return (
    <div className="mb-5">
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}
      <div className="prepend w-full mb-0">
        {/* <img src={leftImg} alt="" /> */}
        <input
          className={
            `w-full placeholder-[#A5A5A5] placeholderText font-montserrat
          } ` + className
          }
          {...field}
          {...props}
          type={pwdfield ? "text" : type}
          disabled={disabled}
        />
        {type === "password" && (
          <button onClick={(e) => togglePassword(e, !pwdfield)}>
            {pwdfield ? (
              <BsEyeSlash color="black" size={25} />
            ) : (
              <EyeOutlined color="black" size={25} />
            )}
          </button>
        )}
      </div>

      {meta.touched && meta.error ? (
        <div className="error-input-field text-[red] text-[13px] mt-3">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyEmailTextInput = ({
  label,
  className,
  leftImg,
  hasPLaceHolder,
  placeholderTop,
  rightImg,
  type,
  disabled = false,
  ...props
}: any) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField({...props});

  return (
    <div className="mb-5">
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}
      <div className="prepend w-full mb-0">
        <input
          className={
            `w-full placeholder-[#A5A5A5] placeholderText font-montserrat
          } ` + className
          }
          {...field}
          {...props}
          type={type}
          disabled={disabled}
          onKeyDown={(event) => {
            if (event.key === " ") {
              event.preventDefault(); // Prevent input of space
            }
          }}
        />
      </div>

      {meta.touched && meta.error ? (
        <div className="error-input-field ">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MySelect = ({
  options,
  styles,
  placeholder,
  label,
  ...props
}: any) => {
  const [field, meta] = useField(props);

  const { setFieldValue } = useFormikContext();
  return (
    <div>
      {label && <InputHeader text={label} />}
      <Select
        options={options}
        className={props.className}
        styles={styles}
        placeholder={placeholder}
        {...props}
        {...field}
        onChange={(value: any) => {
          setFieldValue(field.name, value);
        }}
      />
      {meta.touched && meta.error ? (
        <div className="error-input-field ">{(meta.error as any).value}</div>
      ) : null}
    </div>
  );
};

export const AppPhoneInput = ({
  label,
  className,
  leftImg,
  hasPLaceHolder,
  placeholderTop,
  rightImg,
  type = "text",
  ...props
}: any) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)

  const [field, meta] = useField(props);

  const { setFieldValue } = useFormikContext();

  return (
    <div className="mb-5">
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}
      <div className="prepend w-full mb-0">
        <img src={leftImg} alt="" />
        <PhoneInput
          inputProps={{ ...props }}
          inputClass={
            `w-full placeholder-[#A5A5A5] placeholderText font-montserrat
          } ` + className
          }
          {...field}
          {...props}
          value={field.value}
          onChange={(value) => {
            setFieldValue(field.name, value);
          }}
          enableSearch
          countryCodeEditable={false}
        />
      </div>

      {meta.touched && meta.error ? (
        <div className="error-input-field ">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const MyTextInputBulk = ({
  label,
  className,
  leftImg,
  hasPLaceHolder,
  placeholderTop,
  rightImg,
  type = "text",
  disabled = false,
  ...props
}: any) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [pwdfield, setPwdfield] = useState(false);
  const [field] = useField({...props});
  const togglePassword = (e: any, _: any) => {
    e.preventDefault();

    setPwdfield((state) => !state);
  };

  return (
    <div className="mb-5">
      {hasPLaceHolder && <InputHeader text={placeholderTop} />}
      <div className="prepend w-full mb-0">
        {/* <img src={leftImg} alt="" /> */}
        <input
          className={
            `w-full placeholder-[#A5A5A5] placeholderText font-montserrat
          } ` + className
          }
          {...field}
          {...props}
          type={pwdfield ? "text" : type}
          disabled={disabled}
        />
        {type === "password" && (
          <button onClick={(e) => togglePassword(e, !pwdfield)}>
            {pwdfield ? (
              <BsEyeSlash color="black" size={25} />
            ) : (
              <EyeOutlined color="black" size={25} />
            )}
          </button>
        )}
      </div>

      {/* {meta.touched && meta.error ? (
        <div className="error-input-field ">{meta.error}</div>
      ) : null} */}
    </div>
  );
};

export default AppInput;
