import React, { useEffect, useState } from "react";
import getMonthName from "../../../utils/getMonthName";

export default function MounthSlider(props) {
    const slideStyle = {
        transform: `translateX(-${props.showedPost}00%)`
    }
    return (
        <div className="slider">
            <button className="slider-btn slider-btn_left" onClick={() => { props.switchMonth(-1) }}>  </button>
            <ul className="slider-container" style={slideStyle}>
                <li className="slider__el"><p className="slider__value"></p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(1)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(2)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(3)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(4)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(5)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(6)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(7)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(8)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(9)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(10)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(11)}</p></li>
                <li className="slider__el"><p className="slider__value">{getMonthName(12)}</p></li>
            </ul>
            <button className="slider-btn slider-btn_right" onClick={() => { props.switchMonth(1) }}> </button>
        </div>

    )
}