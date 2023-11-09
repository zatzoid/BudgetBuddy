import React, { useEffect, useState } from "react";
import Profile from "../profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import PostedEl from "./PostedEl/PostedEl";
import LocalPostForm from "./form/localPostForm";

import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';



export default function LoaclPosts(props) {
    const date = new Date;
    const [showedPost, setShowedPost] = useState(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState(null);
    const totalProfit = showedPostData?.cashData.profit.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const totalLose = showedPostData?.cashData.lose.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const [showDescription, setShowDescription] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState(null);
    const [dataForChart, setDataForChart] = useState(null);
    function submitFormPutCashData(data) {
        const valueNmbr = parseInt(data.values.value, 10);
        const cashData = {
            [data.kinde]: {
                'data': {
                    [data.values.key]: valueNmbr
                }

            }
        }
        const postId = showedPostData._id
        props.putCashDataLP({ cashData, postId })
    };
    function deleteCashDataLP(data) {
        data.postId = showedPostData._id;
        props.deleteCashDataLP(data);
    }
    function filterList() {
        const currentData = (props.localData?.filter(item => item.choisenMonth === showedPost));
        if (currentData) {
            setShowedPostData(currentData[0]);
        }
    }

    useEffect(() => {
        filterList()
        if (showedPostData) {
            setDataForChart(chartPieData())
        } else { setDataForChart(null) }
    }, [props.localData]);

    useEffect(() => {
        filterList()
        if (showedPostData) {
            setDataForChart(chartPieData())
        } else {
            setDataForChart(null)
        }
    }, [showedPost]);

    function switchMonth(e) {
        if (showedPost + e < 1) {
            setShowedPost(12)
            return
        }
        else if (showedPost + e > 12) {
            setShowedPost(1);
            return
        }
        setShowedPost(showedPost + e)

    }
    function openEmailModal(data) {
        data.data.postId = showedPostData._id;
        props.openEmailModal(data)
    }


    function chartPieData() {
        const chartData = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                },
            ],
        };

        showedPostData?.cashData.profit.forEach((item, index) => {
            const key = Object.keys(item.data)[0];
            const value = Object.values(item.data)[0];
            chartData.labels.push(key);
            chartData.datasets[0].data.push(value);
            chartData.datasets[0].backgroundColor.push("#33FF57");
        });

        showedPostData?.cashData.lose.forEach((item, index) => {
            const key = Object.keys(item.data)[0];
            const value = Object.values(item.data)[0];
            chartData.labels.push(key);
            chartData.datasets[0].data.push(value);
            chartData.datasets[0].backgroundColor.push("#FF5733");
        });
        return chartData
    }

    useEffect(() => { if (dataForChart !== null) { console.log(dataForChart) } }, [dataForChart])

    return (
        <section className='local-posts'>
            <Profile changeUserInfo={props.changeUserInfo} isLoading={props.isLoading} />
            <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />
            <div className="local-posts__wrapper">
                <div className="local-posts__container">
                    {/*  <Diagram data={showedPostData?.cashData} /> */}
                    {dataForChart !== null && <div style={{
                        gridColumn: '1 / span 2',
                        margin: 'auto',
                        width: '400px',
                        height: '400px'
                    }}>
                        <Pie

                            data={dataForChart}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                legend: {
                                    display: true,
                                    position: "bottom",
                                },
                            }}

                        /> </div>}
                    {!showedPostData ?
                        <div className="local-post__empty-el">
                            <p className="local-post__empty-el-text">{props.isLoadingLP ? 'Добавляем запись' : 'Добавить запись'}</p>
                            <button
                                disabled={props.isLoadingLP}
                                onClick={() => { props.createPost({ choisenMonth: showedPost, choisenYear: 2023 }) }}
                                className={`local-post__empty-el-add-btn ${props.isLoadingLP && 'local-post__empty-el-add-btn_loading'}`}
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
                                    <PostedEl
                                        openEmailModal={openEmailModal}
                                        isLoadingLP={props.isLoadingLP}
                                        deleteCashDataLP={deleteCashDataLP}
                                        reminde={item.reminde}
                                        key={item._id}
                                        objId={item._id}
                                        kinde={'profit'}
                                        keyName={Object.keys(item.data)[0]}
                                        value={Object.values(item.data)[0]} />
                                ))}
                                <li className="local-posts__posted-el">
                                    <LocalPostForm
                                        LPResMsg={props.LPResMsg}
                                        isLoadingLP={props.isLoadingLP}
                                        kinde={'profit'}
                                        heading={'Добавить доход'}
                                        submitForm={submitFormPutCashData}
                                    />

                                </li>
                            </ul>
                            <ul className="local-posts__list">
                                <li><p className="local-posts__list-heading">Расход:</p>
                                    <p className="local-posts__list-heading">{totalLose}</p></li>
                                {Array.isArray(showedPostData?.cashData.lose) && showedPostData?.cashData.lose.map((item) => (
                                    <PostedEl
                                        openEmailModal={openEmailModal}
                                        isLoadingLP={props.isLoadingLP}
                                        deleteCashDataLP={deleteCashDataLP}
                                        reminde={item.reminde}
                                        key={item._id}
                                        objId={item._id}
                                        kinde={'lose'}
                                        keyName={Object.keys(item.data)[0]}
                                        value={Object.values(item.data)[0]} />
                                ))}
                                <li className="local-posts__posted-el">
                                    <LocalPostForm
                                        LPResMsg={props.LPResMsg}
                                        isLoadingLP={props.isLoadingLP}
                                        kinde={'lose'}
                                        heading={'Добавить расход'}
                                        submitForm={submitFormPutCashData} />

                                </li>
                            </ul>
                            <div className='local-posts__public-btn-container' >
                                {showDescription && <div className="local-posts__public-add-description">
                                    <textarea
                                        required
                                        className="local-posts__public-add-description-value"
                                        placeholder="Добавьте описание (это обязательно)"
                                        value={descriptionValue || ''}
                                        onChange={(e) => { setDescriptionValue(e.target.value) }}
                                    />
                                    <button className="local-posts__public-add-description-btn">Опубликовать</button>
                                    <button
                                        onClick={() => { setShowDescription(false) }}
                                        className="local-posts__public-add-description-btn">Отмена</button>
                                </div>}
                                {!showedPostData.posted &&
                                    <button
                                        onClick={() => { setShowDescription(true) }}
                                        className={`local-posts__public-btn ${showDescription && 'local-posts__public-btn_active'}`}>
                                        Опубликовать запись</button>}

                                {showedPostData.posted && <p className="local-posts__public-btn_posted">Запись опубликована</p>}
                            </div>
                        </>}
                </div>

            </div>
        </section>
    )
}