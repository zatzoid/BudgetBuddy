import  { useEffect, useState } from "react";
import VisualBtn from "../../visualbtn/VisualBtn";
import { CashData, CashDataPatch } from "../../../utils/types";
interface props {
    showComplitedPosts: { lose: string, profit: string }
    patchLPCashData: (data: CashDataPatch) => void
    emailModalLodaing: boolean
    openEmailModal: (data: CashData) => void
    isLoadingLP: boolean
    deleteCashDataLP: (data: CashDataPatch) => void
    item: CashData
    key: string
    kinde: 'lose' | 'profit'

}

export default function PostedEl(props: props) {
    const [actionShowed, setActionShowed] = useState(false);
    const [currentDateString, setCurrentDateString] = useState<string>('');
    const date = new Date(props.item.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const itemName = Object.keys(props.item.data)[0];
    const itemValue = Number(Object.values(props.item.data)[0])


    function changeStatusComplited() {
        const item = props.item;
        item.statusComplited = !item.statusComplited;
        const cashData = { [props.kinde]: item };


        props.patchLPCashData({ cashData });
        setActionShowed(!actionShowed)
    }
    function deleteCashDataLP() {
        const item = props.item;
        const cashData = { [props.kinde]: item };
        props.deleteCashDataLP({ cashData });
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
        //props.item.statusComplited &&
        <li
            style={{ display: props.item.statusComplited ? props.showComplitedPosts[props.kinde]: "block" }}
            className='posted-el' >
            <div className={`posted-el__action ${actionShowed && 'posted-el__action_active'}`}>
                <button
                    disabled={props.isLoadingLP}
                    onClick={() => { deleteCashDataLP() }}
                    className="posted-el__action-btn posted-el__action-btn_del" >
                </button>
                <button
                    disabled={props.emailModalLodaing}
                    onClick={() => { props.openEmailModal(props.item) }}
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
                    <p className="posted-el-value posted-el-value_heading">{itemName}</p>
                </div>
                <button className="posted-el__action-show-btn"
                    onClick={() => { setActionShowed(!actionShowed) }}>
                    <VisualBtn
                        cancel={actionShowed}
                        action={!actionShowed}
                    />
                </button>
                <p className="posted-el-value posted-el-value_value">{itemValue}</p>
                <p className="posted-el__date">
                    {currentDateString.length > 2 ? `Добавлено ${currentDateString}` :
                        `Добавлено ${day}-${month}-${year} в ${hour}:${minutes > 9 ? minutes : `0${minutes}`}`}
                </p>
            </div>

        </li>

    )
}