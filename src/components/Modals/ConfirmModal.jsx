import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmModal = ({ showModal, setShowModal, modalInfo, handleAccept }) => {
  console.log(modalInfo);
  const closeModal = () => setShowModal(false);

  const onAccept = () => {
    handleAccept();
    closeModal();
  };

  let bodyText = "";
  if (modalInfo.body) {
    bodyText = modalInfo.body;
  } else if (modalInfo.asSuperior) {
    const employeeName = () => {
      if (modalInfo.employee === null) {
        return "ME";
      }
      return `${modalInfo.employee.first_name} ${modalInfo.employee.last_name}`;
    };
    bodyText = `Do you really want do sign for ${employeeName()}`;
  } else {
    bodyText = `Do you really want do sign the document named ${modalInfo.name}`;
  }

  return (
    <Modal show={showModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{bodyText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onAccept}>
          Accept
        </Button>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
