import Header from "../Header";
import CreatePost from "./CreatePost";

function CreatePostPage() {

    return (
        <>
            <Header title={'Reddit for Students'}/>
            <div className={"mt-6"}>
                <CreatePost/>
            </div>
        </>
    )
}

export default CreatePostPage;
