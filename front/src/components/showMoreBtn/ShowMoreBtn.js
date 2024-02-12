import React from "react";

export default function ShowMoreBtn(props) {

    return (
        <button className="showMoreBtn" onClick={(evt)=>{evt.preventDefault()}}>
            <span className={`showMoreBtn__left ${props.active && 'showMoreBtn__left_active'}`} />
            <span className={`showMoreBtn__right ${props.active && 'showMoreBtn__right_active'}`}/>
        </button>
    )
}