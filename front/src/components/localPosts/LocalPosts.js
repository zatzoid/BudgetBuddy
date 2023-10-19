import React, { useState } from "react";
import Profile from "../profile/Profile";
import getMonthName from "../../utils/getMonthName";
import MounthSlider from "./mounthSlider/MounthSlider";
import Border from "../border/Border";
import { data } from "../../utils/constants";
import PostedEl from "./PostedEl/PostedEl";


export default function LoaclPosts() {
    const [profitList, setProfitList] = useState(data.cashData.profit)
    const [key, setKey] = useState('')
    const [value, setValue] = useState('')
    function submitForm(e) {
        e.preventDefault()
        const objectData = { [key]: parseFloat(value) };
        const updatedProfitList = [...profitList, objectData];
        setProfitList(updatedProfitList);
        resetForm()
    }
    function resetForm() {
        setValue('')
        setKey('')
    }
    return (
        <section className='local-posts'>
            <Profile />
            <MounthSlider />
            <div className="local-posts__wrapper">
                <div className="local-posts__container">

                    <ul className="local-posts__list">
                        <li><p className="local-posts__list-heading">Доходы</p></li>
                        {Array.isArray(profitList) && profitList.map((item, index) => (
                            <PostedEl key={index} keyName={Object.keys(item)[0]} value={Object.values(item)[0]} />
                        ))}
                        <li className="local-posts__posted-el">
                            <form className="local-posts__form"
                                onSubmit={(e) => { submitForm(e) }}>
                                <p className="local-posts__form-heading">Добавить доход</p>
                                <input
                                    onChange={(e) => { setKey(e.target.value) }}
                                    value={key}
                                    placeholder="Название"
                                    className="local-posts__form-input"
                                    name="key"
                                    type="text" />
                                <input
                                    onChange={(e) => { setValue(e.target.value) }}
                                    value={value}
                                    placeholder="Сумма"
                                    className="local-posts__form-input"
                                    name="value"
                                    type="number" />
                                <button
                                    className="local-posts__from-btn-sbmt"
                                    type="submit"
                                />
                                <button
                                    onClick={() => { resetForm() }}
                                    className="local-posts__from-btn-reset"
                                    type="reset"
                                />
                            </form>
                            <Border />
                        </li>
                    </ul>
                    <ul className="local-posts__list">
                        <li><p className="local-posts__list-heading">Расходы</p></li>
                        {Array.isArray(data.cashData.lose) && data.cashData.lose.map((item, index) => (
                            <PostedEl key={index} keyName={Object.keys(item)[0]} value={Object.values(item)[0]} />
                        ))}
                    </ul>
                </div>

            </div>
        </section>
    )
}