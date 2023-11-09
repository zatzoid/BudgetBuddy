import React from "react";
import Border from "../../border/Border";
import VisualBtn from "../../visualbtn/VisualBtn";

export default function PostedEl(props) {

    return (
        <li className="posted-el">
            <p className="posted-el-value posted-el-value_heading">{props.keyName}</p>
            <button
                disabled={props.isLoadingLP}
                onClick={() => { props.deleteCashDataLP({ _id: props.objId, kinde: props.kinde }) }}
                className="posted-el__del-btn" >
                <VisualBtn
                    loading={props.isLoadingLP}
                    cancel={true} />
            </button>
            <button
                onClick={() => { props.openEmailModal({ show: true, data: { name: props.keyName, value: props.value, originalCashDataId: props.objId }, reminde: props.reminde }) }}
                className={`posted-el-email-btn 
                ${props.reminde.status === 'added' && 'posted-el-email-btn_added'}
                ${props.reminde.status === 'sended' && 'posted-el-email-btn_sended'}`} />
            <p className="posted-el-value posted-el-value_value">{props.value}</p>
        </li>

    )
}