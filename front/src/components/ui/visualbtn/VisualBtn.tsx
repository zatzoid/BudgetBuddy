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
        ${action && 'visualBtn-wrapper_action'}
        `}>
            <span
                id="one"
                className={`visualBtn__span 
            ${loading ? 'visualBtn__span_loading' :
                        `${confirm && 'visualBtn__span_confirm'}
                    ${cancel && 'visualBtn__span_cancel'}
                    ${action && 'visualBtn__span_action'}`
                    }
            `} />
            <span
                id="two"
                className={`visualBtn__span 
            ${loading ? 'visualBtn__span_loading' :
                        `${confirm && 'visualBtn__span_confirm'}
                    ${cancel && 'visualBtn__span_cancel'}
                    ${action && 'visualBtn__span_action'}`}
            `} />
            <span
                id="three"
                className={`visualBtn__span 
            ${loading ? 'visualBtn__span_loading' :
                        `${confirm && 'visualBtn__span_confirm'}
                    ${cancel && 'visualBtn__span_cancel'}
                    ${action && 'visualBtn__span_action'}`}
            `} />
        </div>
    )
}