import React, { useEffect, useState } from "react";
import Profile from "../profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import PostedEl from "./PostedEl/PostedEl";
import LocalPostForm from "./form/localPostForm";

import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';



export default function LoaclPosts(props) {
    const date = new Date();
    const [showedPost, setShowedPost] = useState(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState(null);
    const totalProfit = showedPostData?.cashData.profit.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const totalLose = showedPostData?.cashData.lose.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const [showDescription, setShowDescription] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState(null);
    const [dataForChart, setDataForChart] = useState(null);
    const [lpContainerStyle, setLpContainerStyle] = useState('local-posts__container');
    const [sortMenuProfitShowed, setSortMenuProfitShowed] = useState(false);
    const [sortMenuLoseShowed, setSortMenuLoseShowed] = useState(false);

    const [currentSort, setCurrentSort] = useState(null);
    function submitFormPutCashData(data) {
        const valueNmbr = parseInt(data.values.value, 10);
        const cashData = {
            [data.kinde]: {
                'data': {
                    [data.values.key]: valueNmbr
                },
                category: data.category,
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
            if (currentData.length > 0) {
                chartPieData(currentData[0]);
            } else {
                chartPieData(null);
            }

        }
    }

    useEffect(() => {
        filterList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.localData]);

    useEffect(() => {
        filterList()
        setLpContainerStyle('local-posts__container')
        setTimeout(() => {
            setLpContainerStyle('local-posts__container local-posts__container_active')
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        props.openEmailModal(data);
    }


    function chartPieData(data) {
        if (data !== null) {
            const chartData = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [],
                    },
                ]

            };

            data?.cashData.profit.forEach((item, index) => {
                const key = Object.keys(item.data)[0];
                const value = Object.values(item.data)[0];
                chartData.labels.push(key);
                chartData.datasets[0].data.push(value);
                chartData.datasets[0].backgroundColor.push("#7DCE70");
            });

            data?.cashData.lose.forEach((item, index) => {
                const key = Object.keys(item.data)[0];
                const value = Object.values(item.data)[0];
                chartData.labels.push(key);
                chartData.datasets[0].data.push(value);
                chartData.datasets[0].backgroundColor.push("#f12652");
            });
            setDataForChart(chartData);
        } else {
            setDataForChart(null);
        }
    }
    function sortMassive(data) {
        const copyPostData = { ...showedPostData };
        const copyCashData = { ...copyPostData.cashData };
        const kinde = data.kinde;
        const dataArray = copyCashData[kinde];
        /* сортировка выбором*/
        dataArray.sort(function (a, b) {
            if (data.type === 'sum') {
                return data.sortBy === 'fromMany' ?
                    Object.values(b.data) - Object.values(a.data) :
                    Object.values(a.data) - Object.values(b.data)
            } else if (data.type === 'category') {
                return b.category - a.category
            }
        })
        copyPostData.cashData[kinde] = dataArray;
        setShowedPostData(copyPostData);


    }
    useEffect(() => {
        if (currentSort) {
            sortMassive(currentSort)
        }
    }, [currentSort])

    function showSortMenuprofit() {
        if (sortMenuProfitShowed) {
            setSortMenuProfitShowed(false)
        }
        else {
            setSortMenuProfitShowed(true)
        }
    }

    function showSortMenuLose() {
        if (sortMenuLoseShowed) {
            setSortMenuLoseShowed(false)
        }
        else {
            setSortMenuLoseShowed(true)
        }
    }
    return (
        <section className='local-posts'>
            <Profile changeUserInfo={props.changeUserInfo} isLoading={props.isLoading} />
            <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />
            <div className="local-posts__wrapper">
                <div className={lpContainerStyle}>
                    {dataForChart !== null && <div
                        className="local-posts__chart" >
                        <Pie

                            data={dataForChart}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                }
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
                                <li>
                                    <p className="local-posts__list-heading">Доход:</p>
                                    <p className="local-posts__list-heading">{totalProfit}</p>
                                </li>
                                {/* ////////////////////////////////////////////////////////////////////////////// */}
                                <li className="lp__sort-el">
                                    <button className="lp__sort-btn"
                                        onClick={() => { showSortMenuprofit() }}
                                    >сортировать</button>
                                    <div className={`lp__sort-block ${sortMenuProfitShowed && 'lp__sort-block_active'}`}>
                                        <label className="lp__sort-label">
                                            <input
                                                className="lp__sort-input"
                                                type="radio"
                                                name="sortProfit"
                                                value='fromMany'
                                                onClick={() => { setCurrentSort({ kinde: 'profit', sortBy: 'fromMany', type: 'sum' }) }} />
                                            по сумме, от большего
                                        </label>
                                        <label className="lp__sort-label">
                                            <input
                                                className="lp__sort-input"
                                                type="radio"
                                                name="sortProfit"
                                                value='fromSmall'
                                                onChange={() => { setCurrentSort({ kinde: 'profit', sortBy: 'fromSmall', type: 'sum' }) }} />
                                            по сумме, от меньшего
                                        </label>
                                        <label className="lp__sort-label">
                                            <input
                                                className="lp__sort-input"
                                                type="radio"
                                                name="sortProfit"
                                                value='category'
                                                onChange={() => { setCurrentSort({ kinde: 'profit', sortBy: '--', type: 'category' }) }} />
                                            по категории
                                        </label>
                                    </div>

                                </li>
                                {Array.isArray(showedPostData?.cashData.profit) && showedPostData?.cashData.profit.map((item) => (
                                    <PostedEl
                                        emailModalLodaing={props.emailModalLodaing}
                                        openEmailModal={openEmailModal}
                                        isLoadingLP={props.isLoadingLP}
                                        deleteCashDataLP={deleteCashDataLP}
                                        item={item}
                                        key={item._id}
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
                                <li>
                                    <p className="local-posts__list-heading">Расход:</p>
                                    <p className="local-posts__list-heading">{totalLose}</p>
                                </li>
                                <li className="lp__sort-el">
                                    <button className="lp__sort-btn"
                                        onClick={() => { showSortMenuLose() }}
                                    >сортировать</button>
                                    <div className={`lp__sort-block ${sortMenuLoseShowed && 'lp__sort-block_active'}`}>
                                        <label className="lp__sort-label">
                                            <input
                                                className="lp__sort-input"
                                                type="radio"
                                                name="sortLose"
                                                value={'fromMany'}
                                                onClick={() => { setCurrentSort({ kinde: 'lose', sortBy: 'fromMany', type: 'sum' }) }} />
                                            по сумме, от большего
                                        </label>
                                        <label className="lp__sort-label">
                                            <input
                                                className="lp__sort-input"
                                                type="radio"
                                                name="sortLose"
                                                value={'fromSmall'}
                                                onChange={() => { setCurrentSort({ kinde: 'lose', sortBy: 'fromSmall', type: 'sum' }) }} />
                                            по сумме, от меньшего
                                        </label>
                                    </div>

                                </li>
                                {Array.isArray(showedPostData?.cashData.lose) && showedPostData?.cashData.lose.map((item) => (
                                    <PostedEl
                                        emailModalLodaing={props.emailModalLodaing}
                                        openEmailModal={openEmailModal}
                                        isLoadingLP={props.isLoadingLP}
                                        deleteCashDataLP={deleteCashDataLP}
                                        item={item}
                                        key={item._id}
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