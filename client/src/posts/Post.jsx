import PostBody from "./PostBody";


function Post ({}){

    return (
        <div className="flex-col rounded-xl p-6 w-2/3 min-w-max mx-auto bg-gradient-to-b from-cyan-300 to-blue-300
        shadow-lg shadow-blue-900 hover:bg-gradient-to-r hover:scale-110 hover:cursor-pointer
        transition-all duration-300 ease-in-out">
            <div className={"flex-col space-y-5"}>
                <div className="flex-col mx-auto">
                    <div>
                        <h2 className="text-2xl mb-2">Title</h2>
                        <PostBody
                            text = "#jankorazdva3    \n\n\n .hohrfdkhdf \n#uniquecharacter"
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