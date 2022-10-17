import Button from "react-bootstrap/Button";
import React from "react";

const EditBtn = (cell, row, index, { setFormData }) => {
  return (
    <Button
      variant="outline-primary"
      onClick={() => setFormData(row)}
      size="sm"
    >
      Edit
    </Button>
  );
};

export default EditBtn;
