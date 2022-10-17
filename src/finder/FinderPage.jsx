import React, { useContext, useEffect, useState } from "react";
import FilterDocuments from "./FilterDocuments";
import SkillMatrix from "./skill-matrix/SkillMatrix";
import {
  getFetch,
  prepareEmployees,
  prepareFoundDocs,
} from "../utils/functions";
import FoundDocuments from "./FoundDocuments";
import FoundTrainings from "./FoundTrainings";
import FilterTrainings from "./FilterTrainings";
import { PairContext } from "../App";

const FinderPage = () => {
  const pairs = useContext(PairContext);
  const [employees, setEmployees] = useState([]);

  const [showSM, setShowSM] = useState();
  const [SMData, setSMData] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [trainings, setTrainings] = useState([]);

  useEffect(() => {
    getAllRecords();
  }, []);

  useEffect(() => {
    getFetch("/employees/all").then((res) => {
      setEmployees(prepareEmployees(res, pairs.departments));
    });
  }, [pairs]);

  const getAllRecords = () => {
    getFetch("/document/actual").then((res) => {
      setDocuments(prepareFoundDocs(res, pairs));
    });
    getFetch("/training/all").then((res) => {
      setTrainings(res);
    });
  };

  return (
    <div style={{ marginTop: "1%" }} className="finder">
      <FilterDocuments
        employees={employees}
        showSM={showSM}
        setShowSM={setShowSM}
        setSMData={setSMData}
        setDocuments={setDocuments}
        getAllRecords={getAllRecords}
      />
      {showSM ? (
        <SkillMatrix SMData={SMData} />
      ) : (
        <>
          <FoundDocuments found={documents} setFound={setDocuments} />
          <FilterTrainings
            employees={employees}
            setTrainings={setTrainings}
            getAllRecords={getAllRecords}
          />
          <FoundTrainings found={trainings} setFound={setTrainings} />
        </>
      )}
    </div>
  );
};

export default FinderPage;
