import React, { useEffect, useRef, useState } from "react";
import defaultAvatar from '../../../images/user.svg';
import Border from "../../ui/border/Border";
import useFormWithValidation from "../../../utils/customHooks/validator";
import VisualBtn from '../../ui/visualbtn/VisualBtn'
import { User } from "../../../utils/types";
import { useAppDispatch } from "../../../utils/store/hooks";
import { changeUserInfo } from "../../../utils/store/userMeSlice";
import { apiStatus } from "../../../utils/store/apiStatusSlice";


interface props {
    userMe: User
    apiStatus: apiStatus
}

const Profile = React.memo((props: props) => {
    const { userMe, apiStatus } = props

    const dispatch = useAppDispatch()
    const { values, handleChange, errors, isValid } = useFormWithValidation({ 'name': userMe?.name, 'email': userMe?.email });
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [nameFocus, setNameFocus] = useState<boolean>(false);
    const [emailFocus, setEmailFocus] = useState<boolean>(false);
    const form = useRef<HTMLFormElement | null>(null);


    
    useEffect(() => {
        
        console.log('render prof')
    })

    function editMod() {
        if (!isEdit) {
            return setIsEdit(true)
        }
        values.name = (userMe as User).name;
        values.email = (userMe as User).email;
        setIsEdit(false)
    }

   
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            await dispatch(changeUserInfo(values))
            if (apiStatus.statusCode === 200) {
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
                        value={values.name || ''}
                        onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                        minLength={2}
                        maxLength={25}
                        name="name"
                        type="text"
                        autoComplete="off"
                        className="profile__input" />
                    <Border onFocus={nameFocus} onError={errors.name ? true : false} />
                   
                </div>
                <button onClick={() => { editMod() }}
                    disabled={apiStatus.isLoading}
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
                  
                </div>
                {isEdit && <button
                    className="profile__edit-submit-btn"
                    type="submit"
                    disabled={apiStatus.isLoading || !isValid}>
                    <VisualBtn loading={apiStatus.isLoading} confirm={true} /></button>}

            </form>
        </section>
    )
})

export default Profile