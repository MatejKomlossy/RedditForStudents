import PostBody from "./PostBody";
import {Link} from "react-router-dom";
import {postDetail} from "../constants/frontendUrls";
import RatingPanel from "./RatingPanel";


function Post({id, title, post_text, student_id, rating, users_rating}) {  //zobrat z post objektu
    return (

        <div
            className="flex-col rounded-xl w-10/12 mx-auto bg-gradient-to-b from-cyan-300 to-blue-300
                shadow-lg shadow-blue-900 hover:bg-gradient-to-r hover:scale-105 hover:cursor-pointer
                transition-all duration-300 ease-in-out"
        >
            <Link to={`${postDetail}/${id}`}>
                <div className="flex-col space-y-5 mx-auto overflow-hidden px-6 pt-6">
                    <div>
                        <h2 className="text-2xl mb-2">{title}</h2>
                        <PostBody
                            text={post_text}
                            maxLines={3}
                        >
                        </PostBody>
                    </div>
                </div>
            </Link>
            <RatingPanel
                student_id={student_id}
                rating={rating}
                users_rating={users_rating}
                post_id={id}
            />
        </div>

    )
}

export default Post;