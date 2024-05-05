import getMonthName from "../../../utils/getMonthName";
import useTouchSlider from "../../../utils/customHooks/useTouchSlider";
interface props {
    showedPost: number
    switchMonth: (data: number) => void

}

export default function MounthSlider(props: props) {
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: props.showedPost, callback: props.switchMonth })
    return (
        <section className="slider"
            onTouchStart={() => handleTouchStart}
            onTouchMove={() => handleTouchMove}
            onTouchEnd={() => handleTouchEnd}
            onMouseDown={() => handleTouchStart}
            onMouseMove={() => handleTouchMove}
            onMouseUp={() => handleTouchEnd}>
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
        </section>

    )
}