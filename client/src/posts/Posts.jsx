import Header from "../Header";
import Post from "./Post";
import {postGetAll} from "../constants/backendUrls";
import useAlert from "../hooks/useAlrert";
import React, {useEffect, useState} from "react";
import Button from "../components/Button";
import {FaFeatherAlt} from 'react-icons/fa';
import {Link} from "react-router-dom";
import Alert from "../components/Alert";

function Posts() {

    const [posts, setPosts] = useState([]);

    const [showAlert, setShowAlert,
        alertType, setAlertType,
        alertTitle, setAlertTitle,
        alertContext, setAlertContext] = useAlert();

    useEffect(() => fetchAllPosts(), []);

    const showError = (errorMessage) => {
        setShowAlert(true);
        setAlertType('error');
        setAlertTitle("Error");
        setAlertContext(`${errorMessage}`)
    }

    const fetchAllPosts = () => {
        const req = fetch(postGetAll, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        req.then(res => {
            if (res.ok) {
                res.json().then(posts => setPosts(posts))
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    return (
        <>
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}

            <Header title={'Reddit for Students'}/>

            <div className={"flex mx-10 mt-5 place-content-center"}>
                <div title={'Create a Post'}>
                    <Link to={"/createPost"}>
                        <Button
                            type={'secondary'}
                            children={[
                                <p key={0}>create</p>,
                                <FaFeatherAlt key={1} className={'my-auto'}/>
                            ]}
                        />
                    </Link>
                </div>
            </div>

            <div className={'flex flex-col gap-6 mt-6'}>
                {posts.map(post =>
                    <Post
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        post_text={post.post_text}
                        student_id={post.student_id}
                        flag={post.flag}
                        rating={post.rating}
                        users_rating={post.users_rating}
                    />
                )}
            </div>
        </>
    )
}

export default Posts;
