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

// toto je pre update
import InputField from "../components/InputField";
import Textarea from 'react-expanding-textarea';
import DragDrop from "../components/DragDrop";
import {postCreate} from "../constants/backendUrls";
import convertToBase64 from "./FileConverter";


function PostDetail() {

    const {id} = useParams()
    const emptyPost = {title: "", post_text: ""}
    const [post, setPost] = useState(emptyPost)
    const [deleted, setDeleted] = useState(false)
    const [isStudentAuthor, setIsStudentAuthor] = useState(false)
    const [isEdited, setisEdited] = useState(false)
    

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
        if(!file) return;
        console.log("sme tuna")
        convertToBase64(file, setFileBase64);
    }, [file])
    

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

    // toot patri pre update edit

    function base64toBlob(base64Data, contentType) {
        contentType = contentType || '';
        let sliceSize = 1024;
        let byteCharacters = atob(base64Data);
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
    
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);
    
            let bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    const changeToEdditMode = () => {
        setisEdited(!isEdited)
        setTitle(post.title)
        // console.log(post.post_text)
        setText(post.post_text)
        // setFile()
        //console.log(post)
        //console.log(document.getElementsByTagName("img")[0].src )
        console.log(document.getElementsByTagName("img")[0] )
        //DragDrop.handleChange("NONE")

        const my_I = post.images[0].split(",")[1].replace("]","");
        console.log(base64toBlob(my_I,'image/png'))
        //setFileBase64(document.getElementsByTagName("img")[0].src )

        console.log(my_I)
        console.log("edit mode",    isEdited)
    }

    

    

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


    if (wasCreated) {
        return <Navigate to={posts}/>
    }
    const update = () => {
        console.log("update")
    }






    return (
        <>
            {showAlert && <Alert type={alertType} title={alertTitle} context={alertContext}/>}

            <Header title={'Reddit for Students'}/>
            {!isEdited &&
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
                    <div className={"ml-auto flex flex-row space-x-2 max-h-12"}>
                        <Button
                            type={'secondary'}
                            onClick={() => deletePost()}
                            children={<FaTrash/>}
                            ariaLabel={'delete file'}
                            className={'px-1 lg:px-1.5 py-1 lg:py-1.5'}
                        >
                        </Button>
                        <Button
                            type={'secondary'}
                            onClick={() => changeToEdditMode()}
                            children={"edit"}
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
        }
        {isEdited &&
                <div className="border-2 mt-6 border-blue-600 rounded-xl p-6 w-10/12 min-w-max mx-auto">

                    <div className="flex flex-col mx-auto gap-6">
                    <InputField type={'text'}
                                label={'Title'}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                    />

                    <Textarea
                        className="w-full outline-0 border-l-2 border-l-sky-500 resize-none px-2"
                        id="my-textarea"
                        maxLength="3000"
                        onChange={e => setText(e.target.value)}
                        value={text}
                        placeholder="Your message goes here :)"
                        rows={5}
                        
                    />

                    <div className="flex">
                        <DragDrop file={file} setFile={setFile}/>
                        <div className="flex-none w-30 h-14 ml-auto">
                            <Button
                                type={'primary'}
                                onClick={() => update()}
                                children={'update'}
                            />
                        </div>
                    </div>
                </div>
        </div>
        }
        </>
    )
}

export default PostDetail;