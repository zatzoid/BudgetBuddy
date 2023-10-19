import React from "react";

export default function Border(props) {
    const value = false
    const errorval = false
    const borderElSelector = `border__el ${props.onError && 'border__el_error'}`
    return (
        <div className={`border ${props.onFocus && 'border_focus'}`}>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
            <span className={borderElSelector}></span>
        </div>

    )

}