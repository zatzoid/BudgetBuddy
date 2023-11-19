import React, { useEffect, useState } from "react";
import useTouchSlider from "../../utils/customHooks/useTouchSlider";

export default function Present() {
    const [translateValue, setTranslateValue] = useState(0);
    const { handleTouchStartY, handleTouchMoveY, handleTouchEndY, sliderStyleY } = useTouchSlider({ slideFunction: scrollPresent , step: translateValue })
    
    function scrollPresent(val) {
        if (translateValue + val < 3) {
            setTranslateValue(translateValue + val)
        }
        else {
            setTranslateValue(0)
        }
    }
    return (
        <div className="present">
            <div className="present-wrapper"
                style={sliderStyleY}
                onTouchStart={handleTouchStartY}
                onTouchMove={handleTouchMoveY}
                onTouchEnd={handleTouchEndY}
                onMouseDown={handleTouchStartY}
                onMouseMove={handleTouchMoveY}
                onMouseUp={handleTouchEndY}>
    
                <div className="present__el present__el_one">
                    1

                    <button className="present__el-btn" onClick={() => { scrollPresent(translateValue + 1) }} />
                </div>
                <div className="present__el present__el_two">
                   2
                    <button className="present__el-btn present__el-btn_top"
                        onClick={() => { scrollPresent(translateValue - 1) }} />
                    <button className="present__el-btn" onClick={() => { scrollPresent(translateValue + 1) }} />

                </div>
                <div className="present__el present__el_three">
                    3
                    <button className="present__el-btn present__el-btn_top"
                        onClick={() => { scrollPresent(translateValue - 1) }} />

                </div>
            </div>
        </div>
    )
}