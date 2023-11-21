import React, { useEffect, useState } from "react";
import VisualBtn from "../../visualbtn/VisualBtn";

export default function PostedEl(props) {
    const [actionShowed, setActionShowed] = useState(false);
    const [currentDateString, setCurrentDateString] = useState(null);
    const date = new Date(props.item.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    function showAction() {
        if (actionShowed) {
            setActionShowed(false)
        } else {
            setActionShowed(true)
        }
    }
    async function changeStatusComplited() {
        const data = props.item;
        data.statusComplited = !data.statusComplited;
        const cashData = { [props.kinde]: data };
        await props.patchLPCashData({ cashData });
        showAction();
    }
    useEffect(() => {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const previousDay = currentDate.getDate() - 1;
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        function checkToday() {
            if (currentDay === day && currentMonth === month && currentYear === year) {
                setCurrentDateString('Сегодня')
            } else if (previousDay === day && currentMonth === month && currentYear === year) {
                setCurrentDateString('Вчера')
            }
        }
        checkToday()
    }, [])
    return (
        <li
            style={{ display: props.item.statusComplited && props.complitedElStatus[props.kinde] }}
            className='posted-el' >
            <div className={`posted-el__action ${actionShowed && 'posted-el__action_active'}`}>
                <button
                    disabled={props.isLoadingLP}
                    onClick={() => { props.deleteCashDataLP({ _id: props.item._id, kinde: props.kinde }) }}
                    className="posted-el__action-btn posted-el__action-btn_del" >
                </button>
                <button
                    disabled={props.emailModalLodaing}
                    onClick={() => { props.openEmailModal({ show: true, data: { name: props.keyName, value: props.value, originalCashDataId: props.item._id, kinde: props.kinde }, reminde: props.item.reminde }) }}
                    className={`posted-el__action-btn posted-el__action-btn_email  posted-el__action-btn_email-${props.item.reminde.status}`} >

                </button>
                <button
                    onClick={() => { changeStatusComplited() }}
                    disabled={props.isLoadingLP}
                    className={`posted-el__action-btn  ${props.item.statusComplited ? 'posted-el__action-btn_statusComplited_active ' : 'posted-el__action-btn_statusComplited'}`}>
                </button>
                <p className="posted-el__action-btn-desc">удалить запись</p>
                <p className="posted-el__action-btn-desc">отправить на почту</p>
                <p className="posted-el__action-btn-desc">{`${props.item.statusComplited ? 'вычеркнуто' : 'вычеркнуть'}`}</p>
            </div>
            <div className={`posted-el-main-data ${props.item.statusComplited && 'posted-el-main-data_complited'}`}>
                <div className="posted-el__heading-block">
                    <span className={`posted-el__category back-img_${props.item.category}`}
                        title={`${props.item.category}`}></span>
                    <p className="posted-el-value posted-el-value_heading">{props.keyName}</p>
                </div>
                <button className="posted-el__action-show-btn"
                    onClick={() => { showAction() }}>
                    <VisualBtn
                        cancel={actionShowed}
                        action={!actionShowed}
                    />
                </button>
                <p className="posted-el-value posted-el-value_value">{props.value}</p>
                <p className="posted-el__date">
                    {currentDateString !== null ? `Добавлено ${currentDateString}` :
                        `Добавлено ${day}-${month}-${year} в ${hour}:${minutes > 9 ? minutes : `0${minutes}`}`}
                </p>
            </div>

        </li>

    )
}