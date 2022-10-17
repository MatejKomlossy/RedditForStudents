import React, { useEffect, useState } from "react";
import MyBootstrapTable from "../components/Tables/MyBootstrapTable";
import { savedDocumentsColumns, savedTrainingsColumns } from "./columns";
import useDataApi from "../utils/useDataApi";
import { FetchError, FetchLoading } from "../components/FetchComponents";
import {
  badMsg,
  goodMsg,
  orderBy,
  recordType,
  successResponse,
} from "../utils/functions";
import { CustomAlert } from "../components/CustomAlert";
import EditRecordModal from "../components/Modals/EditRecordModal";
import { proxy_url } from "../utils/data";
import ConfirmModal from "../components/Modals/ConfirmModal";

const SavedRecordsPage = () => {
  const [doc_data, isLoaded, error] = useDataApi("/document/edited");
  const [trn_data, isLoaded2, error2] = useDataApi("/training/edited");

  const [documents, setDocuments] = useState([]);
  const [trainings, setTrainings] = useState([]);

  const [notification, setNotification] = useState();
  const [formData, setFormData] = useState();

  const [showModal, setShowModal] = useState(false);
  const [row, setRow] = useState();

  useEffect(() => {
    if (doc_data && trn_data) {
      setDocuments(doc_data);
      setTrainings(trn_data);
    }
  }, [doc_data, trn_data]);

  /** Send record to relevant employees */
  const handleClick = () => {
    fetch(proxy_url + `/${recordType(row)}/confirm/${row.id}`, {
      method: "GET",
    })
      .then((res) => {
        if (successResponse(res)) {
          updateSavedRec();
          setNotification(goodMsg(`Record ${row.name} was successfully sent`));
        } else {
          setNotification(badMsg(`Record ${row.name} failed`));
        }
      })
      .catch((e) => console.log(e));
  };

  /** Remove sent record */
  const updateSavedRec = () => {
    if (recordType(row) === "document") {
      setDocuments((prev) => prev.filter((rec) => rec.id !== row.id));
    } else {
      setTrainings((prev) => prev.filter((rec) => rec.id !== row.id));
    }
  };

  if (error) {
    return <FetchError e={`Error: ${error.message}`} />;
  } else if (error2) {
    return <FetchError e={`Error: ${error2.message}`} />;
  } else if (!isLoaded || !doc_data || !isLoaded2 || !trn_data) {
    return <FetchLoading />;
  }

  const trn_columns = savedTrainingsColumns(setFormData, setRow, setShowModal);
  const doc_columns = savedDocumentsColumns(setFormData, setRow, setShowModal);

  return (
    <>
      {/* DOCUMENTS */}
      <MyBootstrapTable
        title="Saved documents"
        data={documents}
        columns={doc_columns}
        order={orderBy("deadline.Time")}
      />
      {/* TRAININGS */}
      <MyBootstrapTable
        title="Saved trainings"
        data={trainings}
        columns={trn_columns}
        order={orderBy("deadline.Time")}
      />
      {notification && <CustomAlert notification={notification} />}
      {formData && (
        <EditRecordModal
          setRecords={
            recordType(formData) === "document" ? setDocuments : setTrainings
          }
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {showModal && (
        <ConfirmModal
          handleAccept={handleClick}
          showModal={showModal}
          setShowModal={setShowModal}
          modalInfo={{
            body: "Do you really want to send the record to the employees?",
          }}
          // style={{ border: "10px solid #6c757d" }}
        />
      )}
    </>
  );
};

export default SavedRecordsPage;
