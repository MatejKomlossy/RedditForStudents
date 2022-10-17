import React, { useContext, useEffect, useRef, useState } from "react";
import { getFetch, orderBy } from "../../utils/functions";
import MyBootstrapTable from "../../components/Tables/MyBootstrapTable";
import { format_date } from "../../utils/Formatter";
import { PairContext } from "../../App";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useReactToPrint } from "react-to-print";

const ReportTrainingModal = ({ id, closeModal }) => {
  const pairs = useContext(PairContext);

  const [preData, setPreData] = useState([]);
  const [employees, setEmployees] = useState([]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getFetch(`/training/report/${id}`).then((res) => {
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
          <div>
            <MyBootstrapTable
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
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportTrainingModal;
