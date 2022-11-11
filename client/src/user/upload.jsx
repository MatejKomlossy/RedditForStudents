import Alert from "../components/Alert";
import {useState} from "react";
import useAlert from "../hooks/useAlrert";
import {postUpload} from "../constants/urls";
import {DEBUG} from "../constants/other";
import Button from "../components/Button";
import Upload from "../components/upload";

function UploadSite(){
    const [images, setImages] = useState([]);
    const [post, setPost] = useState("");

    const onUpload = (image) => {
        DEBUG && console.log(image);
        setImages( images => [...images, image]);
    };
    const deleteImage = () => {
        DEBUG && console.log(images);
        images.pop();
        setImages(images);
        DEBUG && console.log(images);
    }

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();



    const postSend = () => {
        const req = fetch(postUpload, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({files:images, post:post})
        });
        req.then(res => {
            if (res.ok) {
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
    return (
        <div className={" flex-col border-4 border-blue-600 rounded-2xl mt-8 p-6  w-1/3 min-w-max  mx-auto "}>

            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}
            <div className={"flex-col space-y-5"}>
                <h2 className={"text-center text-3xl"}>Login to Your Account</h2>
                <Upload
                    onInput={image => onUpload(image)}
                />
                <Button onClick={() => deleteImage()} type={'primary'} children={'back'}/>
                <Button onClick={() => postSend()} type={'primary'} children={'submit'}/>
            </div>
        </div>
    )
};
export default UploadSite;