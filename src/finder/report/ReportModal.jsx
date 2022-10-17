import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {buttonColumn, orderBy, require_superior} from "../../utils/functions";
import MyBootstrapTable from "../../components/Tables/MyBootstrapTable";
import {format_date} from "../../utils/Formatter";
import {proxy_url} from "../../utils/data";
import {Button, Col} from "react-bootstrap";

const ReportModal = ({ report, setReport }) => {
  const closeModal = () => setReport(undefined);
  const [signatures, setSignatures] = useState([]);

  const getDate = (date) => {
    const f = format_date(date);
    return f === "01.01.0001" ? "-" : f
  };

  useEffect(() => {
    fetch(proxy_url + `/skill/matrix`, {
      method: "POST",
      body: new URLSearchParams(`document_id=${report.id}`),
    })
      .then((res) => res.json())
      .then((r) => {
        console.log(r);
        const rec = r.documents[0];
        setSignatures(
          rec.signatures.map((sign) => {
            const { employee: e } = sign;
            return {
              id: e.id,
              name: `${e.first_name} ${e.last_name}`,
              e_date: getDate(sign.e_date),
              s_date: getDate(sign.s_date),
            };
          })
        );
      });
  }, []);

  if (!report) return null;

  console.log("report", report);

  let columns = [
    {
      ...buttonColumn("id"),
    },
    {
      dataField: "name",
      text: "Full name",
      sort: true,
    },
    {
      dataField: "e_date",
      text: "Employee",
      sort: true,
    },
  ];

  if (require_superior(report)) {
    columns = [...columns, {
      dataField: "s_date",
      text: "Superior",
      sort: true,
    }]
  }

  const title = `${report.name}, ${format_date(report.release_date)}`;

  return (
    <Modal show={true} onHide={closeModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{marginLeft: "45px"}}>
          <p className="d-inline">{title}</p>
          <Button size="sm ml-2" disabled>
            Export
          </Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MyBootstrapTable
          // title={title}
          data={signatures}
          columns={columns}
          defaultSorted={orderBy("name")}
          // horizontal scroll
          wrapperClasses="table-responsive"
          rowClasses="text-nowrap"
        />
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
