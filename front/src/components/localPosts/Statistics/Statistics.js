import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import translateCategory from "../../../utils/translateCategory";
import ShowMoreBtn from "../../showMoreBtn/ShowMoreBtn";
import useTouchSlider from "../../../utils/customHooks/useTouchSlider";
import ActuveBtnSlider from "../../activeBtnSlider/ActiveBtnSlider";

export default function Statistics(props) {
    const [dataForChart, setDataForChart] = useState(null);
    const [statsOpened, setStatsOpened] = useState(false)
    const [currentStats, setCurrentStats] = useState('category');
    const [profitCategoryList, setProfitCategoryList] = useState(null);
    const [loseCategoryList, setLoseCategoryList] = useState(null);
    const [profitComplitedTotal, setProfitComplitedTotal] = useState(null);
    const [loseComplitedTotal, setLoseComplitedTotal] = useState(null);
    const previousTotalProfit = props.previousPostData?.cashData.profit.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const previousTotalLose = props.previousPostData?.cashData.lose.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const [prevProfitCategoryList, setPrevProfitCategoryList] = useState(null);
    const [prevLoseCategoryList, setPrevLoseCategoryList] = useState(null);
    const [showedStatsEl, setShowedStatsEl] = useState(0);
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: showedStatsEl, slideFunction: choisStats })

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
    function getStatsValues(data) {
        const { cashData } = props.dataForStatistic;
        const cashDataPrev = props?.previousPostData || null;
        const currentList = createStatsValues({ kinde: data.kinde, obj: cashData })
        const previousList = createStatsValues({ kinde: data.kinde, obj: cashDataPrev?.cashData });

        function createStatsValues(data) {
            if (data.obj && data.obj[data.kinde].length > 0) {
                /* несуммированный массив */
                const categoryList = data.obj[data.kinde].map((el) => { return { category: el.category, value: Object.values(el.data)[0] } });

                /* суммированный массив*/
                const resultArray = categoryList.reduce(function (acc, currentValue) {
                    const category = currentValue.category;

                    const existingCategory = acc.find(item => item.category === category);

                    if (existingCategory) {
                        existingCategory.value += currentValue.value;
                    } else {
                        acc.push({ category, value: currentValue.value });
                    }

                    return acc;
                }, []);

                return resultArray;
            } else {
                return null
            }
        }
        data.kinde === 'profit' ? setProfitCategoryList(currentList) : setLoseCategoryList(currentList);

        function createPrevValues(data) {
            if (data.prevList && data.curList) {
                const currentList = data.curList;
                const prevList = data.prevList;
                const newList = currentList.map(el => {
                    const curKey = el.category;
                    const previousObj = prevList.find(el => el.category === curKey);
                    if (previousObj) {
                        if (previousObj.value < el.value) {
                            /*  return { [curKey]: Math.ceil(100 * (el.value - previousObj.value) / el.value) } */
                            return { [curKey]: Math.ceil(((previousObj.value - el.value) / el.value) * 100) }
                        } else {
                            return { [curKey]: Math.ceil(100 * (previousObj.value - el.value) / previousObj.value) }
                            /* return { [curKey]: Math.ceil((( el.value - previousObj.value) / previousObj.value) * 100) } */
                        }
                    } else { return null }
                }).filter(el => el !== null)

                return newList
            } else {
                return null
            }
        }
        const prevValues = createPrevValues({ curList: currentList, prevList: previousList });
        data.kinde === 'profit' ? setPrevProfitCategoryList(prevValues) : setPrevLoseCategoryList(prevValues);
    }

    function predictComplitedData() {
        const profitList = props.dataForStatistic.cashData.profit.filter(el => el.statusComplited === true);
        if (profitList.length > 0) {
            const profitValues = profitList.reduce((acc, val) => acc + Number(Object.values(val.data)), 0);
            setProfitComplitedTotal(profitValues)
        } else { setProfitComplitedTotal(null) };
        const loseList = props.dataForStatistic.cashData.lose.filter(el => el.statusComplited === true);
        if (loseList.length > 0) {
            const loseValues = loseList.reduce((acc, val) => acc + Number(Object.values(val.data)), 0);
            setLoseComplitedTotal(loseValues);
        } else { setLoseComplitedTotal(null) };

    }

    function showStats() {
        if (statsOpened) {
            setStatsOpened(false)
            return
        }
        setStatsOpened(true)
    }
    function choisStats() {
        if (window.innerWidth < 700) {
            if (showedStatsEl === 1) {
                setShowedStatsEl(0)
                return
            }
            setShowedStatsEl(1)
        }
    }

    useEffect(() => {
        if (props.dataForStatistic !== null) {
            chartPieData(props.dataForStatistic)
            getStatsValues({ kinde: 'profit' });
            getStatsValues({ kinde: 'lose' });
            predictComplitedData()
        }

    }, [props.dataForStatistic]);
    return (
        <>
            <button className={`stats__show-stats-btn ${statsOpened && 'stats__show-stats-btn__open'}`}
                type="button"
                onClick={() => { showStats() }}>
                Статистика
                <ShowMoreBtn active={statsOpened} />
            </button>
            <div className={`stats__wrapper ${statsOpened && 'stats__wrapper_opened'}`}>
                <nav className="stats__heading-btn-block" >
                    <button className="stats__heading-btn" onClick={() => choisStats()}>Общая информация</button>
                    <button className="stats__heading-btn" onClick={() => choisStats()}>Подробная информация</button>
                    {props.currentWW < 701 && <ActuveBtnSlider transformValue={showedStatsEl} />}
                </nav>
                <section className='stats' style={slideStyle}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}>
                    <div className="stats__el stats__chart" >
                        {dataForChart !== null && <div className="stats__chart-el">
                            <Pie
                                height={150}
                                width={150}
                                data={dataForChart}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        }

                                    },
                                    /* maintainAspectRatio: true, */
                                    /*   responsive: true, */
                                    /*  aspectRatio: 2 | 2 */

                                }}

                            />
                        </div>}
                        <div className="stats__predict">
                            {props.totalProfit && props.totalLose ? <><p className="stats__predict-heding">Предварительный прогноз:</p>
                                {props.totalProfit > props.totalLose && <p className="stats__predict-value stats__predict-value_ok">{
                                    ` вы сэкономили: ${props.totalProfit - props.totalLose} +${Math.ceil((props.totalProfit / props.totalLose) * 100 - 100)}%`}</p>}
                                {props.totalProfit < props.totalLose && <p className="stats__predict-value stats__predict-value_fault"> {
                                    `вы в минусе: ${props.totalLose - props.totalProfit} ${Math.ceil((props.totalProfit / props.totalLose) * 100 - 100)}%`} </p>}
                                {props.totalProfit === props.totalLose && <p className="stats__predict-value stats__predict-value_ok"> Идеально</p>}</> : ''}
                            <div className="stats__fact">
                                {profitComplitedTotal && <>
                                    <p className="stats__fact-heading">Сумма полученного дохода:</p>
                                    <p className="stats__fact-value">{profitComplitedTotal} ₽  {Math.ceil((profitComplitedTotal / props.totalProfit) * 100)}% от обещего дохода</p>
                                </>}
                                {loseComplitedTotal && <>
                                    <p className="stats__fact-heading">Сумма уплаченного расхода:</p>
                                    <p className="stats__fact-value">{loseComplitedTotal} ₽  {Math.ceil((loseComplitedTotal / props.totalLose) * 100)} % от обещего расхода</p>
                                </>}
                            </div>

                        </div>
                    </div>
                    <div className="stats__el stats__main">

                        <ul className="stats__main-nav">
                            <li onClick={() => { setCurrentStats('month') }}
                                className="stats__main-nav-el">
                                <button className="stats__main-nav-el-btn">сравнение с прошлым месяцом</button>
                            </li>
                            <li onClick={() => { setCurrentStats('category') }}
                                className="stats__main-nav-el">
                                <button className="stats__main-nav-el-btn">анализ по категориям</button>
                            </li>
                            <li className={`stats__main-nav-border stats__main-nav-border_${currentStats}`}>
                            </li>
                        </ul>

                        {currentStats === 'category' ? <div className="stats__category">

                            {profitCategoryList && <ul className="stats__category-values">
                                <li>
                                    <p className="stats__category-values-heading">доход</p>
                                </li>
                                <li className="stats__category-line">
                                    {Array.isArray(profitCategoryList) && profitCategoryList.map(el => {
                                        return (<span
                                            key={el.category}
                                            title={`${translateCategory(el.category)}`}
                                            style={{ width: `${Math.ceil((el.value * 100) / props.totalProfit)}%` }}
                                            className={`stats__category-line-el back-col_${el.category}`} />)
                                    })}
                                </li>
                                {Array.isArray(profitCategoryList) && profitCategoryList.map(el => {
                                    return (<li key={el.category} className='stats__category-values-el'>
                                        <span className={`stats__category-values-img back-img_${el.category}`} />
                                        <p className="stats__category-values-text">{`${Math.ceil((el.value * 100) / props.totalProfit)}%`}</p>
                                        <p className="stats__category-values-text">{el.value}</p>
                                    </li>)
                                })}
                            </ul>}
                            {loseCategoryList && <ul className="stats__category-values">
                                <li>
                                    <p className="stats__category-values-heading">расход</p>
                                </li>
                                <li className="stats__category-line">
                                    {Array.isArray(loseCategoryList) && loseCategoryList.map(el => {
                                        return (<span
                                            key={el.category}
                                            title={`${translateCategory(el.category)}`}
                                            style={{ width: `${Math.ceil((el.value * 100) / props.totalLose)}%` }}
                                            className={`stats__category-line-el back-col_${el.category}`} />)
                                    })}
                                </li>
                                {Array.isArray(loseCategoryList) && loseCategoryList.map(el => {
                                    return (<li key={el.category} className='stats__category-values-el'>
                                        <span className={`stats__category-values-img back-img_${el.category}`} />
                                        <p className="stats__category-values-text">{`${Math.ceil((el.value * 100) / props.totalLose)}%`}</p>
                                        <p className="stats__category-values-text">{el.value}</p>
                                    </li>)
                                })}
                            </ul>}
                        </div> :
                            <>
                                {previousTotalLose !== 0 && previousTotalProfit !== 0 ? <>
                                    <div className="stats__month-total">
                                        {props.totalProfit > previousTotalProfit && <p className="stats__month-text">ваши доходы выросли на <span style={{ color: 'var(--col-main-dark)' }}>
                                            {Math.ceil((props.totalProfit / previousTotalProfit) * 100 - 100)}% +{Math.ceil(props.totalProfit - previousTotalProfit)} ₽</span>
                                        </p>}
                                        {props.totalProfit < previousTotalProfit && <p className="stats__month-text">ваши доходы уменьшились на <span style={{ color: 'var(--col-red)' }}>
                                            {Math.ceil((props.totalProfit / previousTotalProfit) * 100 - 100)}% -{Math.ceil(previousTotalProfit - props.totalProfit)} ₽</span>
                                        </p>}
                                        {props.totalProfit === previousTotalProfit && <p className="stats__month-text">ваши доходы не изменились</p>}
                                        {props.totalLose > previousTotalLose && <p className="stats__month-text">ваши расходы выросли на <span style={{ color: 'var(--col-red)' }}>
                                            {Math.ceil((props.totalLose / previousTotalLose) * 100 - 100)}% +{Math.ceil(props.totalLose - previousTotalLose)} ₽</span>
                                        </p>}
                                        {props.totalLose < previousTotalLose && <p className="stats__month-text">ваши расходы уменьшились на <span style={{ color: 'var(--col-main-dark)' }}>
                                            {Math.ceil((props.totalLose / previousTotalLose) * 100 - 100)}% -{Math.ceil(previousTotalLose - props.totalLose)} ₽</span>
                                        </p>}
                                        {props.totalLose === previousTotalLose && <p className="stats__month-text">ваши расходы не изменились</p>}
                                    </div>
                                    <ul className="stats__month">
                                        <li className="stats__month-el" style={{ gridColumn: '1 / span 2' }}>
                                            {prevLoseCategoryList || prevProfitCategoryList ? <p className="stats__month-heading">сравнение категорий с прошлым месяцом</p> :
                                                <p>нет данных для сравнения</p>}
                                        </li>
                                        {Array.isArray(prevProfitCategoryList) && prevProfitCategoryList.map((el) => {

                                            return (<li className="stats__month-el" style={{ gridColumn: '1' }} key={Object.keys(el)[0]}>
                                                <p className="stats__month-text">{translateCategory(Object.keys(el)[0])}</p>
                                                <p className="stats__month-text" style={{ color: `${Object.values(el) > 0 ? 'var(--col-main-dark)' : 'var(--col-red)'}` }}>{Object.values(el)}%</p>
                                            </li>)

                                        })}
                                        {Array.isArray(prevLoseCategoryList) && prevLoseCategoryList.map((el, index) => {

                                            return (<li className="stats__month-el" style={{ gridColumn: '2', gridRow: `${index + 2}` }} key={Object.keys(el)[0]}>
                                                <p className="stats__month-text">{translateCategory(Object.keys(el)[0])}</p>
                                                <p className="stats__month-text" style={{ color: `${Object.values(el) < 0 ? 'var(--col-main-dark)' : 'var(--col-red)'}` }}>{Object.values(el)}%</p>
                                            </li>)

                                        })}
                                    </ul>
                                </> :
                                    <p className="stats__month-cap">нет данных для сравнения</p>}
                            </>}
                    </div>
                </section >
            </div>
        </>
    )
}