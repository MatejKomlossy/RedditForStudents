import {useState, useEffect, useRef} from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Textarea from 'react-expanding-textarea';
import DragDrop from "../components/DragDrop";


function CreatePost({}) {

    const textareaRef = useRef(null)
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        textareaRef.current.focus()
    }, [])

    return (
        <div className="border-2 border-blue-600 rounded-xl p-6 w-10/12 min-w-max mx-auto">
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
                        <Button onClick={() => console.log("Post")} type={'primary'} children={'Post'}/>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreatePost;