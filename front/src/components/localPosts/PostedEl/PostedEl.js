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
            <p className="posted-el-value posted-el-value_value">{props.value}</p>
        </li>

    )
}