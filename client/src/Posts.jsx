import UserProfile from "./user/UserProfile";
import Header from "./Header";


function Posts(){

    return (
        <>
            <Header title={'Reddit for Students'}/>
            Page with posts. <br/>
            Your username: {UserProfile.getUsername()} <br/>
            Are you logged in? {"" + UserProfile.isUserLoggedIn()}
        </>
    )
}

export default Posts;
