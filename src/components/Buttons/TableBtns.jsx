import React from "react";
import Button from "react-bootstrap/Button";
import { isSuperior, requireSuperior } from "../../utils/functions";
import { FormattedEmployeeDate } from "../../utils/Formatter";

export const MissedBtn = (
  cell,
  row,
  index,
  { setModalInfo, setShowModal, asSuperior }
) => {
  const handleClick = () => {
    if (requireSuperior(row) && isSuperior(row)) {
      return;
    }
    setShowModal(true);
    setModalInfo({
      ...row,
      asSuperior: asSuperior,
    });
  };

  return (
    <Button onClick={handleClick} size="sm" className="btn-block">
      {requireSuperior(row) && isSuperior(row) ? "Details" : "Sign"}
    </Button>
  );
};

export const SignedBtn = (cell, row) => {
  return requireSuperior(row) && isSuperior(row) ? (
    <Button size="sm">Details</Button>
  ) : (
    FormattedEmployeeDate(cell, row.signatures[0])
  );
};
