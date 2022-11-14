

function PostBody ({message}){

    let arr = [];

    function createChildren(message) {
        let messageLines = message.split("\\n");
        let messageImage = messageLines[messageLines.length-1].split(" ")[1];
        for (let i = 0; i < messageLines.length - 1; i++) {
            arr.push(<p key={i}>{messageLines[i]}</p>);
        }
        arr.push(<a key={messageLines.length-1} href={messageImage}>link na image</a>)
    }

    createChildren(message);

    return (
        <div>
            {arr}
        </div>
    )
}

export default PostBody;