import React, { useState } from "react";


export default function useTouchSlider(data) {

    const [sliderStartX, setSliderStartX] = useState(null);

    const slideStyle = {
        transform: `translateX(-${data.step}00%)`
    }
    const handleTouchStart = (e) => {
        setSliderStartX(e.touches ? e.touches[0].clientX : e.clientX);
    };

    // Обработчик перемещения касания или мыши
    const handleTouchMove = (e) => {
        if (sliderStartX === null) return;
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = currentX - sliderStartX;
        if (deltaX > 50) {
             data.slideFunction(-1);
            setSliderStartX(null);
        } else if (deltaX < -50) {
             data.slideFunction(1);
            setSliderStartX(null);
        }
    };

    // Обработчик окончания касания или клика
    const handleTouchEnd = () => {
        setSliderStartX(null);
    };
    return { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle }
}