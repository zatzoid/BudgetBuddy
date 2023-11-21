import React, { useEffect, useState } from "react";
import defaultAvatar from '../../images/user.svg';
import Border from "../border/Border";
import { CurrentUserContext } from "../Context";
import useFormWithValidation from "../../utils/customHooks/validator";
import VisualBtn from '../visualbtn/VisualBtn'


export default function Profile(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const { values, handleChange, errors, isValid } = useFormWithValidation();
    const [isEdit, setIsEdit] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    function editMod() {
        if (!isEdit) {
            return setIsEdit(true)
        }
        values.name = currentUser.name;
        values.email = currentUser.email;
        setIsEdit(false)
    };
    useEffect(() => {
        values.name = currentUser?.name;
        values.email = currentUser?.email;
    }, []);
    async function handleSubmit(e) {
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

        <form className="profile" onSubmit={(e) => { handleSubmit(e) }}>
            <img src={defaultAvatar} alt="ava" className="profile__avatar" />
            <div className="profile__data-block">
                {!isEdit ? <p className="profile__data">{currentUser?.name}</p> :
                    <input
                        onFocus={() => { setNameFocus(true) }}
                        onBlur={(e) => { setNameFocus(false); handleChange(e) }}
                        value={values.name}
                        onChange={(e) => { handleChange(e) }}
                        minLength={2}
                        maxLength={25}
                        name="name"
                        type="text"
                        className="profile__input" />}
                <Border onFocus={nameFocus} onError={errors.name} />
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
                        onBlur={(e) => { setEmailFocus(false); handleChange(e) }}
                        onChange={(e) => { handleChange(e) }}
                        value={values.email}
                        name="email"
                        type="email"
                        className="profile__input" />}
                <Border onFocus={emailFocus} onError={errors.email} />
                <p className="profile__error">{errors.email}</p>
            </div>
            {isEdit && <button 
            className="profile__edit-submit-btn"
             type="submit"
              disabled={props.isLoading || !isValid}>
                <VisualBtn loading={props.isLoading} confirm={true}/></button>}

        </form>
    )
}