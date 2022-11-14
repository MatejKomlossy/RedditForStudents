import UserProfile from "./user/UserProfile";
import Header from "./Header";
import Post from "./components/CreatePost";
import CreatePost from "./components/Post";

function Posts(){

    return (
        <div>
            <Header title={'Reddit for Students'}/>
            <div className="flex flex-col content-center space-y-5 "> 
                Page with posts. <br/>
                Your username: {UserProfile.getUsername()} <br/>
                Are you logged in? {"" + UserProfile.isUserLoggedIn()}
                <Post></Post>
                <CreatePost></CreatePost>
            </div>
        </div>
    )
}

export default Posts;
