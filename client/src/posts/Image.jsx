import {imageGet} from "../constants/backendUrls";
import {useEffect, useState} from "react";


function Image({id, imgType, alt}) {       //nedokoncene

    const [src, setSrc] = useState("");

    const fetchImage = () => {
        if (id == null) return;
        const req = fetch(imageGet, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id, "mextname": imgType})
        });
        req.then(res => {
            if (res.ok) {
                res.blob().then(blob => setSrc(URL.createObjectURL(blob)))
            } else {
                res.json().then(data => console.error(data.msg))
            }
        })
    }

    useEffect(() => fetchImage(), []);

    return (
        <>
            {src && <img alt={alt} src={src}></img>}
        </>
    )
}

export default Image;