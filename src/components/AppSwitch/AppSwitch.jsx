import React, { useState } from "react";
import styles from "./AppSwitch.module.css";

const AppSwitch = ({ userId }) => {
  const [checked, setChecked] = useState(false);
  const handleChange = (e) => {
    e.stopPropagation();
    setChecked(!checked);
  };
  console.log(userId, 'id')
  

  return (
    <label
      onClick={handleChange}
      className={styles.switch}
      style={{ zIndex: 999 }}
    >
      <input type="checkbox" />
      <span className={styles.slider} />
    </label>
  );
};

export default AppSwitch;
