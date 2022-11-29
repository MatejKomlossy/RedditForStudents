import {imageGet} from "../constants/backendUrls";
import {useEffect, useState} from "react";


function Image({id, title}) {       //nedokoncene

    const [image, setImage] = useState(null);

    const fetchImage = () => {
        if (id == null) return;
        const req = fetch(imageGet, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"id": id})
        });
        req.then(res => {
            if (res.ok) {
                res.json().then(post => setImage(post))
            } else {
                res.json().then(data => showError(data.msg))
            }
        }).catch(err => {
            showError(err)
        })
    }

    useEffect(() => fetchImage(), []);

    return (
        <>
        </>
    )
}

export default Image;