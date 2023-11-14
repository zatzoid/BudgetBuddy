import { useState, useEffect } from "react";
import React from "react";

export default function Sorting(props) {
    const [sortMenuShowed, setSortMenuShowed] = useState(false);
    const [currentSort, setCurrentSort] = useState(null);
    const [hideCheckBoxVal, setHideCheckBoxVal] = useState({ profit: false, lose: false });
    const [CBvalProfit, setCBvalProfit] = useState(false);
    const [CBvalLose, setCBvalLose] = useState(false);
    function showSortMenu() {
        if (sortMenuShowed) {
            setSortMenuShowed(false)
        }
        else {
            setSortMenuShowed(true)
        }
    }

    function sortMassive(data) {
        const copyPostData = { ...props.showedPostData };
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
                return a.category.localeCompare(b.category)
            } else if (data.type === 'statusComplited') {
                return b.statusComplited - a.statusComplited
            }
        })
        copyPostData.cashData[kinde] = dataArray;
        props.setShowedPostData(copyPostData);
        showSortMenu()

    }


    function hideComplited(value) {
        if (!value) {
            props.setComplitedElStatusFoo({  kinde:[props.kinde], value: 'none' });
            setHideCheckBoxVal({ ...hideCheckBoxVal, [props.kinde]: true })
        }
        else {
            props.setComplitedElStatusFoo({  kinde:[props.kinde], value: 'block' });
            setHideCheckBoxVal({ ...hideCheckBoxVal, [props.kinde]: false })
        }
    }

    useEffect(() => {
        if (currentSort) {
            sortMassive(currentSort)
        }
    }, [currentSort])

    return (
        <>
            <label>
                <input
                    onChange={(e) => {hideComplited(hideCheckBoxVal[props.kinde]) }}
                    checked={hideCheckBoxVal[props.kinde]}
                    type='checkbox' />
                скрыть вычеркнутые
            </label>
            <button className="lp__sort-btn"
                onClick={() => { showSortMenu() }}
            >сортировать</button>
            <div className={`lp__sort-block ${sortMenuShowed && 'lp__sort-block_active'}`}>
                <label className="lp__sort-label">
                    <input
                        className="lp__sort-input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='fromMany'
                        onClick={() => { setCurrentSort({ kinde: props.kinde, sortBy: 'fromMany', type: 'sum' }) }} />
                    по сумме, от большего
                    <span ></span>
                </label>
                <label className="lp__sort-label">
                    <input
                        className="lp__sort-input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='fromSmall'
                        onChange={() => { setCurrentSort({ kinde: props.kinde, sortBy: 'fromSmall', type: 'sum' }) }} />
                    по сумме, от меньшего
                    <span ></span>
                </label>
                <label className="lp__sort-label">
                    <input
                        className="lp__sort-input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='category'
                        onChange={() => { setCurrentSort({ kinde: props.kinde, sortBy: '--', type: 'category' }) }} />
                    по категории
                    <span ></span>
                </label>
                <label className="lp__sort-label">
                    <input
                        className="lp__sort-input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='statusComplited'
                        onChange={() => { setCurrentSort({ kinde: props.kinde, sortBy: '--', type: 'statusComplited' }) }} />
                    по выполнению
                    <span ></span>
                </label>
            </div>

        </>
    )
}