import React, { useEffect, useState } from "react";
import Profile from "../profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import Border from "../border/Border";
import useLocalPostForm from "../../utils/localPostForm";
import PostedEl from "./PostedEl/PostedEl";
import ChartComponent from "../Chart/chart";
import LocalPostForm from "./form/localPostForm";



export default function LoaclPosts(props) {
    const date = new Date;
    const { profitValues, loseValues, resetLoseForm, resetProfitForm, handleChangeLose, handleChangeProfit } = useLocalPostForm();
    const [localPostList, setLocalPostsList] = useState(props.localData); /* весь массив */
    const [showedPost, setShowedPost] = useState(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState(null);
    const totalProfit = showedPostData?.cashData.profit.reduce((acc, item) => acc + Object.values(item)[1], 0);
    const totalLose = showedPostData?.cashData.lose.reduce((acc, item) => acc + Object.values(item)[1], 0);
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
                            >+</button>
                        </div>
                        :
                        <>
                            <ul className="local-posts__list">
                                <li><p className="local-posts__list-heading">Доход:</p>
                                    <p className="local-posts__list-heading">{totalProfit}</p>
                                </li>
                                {Array.isArray(showedPostData?.cashData.profit) && showedPostData?.cashData.profit.map((item) => (
                                    <PostedEl key={item._id} keyName={Object.keys(item)[1]} value={Object.values(item)[1]} />
                                ))}
                                <li className="local-posts__posted-el">
                                    <LocalPostForm
                                        heading={'Добавить доход'}
                                        values={profitValues}
                                        submitForm={submitForm}
                                        handleChange={handleChangeProfit}
                                        resetForm={resetProfitForm} />
                                    <Border />
                                </li>
                            </ul>
                            <ul className="local-posts__list">
                                <li><p className="local-posts__list-heading">Расход:</p>
                                    <p className="local-posts__list-heading">{totalLose}</p></li>
                                {Array.isArray(showedPostData?.cashData.lose) && showedPostData?.cashData.lose.map((item) => (
                                    <PostedEl key={item._id} keyName={Object.keys(item)[1]} value={Object.values(item)[1]} />
                                ))}
                                <li className="local-posts__posted-el">
                                    <LocalPostForm
                                        heading={'Добавить расход'}
                                        values={loseValues}
                                        submitForm={submitForm}
                                        handleChange={handleChangeLose}
                                        resetForm={resetLoseForm} />
                                    <Border />
                                </li>
                            </ul>
                            <div className="local-posts__public-btn-container">
                                {showedPostData.posted && <button className="local-posts__public-btn">Опубликовать запись</button>}
                                {!showedPostData.posted && <p className="local-posts__public-btn_posted">Запись опубликована</p>}
                            </div>
                        </>}
                </div>

            </div>
        </section>
    )
}