import {imageGet} from "../constants/backendUrls";
import {useEffect, useState} from "react";


function Image({id, imgType, alt, maxW}) {

    const [encodedImg, setEncodedImg] = useState(null);

    const fetchImage = () => {
        if (id == null) return;
        const req = fetch(imageGet, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id, "mextname": imgType})
        });
        req.then(res => {
            if (res.ok) {
                res.json().then(obj => setEncodedImg(obj.img))
            } else {
                res.json().then(data => console.error(data.msg))
            }
        })
    }

    useEffect(() => fetchImage(), []);

    return (
        <>
            {encodedImg &&
                <img
                    src={`${encodedImg}`}
                    alt={alt}
                    className={''}
                />
            }
        </>
    )
}

export default Image;