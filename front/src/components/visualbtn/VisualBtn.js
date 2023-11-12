import React from "react";
export default function VisualBtn(props) {

    return (
        <div className={`visualBtn-wrapper 
        ${props.loading && 'visualBtn-wrapper_loading'}
        ${props.action && 'visualBtn-wrapper_action'}`}>
            <span className={`visualBtn__span visualBtn__span_left 
            ${props.loading ? 'visualBtn__span_left-loading' :
                    `${props.confirm && 'visualBtn__span_left-confirm'}
                    ${props.cancel && 'visualBtn__span_left-cancel'}
                    ${props.action && 'visualBtn__span-left_action'}`
                }
            `} />
            <span className={`visualBtn__span visualBtn__span_right
            ${props.loading ? 'visualBtn__span_right-loading' :
                    `${props.cancel && 'visualBtn__span_right-cancel'}
                    ${props.action && 'visualBtn__span-right_action'}`}
            `} />
        </div>
    )
}