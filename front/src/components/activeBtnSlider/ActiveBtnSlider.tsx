interface props{
    transformValue: number
}

export default function ActuveBtnSlider(props: props) {
    return (
        <div className='activeBtnSlider__wrapper'
            style={{ transform: `translateX(${props.transformValue}00%)` }}>
            <span className='activeBtnSlider' />
        </div>
    )
}