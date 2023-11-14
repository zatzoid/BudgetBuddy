import React, { useEffect, useState } from "react";
import Border from "../../border/Border";
import VisualBtn from "../../visualbtn/VisualBtn";

export default function LocalPostForm(props) {
    const [values, setValues] = useState({});
    const [focusKey, setFocusKey] = useState(false);
    const [focusValue, setFocusValue] = useState(false);
    const [categoryValue, setCategoryValue] = useState('another');
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
        setCategoryValue('another');

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
    function choisCategory(data){
        setCategoryValue(data)
        setTimeout(() => {
            openCategory()
        }, 500);
        
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
                        value='transport'
                        onChange={(e) => { choisCategory(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn back-img_transport"></span>
                        транспорт
                    </label>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='jkh'
                        onChange={(e) => { choisCategory(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn back-img_jkh"></span>
                        жкх
                    </label>

                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='food'
                        onChange={(e) => { choisCategory(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn back-img_food"></span>
                        питание
                    </label>
                    <label className="lp__form-type-label">
                        <input
                            type='radio'
                            name='typeof'
                            value='fun'
                            onChange={(e) => { choisCategory(e.target.value) }}
                            className="lp__form-type-input"
                        />
                        <span className="lp__form-type-input-btn back-img_fun"></span>
                        развлечения
                    </label>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='vzyatka'
                        onChange={(e) => { choisCategory(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn back-img_vzyatka"></span>
                        взятка
                    </label>
                    <label className="lp__form-type-label"> <input
                        type='radio'
                        name='typeof'
                        value='another'
                        defaultChecked
                        onChange={(e) => { choisCategory(e.target.value) }}
                        className="lp__form-type-input"
                    />
                        <span className="lp__form-type-input-btn back-img_another"></span>
                        другое
                    </label>
                </> :
                    <>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='mining'
                            onChange={(e) => { choisCategory(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn back-img_mining"></span>
                            майнинг
                        </label>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='zp'
                            onChange={(e) => { choisCategory(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn back-img_zp"></span>
                            зарплата
                        </label>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='another'
                            defaultChecked
                            onChange={(e) => { choisCategory(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn back-img_another"></span>
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