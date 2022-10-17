import {
  FormattedDate,
  FormattedEmployeeDate,
  FormattedRelease,
  FormattedSuperiorDate,
  FormattedTrainingDate,
  FullName,
  NameWithLink,
} from "../utils/Formatter";
import { SignedBtn } from "../components/Buttons/TableBtns";

export const signedDocumentsColumns = () => [
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
    dataField: "signatures[0].e_date.Time",
    text: "Signed date",
    sort: true,
    formatter: SignedBtn,
    headerStyle: { width: "33%" },
  },
];

export const signedDocumentsExpandColumns = () => [
  {
    dataField: "employee.id",
    text: "ID",
    sort: true,
    headerStyle: { width: "1%" },
  },
  {
    dataField: "employee.last_name",
    text: "Full name",
    sort: true,
    formatter: FullName,
  },
  {
    dataField: "e_date.Time",
    text: "Employee Sign",
    sort: true,
    formatter: FormattedEmployeeDate,
  },
  {
    dataField: "s_date.Time",
    text: "My Sign",
    sort: true,
    formatter: FormattedSuperiorDate,
  },
];

export const signedTrainingsColumns = () => [
  {
    dataField: "name",
    text: "Name",
    sort: true,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "date.Time",
    text: "Took place",
    sort: true,
    formatter: FormattedDate,
    headerStyle: { width: "33%" },
  },
  {
    dataField: "signatures[0].date.Time", // always array with length of 1 [by SQL query]
    text: "Signed date",
    sort: true,
    formatter: FormattedTrainingDate,
    headerStyle: { width: "33%" },
  },
];
