import React from "react";

export default function ShowMoreBtn(props) {

    return (
        <div className="showMoreBtn">
            <span className={`showMoreBtn__left ${props.active && 'showMoreBtn__left_active'}`} />
            <span className={`showMoreBtn__right ${props.active && 'showMoreBtn__right_active'}`}/>
        </div>
    )
}