import { useContext, useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
/* import type { ChartData, ChartOptions } from 'chart.js'; */
import translateCategory from "../../../utils/translateCategory";
import ShowMoreBtn from "../../ui/showMoreBtn/ShowMoreBtn";
import useTouchSlider from "../../../utils/customHooks/useTouchSlider";
import ActuveBtnSlider from "../../ui/activeBtnSlider/ActiveBtnSlider";
import { CashData, LocalPost } from "../../../utils/types";
import { CurrentContext } from "../../Context";
interface chartData {
    labels: string[], datasets: [{ data: number[], backgroundColor: string[] }]
}
interface props {
    currentWW: number
    localPost: { current: LocalPost | null, prev: LocalPost | null }
    totalLose: number
    totalProfit: number
}

type valuesByCategory = { category: string; value: number }[] | null;


export default function Statistics(props: props) {
    const { appSettings } = useContext(CurrentContext)
    const [dataForChart, setDataForChart] = useState<chartData | null>(null);
    const [statsOpened, setStatsOpened] = useState<boolean>(appSettings.statsMustOpen)
    const [currentStats, setCurrentStats] = useState<string>('category');

    const [profitCategoryList, setProfitCategoryList] = useState<valuesByCategory>(null);
    const [profitPrecentCategoryList, setProfitPrecentCategoryList] = useState<valuesByCategory>(null);

    const [loseCategoryList, setLoseCategoryList] = useState<valuesByCategory>(null);
    const [losePrecentCategoryList, setLosePrecentCategoryList] = useState<valuesByCategory>(null);

    const [profitComplitedTotal, setProfitComplitedTotal] = useState<number | null>(null);
    const [loseComplitedTotal, setLoseComplitedTotal] = useState<number | null>(null);
    const previousTotalProfit = props.localPost.prev?.cashData.profit.reduce((acc, item) => acc + Object.values(item.data)[0], 0) || 0
    const previousTotalLose = props.localPost.prev?.cashData.lose.reduce((acc, item) => acc + Object.values(item.data)[0], 0) || 0


    const [showedStatsEl, setShowedStatsEl] = useState(0);
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: showedStatsEl, callback: choisStats })

    function chartPieData(data: LocalPost | null) {
        if (data !== null) {
            const chartData: chartData = {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: [],
                    },
                ]

            };

            data?.cashData.profit.forEach((item) => {
                const key = Object.keys(item.data)[0];
                const value = Object.values(item.data)[0];
                chartData.labels.push(key);
                chartData.datasets[0].data.push(value);
                chartData.datasets[0].backgroundColor.push("#7DCE70");
            });

            data?.cashData.lose.forEach((item) => {
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
    function getStatsValues(data: { kinde: string }) {
        const { cashData } = (props.localPost.current as LocalPost);
        const cashDataPrev = props?.localPost.prev || null;
        const currentList = createStatsValues({ kinde: data.kinde, obj: cashData })
        const previousList = createStatsValues({ kinde: data.kinde, obj: cashDataPrev?.cashData || null });

        function createStatsValues(data: { kinde: string, obj: { [key: string]: CashData[] } | null }): valuesByCategory {
            if (data.obj && data.obj[data.kinde].length > 0) {
                /* несуммированный массив */
                const categoryList = data.obj[data.kinde].map((el) => { return { category: el.category, value: Object.values(el.data)[0] } });

                /* суммированный массив*/
                const resultArray = categoryList.reduce(function (acc, cshData) {
                    const category = cshData.category;

                    const existingCategory = acc.find((item: { category: string, value: number }) => item.category === category)

                    if (existingCategory) {
                        (existingCategory as { category: string, value: number }).value += cshData.value;
                    } else {

                        acc.push({ category: cshData.category, value: cshData.value });
                    }

                    return acc;
                }, [] as { category: string; value: number }[]);

                return resultArray;
            } else {
                return null
            }
        }



        data.kinde === 'profit' ? setProfitCategoryList(currentList) : setLoseCategoryList(currentList);

        const prevValues = createPrevValues({ curList: currentList, prevList: previousList, kinde: data.kinde });

        data.kinde === 'profit' ? setProfitPrecentCategoryList(prevValues) : setLosePrecentCategoryList(prevValues);


        function createPrevValues(data: { curList: valuesByCategory, prevList: valuesByCategory, kinde: string }): valuesByCategory {
            if (data.prevList && data.curList) {

                const currentList = data.curList;
                const prevList = data.prevList;
                const newList = currentList.map((el) => {
                    const curKey = el.category;
                    const previousObj = prevList.find(el => el.category === curKey);
                    if (previousObj) {
                        if (data.kinde === 'profit') {
                            if (previousObj.value < el.value) {
                                return { category: curKey, value: Math.ceil(((el.value - previousObj.value) / el.value) * 100) }
                            } else {
                                return { category: curKey, value: Math.ceil(((el.value - previousObj.value) / previousObj.value) * 100) }
                            }
                        } else {
                            if (previousObj.value < el.value) {

                                return { category: curKey, value: Math.ceil(((el.value - previousObj.value) / el.value) * 100) }
                            } else {
                                return { category: curKey, value: Math.ceil(((el.value - previousObj.value) / previousObj.value) * 100) }

                            }
                        }
                    }
                    else {
                        return null
                    }
                }).filter(el => el !== null)

                return (newList as valuesByCategory)
            } else {
                return null
            }
        }


    }

    function predictComplitedData() {
        const profitList = (props.localPost.current as LocalPost).cashData.profit.filter(el => el.statusComplited === true);
        if (profitList.length > 0) {
            const profitValues = profitList.reduce((acc, val) => acc + Number(Object.values(val.data)), 0);
            setProfitComplitedTotal(profitValues)
        } else {
            setProfitComplitedTotal(null)
        }
        const loseList = (props.localPost.current as LocalPost).cashData.lose.filter(el => el.statusComplited === true);
        if (loseList.length > 0) {
            const loseValues = loseList.reduce((acc, val) => acc + Number(Object.values(val.data)), 0);
            setLoseComplitedTotal(loseValues);
        } else {
            setLoseComplitedTotal(null)
        }

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
        if (props.localPost.current !== null) {
            chartPieData(props.localPost.current)
            getStatsValues({ kinde: 'profit' });
            getStatsValues({ kinde: 'lose' });
            predictComplitedData()
        }

    }, [props.localPost.current]);
    return (
        <>
            <button className={`stats__show-stats-btn `}
                type="button"
                onClick={() => { showStats() }}>
                Статистика
                <ShowMoreBtn active={statsOpened} />
                <span className={`stats__show-stats-btn-triangle ${statsOpened && 'stats__show-stats-btn-triangle_open'}`}></span>
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
                                /*  height={150}
                                 width={150} */
                                data={dataForChart}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        }

                                    },

                                }}

                            />
                        </div>}
                        <div className="stats__predict">
                            {props.totalProfit && props.totalLose ? <><p className="stats__predict-heding">Предварительный прогноз:</p>
                                {props.totalProfit > props.totalLose && <p className="stats__predict-value stats__predict-value_ok">{
                                    ` вы сэкономили: ${props.totalProfit - props.totalLose}₽ +${Math.ceil((props.totalProfit / props.totalLose) * 100 - 100)}%`}</p>}
                                {props.totalProfit < props.totalLose && <p className="stats__predict-value stats__predict-value_fault"> {
                                    `вы в минусе: ${props.totalLose - props.totalProfit}₽ ${Math.ceil((props.totalProfit / props.totalLose) * 100 - 100)}%`} </p>}
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
                                        <p className="stats__category-values-text">{`${((el.value * 100) / props.totalProfit).toFixed(1)}%`}</p>
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
                                        <p className="stats__category-values-text">{`${((el.value * 100) / props.totalLose).toFixed(1)}%`}</p>
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
                                            {losePrecentCategoryList || profitPrecentCategoryList ? <p className="stats__month-heading">текущий месяц к прошлому по категориям</p> :
                                                <p className="stats__month-cap">нет данных для сравнения</p>}
                                        </li>
                                        {Array.isArray(profitPrecentCategoryList) && profitPrecentCategoryList.map((el) => {

                                            return (<li className="stats__month-el" style={{ gridColumn: '1' }} key={el.category}>
                                                <span className={`stats__month-img back-img_${el.category}`} />
                                                <p className="stats__month-text">{translateCategory(el.category)}</p>
                                                <p className="stats__month-text" style={{ color: `${el.value >= 0 ? 'var(--col-main-dark)' : 'var(--col-red)'}` }}>{el.value}%</p>
                                            </li>)

                                        })}
                                        {Array.isArray(losePrecentCategoryList) && losePrecentCategoryList.map((el, index) => {

                                            return (<li className="stats__month-el" style={{ gridColumn: '2', gridRow: `${index + 2}` }} key={el.category}>
                                                <span className={`stats__month-img back-img_${el.category}`} />
                                                <p className="stats__month-text">{translateCategory(el.category)}</p>
                                                <p className="stats__month-text" style={{ color: `${el.value < 0 ? 'var(--col-main-dark)' : 'var(--col-red)'}` }}>{el.value}%</p>
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