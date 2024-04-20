interface props {
    active: boolean
}

export default function ShowMoreBtn(props: props) {

    return (
        <div className="showMoreBtn" onClick={(evt) => { evt.preventDefault() }}>
            <span className={`showMoreBtn__left ${props.active && 'showMoreBtn__left_active'}`} />
            <span className={`showMoreBtn__right ${props.active && 'showMoreBtn__right_active'}`} />
        </div>
    )
}