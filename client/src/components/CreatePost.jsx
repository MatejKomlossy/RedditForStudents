import { Textarea } from "@material-tailwind/react";
import InputField from "./InputField";
import Button from "./Button";
import {useState} from "react";

function CreatePost ({}){

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");


    return (
        <div className=" flex-col border-4 border-blue-600 rounded-2xl mt-8 p-6  w-2/3 min-w-max  mx-auto ">  
            <div className={"flex-col space-y-5"}>
                <div className="flex-col mx-auto">
                    <InputField type={'text'}
                                label={'Title'}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                    />
                    <Textarea label="Message" 
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