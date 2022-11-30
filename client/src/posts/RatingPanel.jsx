import {FaGrinStars, FaGrimace, FaSkull} from 'react-icons/fa';
import Button from "../components/Button";
import React, {useState} from "react";


function RatingPanel({student_id, rating, users_rating}) {

    const [usersRating, setUsersRating] = useState(users_rating)

    const buttonClass = 'max-w-min px-1 lg:px-1.5 py-1 lg:py-1.5 border-0';

    return (
        <div className={'p-2 flex flex-row space-x-3'}>
            <div title={'Like'}>
                <Button
                    type={'primary'}
                    onClick={() => {
                    }}
                    children={<FaGrinStars/>}
                    className={buttonClass}
                    disabled={usersRating !== null}
                >
                </Button>
            </div>
            <p className={'my-auto text-indigo-700 text-xl'}>
                {rating? rating : 0}
            </p>
            <div title={'Dislike'}>
                <Button
                    type={'primary'}
                    onClick={() => {
                    }}
                    children={<FaGrimace/>}
                    className={buttonClass}
                    disabled={usersRating !== null}
                >
                </Button>
            </div>
            <div title={'Outdated'}>
                <Button
                    type={'primary'}
                    onClick={() => {
                    }}
                    children={<FaSkull/>}
                    className={buttonClass}
                    disabled={usersRating !== null}
                >
                </Button>
            </div>
        </div>
    )
}

export default RatingPanel;