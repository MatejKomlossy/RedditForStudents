import React from "react";
import { Button } from "react-bootstrap";
import { recordType } from "../../utils/functions";

const ReportBtn = (cell, row, index, { setReport }) => {
  return (
    <Button
      // href={`/${recordType(row)}/reports/${row.id}`}
      // type={"link"}
      onClick={() => setReport(row.id)}
      size="sm"
    >
      Report
    </Button>
  );
};

export default ReportBtn;
