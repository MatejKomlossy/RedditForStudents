import {useState, useEffect, useRef} from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Textarea from 'react-expanding-textarea';
import DragDrop from "../components/DragDrop";
import {postCreate} from "../constants/backendUrls";
import {Navigate} from "react-router-dom";
import {posts} from "../constants/frontendUrls";
import useAlert from "../hooks/useAlrert";
import Alert from "../components/Alert";
import convertToBase64 from "./FileConverter";


function CreatePost({}) {

    const textareaRef = useRef(null)
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState(null);
    const [wasCreated, setWasCreated] = useState(false);

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

    useEffect(() => {
        textareaRef.current.focus()
    }, [])

    useEffect(() => {
        if(!file) return;
        convertToBase64(file, setFileBase64);
    }, [file])

    const create = () => {
        const post = {"title": title, "post_text": text, "flag": true};
        const req = fetch(postCreate, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "post": post,
                "imgs":file? [{
                    "title": file.name,
                    "file": fileBase64
                }] : []
            }
            )
        });
        req.then(res => {
            if (res.ok) {
                setWasCreated(true)
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

    if (wasCreated) {
        return <Navigate to={posts}/>
    }

    return (
        <div className="border-2 border-blue-600 rounded-xl p-6 w-10/12 min-w-max mx-auto">
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}

            <div className="flex flex-col mx-auto gap-6">
                <InputField type={'text'}
                            label={'Title'}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                />

                <Textarea
                    className="w-full outline-0 border-l-2 border-l-sky-500 resize-none px-2"
                    defaultValue=""
                    id="my-textarea"
                    maxLength="3000"
                    onChange={e => setText(e.target.value)}
                    placeholder="Your message goes here :)"
                    rows={5}
                    ref={textareaRef}
                />

                <div className="flex">
                    <DragDrop file={file} setFile={setFile}/>
                    <div className="flex-none w-30 h-14 ml-auto">
                        <Button
                            type={'primary'}
                            onClick={() => create()}
                            children={'Post'}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreatePost;