import UserProfile from "../user/UserProfile";
import Header from "../Header";
import Post from "./Post";
import CreatePost from "./CreatePost";


function Posts(){

    return (
        <>
            <Header title={'Reddit for Students'}/>
            Page with posts. <br/>
            <Post></Post>
            <CreatePost></CreatePost>
        </>
    )
}

export default Posts;
