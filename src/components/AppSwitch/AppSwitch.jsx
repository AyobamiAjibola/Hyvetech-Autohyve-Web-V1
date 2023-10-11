import React, { useEffect, useState } from "react";
import styles from "./AppSwitch.module.css";

const AppSwitch = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    e.stopPropagation();
    setChecked(!checked);
  };

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
