import {
  FormattedDate,
  FormattedDeadline,
  FormattedRelease,
} from "../utils/Formatter";
import { buttonColumn } from "../utils/functions";
import Button from "react-bootstrap/Button";
import React from "react";
import EditBtn from "../components/Buttons/EditBtn";

const SendBtn = (cell, row, index, { setRow, setShowModal }) => {
  return (
    <Button
      id="save"
      size="sm"
      onClick={() => {
        setRow(row);
        setShowModal(true);
      }}
    >
      Send
    </Button>
  );
};

export const savedDocumentsColumns = (setFormData, setRow, setShowModal) => [
  {
    dataField: "name",
    text: "Name",
    sort: true,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "release_date.Time",
    text: "Release",
    sort: true,
    formatter: FormattedRelease,
    headerStyle: { width: "32%" },
  },
  {
    dataField: "deadline.Time",
    text: "Deadline",
    sort: true,
    formatter: FormattedDeadline,
    headerStyle: { width: "33%" },
  },
  {
    ...buttonColumn("EditBtn"),
    formatter: EditBtn,
    formatExtraData: {
      setFormData: setFormData,
    },
  },
  {
    ...buttonColumn("SendBtn"),
    formatter: SendBtn,
    formatExtraData: {
      setRow: setRow,
      setShowModal: setShowModal,
    },
  },
];

export const savedTrainingsColumns = (setFormData, setRow, setShowModal) => [
  {
    dataField: "name",
    text: "Name",
    sort: true,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "date.Time",
    text: "Release",
    sort: true,
    formatter: FormattedDate,
    headerStyle: { width: "32%" },
  },
  {
    dataField: "place",
    text: "Place",
    sort: true,
    headerStyle: { width: "33%" },
  },
  {
    ...buttonColumn("EditBtn"),
    formatter: EditBtn,
    formatExtraData: {
      setFormData: setFormData,
    },
  },
  {
    ...buttonColumn("SendBtn"),
    formatter: SendBtn,
    formatExtraData: {
      setRow: setRow,
      setShowModal: setShowModal,
    },
  },
];
