import InputField from "../components/InputField";
import {useState} from "react";
import Button from "../components/Button";
import Alert from '../components/Alert';
import useAlert from "../hooks/useAlrert";
import {Navigate} from 'react-router-dom';
import {studentLogin} from "../constants/backendUrls";
import UserProfile from "./UserProfile";

import {useClickCapureUpdate,useClickCapture} from "../context/ClickCapureCTX";
import {posts} from "../constants/frontendUrls";



function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);


    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();
    
    const switchClick = useClickCapureUpdate();
    const Click = useClickCapture();
    
    const isactive = {
        display: Click === "login" ? "block" : "none"
    }



    const loginSend = () => {
        const req = fetch(studentLogin, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"nick_name": username, "password": password})
        });
        req.then(res => {
            if (res.ok) {
                setLoggedIn(true)
                UserProfile.setUsername(username)
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    const showError = (errorMessage) => {
        setShowAlert(true);
        setAlertType('error');
        setAlertTitle("Error");
        setAlertContext(`${errorMessage}`)
    }

    if (loggedIn) {
        return <Navigate to={posts}/>
    }
    
    return (
        <div className={" flex-col border-4 border-blue-600 rounded-2xl mt-8 p-6  w-1/3 min-w-max  mx-auto "} style={isactive}>  
            
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}
            <div className={"flex-col space-y-5"}>
                <h2 className={"text-center text-3xl"}>Login to Your Account</h2>
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
                <Button onClick={() => loginSend()} type={'primary'} children={'Log In'}/>
                <Button onClick={() => switchClick("none")} type={'secondary'} children={'Back'}/>
            </div>
        </div>
    )
}

export default Login;