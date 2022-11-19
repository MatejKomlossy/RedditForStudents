import {useState} from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";

function CreatePost ({}){

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div className="flex-col border-2 border-blue-600 rounded-xl p-6 w-10/12 min-w-max mx-auto">
            <div className={"flex-col space-y-5"}>
                <div className="flex-col mx-auto">
                    <InputField type={'text'}
                                label={'Title'}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                    />
                    {/*textarea tu namieso toho*/}
                    <InputField label="Message"
                              onChange={e => setMessage(e.target.value)}/>
                    <div className="flex">
                        <div className="grow h-14">
                            tu bude drag and drop
                        </div>
                        <div className="flex-none w-30 h-14">
                            <Button onClick={() => console.log("Post")} type={'primary'} children={'Post'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreatePost;