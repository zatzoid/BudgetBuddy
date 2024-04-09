import React from "react";
interface props {
    onFocus: boolean
    onError?: boolean
}

const defaultProps: Partial<props> = {
    onError: false,

};


export default function Border(props: props) {
    const { onError } = { ...defaultProps, ...props };
    const borderElSelector = `border__el ${onError && 'border__el_error'}`
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