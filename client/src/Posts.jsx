import UserProfile from "./user/UserProfile";
import Header from "./Header";
import Button from "./components/Button";
import Alert from './components/Alert';
import useAlert from "./hooks/useAlrert";
import {studentLogout} from "./constants/urls"


function Posts(){

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

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

    const logoutSend = () => {
        console.log(document.cookie)
        const req = fetch(studentLogout, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"cookie": document.cookie})
        });
        console.log("CLICK LOGOUT")
        req.then(res => {
            if (res.ok) {
                showSuccess("Logout successful")
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    return (
        <>
            <Header title={'Reddit for Students'}/>
            Page with posts. <br/>
            Your username: {UserProfile.getUsername()} <br/>
            Are you logged in? {"" + UserProfile.isUserLoggedIn()} <br/>
            <Button type={'secondary'} children={'Logout'} onClick={() => logoutSend()}/>
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}
        </>
    )
}

export default Posts;
