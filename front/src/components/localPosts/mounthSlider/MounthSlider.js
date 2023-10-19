import React, { useEffect, useState } from "react";
import getMonthName from "../../../utils/getMonthName";

export default function MounthSlider() {
    const [currentMounth, setCurrentMounth] = useState(0);
    const slideStyle = {
        transform: `translateX(-${currentMounth}00%)`
    }
    useEffect(() => {
        const date = new Date;
        console.log(date.getMonth() + 1)
        setCurrentMounth(date.getMonth() + 1)

    }, []);
    function sliderMove(e) {
        setCurrentMounth(currentMounth + e)
    }

    return (
        <div className="slider">
            <button className="slider-btn slider-btn_left" onClick={() => { sliderMove(-1) }}>  </button>
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
            <button className="slider-btn slider-btn_right" onClick={() => { sliderMove(1) }}> </button>
        </div>

    )
}