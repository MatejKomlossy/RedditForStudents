import Image from "./Image";


function PostBody({maxLines, text, images}) {

    const renderLines = (txt) => {
        if (!txt) {
            return <div/>
        }
        let splitText = txt.split("\n")
        let maxNumOfLines = maxLines ? maxLines : splitText.length
        return splitText
            .slice(0, maxNumOfLines)
            .map((line, idx) => <p key={idx}>{line}</p>)
    }

    const renderImages = () => {
        if (!images) return <></>

        return images.map((img, idx) => {
                if (!img) return <div key={idx}></div>
                const imgFileName = imgAltFromWeirdImgString(img);
                return <Image
                    key={idx}
                    id={imgIdFromWeirdImgString(img)}
                    alt={imgFileName}
                    imgType={fileType(imgFileName)}
                />
            }
        )
    }

    const fileType = (fileName) => {
        return fileName.split('.').pop();
    }

    const imgIdFromWeirdImgString = (img) => {
        return weirdImgStringToArray(img)[0]
    }

    const imgAltFromWeirdImgString = (img) => {
        return weirdImgStringToArray(img)[1]
    }

    const weirdImgStringToArray = (img) => {
        return img.replace("[", "").replace("]", "").split(",")
    }

    return (
        <div>
            {renderLines(text)}
            {images &&
                <div>
                    {renderImages()}
                </div>
            }
        </div>
    )
}

export default PostBody;