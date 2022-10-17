import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MyFormGroup from "./MyFormGroup";
import { Form, Row, Col, Button } from "react-bootstrap";
import Combinations from "../Tables/Combinations";
import { CustomAlert } from "../CustomAlert";
import { proxy_url, types as t } from "../../utils/data";
import {
  badMsg,
  goodMsg,
  correctDocumentFormData,
  getSelectOptions,
  prefillDocumentForm,
  successResponse,
  getAssignedTo,
  prepareCombinations,
  getFormID,
} from "../../utils/functions";
import { PairContext } from "../../App";
import ConfirmModal from "../Modals/ConfirmModal";

const DocumentForm = ({ setRecords, formData, setFormData, actual }) => {
  const pairs = useContext(PairContext);

  const [showModal, setShowModal] = useState(false);
  const [submitData, setSubmitData] = useState({});

  const { register, handleSubmit } = useForm({
    defaultValues: prefillDocumentForm(formData),
  });

  const types = t;
  const [action, setAction] = useState();
  const [selectedType, setSelectedType] = useState(
    formData ? formData.type : ""
  );

  const [sent, setSent] = useState(false);
  const [currentID, setCurrentID] = useState(formData ? formData.id : 0);
  const [notification, setNotification] = useState();
  const [combinations, setCombinations] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [emptyAssign, setEmptyAssign] = useState([true]);
  useEffect(() => setNotification(undefined), emptyAssign);

  useEffect(() => {
    fetch(proxy_url + "/combinations", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        setCombinations(prepareCombinations(res));
      })
      .catch((e) => console.log(e));

    fetch(proxy_url + "/employees/all", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        setAssignedTo(getAssignedTo(formData, pairs, res));
      })
      .catch((e) => console.log(e));
  }, []);

  const onSubmit = (data) => {
    if (assignedTo.length === 0) {
      setNotification(badMsg("At least one combination is required"));
      return;
    }

    setSubmitData(data);

    if (action === "send") {
      setShowModal(true);
    } else {
      executeSubmit(data);
    }
  };

  const executeSubmit = (data) => {
    console.log("raw", assignedTo);
    data = correctDocumentFormData(data || submitData, assignedTo);
    console.log("data", data);

    if (action === "save") {
      if (currentID) {
        data = { ...data, id: currentID };
        upsert(data, "update");
        updateSavedRec(data);
      } else {
        upsert(data, "create").then((r) => setCurrentID(r?.id));
      }
    }
    if (action === "send") {
      if (currentID) {
        data = { ...data, id: currentID };
        if (actual) {
          upsertConfirm(data, "create/confirm").then((r) => {
            setCurrentID(r?.id);
          });
        } else {
          upsertConfirm(data, "update/confirm", true);
        }
      } else {
        upsertConfirm(data, "create/confirm").then((r) => setCurrentID(r?.id));
      }
      setSent(true);
    }
  };

  const upsert = (data, action) => {
    console.log(data);
    return fetch(proxy_url + `/document/${action}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (successResponse(res)) {
          setNotification(goodMsg(`${action} was successful`));
        } else {
          setNotification(badMsg(`${action} failed`));
        }
        return res.json();
      })
      .catch((e) => console.log("error", e));
  };
  const upsertConfirm = (data, action, update) => {
    console.log(data);
    return fetch(proxy_url + `/document/${action}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (successResponse(res)) {
          setNotification(goodMsg(`${action} was successful`));
          if (setRecords && update) {
            filterSavedRec(data); // update table data
            // if (setFormData) setFormData(undefined); // hide modal
          }
          updateSavedRec(data);
        } else {
          setNotification(badMsg(`${action} failed`));
        }
        console.log(res);
        return res.json();
      })
      .catch((e) => {
        setNotification(badMsg(`${action} failed`));
        console.log("error", e);
      });
  };

  const filterSavedRec = (data) => {
    setRecords((prevState) => prevState.filter((p) => p.id !== data.id));
  };

  const updateSavedRec = (data) => {
    if (!setRecords) return;

    setRecords((prevState) => {
      let update = prevState;
      const foundID = prevState.findIndex((p) => p.id === data.id);
      update[foundID] = data;
      return update;
    });
  };

  return (
    <Form
      onChange={() => setNotification(undefined)}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* TYPE* */}
      <Form.Group as={Row}>
        <Form.Label column sm="3">
          Type*
        </Form.Label>
        <Col>
          <Form.Control
            onChange={(e) => setSelectedType(e.target.value)}
            as="select"
            name="type"
            ref={register({ validate: (v) => v !== "" })}
            required
            value={selectedType}
          >
            {getSelectOptions(types)}
          </Form.Control>
        </Col>
      </Form.Group>
      {/* REQUIRE SUPERIOR */}
      <Form.Group as={Row}>
        <Form.Label column sm="3">
          {" "}
        </Form.Label>
        <Col>
          <Form.Check
            inline
            label="require superior"
            name="require_superior"
            ref={register}
          />
        </Col>
      </Form.Group>
      {/* NAME */}
      <MyFormGroup
        label="Document name*"
        name="name"
        placeholder="Enter document name"
        register={register}
        required
      />
      {/* DOCUMENT NUMBER */}
      <MyFormGroup
        label="Document number*"
        name="order_number"
        type="number"
        placeholder="Enter number"
        register={register({ valueAsNumber: true })}
        required
      />
      {/* VERSION */}
      <MyFormGroup
        label="Version*"
        name="version"
        placeholder="Enter version"
        register={register}
        required
      />
      {/* LINK */}
      <MyFormGroup
        label="Link to sharepoint"
        name="link"
        placeholder="Enter document link to sharepoint"
        register={register}
      />
      {/* RELEASE */}
      <MyFormGroup
        label="Release date*"
        name="release_date"
        type="date"
        register={register}
        required
      />
      {/* DEADLINE */}
      <MyFormGroup
        label="Days to deadline*"
        name="deadline"
        type="date"
        register={register}
        required
      />
      {/* NOTE */}
      <MyFormGroup
        label="Note"
        name="note"
        as="textarea"
        placeholder="Enter note"
        register={register}
      />
      <input hidden name="complete" ref={register} />
      {/* COMBINATIONS */}
      <Combinations
        combinations={combinations}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        emptyAssign={emptyAssign}
        setEmptyAssign={setEmptyAssign}
      />
      {/* ALERTS */}
      {notification && <CustomAlert notification={notification} />}
      {/* SAVE | SEND BUTTONS */}
      <div className="pt-1 btn-block text-right">
        <Button
          variant="outline-primary"
          type="submit"
          className="mr-1"
          disabled={sent}
          onClick={() => setAction("save")}
        >
          Save
        </Button>
        <Button type="submit" onClick={() => setAction("send")} disabled={sent}>
          {actual ? "Send as new version" : "Send"}
        </Button>
      </div>
      {showModal && (
        <ConfirmModal
          handleAccept={executeSubmit}
          showModal={showModal}
          setShowModal={setShowModal}
          modalInfo={{
            body: "Do you really want to send the record to the employees?",
          }}
          // style={{ border: "10px solid #6c757d" }}
        />
      )}
    </Form>
  );
};

export default DocumentForm;
