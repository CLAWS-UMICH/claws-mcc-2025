import React from "react";
import {
  Dropdown,
  makeStyles,
  Option,
  Button,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "300px",
  },
  label: {
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: 600,
  },
  dropdown: {
    width: "100%",
  },
  button: {
    alignSelf: "center",
    marginTop: "16px",
  },
});

const QuickShare: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div>
        <label className={styles.label}>Send to Astronaut 1</label>
        <Dropdown placeholder="Select an option" className={styles.dropdown}>
          <Option>Choose image only</Option>
          <Option>Choose instructions only</Option>
          <Option>Choose image and instructions</Option>
        </Dropdown>
      </div>
      <div>
        <label className={styles.label}>Send to Astronaut 2</label>
        <Dropdown placeholder="Select an option" className={styles.dropdown}>
          <Option>Choose image only</Option>
          <Option>Choose instructions only</Option>
          <Option>Choose image and instructions</Option>
        </Dropdown>
      </div>
      <Button className={styles.button} appearance="primary">
        QuickShare
      </Button>
    </div>
  );
};

export default QuickShare;
