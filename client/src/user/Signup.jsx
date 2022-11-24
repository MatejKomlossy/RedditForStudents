import InputField from "../components/InputField";
import {useState} from "react";
import Button from "../components/Button";
import Alert from '../components/Alert';
import useAlert from "../hooks/useAlrert";
import {studentRegister} from "../constants/backendUrls";
import {useClickCapureUpdate,useClickCapture} from "../context/ClickCapureCTX";
import React from "react";



function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isicNumber, setIsicNumber] = useState("");
    const [password2, setPassword2] = useState("");
    const [signedUp, setSignedUp] = useState(false);

    const switchClick = useClickCapureUpdate();
    const Click = useClickCapture();
    
    const isactive = {
        display: Click === "register" ? "block" : "none"
    }

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

    const signupSend = () => {
        if (password !== password2) {
            showError("passwords do not match");
            return
        }
        const req = fetch(studentRegister, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"nick_name": username, "password": password, "isic_number": isicNumber})
        });
        req.then(res => {
            if (res.ok) {
                showSuccess("Registration successful")
                switchClick("login")
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    const showSuccess = (successMessage) => {
        setShowAlert(true);
        setAlertType('success');
        setAlertTitle("Awesome");
        setAlertContext(`${successMessage}`)
    }

    const showError = (errorMessage) => {
        setShowAlert(true);
        setAlertType('error');
        setAlertTitle("Error");
        setAlertContext(`${errorMessage}`)
    }
    
    return (
        <div className={"border-4 border-blue-600 rounded-2xl w-1/3 min-w-max mx-auto mt-8 p-6"} style={isactive} >
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}
            <div className={"flex-col space-y-5"}>
                <h2 className={"text-center text-3xl"}>Create an Account</h2>
                <InputField type={'text'}
                            label={'username'}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                />
                <InputField type={'password'}
                            label={'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                />
                <InputField type={'password'}
                            label={'repeat password'}
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                />
                <InputField type={'text'}
                            label={'isic number'}
                            value={isicNumber}
                            onChange={e => setIsicNumber(e.target.value)}
                />

                <Button onClick={() => signupSend()} type={'primary'} children={'Sign Up'} />
                <Button onClick={() => switchClick("login")} type={'secondary'} children={'Back'}/>
                
            </div>
        </div>
    )
}

export default Signup;