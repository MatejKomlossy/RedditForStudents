import React, { useContext, useEffect, useState } from "react";
import { getFetch, orderBy } from "../../utils/functions";
import MyBootstrapTable from "../../components/Tables/MyBootstrapTable";
import { format_date } from "../../utils/Formatter";
import { PairContext } from "../../App";

const ReportTraining = ({ match }) => {
  const pairs = useContext(PairContext);
  console.log("pairs", pairs);

  const [preData, setPreData] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const id = match.params.id;

    getFetch(`/training/report/${id}`).then((res) => {
      console.log("res", res);
      setPreData([
        {
          label: "Názov školenia:",
          value: res.name,
        },
        {
          label: "Dátum a miesto konania školenia:",
          value: format_date(res.date) + " " + res.place,
        },
        {
          label: "Názov vzdelávacej agentúry:",
          value: res.agency,
        },
        {
          label: "Meno a priezvisko školiteľa:",
          value: res.lector,
        },
        {
          label: "Podpis školiteľa:",
          value: "?",
        },
      ]);

      setEmployees(
        res.signatures.map((sign) => {
          const e = sign.employee;
          return {
            id: e.id,
            name: `${e.first_name} ${e.last_name}`,
            date: format_date(sign.date),
            department: pairs.departments.find(
              (dep) => dep.id === e.department_id
            )?.name,
          };
        })
      );
    });
  }, []);

  const columns = [
    {
      dataField: "name",
      text: "Full name",
      sort: true,
    },
    {
      dataField: "department",
      text: "Department",
      sort: true,
    },
    {
      dataField: "date",
      text: "Sign Date",
      sort: true,
    },
  ];

  const title = `Prezencna listina`;

  const preColumns = [
    {
      dataField: "label",
      text: "",
    },
    {
      dataField: "value",
      text: "",
    },
  ];

  return (
    <div>
      <MyBootstrapTable
        title={title}
        data={preData}
        columns={preColumns}
        defaultSorted={orderBy("name")}
        headerClasses="d-none"
        classes="report"
      />
      <br />
      <MyBootstrapTable
        data={employees}
        columns={columns}
        defaultSorted={orderBy("name")}
        // horizontal scroll
        wrapperClasses="table-responsive"
        rowClasses="text-nowrap"
      />
    </div>
  );
};

export default ReportTraining;
