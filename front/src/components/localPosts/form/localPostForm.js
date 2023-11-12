import React, { useEffect, useState } from "react";
import Border from "../../border/Border";
import VisualBtn from "../../visualbtn/VisualBtn";

export default function LocalPostForm(props) {
    const [values, setValues] = useState({});
    const [focusKey, setFocusKey] = useState(false);
    const [focusValue, setFocusValue] = useState(false);
    const [categoryValue, setCategoryValue] = useState('другое');
    const [showCategory, setShowCategory] = useState(false);
    function handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        setValues({ ...values, [name]: value });

    }
    function submit(e) {
        e.preventDefault();
        props.submitForm({ values, kinde: props.kinde, category: categoryValue });

    }
    useEffect(() => {
        if (props.LPResMsg !== null && props.LPResMsg.status) {
            setValues({})
        }
    }, [props.LPResMsg]);

    function openCategory() {
        if (showCategory) {
            setShowCategory(false)
            return
        }
        setShowCategory(true);
    }

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
            <button className="lp__form-type-btn"
                type="button"
                onClick={() => { openCategory() }}>
                <p className="lp__form-heading-type">Выберите категорию</p>
                <span className={`lp__form-type-btn-arrow ${showCategory && 'lp__form-type-btn-arrow_active'}`} ></span>
            </button>
            <div className={`lp-form-type-container ${showCategory && 'lp-form-type-container_active'}`}>
                {props.kinde === 'lose' ? <>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='транспорт'
                        onChange={(e) => { setCategoryValue(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn lp__form-type-input-btn_auto"></span>
                        транспорт
                    </label>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='жкх'
                        onChange={(e) => { setCategoryValue(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn lp__form-type-input-btn_jkh"></span>
                        жкх
                    </label>

                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='питание'
                        onChange={(e) => { setCategoryValue(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn lp__form-type-input-btn_food"></span>
                        питание
                    </label>
                    <label className="lp__form-type-label">
                        <input
                            type='radio'
                            name='typeof'
                            value='развлечения'
                            onChange={(e) => { setCategoryValue(e.target.value) }}
                            className="lp__form-type-input"
                        />
                        <span className="lp__form-type-input-btn lp__form-type-input-btn_fun"></span>
                        развлечения
                    </label>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='взятка'
                        onChange={(e) => { setCategoryValue(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn lp__form-type-input-btn_vzyatka"></span>
                        взятка
                    </label>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='другое'
                        defaultChecked
                        onChange={(e) => { setCategoryValue(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn lp__form-type-input-btn_another"></span>
                        другое
                    </label>
                </> :
                    <>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='майнинг'
                            onChange={(e) => { setCategoryValue(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn lp__form-type-input-btn_mine"></span>
                            майнинг
                        </label>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='зарплата'
                            onChange={(e) => { setCategoryValue(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn lp__form-type-input-btn_zp"></span>
                            зарплата
                        </label>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='другое'
                            defaultChecked
                            onChange={(e) => { setCategoryValue(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn lp__form-type-input-btn_another"></span>
                            другое
                        </label>
                    </>}
            </div>
            <div className="local-posts__from-btn-wrapper">
                <button
                    className="local-posts__from-btn-sbmt"
                    type="submit"
                    disabled={props.isLoadingLP}
                ><VisualBtn confirm={true} loading={props.isLoadingLP} /> </button>
                <button
                    onClick={() => { setValues({}) }}
                    className="local-posts__from-btn-reset"
                    type="reset"
                    disabled={props.isLoadingLP}
                ><VisualBtn cancel={true} loading={props.isLoadingLP} /> </button>
            </div>
        </form>
    )

}