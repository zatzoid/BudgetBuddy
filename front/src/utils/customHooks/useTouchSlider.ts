import { useState } from "react";
interface props {
    step: number
    callback: (arg: number) => void;
}


export default function useTouchSlider(data: props) {
    const { step, callback } = data
    const [sliderStartX, setSliderStartX] = useState<null | number>(null);
    const [sliderStartY, setSliderStartY] = useState<null | number>(null);
    const slideStyle = {
        transform: `translateX(calc(-${step}00% - ${step > 0 ? 15 : 0}px))`
    }
    const sliderStyleY = {
        transform: `translateY(-${step}00%)`
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleTouchStart(e: any) {
        setSliderStartX(e.touches ? e.touches[0].clientX : e.clientX);

    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleTouchStartY(e: any) {
        setSliderStartX(e.touches ? e.touches[0].clientY : e.clientY);
    }

    /**
     * function handleTouchStart(e: unknown) {
        if (e instanceof TouchEvent) {
            const evt = e as TouchEvent;
            setSliderStartX(evt.touches[0].clientX);
        } else if (e instanceof MouseEvent) {
            const evt = e as MouseEvent;
            setSliderStartX(evt.clientX);
        } else {
            console.log('wrong type of atr on event', typeof e, e);
        }

    } 
     function handleTouchStartY(e: unknown) {
        if (e instanceof TouchEvent) {
            const evt = e as TouchEvent;
            setSliderStartX(evt.touches[0].clientY);
        } else if (e instanceof MouseEvent) {
            const evt = e as MouseEvent;
            setSliderStartX(evt.clientY);
        } else {
            console.log('wrong type of atr on event');
        }
    }
    */


    // Обработчик перемещения касания или мыши
    function handleTouchMove(e: unknown) {
        if (sliderStartX === null) return;

        const currentX = e instanceof TouchEvent ? e.touches[0].clientX : e instanceof MouseEvent ? e.clientX : 0;
        const deltaX = currentX - sliderStartX;
        if (deltaX > 100) {
            callback(-1);
            setSliderStartX(null);
        } else if (deltaX < -100) {
            callback(1);
            setSliderStartX(null);
        }
    }
    function handleTouchMoveY(e: unknown) {
        if (sliderStartY === null) return;
        const currentY = e instanceof TouchEvent ? e.touches[0].clientY : e instanceof MouseEvent ? e.clientY : 0;
        const deltaY = currentY - sliderStartY;
        if (deltaY > 100) {
            callback(-1);
            setSliderStartY(null);
        } else if (deltaY < -100) {
            callback(1);
            setSliderStartY(null);
        }
    }

    // Обработчик окончания касания или клика
    function handleTouchEnd() {
        setSliderStartX(null);
    }
    function handleTouchEndY() {
        setSliderStartY(null);
    }

    return { handleTouchStart, handleTouchStartY, handleTouchMove, handleTouchMoveY, handleTouchEnd, handleTouchEndY, slideStyle, sliderStyleY }
}