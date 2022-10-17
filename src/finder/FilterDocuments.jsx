import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { PairContext } from "../App";
import {
  getFetch,
  getOptionsForSelect,
  postFetch,
  prepareFoundDocs,
  resolveFilter,
} from "../utils/functions";
import { proxy_url } from "../utils/data";

const FilterDocuments = ({
  employees,
  showSM,
  setShowSM,
  setSMData,
  setDocuments,
  getAllRecords,
}) => {
  const pairs = useContext(PairContext);
  const [person, setPerson] = useState(initPerson);

  const optionsStructure = getOptionsForSelect(pairs);
  const [combination, setCombinations] = useState(initCombination);

  const [searchType, setSearchType] = useState("structure");
  const [searched, setSearched] = useState(false);

  const handleSearch = (type, toggle) => {
    setSearched(true);
    setSearchType(type);

    let sm = showSM;
    if (toggle) {
      sm = !showSM;
      setShowSM((prev) => !prev);
    }

    sm ? searchForMatrix(type) : searchForTable(type);
  };

  const searchForTable = (type) => {
    console.log("searching for TABLE", type);
    type === "person" ? tableByPerson() : tableByCombination();
  };

  const tableByPerson = () => {
    if (!person.employee) {
      getAllRecords();
      return;
    }

    const id = person.employee.value;
    getFetch(`/document/manager/${id}`)
      .then((res) => {
        console.log("tableByPerson", res);
        setDocuments(prepareFoundDocs(res, pairs));
      })
      .catch((e) => {
        setDocuments([]);
      });
  };

  const tableByCombination = () => {
    const filter = resolveFilter(combination);
    postFetch(`/document/filter`, JSON.stringify(filter)).then((res) => {
      console.log("tableByCombination", res);
      setDocuments(prepareFoundDocs(res, pairs));
    });
  };

  const searchForMatrix = (type) => {
    console.log("searching for MATRIX", type);
    type === "person" ? matrixByPerson() : matrixByCombination();
  };

  const matrixByPerson = () => {
    fetch(proxy_url + `/skill/matrix`, {
      method: "POST",
      body: new URLSearchParams(`superior_id=${person.employee.value}`),
    })
      .then((result) => result.json())
      .then((res) => {
        console.log("matrixByPerson", res);
        setSMData(res);
      });
  };

  const matrixByCombination = () => {
    const filter = resolveFilter(combination);
    fetch(proxy_url + `/skill/matrix`, {
      method: "POST",
      body: new URLSearchParams(`filter=${JSON.stringify(filter)}`),
    })
      .then((result) => result.json())
      .then((res) => {
        console.log("matrixByCombination", res);
        setSMData(res);
      });
  };

  const getBtnStyle = (type) => {
    const colors = searched && searchType === type ? activeBtn : passiveBtn;
    return {
      border: "none",
      width: "10%",
      ...colors,
    };
  };

  const selectPerson = (data, { name: field }) => {
    setSearched(false);
    setPerson({ ...person, [field]: data });
  };

  const selectorPerson = () => (
    <div style={style}>
      <Select
        isClearable
        value={person.employee}
        name={"employee"}
        placeholder={"Select employee"}
        options={employees}
        onChange={(data, p) => selectPerson(data, p)}
      />
    </div>
  );

  const selectStructure = (data, { name: field }) => {
    setSearched(false);
    setCombinations({ ...combination, [field]: data });
  };

  const selectorStructure = (name) => (
    <div style={style}>
      <Select
        isClearable
        isMulti
        value={combination[name]}
        name={name}
        placeholder={`Select ${name}`}
        options={optionsStructure[name]}
        onChange={(data, s) => selectStructure(data, s)}
      />
    </div>
  );

  return (
    <Form style={{ marginLeft: "16px" }}>
      {/* EMPLOYEE ROW*/}
      <Row className="pb-2">
        <Button
          style={getBtnStyle("person")}
          onClick={() => handleSearch("person")}
        >
          {showSM ? "Search manager" : "Search employee" }
        </Button>
        {selectorPerson()}
        <Col className="text-right pr-0">
          <Button
            className="mr-3"
            variant="primary"
            onClick={() => handleSearch(searchType, true)}
          >
            {`Show ${showSM ? "table" : "skill matrix"}`}
          </Button>
        </Col>
      </Row>
      {/* STRUCTURE ROW*/}
      <Row>
        <Button
          style={getBtnStyle("structure")}
          onClick={() => handleSearch("structure")}
        >
          Search combination
        </Button>
        {selectorStructure("branches")}
        {selectorStructure("divisions")}
        {selectorStructure("departments")}
        {selectorStructure("cities")}
      </Row>
    </Form>
  );
};

const initCombination = {
  branches: [],
  cities: [],
  departments: [],
  divisions: [],
};

const initPerson = {
  employee: "",
  lector: "",
};

const style = {
  width: "22%",
  marginLeft: "5px",
};

const activeBtn = {
  backgroundColor: "#f3c404f2",
  color: "black",
};

const passiveBtn = {
  backgroundColor: "#343a40",
};

export default FilterDocuments;
