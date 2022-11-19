import PostBody from "./PostBody";
import Button from "../components/Button";


function Post ({}){

    return (
        <div className=" flex-col border-4 border-blue-600 rounded-2xl mt-8 p-6  w-2/3 min-w-max  mx-auto ">
            <div className={"flex-col space-y-5"}>
                <div className="flex-col mx-auto">
                    <div>
                        <h2 className="text-2xl mb-2">Title</h2>
                        <PostBody
                            message="#jankorazdva3    \n\n\n .hohrfdkhdf \n#uniquecharacter"
                            imageUrl = "./img/Capture.png"
                        >
                        </PostBody>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Post;