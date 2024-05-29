
import React, { useEffect, useRef, useState } from "react";
import Border from "../../ui/border/Border";
import VisualBtn from "../../ui/visualbtn/VisualBtn";
import Select from "../../ui/select/Select";
import useFormWithValidation from "../../../utils/customHooks/validator";
import { MetaData, CashDataFromClient, Kinde } from "../../../utils/types";


interface props {

    LPResMsg: MetaData
    isLoadingLP: boolean
    kinde: string
    heading: string
    postId: string
    submitForm: (data: CashDataFromClient) => void
}

export default function LocalPostForm(props: props) {
    
    const { values, handleChange, resetForm, errors, isValid } = useFormWithValidation()
    const [focusKey, setFocusKey] = useState<boolean>(false);
    const [focusValue, setFocusValue] = useState<boolean>(false);
    const [categoryValue, setCategoryValue] = useState<string>('another');
    const [formShowed, setFormShowed] = useState<boolean>(false);
    const form = useRef<HTMLFormElement | null>(null);
    const optionsArray = {
        lose: [
            { name: 'транспорт', value: 'transport' },
            { name: 'жкх', value: 'jkh' },
            { name: 'питание', value: 'food' },
            { name: 'развлечения', value: 'fun' },
            { name: 'взятки', value: 'vzyatka' },
            { name: 'другое', value: 'another' },
        ],
        profit: [
            { name: 'майнинг', value: 'mining' },
            { name: 'зарплата', value: 'zp' },
            { name: 'другое', value: 'another' },
        ]
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const cashData = {
            [props.kinde]: {
                'data': {
                    [values.key]: Number(values.value)
                },
                category: categoryValue,
            }
        }
        props.submitForm({ cashData: cashData, postId: props.postId });
        resetForm()


    }
    useEffect(() => {

        if (props.LPResMsg.statusCode >= 200) {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.LPResMsg]);


    function choisCategory(e: React.ChangeEvent<HTMLInputElement>) {
        setCategoryValue(e.currentTarget.value)


    }


    return (
        <> <button className={`local-posts__form-heading ${formShowed && 'local-posts__form-heading_active'}`}
            onClick={() => setFormShowed(!formShowed)}>
            {props.heading}
        </button>
            <form
                ref={form}
                noValidate
                className={`local-posts__form ${formShowed && 'local-posts__form_active'}`}
                onSubmit={(e) => { submit(e) }}>

                <input
                    disabled={props.isLoadingLP}
                    required
                    onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                    value={values.key || ''}
                    placeholder="Название"
                    className="local-posts__form-input"
                    name="key"
                    type="text"
                    pattern="^[a-zA-Zа-яА-Я0-9 ]*$"
                    maxLength={25}
                    minLength={3}
                    onFocus={() => { setFocusKey(true) }}
                    onBlur={() => { setFocusKey(false) }}

                />
                <Border onFocus={focusKey} onError={errors.key ? true : false} />
                <span className="lp__form-input-err-msg">{errors.key || ''}</span>
                <input
                    disabled={props.isLoadingLP}
                    required
                    onChange={(e) => { handleChange(e, (form.current as HTMLFormElement)) }}
                    value={values.value || ''}
                    placeholder="Сумма"
                    className="local-posts__form-input"
                    name="value"
                    type="number"
                    min={1}
                    onFocus={() => { setFocusValue(true) }}
                    onBlur={() => { setFocusValue(false) }} />
                <Border onFocus={focusValue} onError={errors.value ? true : false} />
                <span className="lp__form-input-err-msg">{errors.value || ''}</span>
                <p className="lp__form-text">Категория:</p>
                <Select
                    zIndex={6}
                    optionsArray={optionsArray[(props.kinde as Kinde)]}
                    selectName={`category${props.kinde}`}
                    iconIsNeed={true}
                    callBack={choisCategory} />
                <div className="local-posts__from-btn-wrapper">
                    <button
                        className="local-posts__from-btn local-posts__from-btn_sbmt"
                        type="submit"
                        disabled={props.isLoadingLP || !isValid}
                    ><VisualBtn confirm={true} loading={props.isLoadingLP} />
                    </button>
                    <button
                        onClick={() => { resetForm() }}
                        className="local-posts__from-btn local-posts__from-btn_reset"
                        type="reset"
                        disabled={props.isLoadingLP}
                    ><VisualBtn cancel={true} loading={props.isLoadingLP} />
                    </button>
                </div>
            </form>
        </>
    )

}