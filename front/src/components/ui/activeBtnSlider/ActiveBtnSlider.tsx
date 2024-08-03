import { memo } from "react"

interface props {
    transformValue: number
}

const ActuveBtnSlider = memo((props: props) => {
    return (
        <div className='activeBtnSlider__wrapper'
            style={{ transform: `translateX(${props.transformValue}00%)` }}>
            <span className='activeBtnSlider' />
        </div>
    )
})

export default ActuveBtnSlider