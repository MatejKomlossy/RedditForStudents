import Hyperlink from "../components/Hyperlink";


function PostBody ({maxLines, text, imageUrl}){

    const renderLines = (txt) => {
        if(!txt){
            return <p>no text</p>
        }
        let splitText = txt.split(/r?\n/)
        let maxNumOfLines = maxLines ? maxLines : splitText.length
        return splitText
            .slice(0, maxNumOfLines)
            .map((line, idx) => <p key={idx}>{line}</p>)
    }

    return (
        <div>
            {renderLines(text)}
            {imageUrl && <Hyperlink href={imageUrl} linkText={"link na image"}/>}
        </div>
    )
}

export default PostBody;