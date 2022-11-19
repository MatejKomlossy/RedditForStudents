import UserProfile from "../user/UserProfile";
import Header from "../Header";
import Post from "./Post";
import CreatePost from "./CreatePost";
import PostDetail from "./PostDetail";


function Posts(){

    return (
        <>
            <Header title={'Reddit for Students'}/>
            Page with posts. <br/>
            <Post
                id={420}
                title={"Post pre teba"}
                text= "#jankorazdva3   \n .hohrfdkhdf \n #uniquecharacter uniquecharacteruniquecharacteruniquecharacteruniquecharacteruniquecharacteruniquecharacteruniquecharacteruniquecharacteruniquecharacter"
            >
            </Post>
            <CreatePost></CreatePost>
            <PostDetail
                id={420}
                title={"Post detail"}
                text= "#jankorazdva3   \n .hohrfdkhdf \n #uniquecharacter"
            />
        </>
    )
}

export default Posts;
