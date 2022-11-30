import {FaGrinStars, FaGrimace, FaSkull} from 'react-icons/fa';
import Button from "../components/Button";
import React, {useState} from "react";


function RatingPanel({student_id, rating, users_rating}) {

    const [postRating, setPostRating] = useState(rating)
    const [usersRating, setUsersRating] = useState(users_rating)

    const buttonClass = 'max-w-min px-1 lg:px-1.5 py-1 lg:py-1.5 border-0';

    return (
        <div className={'p-2 flex flex-row space-x-3'}>
            <div title={'Like'}>
                <Button
                    type={'secondary'}
                    onClick={() => {
                    }}
                    children={<FaGrinStars/>}
                    className={buttonClass}
                >
                </Button>
            </div>
            <div title={'Dislike'}>
                <Button
                    type={'secondary'}
                    onClick={() => {
                    }}
                    children={<FaGrimace/>}
                    className={buttonClass}
                >
                </Button>
            </div>
            <div title={'Outdated'}>
                <Button
                    type={'secondary'}
                    onClick={() => {
                    }}
                    children={<FaSkull/>}
                    className={buttonClass}
                >
                </Button>
            </div>
        </div>
    )
}

export default RatingPanel;