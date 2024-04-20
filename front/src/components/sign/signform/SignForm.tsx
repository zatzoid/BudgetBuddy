import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Border from "../../ui/border/Border";
import useFormWithValidation from '../../../utils/customHooks/validator';
import { UserSign } from "../../../utils/types";


interface props {
    isLoading: boolean
    signUp: boolean
    submit: (data: UserSign) => void
}

export default function SignForm(props: props) {
    const { values, handleChange, errors, isValid } = useFormWithValidation();
    const [nameFocus, setNameFocus] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);
    const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
    const form = useRef<HTMLFormElement | null>(null)
    function submitForm(e: React.FormEvent) {
        e.preventDefault()
        props.submit(
            {
                name: values.name,
                email: values.email,
                password: values.password
            }
        );

    }
    return (
        <div className="sign-wrapper">
            <form onSubmit={(e) => { submitForm(e) }} ref={form} className="sign__form">
                <h2 className="sign__form-heading">{props.signUp ? 'Регистрация' : 'Вход'}</h2>
                {props.signUp && <div className="sign__form-input-block">
                    <input
                        onFocus={() => { setNameFocus(true) }}
                        onBlur={(e) => { handleChange(e, (form.current as HTMLFormElement)); setNameFocus(false) }}
                        onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                        value={values.name || ''}
                        minLength={2}
                        maxLength={25}
                        className="sign__form-input"
                        name="name"
                        type="text"
                        placeholder="name"
                        required />
                    <Border onError={errors.name ? true : false} onFocus={nameFocus} />
                    <span className="sign__form-input-err">{errors.name}</span>
                </div>}
                <div className="sign__form-input-block">
                    <input
                        required
                        onFocus={() => { setEmailFocus(true) }}
                        onBlur={(e) => { handleChange(e, (form.current as HTMLFormElement)); setEmailFocus(false) }}
                        onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                        value={values.email || ''}
                        className="sign__form-input"
                        name="email"
                        type="email"
                        placeholder="email" />
                    <Border onError={errors.email ? true : false} onFocus={emailFocus} />
                    <span className="sign__form-input-err">{errors.email}</span>
                </div>
                <div className="sign__form-input-block">
                    <input
                        required
                        onFocus={() => { setPasswordFocus(true) }}
                        onBlur={(e) => { handleChange(e, (form.current as HTMLFormElement)); setPasswordFocus(false) }}
                        onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                        value={values.password || ''}
                        minLength={5}
                        className="sign__form-input"
                        name="password"
                        type="password"
                        placeholder="password" />
                    <Border onError={errors.password ? true : false} onFocus={passwordFocus} />
                    <span className="sign__form-input-err">{errors.password}</span>
                </div>
                {props.signUp ?
                    <div className="sign__redirect-block">
                        <p className="sign__redirect-message">Уже зарегистрированы?
                            <Link to='/sign-in' className="sign__redirect-link"> войти</Link>
                        </p>
                    </div>
                    : <div className="sign__redirect-block">
                        <p className="sign__redirect-message">Еще не зарегистрированы?
                            <Link to='/sign-up' className="sign__redirect-link"> Регистрация</Link>
                        </p>
                    </div>}
                <p className="sign__submit-error-msg"></p>
                <div className="sign__submit-btn-wrapper">
                    <button
                        disabled={!isValid || props.isLoading}
                        type="submit"
                        className={`sign__submit-btn ${props.isLoading && 'sign__submit-btn_loading'}`}>
                        {props.signUp ? `${!props.isLoading ? "Зарегистрироваться" : 'Регистрация'}` :
                            `${!props.isLoading ? 'Войти' : 'Вход'}`}
                    </button>
                </div>
            </form>
        </div>
    )
}