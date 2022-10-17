import {
  FormattedDate,
  FormattedDeadline,
  FormattedEmployeeDate,
  FormattedRelease,
  FullName,
  NameWithLink,
} from "../utils/Formatter";
import { MissedBtn } from "../components/Buttons/TableBtns";
import { buttonColumn } from "../utils/functions";

export const trainingsToSignColumns = (setModalInfo, setShowModal) => [
  {
    dataField: "name",
    text: "Name",
    sort: true,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "date.Time",
    text: "Date",
    sort: true,
    formatter: FormattedDate,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "deadline.Time",
    text: "Deadline",
    sort: true,
    formatter: FormattedDeadline,
    headerStyle: { width: "33%" },
  },
  {
    ...buttonColumn(),
    formatter: MissedBtn,
    formatExtraData: {
      setModalInfo: setModalInfo,
      setShowModal: setShowModal,
    },
  },
];

export const documentsToSignColumns = (setModalInfo, setShowModal) => [
  {
    dataField: "name",
    text: "Name",
    sort: true,
    formatter: NameWithLink,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "release_date.Time",
    text: "Release",
    sort: true,
    formatter: FormattedRelease,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "deadline.Time",
    text: "Deadline",
    sort: true,
    formatter: FormattedDeadline,
    headerStyle: { width: "33%" },
  },
  {
    ...buttonColumn(),
    formatter: MissedBtn,
    formatExtraData: {
      setModalInfo: setModalInfo,
      setShowModal: setShowModal,
      asSuperior: false,
    },
  },
];

export const documentsToSignExpandColumns = (setModalInfo, setShowModal) => [
  {
    dataField: "employee.id",
    text: "Employee ID",
    sort: true,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "employee.last_name",
    text: "Full name",
    sort: true,
    formatter: FullName,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "e_date.Time",
    text: "Sign Date",
    sort: true,
    formatter: FormattedEmployeeDate,
    headerStyle: { width: "33%" },
  },
  {
    ...buttonColumn(),
    formatter: MissedBtn,
    formatExtraData: {
      setModalInfo: setModalInfo,
      setShowModal: setShowModal,
      asSuperior: true,
    },
  },
];
