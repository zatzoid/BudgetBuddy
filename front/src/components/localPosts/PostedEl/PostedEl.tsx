import { useState } from "react";
import VisualBtn from "../../ui/visualbtn/VisualBtn";
import { CashData, CashDataPatch } from "../../../utils/types";
interface props {
    hidenComplitedPost: { lose: string, profit: string }
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

    const itemName = Object.keys(props.item.data)[0];
    const itemValue = Number(Object.values(props.item.data)[0])


    function changeStatusComplited() {

        const item = { ...props.item };
        item.statusComplited = !item.statusComplited;
        const cashData = { [props.kinde]: item };

        props.patchLPCashData({ cashData });
        setActionShowed(!actionShowed);
    }
    function deleteCashDataLP() {
        const item = props.item;
        const cashData = { [props.kinde]: item };
        props.deleteCashDataLP({ cashData });
    }

    function getCreatedDate(createdAt: Date): string {

        //today
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const previousDay = currentDate.getDate() - 1;
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        //createdAt
        const date = new Date(createdAt);
        const day = date.getDate().toFixed(0).padStart(2, '0')
        const month = (date.getMonth() + 1).toFixed(0).padStart(2, '0')
        const year = date.getFullYear();
        const hour = date.getHours().toFixed(0).padStart(2, '0')
        const minutes = date.getMinutes().toFixed(0).padStart(2, '0')

        if (currentDay === date.getDate() && currentMonth === date.getMonth() + 1 && currentYear === year) {
            return 'Добавлено сегодня'
        } else if (previousDay === date.getDate() && currentMonth === date.getMonth() + 1 && currentYear === year) {
            return 'Добавлено вчера'
        }
        return `Добавлено ${day}-${month}-${year} в ${hour}:${minutes}`
    }

    return (
        //props.item.statusComplited &&
        <li
            style={{ display: props.item.statusComplited ? props.hidenComplitedPost[props.kinde] : "block" }}
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
                    {getCreatedDate(props.item.createdAt)}
                </p>
            </div>

        </li>

    )
}