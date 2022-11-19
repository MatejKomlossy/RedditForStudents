import PostBody from "./PostBody";
import {useParams} from 'react-router-dom'
import {useState} from "react";
import Header from "../Header";


function PostDetail() {

    const {id} = useParams()
    const [title, setTitle] = useState("title")
    const [text, setText] = useState("text")

    return (
        <>
            <Header title={'Reddit for Students'}/>
            <div
                className="flex-col rounded-xl p-6 w-10/12 min-w-max mx-auto bg-gradient-to-b from-cyan-300 to-blue-300">
                <div className={"flex-col mx-auto space-y-5"}>
                    <div>
                        <h2 className="text-2xl mb-2">{title}</h2>
                        <PostBody
                            text={text}
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