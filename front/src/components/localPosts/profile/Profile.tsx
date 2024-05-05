import React, { useRef, useState } from "react";
import defaultAvatar from '../../../images/user.svg';
import Border from "../../ui/border/Border";
import { CurrentContext } from "../../Context";
import useFormWithValidation from "../../../utils/customHooks/useFormWithValidation";
import VisualBtn from '../../ui/visualbtn/VisualBtn'
import { Input, User } from "../../../utils/types";

interface props {
    changeUserInfo: (data: Input) => Promise<{ success: boolean }>
    isLoading: boolean
}


export default function Profile(props: props) {

    const { userData } = React.useContext(CurrentContext);
    const { values, handleChange, errors, isValid } = useFormWithValidation({ values: [{ name: 'name', value: (userData as User)?.name || '' }, { name: 'email', value: (userData as User)?.email || '' }] });
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [nameFocus, setNameFocus] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);
    const form = useRef<HTMLFormElement | null>(null)
    console.log('rerender Profile 👨');

    function editMod() {
        if (!isEdit) {
            return setIsEdit(true)
        }
        values.name = (userData as User).name;
        values.email = (userData as User).email;
        setIsEdit(false)
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const data = await props.changeUserInfo(values);
            if (data.success) {
                setIsEdit(false);
            }
        }
        catch (e) { console.log(e) }
    }

    return (
        <section className="profile-wrapper">

            <form className="profile" ref={form} onSubmit={(e) => { handleSubmit(e) }}>
                <img src={defaultAvatar} alt="ava" className="profile__avatar" />
                <div className="profile__data-block">

                    <input
                        disabled={!isEdit}
                        onFocus={(e) => { setNameFocus(true); handleChange(e, (form.current as HTMLFormElement)) }}
                        onBlur={(e) => { setNameFocus(false); handleChange(e, (form.current as HTMLFormElement)) }}
                        value={values.name}
                        onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                        minLength={2}
                        maxLength={25}
                        name="name"
                        type="text"
                        autoComplete="off"
                        className="profile__input" />
                    <Border onFocus={nameFocus} onError={errors.name ? true : false} />
                    <p className="profile__error">{errors.name}</p>
                </div>
                <button onClick={() => { editMod() }}
                    disabled={props.isLoading}
                    type="button"
                    className={`profile__edit ${isEdit && 'profile__edit_active'}`}></button>
                <div className="profile__data-block">
                    <input
                        disabled={!isEdit}
                        onFocus={() => { setEmailFocus(true) }}
                        onBlur={(e) => { setEmailFocus(false); handleChange(e, (form.current as HTMLFormElement)) }}
                        onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                        value={values.email || ''}
                        name="email"
                        type="email"
                        className="profile__input" />
                    <Border onFocus={emailFocus} onError={errors.email ? true : false} />
                    <p className="profile__error">{errors.email}</p>
                </div>
                {isEdit && <button
                    className="profile__edit-submit-btn"
                    type="submit"
                    disabled={props.isLoading || !isValid}>
                    <VisualBtn loading={props.isLoading} confirm={true} /></button>}

            </form>
        </section>
    )
}