import React, { useEffect, useState } from "react";
import Border from "../../border/Border";
import VisualBtn from "../../visualbtn/VisualBtn";

export default function LocalPostForm(props) {
    const [values, setValues] = useState({});
    const [focusKey, setFocusKey] = useState(false);
    const [focusValue, setFocusValue] = useState(false);
    function handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setValues({ ...values, [name]: value });

    }
    async function submit(e) {
        e.preventDefault();
        try {
            await props.submitForm({ values, kinde: props.kinde });

        }
        catch (e) { console.log(e) }
    }
    useEffect(() => {

        if (props.LPResMsg !== null && props.LPResMsg.status) {
            setValues({})
        }
    }, [props.LPResMsg])

    return (
        <form className="local-posts__form"
            onSubmit={(e) => { submit(e) }}>
            <p className="local-posts__form-heading">{props.heading}</p>
            <input
                disabled={props.isLoadingLP}
                required
                onChange={(e) => { handleChange(e) }}
                value={values.key || ''}
                placeholder="Название"
                className="local-posts__form-input"
                name="key"
                type="text"
                onFocus={() => { setFocusKey(true) }}
                onBlur={() => { setFocusKey(false) }}

            />
            <Border onFocus={focusKey} />
            <input
                disabled={props.isLoadingLP}
                required
                onChange={(e) => { handleChange(e) }}
                value={values.value || ''}
                placeholder="Сумма"
                className="local-posts__form-input"
                name="value"
                type="number"
                onFocus={() => { setFocusValue(true) }}
                onBlur={() => { setFocusValue(false) }} />
            <Border onFocus={focusValue} />
            <div className="local-posts__from-btn-wrapper">
                <button
                    className="local-posts__from-btn-sbmt"
                    type="submit"
                    disabled={props.isLoadingLP}
                ><VisualBtn confirm={true} loading={props.isLoadingLP}/> </button>
                <button
                    onClick={() => { setValues({}) }}
                    className="local-posts__from-btn-reset"
                    type="reset"
                    disabled={props.isLoadingLP}
                ><VisualBtn cancel={true} loading={props.isLoadingLP}/> </button>
            </div>
        </form>
    )

}