import PostBody from "./PostBody";
import {Navigate, useParams} from 'react-router-dom'
import React, {useEffect, useState} from "react";
import Header from "../Header";
import {postGetOne, postDelete, postIsAuthorGet} from "../constants/backendUrls";
import useAlert from "../hooks/useAlrert";
import Alert from "../components/Alert";
import {posts} from "../constants/frontendUrls";
import Button from "../components/Button";
import {FaTrash} from "react-icons/fa";
import RatingPanel from "./RatingPanel";


function PostDetail() {

    const {id} = useParams()
    const emptyPost = {title: "", post_text: ""}
    const [post, setPost] = useState(emptyPost)
    const [deleted, setDeleted] = useState(false)
    const [isStudentAuthor, setIsStudentAuthor] = useState(false)

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

    const fetchPostById = () => {
        if (id == null) return;
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

    const deletePost = () => {
        if (id == null) return;
        const req = fetch(postDelete, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id})
        });
        req.then(res => {
            if (res.ok) {
                setDeleted(true)
            } else {
                showError("You are not the author of this post")
            }
        }).catch(err => {
            showError(err)
        })
    }

    const isUserAuthor = () => {
        if (id == null) return;
        const req = fetch(postIsAuthorGet, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"post_id": id})
        });
        req.then(res => {
            if (res.ok) {
                res.json().then(data => setIsStudentAuthor(data.isAuthor))
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    useEffect(() => fetchPostById(), []);

    useEffect(() => isUserAuthor(), []);

    const showError = (errorMessage) => {
        setShowAlert(true);
        setAlertType('error');
        setAlertTitle("Error");
        setAlertContext(`${errorMessage}`)
    }

    if (deleted) {
        return <Navigate to={posts}/>
    }
    return (
        <>
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}

            <Header title={'Reddit for Students'}/>

            <div className="rounded-xl w-10/12 max-w-10/12 mx-auto bg-gradient-to-b from-cyan-300 to-blue-300 mt-6">
                <div className={'flex flex-row'}>
                    <div className={"flex-col space-y-5 px-6 pt-6"}>
                        <div>
                            <h2 className="text-2xl mb-2">{post.title}</h2>
                            <PostBody
                                text={post.post_text}
                                images={post.images}
                            >
                            </PostBody>
                        </div>
                    </div>

                    {isStudentAuthor &&
                    <div className={"ml-auto"}>
                        <Button
                            type={'secondary'}
                            onClick={() => deletePost()}
                            children={<FaTrash/>}
                            ariaLabel={'delete file'}
                            className={'px-1 lg:px-1.5 py-1 lg:py-1.5'}
                        >
                        </Button>
                    </div>}
                </div>

                {post.title &&
                    <RatingPanel
                        student_id={post.student_id}
                        rating={post.rating}
                        users_rating={post.users_rating}
                        post_id={post.id}
                    />
                }
            </div>
        </>
    )
}

export default PostDetail;