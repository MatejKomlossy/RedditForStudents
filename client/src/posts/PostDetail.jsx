import PostBody from "./PostBody";
import {useParams} from 'react-router-dom'
import {useEffect, useState} from "react";
import Header from "../Header";
import {postGetOne} from "../constants/urls";
import useAlert from "../hooks/useAlrert";
import Alert from "../components/Alert";


function PostDetail() {

    const {id} = useParams()
    const emptyPost = {title: "", post_text: ""}
    const [post, setPost] = useState(emptyPost)

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

    const fetchPostById = () => {
        if(id == null) return;
        const req = fetch(postGetOne, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id})
        });
        req.then(res => {
            if (res.ok) {
                res.json().then(post => setPost(post))
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    useEffect(() => fetchPostById(), []);

    const showError = (errorMessage) => {
        setShowAlert(true);
        setAlertType('error');
        setAlertTitle("Error");
        setAlertContext(`${errorMessage}`)
    }

    return (
        <>
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}

            <Header title={'Reddit for Students'}/>

            <div
                className="flex-col rounded-xl p-6 w-10/12 min-w-max mx-auto bg-gradient-to-b from-cyan-300 to-blue-300 mt-6">
                <div className={"flex-col mx-auto space-y-5"}>
                    <div>
                        <h2 className="text-2xl mb-2">{post.title}</h2>
                        <PostBody
                            text={post.post_text}
                            imageUrl={"placeholder"}
                        >
                        </PostBody>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PostDetail;