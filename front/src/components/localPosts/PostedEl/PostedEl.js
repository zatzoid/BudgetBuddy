import React, { useEffect, useState } from "react";
import VisualBtn from "../../visualbtn/VisualBtn";

export default function PostedEl(props) {
    const [actionShowed, setActionShowed] = useState(false);
    function whatCategory(data) {
        switch (data) {
            case 'транспорт':
                return "auto";
            case 'жкх':
                return "jkh";
            case 'зарплата':
                return "zp";
            case 'другое':
                return "another";
            case 'питание':
                return "food";
            case 'развлечения':
                return "fun";
            case 'майнинг':
                return "mine";
            case 'взятка':
                return "vzyatka";
            default:
                return " ";
        }
    }
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

    return (
        <li className={`posted-el ${props.item.statusComplited && 'posted-el_complited'}`}>
            <div className={`posted-el__action ${actionShowed && 'posted-el__action_active'}`}>
                <button
                    disabled={props.isLoadingLP}
                    onClick={() => { props.deleteCashDataLP({ _id: props.item._id, kinde: props.kinde }) }}
                    className="posted-el__action-btn posted-el__action-btn_del" >
                </button>
                <button
                    disabled={props.emailModalLodaing}
                    onClick={() => { props.openEmailModal({ show: true, data: { name: props.keyName, value: props.value, originalCashDataId: props.item._id }, reminde: props.item.reminde }) }}
                    className={`posted-el__action-btn posted-el__action-btn_email  posted-el__action-btn_email-${props.item.reminde.status}`} >
                    ..
                </button>
                <button
                    disabled={props.isLoadingLP}
                    className='posted-el__action-btn posted-el__action-btn_statusComplited'>
                </button>
                <p className="posted-el__action-btn-desc">удалить запись</p>
                <p className="posted-el__action-btn-desc">отправить на почту</p>
                <p className="posted-el__action-btn-desc">вычеркнуть</p>
            </div>
            <div className="posted-el__heading-block">
                <span className={`posted-el__category posted-el__category_${whatCategory(props.item.category)}`}
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
            <p className="posted-el__date">{`Добавлено ${day}-${month}-${year} в ${hour}:${minutes > 9 ? minutes : `0${minutes}`}`}</p>
        </li>

    )
}