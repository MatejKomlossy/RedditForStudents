import PostBody from "./PostBody";


function PostDetail({id, title, text, imgUrl}) {

    return (
        <div className="flex-col rounded-xl p-6 w-2/3 min-w-max mx-auto bg-gradient-to-b from-cyan-300 to-blue-300
        shadow-lg shadow-blue-900 hover:bg-gradient-to-r hover:scale-110 hover:cursor-pointer
        transition-all duration-300 ease-in-out">
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

    )
}

export default PostDetail;