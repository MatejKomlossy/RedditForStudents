import React, { useState } from "react";
import EditBtn from "../components/Buttons/EditBtn";
import EditRecordModal from "../components/Modals/EditRecordModal";
import ReportBtn from "./report/ReportBtn";
import { buttonColumn, orderBy } from "../utils/functions";
import { FormattedDate, Percentage } from "../utils/Formatter";
import MyBootstrapTable from "../components/Tables/MyBootstrapTable";
import { Redirect } from "react-router";
import ReportDocumentModal from "./report/ReportDocumentModal";
import ReportTrainingModal from "./report/ReportTrainingModal";

const FoundTrainings = ({ found, setFound }) => {
  const [formData, setFormData] = useState();
  const [report, setReport] = useState();

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
    },
    {
      dataField: "date.Time",
      text: "Release",
      formatter: FormattedDate,
      sort: true,
    },
    {
      dataField: "lector",
      text: "Lector",
      sort: true,
    },
    {
      dataField: "agency",
      text: "Agency",
      sort: true,
    },
    {
      dataField: "place",
      text: "Place",
      sort: true,
    },
    {
      dataField: "complete",
      text: "State",
      formatter: Percentage,
      sort: true,
      headerStyle: { width: "1%" },
    },
    {
      ...buttonColumn("EditBtn"),
      formatter: EditBtn,
      formatExtraData: {
        setFormData: setFormData,
      },
    },
    {
      ...buttonColumn("ReportBtn"),
      formatter: ReportBtn,
      formatExtraData: {
        setReport: setReport,
      },
    },
  ];

  return (
    <>
      <MyBootstrapTable
        title="Found trainings"
        data={found}
        columns={columns}
        defaultSorted={orderBy("name")}
        // horizontal scroll
        wrapperClasses="table-responsive"
        rowClasses="text-nowrap"
      />
      {formData && (
        <EditRecordModal
          setRecords={setFound}
          formData={formData}
          setFormData={setFormData}
          actual={true}
        />
      )}
      {report && (
        <ReportTrainingModal
          id={report}
          closeModal={() => setReport(undefined)}
        />
      )}
    </>
  );
};

export default FoundTrainings;
