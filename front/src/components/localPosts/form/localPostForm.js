import React from "react";

export default function LocalPostForm(props) {
    return (
        <form className="local-posts__form"
            onSubmit={(e) => { props.submitForm(e) }}>
            <p className="local-posts__form-heading">{props.heading}</p>
            <input
                onChange={(e) => { props.handleChange(e) }}
                value={props.values.key}
                placeholder="Название"
                className="local-posts__form-input"
                name="key"
                type="text" />
            <input
                onChange={(e) => { props.handleChange(e) }}
                value={props.values.value}
                placeholder="Сумма"
                className="local-posts__form-input"
                name="value"
                type="number" />
            <button
                className="local-posts__from-btn-sbmt"
                type="submit"
            />
            <button
                onClick={() => { props.resetForm() }}
                className="local-posts__from-btn-reset"
                type="reset"
            />
        </form>
    )

}