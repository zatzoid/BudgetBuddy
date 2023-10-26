import React, { useEffect, useState } from "react";
import Profile from "../profile/Profile";
import getMonthName from "../../utils/getMonthName";
import MounthSlider from "./mounthSlider/MounthSlider";
import Border from "../border/Border";
import useLocalPostForm from "../../utils/localPostForm";
import PostedEl from "./PostedEl/PostedEl";
import ChartComponent from "../Chart/chart";



export default function LoaclPosts(props) {
    const date = new Date;
    const { profitValues, loseValues, resetLoseForm, resetProfitForm, handleChangeLose, handleChangeProfit } = useLocalPostForm();
    const [localPostList, setLocalPostsList] = useState(props.localData); /* вес массив */
    const [showedPost, setShowedPost] = useState(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState(null)
    function submitForm(e) {
        e.preventDefault()
        const objectData = { [profitValues.key]: parseFloat(profitValues.value) };
        const updatedProfitList = [...showedPostData, objectData];
        setShowedPostData(updatedProfitList);
        resetProfitForm();
    }

    useEffect(() => {

        setLocalPostsList(props.localData);

    }, []);
    useEffect(() => {
        const currentData = (localPostList?.filter(item => item.choisenMonth === showedPost));
        setShowedPostData(currentData[0]);
    }, [showedPost]);
    function switchMonth(e) {
        if (showedPost + e === 0) {
            setShowedPost(12)
            return
        }
        else if (showedPost + e === 13) {
            setShowedPost(1);
            return
        }
        setShowedPost(showedPost + e)

    }


    return (
        <section className='local-posts'>
            <Profile />
            <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />
            <div className="local-posts__wrapper">
                <div className="local-posts__container">
                    {/* тут должна быть диаграмма */}
                    {!showedPostData ?
                        <div className="local-post__empty-el">
                            <p className="local-post__empty-el-text">Добавить запись</p>
                            <button

                                className="local-post__empty-el-add-btn"
                                type="button"
                            >+ </button>
                        </div>
                        :
                        <>
                            <ul className="local-posts__list">
                                <li><p className="local-posts__list-heading">Доходы</p></li>
                                {Array.isArray(showedPostData?.cashData.profit) && showedPostData?.cashData.profit.map((item) => (
                                    <PostedEl key={item._id} keyName={Object.keys(item)[1]} value={Object.values(item)[1]} />
                                ))}
                                <li className="local-posts__posted-el">
                                    <form className="local-posts__form"
                                        onSubmit={(e) => { submitForm(e) }}>
                                        <p className="local-posts__form-heading">Добавить доход</p>
                                        <input
                                            onChange={(e) => { handleChangeProfit(e) }}
                                            value={profitValues.key}
                                            placeholder="Название"
                                            className="local-posts__form-input"
                                            name="key"
                                            type="text" />
                                        <input
                                            onChange={(e) => { handleChangeProfit(e) }}
                                            value={profitValues.value}
                                            placeholder="Сумма"
                                            className="local-posts__form-input"
                                            name="value"
                                            type="number" />
                                        <button
                                            className="local-posts__from-btn-sbmt"
                                            type="submit"
                                        />
                                        <button
                                            onClick={() => { resetProfitForm() }}
                                            className="local-posts__from-btn-reset"
                                            type="reset"
                                        />
                                    </form>
                                    <Border />
                                </li>
                            </ul>
                            <ul className="local-posts__list">
                                <li><p className="local-posts__list-heading">Расходы</p></li>
                                {Array.isArray(showedPostData?.cashData.lose) && showedPostData?.cashData.lose.map((item) => (
                                    <PostedEl key={item._id} keyName={Object.keys(item)[1]} value={Object.values(item)[1]} />
                                ))}
                            </ul>
                        </>}
                </div>

            </div>
        </section>
    )
}