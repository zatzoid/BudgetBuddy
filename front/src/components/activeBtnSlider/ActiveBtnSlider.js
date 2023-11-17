import React from "react";

export default function ActuveBtnSlider(props) {
    return (
        <div className='activeBtnSlider__wrapper'
            style={{ transform: `translateX(${props.transformValue}00%)` }}>
            <span className='activeBtnSlider' />
        </div>
    )
}