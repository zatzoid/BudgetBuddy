import { useContext, useEffect, useMemo, useState } from "react";
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
    console.log('rerender statistic 🎀');
    const { appSettings } = useContext(CurrentContext);
    const [statsOpened, setStatsOpened] = useState<boolean>(appSettings.statsMustOpen);
    //слайдер между "сравнение с прошлым месяцом"  "анализ по категориям"
    const [currentStats, setCurrentStats] = useState<string>('category');


    const [dataForChart, setDataForChart] = useState<chartData>({
        labels: ['доход', 'расход'],
        datasets: [
            {
                data: [props.totalProfit, props.totalLose],
                backgroundColor: ["#f12652", "#7DCE70"],
            },
        ]
    })
    const [profitCategoryData, setProfitCategoryData] = useState<{ total: valuesByCategory, precent: valuesByCategory }>({ total: null, precent: null });
    const [loseCategoryData, setLoseCategoryData] = useState<{ total: valuesByCategory, precent: valuesByCategory }>({ total: null, precent: null });
    const [totalComplited, setTotalComplited] = useState<{ lose: number, profit: number }>({ lose: 0, profit: 0 })

    const previousTotalProfit = useMemo(() => props.localPost.prev?.cashData.profit.reduce((acc, item) => acc + Object.values(item.data)[0], 0) || 0, [props.localPost.current, statsOpened])
    const previousTotalLose = useMemo(() => props.localPost.prev?.cashData.lose.reduce((acc, item) => acc + Object.values(item.data)[0], 0) || 0, [props.localPost.current, statsOpened])

    // для мобилок
    // слайдер chart и main
    const [showedStatsEl, setShowedStatsEl] = useState(0);
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: showedStatsEl, callback: choisStats })

    useEffect(() => {
        if (statsOpened) {
            setProfitCategoryData(getValuesByCategory({ localPost: props.localPost, kinde: 'profit' }));
            setLoseCategoryData(getValuesByCategory({ localPost: props.localPost, kinde: 'lose' }));
            setDataForChart(chartPieData(props.localPost.current));
            setTotalComplited(getTotalValues(props.localPost));

        }


    }, [props.localPost, statsOpened])

    function chartPieData(data: LocalPost | null): chartData {
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
        return chartData;

    }
    function getValuesByCategory(data: { localPost: { current: LocalPost | null, prev: LocalPost | null }, kinde: string }): { total: valuesByCategory, precent: valuesByCategory } {

        const { cashData } = (data.localPost.current as LocalPost);
        const cashDataPrev = data.localPost.prev || null;
        const currentList = createStatsValues({ kinde: data.kinde, obj: cashData });
        const previousList = createStatsValues({ kinde: data.kinde, obj: cashDataPrev?.cashData || null });
        const precentValues = createPrecentValues({ curList: currentList, prevList: previousList, kinde: data.kinde });

        return { total: currentList, precent: precentValues }


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


        function createPrecentValues(data: { curList: valuesByCategory, prevList: valuesByCategory, kinde: string }): valuesByCategory {
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

    function getTotalValues(localPost: { current: LocalPost | null, prev: LocalPost | null }): { profit: number, lose: number } {

        const profitList = (localPost.current as LocalPost).cashData.profit.filter(el => el.statusComplited === true);
        const profit = profitList.length > 0
            ? profitList.reduce((acc, val) => acc + Number(Object.values(val.data)), 0)
            : 0;

        const loseList = (localPost.current as LocalPost).cashData.lose.filter(el => el.statusComplited === true);
        const lose = loseList.length > 0
            ? loseList.reduce((acc, val) => acc + Number(Object.values(val.data)), 0)
            : 0


        return { profit, lose }

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
                    <div className="stats__el stats__elChart" >
                        {dataForChart !== null && <div className="stats__elChart-pie ">
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
                        <div className="stats__elChart-predict">
                            {props.totalProfit && props.totalLose ? <><p className="stats__elChart-predict-heding">Предварительный прогноз:</p>
                                {props.totalProfit > props.totalLose && <p className="stats__elChart-predict-value stats__elChart-predict-value_ok">{
                                    ` вы сэкономили: ${props.totalProfit - props.totalLose}₽ +${Math.ceil((props.totalProfit / props.totalLose) * 100 - 100)}%`}</p>}
                                {props.totalProfit < props.totalLose && <p className="stats__elChart-predict-value stats__elChart-predict-value_fault"> {
                                    `вы в минусе: ${props.totalLose - props.totalProfit}₽ ${Math.ceil((props.totalProfit / props.totalLose) * 100 - 100)}%`} </p>}
                                {props.totalProfit === props.totalLose && <p className="stats__elChart-predict-value stats__elChart-predict-value_ok"> Идеально</p>}</> : ''}
                            <div className="stats__elChart-predict-fact">
                                {totalComplited.profit && <>
                                    <p className="stats__elChart-predict-fact-heading">Сумма полученного дохода:</p>
                                    <p className="stats__elChart-predict-fact-value">{totalComplited.profit} ₽  {Math.ceil((totalComplited.profit / props.totalProfit) * 100)}% от обещего дохода</p>
                                </>}
                                {totalComplited.lose && <>
                                    <p className="stats__elChart-predict-fact-heading">Сумма уплаченного расхода:</p>
                                    <p className="stats__elChart-predict-fact-value">{totalComplited.lose} ₽  {Math.ceil((totalComplited.lose / props.totalLose) * 100)} % от обещего расхода</p>
                                </>}
                            </div>

                        </div>
                    </div>
                    <div className="stats__el stats__elMain">

                        <ul className="stats__elMain-nav">
                            <li onClick={() => { setCurrentStats('month') }}
                                className="stats__elMain-nav-el">
                                <button className="stats__elMain-nav-el-btn">сравнение с прошлым месяцом</button>
                            </li>
                            <li onClick={() => { setCurrentStats('category') }}
                                className="stats__elMain-nav-el">
                                <button className="stats__elMain-nav-el-btn">анализ по категориям</button>
                            </li>
                            <li className={`stats__elMain-nav-border stats__elMain-nav-border_${currentStats}`}>
                            </li>
                        </ul>

                        {currentStats === 'category' ? <div className="stats__elMain-category">

                            {profitCategoryData.total && <ul className="stats__elMain-category-values">
                                <li>
                                    <p className="stats__elMain-category-values-heading">доход</p>
                                </li>
                                <li className="stats__elMain-category-line">
                                    {Array.isArray(profitCategoryData.total) && profitCategoryData.total.map(el => {
                                        return (<span
                                            key={el.category}
                                            title={`${translateCategory(el.category)}`}
                                            style={{ width: `${Math.ceil((el.value * 100) / props.totalProfit)}%` }}
                                            className={`stats__elMain-category-line-el back-col_${el.category}`} />)
                                    })}
                                </li>
                                {Array.isArray(profitCategoryData.total) && profitCategoryData.total.map(el => {
                                    return (<li key={el.category} className='stats__elMain-category-values-el'>
                                        <span className={`stats__elMain-category-values-img back-img_${el.category}`} />
                                        <p className="stats__elMain-category-values-text">{`${((el.value * 100) / props.totalProfit).toFixed(1)}%`}</p>
                                        <p className="stats__elMain-category-values-text">{el.value}</p>
                                    </li>)
                                })}
                            </ul>}
                            {loseCategoryData.total && <ul className="stats__elMain-category-values">
                                <li>
                                    <p className="stats__elMain-category-values-heading">расход</p>
                                </li>
                                <li className="stats__elMain-category-line">
                                    {Array.isArray(loseCategoryData.total) && loseCategoryData.total.map(el => {
                                        return (<span
                                            key={el.category}
                                            title={`${translateCategory(el.category)}`}
                                            style={{ width: `${Math.ceil((el.value * 100) / props.totalLose)}%` }}
                                            className={`stats__elMain-category-line-el back-col_${el.category}`} />)
                                    })}
                                </li>
                                {Array.isArray(loseCategoryData.total) && loseCategoryData.total.map(el => {
                                    return (<li key={el.category} className='stats__elMain-category-values-el'>
                                        <span className={`stats__elMain-category-values-img back-img_${el.category}`} />
                                        <p className="stats__elMain-category-values-text">{`${((el.value * 100) / props.totalLose).toFixed(1)}%`}</p>
                                        <p className="stats__elMain-category-values-text">{el.value}</p>
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
                                            {loseCategoryData.precent || profitCategoryData.precent ? <p className="stats__month-heading">текущий месяц к прошлому по категориям</p> :
                                                <p className="stats__month-cap">нет данных для сравнения</p>}
                                        </li>
                                        {Array.isArray(profitCategoryData.precent) && profitCategoryData.precent.map((el) => {

                                            return (<li className="stats__month-el" style={{ gridColumn: '1' }} key={el.category}>
                                                <span className={`stats__month-img back-img_${el.category}`} />
                                                <p className="stats__month-text">{translateCategory(el.category)}</p>
                                                <p className="stats__month-text" style={{ color: `${el.value >= 0 ? 'var(--col-main-dark)' : 'var(--col-red)'}` }}>{el.value}%</p>
                                            </li>)

                                        })}
                                        {Array.isArray(loseCategoryData.precent) && loseCategoryData.precent.map((el, index) => {

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