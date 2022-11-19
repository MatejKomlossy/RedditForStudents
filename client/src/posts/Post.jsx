import PostBody from "./PostBody";
import {Link} from "react-router-dom";


function Post({id, title, text, imgUrl}) {

    return (
        <div
            className="flex-col rounded-xl p-6 w-10/12 mx-auto bg-gradient-to-b from-cyan-300 to-blue-300
                shadow-lg shadow-blue-900 hover:bg-gradient-to-r hover:scale-110 hover:cursor-pointer
                transition-all duration-300 ease-in-out"
        >
            <Link to={`/postDetail/${id}`}>
                <div className="flex-col space-y-5 mx-auto overflow-hidden">
                    <div>
                        <h2 className="text-2xl mb-2">{title}</h2>
                        <PostBody
                            text={text}
                            maxLines={3}
                        >
                        </PostBody>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Post;