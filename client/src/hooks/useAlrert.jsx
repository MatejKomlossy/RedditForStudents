import {useState} from "react";

const useAlert = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState("error");
    const [alertTitle, setAlertTitle] = useState("Something went WRONG");
    const [alertContext, setAlertContext] = useState("Unexpected error");

    return [
        showAlert,
        setShowAlert,
        alertType,
        setAlertType,
        alertTitle,
        setAlertTitle,
        alertContext,
        setAlertContext
    ]
};

export default useAlert;