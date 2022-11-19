import UserProfile from "../user/UserProfile";
import Header from "../Header";
import Post from "./Post";
import CreatePost from "./CreatePost";


function Posts(){

    return (
        <>
            <Header title={'Reddit for Students'}/>
            Page with posts. <br/>
            Your username: {UserProfile.getUsername()} <br/>
            Are you logged in? {"" + UserProfile.isUserLoggedIn()}
            <Post></Post>
            <CreatePost></CreatePost>
        </>
    )
}

export default Posts;
