// import React from "react";

// const AppTabBtn = ({ onClick, title, className, icon, titelClassName }) => {
//   return (
//     <button
// className={
//   ` text-[#000] cursor-pointer gap-3 bg-[#FAA21B] py-4 rounded-[20px]  flex items-center justify-center
// ` + className
// }
// onClick={onClick}
//     >
//       {icon}
//       <span
//         className={
//           ` text-sm inline-block font-medium font-montserrat
//       ` + titelClassName
//         }
//       >
//         {title}
//       </span>
//     </button>
//   );
// };

// export default AppTabBtn;

import React from "react";

interface IProps {
  onClick: any; 
  title: string;
  className: any;
  icon: any;
  type?: any
}

const AppTabBtn = ({ 
  onClick, 
  title, 
  className, 
  icon, 
  type = 'button'
}: IProps) => {
  return (
    <button
      type={type}
      className={
        ` btn-secondary flex items-center justify-center gap-3 md:w-[210px] w-[100%] py-4 rounded-[20px]
    ` + className
      }
      onClick={onClick}
    >
      {icon}
      <span className="font-montserrat font-medium text-sm"> {title}</span>
    </button>
  );
};

export default AppTabBtn;
