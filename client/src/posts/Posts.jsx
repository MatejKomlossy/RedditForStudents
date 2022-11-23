import Header from "../Header";
import Post from "./Post";
import CreatePost from "./CreatePost";
import {postGetAll} from "../constants/urls";
import useAlert from "../hooks/useAlrert";
import {useEffect, useState} from "react";


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
            <Header title={'Reddit for Students'}/>
            <div className={""}>
                {posts.map(post =>
                    <Post
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        post_text={post.post_text}
                        student_id={post.student_id}
                        changed={post.changed}
                        flag={post.flag}
                    />
                )}
            </div>
        </>
    )
}

export default Posts;
