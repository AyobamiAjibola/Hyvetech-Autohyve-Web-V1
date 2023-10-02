import React, { useState, useEffect } from "react";
import styles from "./AppSwitch.module.css";

const UserAppSwitch = ({ userId, initialStatus }) => {
  const [checked, setChecked] = useState(initialStatus);
  const [status, setStatus] = useState(initialStatus);
  console.log(initialStatus, 'status')
  const handleChange = (e) => {
    e.stopPropagation();
  
    setChecked(!checked);
    setStatus(checked ? "inactive" : "active");
  };

  useEffect(() => {

    const simulateApiCall = () => {
      setTimeout(() => {
        // Update the status based on the API response
        setStatus(checked ? "active" : "inactive");
      }, 1000); // Simulate a 1-second delay
    };

    simulateApiCall();
  }, [checked]);

  return (
    <label onClick={handleChange} className={`${styles.switch} ${status}`}>
      <input type="checkbox" checked={checked} />
      <span className={styles.slider} />
    </label>
  );
};

export default UserAppSwitch;
