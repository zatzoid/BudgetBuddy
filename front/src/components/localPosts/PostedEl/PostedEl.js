import React from "react";
import Border from "../../border/Border";

export default function PostedEl(props) {

    return (
        <li className="posted-el">
            <p className="posted-el-value posted-el-value_heading">{props.keyName}</p>
            <button 
            className="posted-el__del-btn"
            />
            <p className="posted-el-value posted-el-value_value">{props.value}</p>
            
            <Border />
        </li>

    )
}