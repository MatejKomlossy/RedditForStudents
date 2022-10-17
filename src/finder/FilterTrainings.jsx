import React, { useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { getFetch, postFetch } from "../utils/functions";

const FilterTrainings = ({ employees, setTrainings, getAllRecords }) => {
  const [lectors, setLectors] = useState([]); // all lectors
  const [persons, setPersons] = useState({
    employee: "",
    lector: "",
  });

  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getFetch("/lectors/all").then((res) => {
      setLectors(
        res.map((l) => {
          console.log("lector", l);
          return { value: l, label: l };
        })
      );
    });
  }, []);

  const selectPerson = (data, { name: field }) => {
    setSearched(false);
    setPersons({ ...persons, [field]: data });
  };

  const handleSearch = () => {
    setSearched(true);

    if (!persons.employee && !persons.lector) {
      getAllRecords();
      return;
    }
    console.log(
      "post",
      `${JSON.stringify({
        employee: "" + persons.employee?.value || "",
        lector: persons.lector?.value || "",
      })}`
    );
    postFetch(
      `/training/filter`,
      `${JSON.stringify({
        employee: "" + persons.employee?.value || "",
        lector: persons.lector?.value || "",
      })}`
    ).then((res) => {
      console.log("found trainings", res);
      setTrainings(res);
    });
  };

  const getBtnStyle = () => {
    const colors = searched ? activeBtn : passiveBtn;
    return {
      border: "none",
      width: "10%",
      ...colors,
    };
  };

  const selectorPerson = (name, options, value) => (
    <div style={style}>
      <Select
        isClearable
        value={value}
        name={name}
        placeholder={`Select ${name}`}
        options={options}
        onChange={(data, p) => selectPerson(data, p)}
      />
    </div>
  );

  return (
    <Form style={{ marginTop: "3rem", marginLeft: "14px" }}>
      <Row>
        <Button style={getBtnStyle()} onClick={handleSearch}>
          Search trainings
        </Button>
        {selectorPerson("employee", employees, persons.employee)}
        {selectorPerson("lector", lectors, persons.lector)}
      </Row>
    </Form>
  );
};

const style = {
  width: "20%",
  marginLeft: "4px",
};

const activeBtn = {
  backgroundColor: "#f3c404f2",
  color: "black",
};

const passiveBtn = {
  backgroundColor: "#343a40",
};

export default FilterTrainings;
