import {imageGet} from "../constants/backendUrls";
import {useEffect, useState} from "react";
import useAlert from "../hooks/useAlrert";


function Image({id, imgType, alt}) {       //nedokoncene

    const [image, setImage] = useState(null);

    const fetchImage = () => {
        if (id == null) return;
        const req = fetch(imageGet, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id, "mextname": imgType})
        });
        req.then(res => {
            if (res.ok) {
                res.json().then(smth => console.log(smth))
            } else {
                res.json().then(data => console.error(data.msg))
            }
        })
    }

    useEffect(() => fetchImage(), []);

    return (
        <>
            <p>{alt}</p>
        </>
    )
}

export default Image;