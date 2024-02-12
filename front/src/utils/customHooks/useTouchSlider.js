import React, { useState } from "react";


export default function useTouchSlider(data) {
    const [sliderStartX, setSliderStartX] = useState(null);
    const [sliderStartY, setSliderStartY] = useState(null);
    const slideStyle = {
        transform: `translateX(calc(-${data.step}00% - ${data.step > 0 ? 15 : 0}px))`
    }
    const sliderStyleY = {
        transform: `translateY(-${data.step}00%)`
    }
    const handleTouchStart = (e) => {
        setSliderStartX(e.touches ? e.touches[0].clientX : e.clientX);
    };
    const handleTouchStartY = (e) => {
        setSliderStartY(e.touches ? e.touches[0].clientY : e.clientY);
    };

    // Обработчик перемещения касания или мыши
    const handleTouchMove = (e) => {
        if (sliderStartX === null) return;
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - sliderStartX;
        if (deltaX > 100) {
            data.slideFunction(-1);
            setSliderStartX(null);
        } else if (deltaX < -100) {
            data.slideFunction(1);
            setSliderStartX(null);
        }
    };
    const handleTouchMoveY = (e) => {
        if (sliderStartY === null) return;
        const currentY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = currentY - sliderStartY;
        if (deltaY > 100) {
            data.slideFunction(-1);
            setSliderStartY(null);
        } else if (deltaY < -100) {
            data.slideFunction(1);
            setSliderStartY(null);
        }
    };

    // Обработчик окончания касания или клика
    const handleTouchEnd = () => {
        setSliderStartX(null);
    };
    const handleTouchEndY = () => {
        setSliderStartY(null);
    };

    return { handleTouchStart, handleTouchStartY, handleTouchMove, handleTouchMoveY, handleTouchEnd, handleTouchEndY, slideStyle, sliderStyleY }
}