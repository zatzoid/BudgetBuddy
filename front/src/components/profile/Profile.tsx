import React, { useEffect, useRef, useState } from "react";
import defaultAvatar from '../../images/user.svg';
import Border from "../border/Border";
import { CurrentUserContext } from "../Context";
import useFormWithValidation from "../../utils/customHooks/validator";
import VisualBtn from '../visualbtn/VisualBtn'
import { Input, User } from "../../utils/types";

interface props {
    changeUserInfo: (data: Input) => Promise<{ success: boolean }>
    isLoading: boolean
}


export default function Profile(props: props) {
    const currentUser = React.useContext(CurrentUserContext);
    const { values, handleChange, errors, isValid } = useFormWithValidation();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [nameFocus, setNameFocus] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);
    const form = useRef<HTMLFormElement | null>(null)

    function editMod() {
        if (!isEdit) {
            return setIsEdit(true)
        }
        values.name = (currentUser as User).name;
        values.email = (currentUser as User).email;
        setIsEdit(false)
    }

    useEffect(() => {
        values.name = (currentUser as User)?.name;
        values.email = (currentUser as User)?.email;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
                    {!isEdit ? <p className="profile__data">{currentUser?.name}</p> :
                        <input
                            onFocus={() => { setNameFocus(true) }}
                            onBlur={(e) => { setNameFocus(false); handleChange(e, (form.current as HTMLFormElement)) }}
                            value={values.name}
                            onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                            minLength={2}
                            maxLength={25}
                            name="name"
                            type="text"
                            className="profile__input" />}
                    <Border onFocus={nameFocus} onError={errors.name ? true : false} />
                    <p className="profile__error">{errors.name}</p>
                </div>
                <button onClick={() => { editMod() }}
                    disabled={props.isLoading}
                    type="button"
                    className={`profile__edit ${isEdit && 'profile__edit_active'}`}></button>
                <div className="profile__data-block">
                    {!isEdit ? <p className="profile__data">{currentUser?.email}</p> :
                        <input
                            onFocus={() => { setEmailFocus(true) }}
                            onBlur={(e) => { setEmailFocus(false); handleChange(e, (form.current as HTMLFormElement)) }}
                            onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                            value={values.email}
                            name="email"
                            type="email"
                            className="profile__input" />}
                    <Border onFocus={emailFocus} onError={errors.name ? true : false} />
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