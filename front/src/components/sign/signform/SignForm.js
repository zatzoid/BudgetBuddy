import React, { useState } from "react";
import { Link } from "react-router-dom";
import Border from "../../border/Border";
import useFormWithValidation from '../../../utils/validator';

export default function SignForm(props) {
    const { values, handleChange, errors, isValid } = useFormWithValidation();
    const [nameFocus, setNameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    function submitForm(e) {
        e.preventDefault()
        props.submit()

    }
    return (
        <div className="sign-wrapper">
            <form onSubmit={(e) => { submitForm(e) }} className="sign__form">
                <h2 className="sign__form-heading">{props.signUp ? 'Регистрация' : 'Вход'}</h2>
                {props.signUp && <div className="sign__form-input-block">
                    <input
                        onFocus={() => { setNameFocus(true) }}
                        onBlur={(e) => { handleChange(e); setNameFocus(false) }}
                        onChange={(e) => { handleChange(e) }}
                        value={values.name}
                        minLength={2}
                        maxLength={25}
                        className="sign__form-input"
                        name="name"
                        type="text"
                        placeholder="name" />
                    <Border onError={errors.name} onFocus={nameFocus} />
                    <span className="sign__form-input-err">{errors.name}</span>
                </div>}
                <div className="sign__form-input-block">
                    <input
                        onFocus={() => { setEmailFocus(true) }}
                        onBlur={(e) => { handleChange(e); setEmailFocus(false) }}
                        onChange={(e) => { handleChange(e) }}
                        value={values.email}
                        className="sign__form-input"
                        name="email"
                        type="email"
                        placeholder="email" />
                    <Border onError={errors.email} onFocus={emailFocus} />
                    <span className="sign__form-input-err">{errors.email}</span>
                </div>
                <div className="sign__form-input-block">
                    <input
                        onFocus={() => { setPasswordFocus(true) }}
                        onBlur={(e) => { handleChange(e); setPasswordFocus(false) }}
                        onChange={(e) => { handleChange(e) }}
                        value={values.password}
                        minLength={5}
                        className="sign__form-input"
                        name="password"
                        type="password"
                        placeholder="password" />
                    <Border onError={errors.password} onFocus={passwordFocus} />
                    <span className="sign__form-input-err">{errors.password}</span>
                </div>
                {props.signUp ?
                    <div className="sign__redirect-block">
                        <p className="sign__redirect-message">Уже зарегистрированы?
                            <Link to='/sign-in' className="sign__redirect-link"> войти</Link>
                        </p>
                    </div>
                    : <div className="sign__redirect-block">
                        <p className="sign__redirect-message">Еще незарегистрированы?
                            <Link to='/sign-up' className="sign__redirect-link"> Регистрация</Link>
                        </p>
                    </div>}
                <p className="sign__submit-error-msg"></p>
                <button
                    disabled={!isValid}
                    type="submit"
                    className="sign__submit-btn">
                    {props.signUp ? "Зарегистрироваться" : "Войти"}
                </button>
            </form>
        </div>
    )
}