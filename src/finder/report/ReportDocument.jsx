import React, { useEffect, useState } from "react";
import { getFetch, orderBy } from "../../utils/functions";
import MyBootstrapTable from "../../components/Tables/MyBootstrapTable";
import { format_date } from "../../utils/Formatter";
import Button from "react-bootstrap/Button";

const ReportDocument = ({ match }) => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState();

  const [employees, setEmployees] = useState([]);
  const [reqSuperior, setReqSuperior] = useState(false);

  useEffect(() => {
    const id = match.params.id;

    getFetch(`/document/report/${id}`).then((res) => {
      console.log("res", res);
      console.log("id", id);
      const rep = res.find((r) => {
        console.log("r", r);
        return r.id == id;
      });
      console.log("rep", rep);
      prepareReport(rep);

      if (res.length > 1) {
        setReports(res);
      }
    });
  }, []);

  const prepareReport = (res) => {
    console.log("prepare", res);
    setActiveReport(res);
    setReqSuperior(res.require_superior);

    setEmployees(
      res.signatures.map((sign) => {
        const { employee: e } = sign;
        return {
          id: sign.employee_id,
          name: `${e.first_name} ${e.last_name}`,
          e_date: format_date(sign.e_date),
          s_date: format_date(sign.s_date),
        };
      })
    );
  };

  let columns = [
    {
      dataField: "name",
      text: "Full name",
      sort: true,
    },
    {
      dataField: "e_date",
      text: "Sign Date",
      sort: true,
    },
  ];

  if (reqSuperior) {
    columns = [
      ...columns,
      {
        dataField: "s_date",
        text: "Superior",
        sort: true,
      },
    ];
  }

  const title = `Prezencna listina`;

  const ReportLink = ({ rep }) => {
    const row = `${rep.name}, version: ${rep.version}, date: ${format_date(
      rep.release_date
    )}`;
    return (
      <p>
        {rep.id === activeReport?.id ? (
          <span>{row}</span>
        ) : (
          <Button variant="link" onClick={() => prepareReport(rep)}>
            {row}
          </Button>
        )}
      </p>
    );
  };

  return (
    <div>
      {reports.map((rep) => (
        <ReportLink rep={rep} />
      ))}
      <MyBootstrapTable
        title={title}
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

export default ReportDocument;
