interface props {
    step: number
    callback: (arg: number) => void;
}


export default function useTouchSlider(data: props) {
    const { step, callback } = data;
    let sliderStartX: null | number = null
   // const [sliderStartX, setSliderStartX] = useState<null | number>(null);
    const slideStyle = {
        transform: `translateX(calc(-${step}00% - ${step > 0 ? 15 : 0}px))`
    }
    const sliderStyleY = {
        transform: `translateY(-${step}00%)`
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleTouchStart(e: any) {
        sliderStartX = (e.nativeEvent instanceof TouchEvent ? e.nativeEvent.touches[0].clientX : e.nativeEvent instanceof MouseEvent ? e.nativeEvent.clientX : 0);


    }

    function handleTouchStartY(e: React.SyntheticEvent) {
        sliderStartX = (e.nativeEvent instanceof TouchEvent ? e.nativeEvent.touches[0].clientY : e.nativeEvent instanceof MouseEvent ? e.nativeEvent.clientY : 0);

    }


    // Обработчик перемещения касания или мыши
    function handleTouchMove(e: React.SyntheticEvent) {
        if (sliderStartX === null) return;

        const currentX = e.nativeEvent instanceof TouchEvent ? e.nativeEvent.touches[0].clientX : e.nativeEvent instanceof MouseEvent ? e.nativeEvent.clientX : 0;
        const deltaX = currentX - sliderStartX;
        if (deltaX > 100) {
            callback(-1);
            sliderStartX = (null);
        } else if (deltaX < -100) {
            callback(1);
            sliderStartX = (null);
        }
    }



    // Обработчик окончания касания или клика
    function handleTouchEnd() {
        sliderStartX = (null);
    }
    

    return { handleTouchStart, handleTouchStartY, handleTouchMove, handleTouchEnd,  slideStyle, sliderStyleY }
}