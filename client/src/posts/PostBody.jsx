import Hyperlink from "../components/Hyperlink";


function PostBody ({text, imageUrl}){

    const renderLines = (txt) => {
        if(!txt) return <p>no text</p>
        return txt.split("\\n").map((line, idx) => <p key={idx}>{line}</p>)
    }

    return (
        <div>
            {renderLines(text)}
            <Hyperlink href={imageUrl} linkText={"link na image"}/>
        </div>
    )
}

export default PostBody;