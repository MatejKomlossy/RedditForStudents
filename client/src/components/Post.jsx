import { Textarea } from "@material-tailwind/react";
import InputField from "./InputField";
import Button from "./Button";
import {useState} from "react";
import PostBody from "./PostBody";

function Post ({}){

    return (
        <div className=" flex-col border-4 border-blue-600 rounded-2xl mt-8 p-6  w-2/3 min-w-max  mx-auto ">  
            <div className={"flex-col space-y-5"}>
                <div className="flex-col mx-auto">
                    <div>
                        <h2 className="text-2xl mb-2">Title</h2>
                        <PostBody message="#jankorazdva3    \n\n\n .hohrfdkhdf \n#uniquecharacter './img/Capture.png'"></PostBody>
                    </div>
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

export default Post;