import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import {
  badMsg,
  getSelectOptions,
  goodMsg,
  successResponse,
  warningMsg,
} from "../utils/functions";
import { proxy_url } from "../utils/data";
import { CustomAlert } from "../components/CustomAlert";

const SettingsPage = () => {
  const import_types = [
    "GEFCO SLOVAKIA",
    "GEFCO Forwarding Slovakia",
    "VCM",
    "Leasing",
  ];

  const [selectedType, setSelectedType] = useState();

  const [cardsFile, setCardsFile] = useState();
  const [employeesFile, setEmployeesFile] = useState();

  const [notification, setNotification] = useState();
  const [notification2, setNotification2] = useState();

  const changeCards = (e) => setCardsFile(e.target.files[0]);

  const uploadCards = () => {
    clearErrors();

    const data = new FormData();
    let name = `kiosk_upload_${Date.now()}`;

    data.append("file", cardsFile);
    data.append("name", name);

    console.log(cardsFile);

    if (!cardsFile) {
      setNotification(badMsg("File is not set"));
      return;
    }

    fetch(proxy_url + "/file/upload", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        console.log(response);
        if (successResponse(response)) {
          setNotification(goodMsg("Successfully uploaded."));
        } else {
          setNotification(badMsg("Import was unsuccessful"));
        }
      })
      .catch((e) => setNotification(badMsg("Error submitting form! " + e)));
  };

  const changeEmployees = (e) => setEmployeesFile(e.target.files[0]);

  const uploadEmployees = () => {
    clearErrors();

    const data = new FormData();
    let name = `employees_upload_${Date.now()}`;

    if (!selectedType) {
      setNotification2(badMsg("Select type"));
      return;
    }

    data.append("file", employeesFile);
    data.append("name", name);
    data.append("import", selectedType);

    if (!employeesFile) {
      setNotification2(badMsg("File is not set"));
      return;
    }

    fetch(proxy_url + "/file/upload", {
      method: "POST",
      body: data,
    })
      .then((response) => {
        console.log("rrr", response);
        if (successResponse(response)) {
          return response.json();
        } else {
          throw new Error("Import was unsuccessful");
        }
      })
      .then((res) => {
        if (res.IsWarning) {
          setNotification2(warningMsg(res.Msg));
        } else {
          setNotification2(goodMsg("Successfully uploaded.")); // accept
        }
      })
      .catch((e) => setNotification2(badMsg("Error " + e)));
  };

  const clearErrors = () => {
    setNotification(undefined);
    setNotification2(undefined);
  };

  return (
    <div>
      <script crossOrigin="true" />
      <p className="pt-5">
        <strong>IMPORT EMPLOYEES</strong>
      </p>
      <Form>
        <select
          onChange={(e) => setSelectedType(e.target.value)}
          // ref={register({validate: v => v !== ""})}
          name="type"
          required
          value={selectedType}
        >
          {getSelectOptions(import_types)}
        </select>
        <span> Choose import</span>
        <br />
        <input type="file" required onChange={changeEmployees} />
        <Button type="button" onClick={uploadEmployees}>
          Upload
        </Button>
        {/* ALERTS */}
        {notification2 && <CustomAlert notification={notification2} />}
      </Form>
      <hr />
      <p className="pt-5">
        <strong>IMPORT CARDS</strong>
      </p>
      <Form>
        <p style={{ marginBottom: "4px" }}>
          Upload file with employee card information
        </p>
        <input type="file" id="cardsFile" onChange={changeCards} />
        <Button type="button" onClick={uploadCards}>
          Upload
        </Button>
        {/* ALERTS */}
        {notification && <CustomAlert notification={notification} />}
      </Form>
      <hr />
    </div>
  );
};

export default SettingsPage;
