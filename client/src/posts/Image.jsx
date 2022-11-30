import {imageGet} from "../constants/backendUrls";
import {useEffect, useState} from "react";


function Image({id, imgType, alt}) {       //nedokoncene

    const [encodedImg, setEncodedImg] = useState("");
    const [decodedImg, setDecodedImg] = useState(null);

    const fetchImage = () => {
        if (id == null) return;
        const req = fetch(imageGet, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id, "mextname": imgType})
        });
        req.then(res => {
            if (res.ok) {
                res.json().toString()
            } else {
                res.json().then(data => console.error(data.msg))
            }
        })
    }

    useEffect(() => fetchImage(), []);

    return (
        <>
            {decodedImg &&
                <img
                    src={`data:image/jpeg;base64,${encodedImg}`}
                    alt={alt}
                />
            }
        </>
    )
}

export default Image;