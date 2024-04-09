import { useState, useEffect } from "react";
import { CashData, LocalPost } from "../../../utils/types";

interface props {
    kinde: 'profit' | 'lose'
    setShowComplitedPostsFoo: (data: { kinde: string, value: string }) => void
    showedPostData: LocalPost
    setShowedPostData: (data: LocalPost) => void
}

export default function Sorting(props: props) {
    const [sortMenuShowed, setSortMenuShowed] = useState<boolean>(false);
    const [currentSort, setCurrentSort] = useState<{ kinde: 'profit' | 'lose', sortBy: string, type: string } | null>(null);
    const [hideCheckBoxVal, setHideCheckBoxVal] = useState<{ profit: boolean, lose: boolean }>({ profit: false, lose: false });


    function sortMassive(data: { kinde: 'profit' | 'lose', sortBy: string, type: string }) {
        const copyLocalPost = { ...props.showedPostData };
        const copyCashData = { ...copyLocalPost.cashData };
        const kinde = data.kinde;
        const dataArray = copyCashData[kinde];
        /* сортировка выбором по типу*/
        if (data.type === 'sum') {
            //сортировка от большего к меньшему или наоборот
            dataArray.sort(function (a: CashData, b: CashData): number {
                return data.sortBy === 'fromMany' ?
                    Number(Object.values(b.data)) - Number(Object.values(a.data))
                    :
                    Number(Object.values(a.data)) - Number(Object.values(b.data))

            })
        }
        else if (data.type === 'category') {
            dataArray.sort(function (a: CashData, b: CashData): number {
                return a.category.localeCompare(b.category)
            })

        } else if (data.type === 'statusComplited') {
            dataArray.sort(function (a: CashData, b: CashData): number {
                return b.statusComplited ? 1 : -1 - (a.statusComplited ? 1 : -1)
            })

        } else if (data.type === 'date') {
            dataArray.sort(function (a: CashData, b: CashData): number {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return Number(dateB) - Number(dateA)
            })
        }
        /*  dataArray.sort(function (a: CashData, b: CashData): number {
             if (data.type === 'sum') {
                 return data.sortBy === 'fromMany' ?
                     Object.values(b.data) - Object.values(a.data) :
                     Object.values(a.data) - Object.values(b.data)
             } else if (data.type === 'category') {
                 return a.category.localeCompare(b.category)
             } else if (data.type === 'statusComplited') {
                 return b.statusComplited - a.statusComplited
             } else if (data.type === 'date') {
                 const dateA = new Date(a.createdAt);
                 const dateB = new Date(b.createdAt);
                 return dateB - dateA
 
             }
         }) */
        copyLocalPost.cashData[kinde] = dataArray;
        props.setShowedPostData(copyLocalPost);
        setSortMenuShowed(!sortMenuShowed)

    }


    function hideComplited(value: boolean) {
        if (!value) {
            props.setShowComplitedPostsFoo({ kinde: props.kinde, value: 'none' });
            setHideCheckBoxVal({ ...hideCheckBoxVal, [props.kinde]: true })
        }
        else {
            props.setShowComplitedPostsFoo({ kinde: props.kinde, value: 'block' });
            setHideCheckBoxVal({ ...hideCheckBoxVal, [props.kinde]: false })
        }
    }

    useEffect(() => {
        if (currentSort) {
            sortMassive(currentSort)
        }
    }, [currentSort])

    return (
        <div className="sorting-wrapper">
            <label className="sorting__checkbox">
                <input
                    onChange={() => { hideComplited(hideCheckBoxVal[props.kinde]) }}
                    checked={hideCheckBoxVal[props.kinde]}
                    type='checkbox' />
                скрыть вычеркнутые
                <span />
            </label>
            <button className="sorting__btn"
                onClick={() => { setSortMenuShowed(!sortMenuShowed) }}
            >сортировать</button>
            <div className={`sorting__block ${sortMenuShowed && 'sorting__block_active'}`}>
                <label className="sorting__label">
                    <input
                        className="sorting__input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='fromMany'
                        onClick={() => { setCurrentSort({ kinde: props.kinde, sortBy: '--', type: 'date' }) }} />
                    по дате добавления
                    <span ></span>
                </label>
                <label className="sorting__label">
                    <input
                        className="sorting__input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='fromMany'
                        onClick={() => { setCurrentSort({ kinde: props.kinde, sortBy: 'fromMany', type: 'sum' }) }} />
                    по сумме, от большего
                    <span ></span>
                </label>
                <label className="sorting__label">
                    <input
                        className="sorting__input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='fromSmall'
                        onChange={() => { setCurrentSort({ kinde: props.kinde, sortBy: 'fromSmall', type: 'sum' }) }} />
                    по сумме, от меньшего
                    <span ></span>
                </label>
                <label className="sorting__label">
                    <input
                        className="sorting__input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='category'
                        onChange={() => { setCurrentSort({ kinde: props.kinde, sortBy: '--', type: 'category' }) }} />
                    по категории
                    <span ></span>
                </label>
                <label className="sorting__label">
                    <input
                        className="sorting__input"
                        type="radio"
                        name={`sort${props.kinde}`}
                        value='statusComplited'
                        onChange={() => { setCurrentSort({ kinde: props.kinde, sortBy: '--', type: 'statusComplited' }) }} />
                    по выполнению
                    <span ></span>
                </label>
            </div>

        </div>
    )
}