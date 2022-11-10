import useAlert from "./hooks/useAlrert";
import {studentLogout} from "./constants/urls";
import UserProfile from "./user/UserProfile";
import Button from "./components/Button";
import Alert from "./components/Alert";
import {Navigate} from "react-router-dom";
import {useState} from "react";
import {FaUserGraduate} from 'react-icons/fa';
import {FaHandScissors} from 'react-icons/fa';

function Header({title, children}) {

    const [loggedOut, setLoggedOut] = useState(false);

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

    const showError = (errorMessage) => {
        setShowAlert(true);
        setAlertType('error');
        setAlertTitle("Error");
        setAlertContext(`${errorMessage}`)
    }

    const logoutSend = () => {
        const req = fetch(studentLogout, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: 'include'
        });

        req.then(res => {
            if (res.ok) {
                UserProfile.setUsername('')
                setLoggedOut(true)
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    if (loggedOut) {
        return <Navigate to="/"/>
    }
    return (
        <>
            {showAlert &&
                <Alert type={alertType} title={alertTitle} context={alertContext}/>
            }
            <header className={'flex flex-row content-center bg-gray-200 p-3 shadow-xl'}>
                <p className={'my-auto text-xl text-blue-800'}>
                    {title}
                </p>
                <div className={'my-auto'}>
                    {children}
                </div>
                <p
                    className={'ml-auto my-auto mr-4 font-medium flex flex-row gap-2 text-xl'}>
                    <span className={'text-gray-400'}>Student:</span>
                    {UserProfile.getUsername()}
                    <FaUserGraduate className={'my-auto'}/>
                </p>
                <div title={'Log Out'}>
                    <Button
                        type={'secondary'}
                        children={<FaHandScissors/>}
                        onClick={() => logoutSend()}
                        className={'max-w-min'}
                    />
                </div>
            </header>
        </>
    )
}

export default Header;
