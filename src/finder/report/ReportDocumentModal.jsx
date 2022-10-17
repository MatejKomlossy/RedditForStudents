import React, { useEffect, useRef, useState } from "react";
import {
  getFetch,
  getTimestamp,
  orderBy,
  postFetch,
} from "../../utils/functions";
import MyBootstrapTable from "../../components/Tables/MyBootstrapTable";
import { format_date } from "../../utils/Formatter";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useReactToPrint } from "react-to-print";

const ReportDocumentModal = ({ id, closeModal }) => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState();

  const [employees, setEmployees] = useState([]);
  const [reqSuperior, setReqSuperior] = useState(false);

  const [preData, setPreData] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getFetch(`/document/report/${id}`).then((res) => {
      console.log("report data", res);

      const rep = res.find((r) => r.id == id);
      prepareReport(rep);

      if (res.length > 1) {
        const sorted = res.sort(function (a, b) {
          return a.id - b.id;
        });
        setReports(sorted);
      }
    });
  }, []);

  const prepareReport = (res) => {
    setActiveReport(res);
    setReqSuperior(res.require_superior);

    setPreData([
      {
        label: "Názov dokumentu:",
        value: res.name,
      },
    ]);

    if (res.require_superior) {
      let superiors = [];
      res.signatures.forEach((sign) => {
        if (sign.superior_id !== 0) {
          superiors.push(sign.superior_id);
        }
      });
      superiors = `[${superiors.join(",")}]`;

      postFetch(`/employees/ids`, JSON.stringify({ ids: superiors })).then(
        (res2) => {
          console.log("res", res2);
          setPreData((prev) => [
            ...prev,
            {
              label: "Školiteľ:",
              value: res2
                .map((s) => s.first_name + " " + s.last_name)
                .join(", "),
            },
          ]);
        }
      );
    }

    const emps = res.signatures.map((sign) => {
      const { employee: e } = sign;
      return {
        id: sign.employee_id,
        name: `${e.first_name} ${e.last_name}`,
        e_date: format_date(sign.e_date),
        s_date: format_date(sign.s_date),
      };
    });

    // setEmployees([...emps, ...emps, ...emps]);
    setEmployees(emps);
  };

  const title = `Prezenčná listina`;

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

  const columns = [
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
    columns.push({
      dataField: "s_date",
      text: "Superior",
      sort: true,
    });
  }

  const ReportLink = ({ rep }) => {
    const row = `${rep.name}, version: ${rep.version}, date: ${format_date(
      rep.release_date
    )}`;
    return (
      <p style={{ marginBottom: "4px", marginRight: "24px" }}>
        {rep.id === activeReport?.id ? (
          <span>{row}</span>
        ) : (
          <Button
            variant="link"
            onClick={() => prepareReport(rep)}
            style={{ padding: "0" }}
          >
            {row}
          </Button>
        )}
      </p>
    );
  };

  return (
    <Modal show={true} onHide={closeModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <span>{title}</span>
          <Button
            size="sm"
            variant="dark"
            style={{ position: "absolute", right: "3.5rem" }}
            onClick={handlePrint}
          >
            Print this out!
          </Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="print-page content" ref={componentRef}>
          <div
            className="no-print"
            style={{
              marginBottom: "1rem",
            }}
          >
            {reports.map((rep) => (
              <ReportLink rep={rep} />
            ))}
          </div>
          <div
            className="print header"
            style={{
              position: "relative",
              marginBottom: "5rem",
              marginTop: "2rem",
              display: "none",
            }}
          >
            <img
              src="/images/logo-header.png"
              style={{
                position: "absolute",
                left: "0",
              }}
            />
            <h2
              style={{
                textAlign: "center",
              }}
            >
              {title}
            </h2>
          </div>
          <MyBootstrapTable
            data={preData}
            columns={preColumns}
            defaultSorted={orderBy("name")}
            headerClasses="d-none"
            classes="report mb-2"
          />
          <MyBootstrapTable
            data={employees}
            columns={columns}
            defaultSorted={orderBy("name")}
            // horizontal scroll
            wrapperClasses="table-responsive"
            rowClasses="text-nowrap"
          />
          <p
            id="pageFooter"
            className="print footer"
            style={{ display: "none", position: "absolute", bottom: "0" }}
          >
            {getTimestamp()}
          </p>
          <div
            style={{
              display: "none",
              position: "absolute",
              bottom: "0",
              right: "0",
            }}
            className="page-number print"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportDocumentModal;
