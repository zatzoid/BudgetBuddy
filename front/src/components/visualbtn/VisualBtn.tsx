import React from "react";
interface props {
    loading?: boolean 
    confirm?: boolean
    action?: boolean 
    cancel?: boolean 

}

//дефолтные значения пропсов
const defaultProps: Partial<props> = {
    confirm: false,
    action: false,
    cancel: false,
    loading: false
};
export default function VisualBtn(props: props) {
    const { loading, confirm, action, cancel } = { ...defaultProps, ...props };
    return (
        <div className={`visualBtn-wrapper 
        ${loading && 'visualBtn-wrapper_loading'}
        ${action && 'visualBtn-wrapper_action'}`}>
            <span className={`visualBtn__span visualBtn__span_left 
            ${loading ? 'visualBtn__span_left-loading' :
                    `${confirm && 'visualBtn__span_left-confirm'}
                    ${cancel && 'visualBtn__span_left-cancel'}
                    ${action && 'visualBtn__span-left_action'}`
                }
            `} />
            <span className={`visualBtn__span visualBtn__span_right
            ${loading ? 'visualBtn__span_right-loading' :
                    `${cancel && 'visualBtn__span_right-cancel'}
                    ${action && 'visualBtn__span-right_action'}`}
            `} />
        </div>
    )
}