import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import translateCategory from "../../../utils/translateCategory";

export default function Statistics(props) {
    const [dataForChart, setDataForChart] = useState(null);
    const [currentStats, setCurrentStats] = useState('category');
    const [profitCategoryList, setProfitCategoryList] = useState(null);
    const [profitCategoryListTotal, setProfitCategoryListTotal] = useState(null);
    const [loseCategoryList, setLoseCategoryList] = useState(null);
    const [loseCategoryListTotal, setLoseCategoryListTotal] = useState(null);
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
    function statsValues(data) {
        const { cashData } = props.dataForStatistic;
        const profitCatList = cashData[data.kinde].map((el) => { return { category: el.category, value: Object.values(el.data)[0] } });
        const sumByCategory = profitCatList.reduce(function (acc, currentValue) {
            const category = currentValue.category;
            acc[category] = (acc[category] || 0) + currentValue.value;
            return acc;
        }, {});
        const resultArray = Object.keys(sumByCategory).map(function (category) {
            return { category: category, value: sumByCategory[category] };
        });
        data.kinde === 'profit' ? setProfitCategoryList(resultArray) : setLoseCategoryList(resultArray);

        const totalProfValue = profitCatList.reduce(function (acc, currentValue) {
            return acc + currentValue.value;
        }, 0);
        data.kinde === 'profit' ? setProfitCategoryListTotal(totalProfValue) : setLoseCategoryListTotal(totalProfValue);;
    }
    useEffect(() => {
        if (props.dataForStatistic !== null) {
            chartPieData(props.dataForStatistic)
            statsValues({ kinde: 'profit' });
            statsValues({ kinde: 'lose' })
        }

    }, [props.dataForStatistic])
    return (
        <>
            {dataForChart !== null && <section className="stats">
                <div className="stats__chart" >
                    <p className="stats__heading">Общая диаграмма</p>
                    <div>
                        <Pie
                            data={dataForChart}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                }
                            }}

                        />
                    </div>
                </div>
                <div className="stats__main">
                    <p className="stats__heading">Статистика</p>
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
                    <div className="stats__main-data">

                        <ul className="stats__main-data-values">
                            <li>
                                <p className="stats__main-data-values-heading">доход</p>
                            </li>
                            <li className="stats__main-data-line">
                                {Array.isArray(profitCategoryList) && profitCategoryList.map(el => {
                                    return (<span
                                        key={el.category}
                                        title={`${translateCategory(el.category)}`}
                                        style={{ width: `${Math.ceil((el.value * 100) / profitCategoryListTotal)}%` }}
                                        className={`stats__main-data-line-el back-col_${el.category}`} />)
                                })}
                            </li>
                            {Array.isArray(profitCategoryList) && profitCategoryList.map(el => {
                                return (<li  key={el.category} className='stats__main-data-values-el'>
                                    <span className={`stats__main-data-values-img back-img_${el.category}`} />
                                    <p className="stats__main-data-values-text">{`${Math.ceil((el.value * 100) / profitCategoryListTotal)}%`}</p>
                                    <p className="stats__main-data-values-text">{el.value}</p>
                                </li>)
                            })}
                        </ul>
                        <ul className="stats__main-data-values">
                            <li>
                                <p className="stats__main-data-values-heading">расход</p>
                            </li>
                            <li className="stats__main-data-line">
                                {Array.isArray(loseCategoryList) && loseCategoryList.map(el => {
                                    return (<span
                                        key={el.category}
                                        title={`${translateCategory(el.category)}`}
                                        style={{ width: `${Math.ceil((el.value * 100) / loseCategoryListTotal)}%` }}
                                        className={`stats__main-data-line-el back-col_${el.category}`} />)
                                })}
                            </li>
                            {Array.isArray(loseCategoryList) && loseCategoryList.map(el => {
                                return (<li  key={el.category} className='stats__main-data-values-el'>
                                    <span className={`stats__main-data-values-img back-img_${el.category}`} />
                                    <p className="stats__main-data-values-text">{`${Math.ceil((el.value * 100) / loseCategoryListTotal)}%`}</p>
                                    <p className="stats__main-data-values-text">{el.value}</p>
                                </li>)
                            })}
                        </ul>
                    </div>
                </div>
            </section>}
        </>
    )
}