import {FaGrinStars, FaGrimace, FaSkull} from 'react-icons/fa';
import Button from "../components/Button";
import React, {useState} from "react";
import {dislike, like, outdated} from "../constants/otherConstants";
import {postRatingCreate, postRatingDelete, postRatingUpdate} from "../constants/backendUrls";


function RatingPanel({post_id, rating, users_rating}) {

    const [usersRating, setUsersRating] = useState(users_rating)  //category (-1, 0, 1)
    const [postRating, setPostRating] = useState(parseInt(rating))

    const buttonClass = 'max-w-min px-1 lg:px-1.5 py-1 lg:py-1.5 border-0';

    const sendRating = (category) => {
        if(category === usersRating){
            setPostRating(postRating - category)
            setUsersRating(null)
            doSendRating(category, postRatingDelete)
            return
        }
        setUsersRating(category)
        if(usersRating === null){
            setPostRating(postRating + category)
            doSendRating(category, postRatingCreate)
            return
        }
        const newPostRating = postRating - usersRating + category
        setPostRating(newPostRating)
        doSendRating(category, postRatingUpdate)
    }

    const doSendRating = (category, endpointUrl) => {
        const req = fetch(endpointUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"category": category, "post_id": post_id})
        });
        req.then(res => {
            if (res.ok) {

            } else {
                res.json().then(data => console.error(data.msg))
            }
        }).catch(err => {
            console.error(err)
        })
    }

    function clickedClass(category){
        if(category === usersRating){
            return "text-orange-500"
        }
        return ""
    }

    return (
        <div className={'p-2 flex flex-row space-x-3'}>
            <div title={'Like'}>
                <Button
                    type={'primary'}
                    onClick={() => sendRating(like)}
                    children={<FaGrinStars/>}
                    className={buttonClass + " " + clickedClass(like)}
                >
                </Button>
            </div>
            <p className={'my-auto text-indigo-700 text-xl'}>
                {postRating? postRating : 0}
            </p>
            <div title={'Dislike'}>
                <Button
                    type={'primary'}
                    onClick={() => sendRating(dislike)}
                    children={<FaGrimace/>}
                    className={buttonClass + " " + clickedClass(dislike)}
                >
                </Button>
            </div>
            <div title={'Outdated'}>
                <Button
                    type={'primary'}
                    onClick={() => sendRating(outdated)}
                    children={<FaSkull/>}
                    className={buttonClass + " " + clickedClass(outdated)}
                >
                </Button>
            </div>
        </div>
    )
}

export default RatingPanel;