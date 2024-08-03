import { useCallback, useEffect, useMemo, useState } from "react";
import Profile from "./profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import PostedEl from "./PostedEl/PostedEl";
import LocalPostForm from "./form/localPostForm";
import Sorting from "./Sorting/Sorting";
import Statistics from "./Statistics/Statistics";
import ActuveBtnSlider from "../ui/activeBtnSlider/ActiveBtnSlider";
import useTouchSlider from "../../utils/customHooks/useTouchSlider";
import { CashDataPatch, CashData, LocalPost, CashDataFromClient, Kinde } from "../../utils/types";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { createLPel, deleteCashDataLP, patchLPCashData, putCashDataLP } from "../../utils/store/localPostsSlice";
import ShowMoreBtn from "../ui/showMoreBtn/ShowMoreBtn";

interface props {
    openEmailModal: (data: CashData | null) => void

}




export default function LocalPosts(props: props) {
    const dispatch = useAppDispatch()
    const appSettings = useAppSelector(store => store.appSettings);
    const localPosts = useAppSelector(store => store.localPosts);
    const apiStatus = useAppSelector(store => store.apiStatus);
    const userMe = useAppSelector(store => store.userMe);


    const date = new Date();
    const [statsOpened, setStatsOpened] = useState<boolean>(appSettings.statsMustOpen);
    const [showedPost, setShowedPost] = useState<number>(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState<{ current: LocalPost | null, prev: LocalPost | null }>({ current: null, prev: null });
    const [lpContainerStyle, setLpContainerStyle] = useState<string>('local-posts__container');
    const [hidenComplitedPosts, setHidenComplitedPosts] = useState<{ lose: string, profit: string }>({ lose: appSettings.loseHideComplited ? 'none' : 'block', profit: appSettings.profitHideComplited ? 'none' : 'block' });
    const [currentSorting, setCurrentSorting] = useState<{ kinde: Kinde, value: string }[]>([{ kinde: 'profit', value: appSettings.profitSorting }, { kinde: 'lose', value: appSettings.loseSorting }])
    // для мобилок
    // отображаемый тип кэш даты profit/lose
    // слайдер | profit | > | lose |
    const [currentKindeShowed, setCurrentKindeShowed] = useState<number>(0);


    const [currentWW, setCurrentWW] = useState<number>(window.innerWidth);

    const totalProfit = useMemo((): number => {
        if (!showedPostData.current) {
            return 0
        }
        return showedPostData.current?.cashData.profit.reduce((acc: number, item: CashData): number => acc + Number(Object.values(item.data)[0]), 0);
    }, [showedPostData])
    const totalLose = useMemo((): number => {
        if (!showedPostData.current) {
            return 0
        }
        return showedPostData.current?.cashData.lose.reduce((acc: number, item: CashData): number => acc + Number(Object.values(item.data)[0]), 0);
    }, [showedPostData])

    const slideCashData = useCallback(() => {
        if (window.innerWidth < 700) {
            if (currentKindeShowed === 1) {
                setCurrentKindeShowed(0)
                return
            }
            setCurrentKindeShowed(1)
        }

    }, [currentKindeShowed])
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: currentKindeShowed, callback: slideCashData })

    function checkWW() {
        setCurrentWW(window.innerWidth);
    }

    useEffect(() => {
        checkWW()
        window.addEventListener('resize', checkWW);
        return () => {
            window.removeEventListener('resize', checkWW);
        };
    }, [])



    function getCurrentPost() {
        const currentData = structuredClone(localPosts.filter(item => item.choisenMonth === showedPost)[0]);
        const previousData = structuredClone(localPosts.filter(item => item.choisenMonth === showedPost - 1)[0] || null);

        if (currentData && currentData.cashData.lose.length > 0 && currentData.cashData.profit.length > 0) {
            if (currentSorting.length > 0) {
                //вызывается 2 раза на каждый тип cashData
                currentSorting.forEach(el => { currentData.cashData[el.kinde] = (sortMassive(el, false, currentData) as CashData[]) })
            }

        }
        setShowedPostData({ current: currentData, prev: previousData });
    }


    const switchMonth = useCallback((e: number) => {
        if (showedPost + e < 1) {
            setShowedPost(12)
            return
        }
        else if (showedPost + e > 12) {
            setShowedPost(1);
            return
        }
        setShowedPost(showedPost + e)

    }, [showedPost])




    const sortMassive = useCallback((data: { kinde: Kinde, value: string }, mustUpdate: boolean = true, currentArray: LocalPost = (showedPostData.current as LocalPost)): CashData[] | void=> {
        //если mustUpdate = true
        // возвращает cashData[] того типа который передан в data.kinde
        // в ином случае самостоятельно изменяет стейт перменную текущего поста -showedPostData
        const copyLocalPost = ({ ...currentArray } as LocalPost);
        const copyCashData = { ...copyLocalPost.cashData };
        const kinde = data.kinde;
        const cashDataArray = copyCashData[(kinde as Kinde)];

        //сохранение текущей сортировки
        const currentSortIndex = currentSorting.findIndex(el => el.kinde === data.kinde);
        if (currentSortIndex >= 0) {
            const prevSorting = [...currentSorting];
            prevSorting[currentSortIndex] = { kinde: data.kinde, value: data.value }
            setCurrentSorting(prevSorting);

        } else {
            setCurrentSorting([...currentSorting, { kinde: data.kinde, value: data.value }])
        }



        /* сортировка выбором по типу*/
        if (data.value.includes('sum')) {
            //сортировка от большего к меньшему или наоборот
            cashDataArray.sort(function (a: CashData, b: CashData): number {
                return data.value.includes('fromSmall') ?
                    Number(Object.values(a.data)) - Number(Object.values(b.data))
                    :
                    Number(Object.values(b.data)) - Number(Object.values(a.data))


            })
        }
        else if (data.value.includes('category')) {
            cashDataArray.sort(function (a: CashData, b: CashData): number {
                return a.category.localeCompare(b.category)
            })

        } else if (data.value.includes('statusComplited')) {
            cashDataArray.sort(function (a: CashData, b: CashData): number {
                return b.statusComplited ? 1 : -1 - (a.statusComplited ? 1 : -1)
            })

        } else if (data.value.includes('date')) {
            cashDataArray.sort(function (a: CashData, b: CashData): number {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return Number(dateB) - Number(dateA)
            })
        }

        copyLocalPost.cashData[kinde] = cashDataArray;

        if (mustUpdate) {
            setShowedPostData({ prev: showedPostData.prev, current: copyLocalPost })
        } else {
            return cashDataArray
        }


    },[showedPostData, currentSorting])
    const hideComplited = useCallback((event: React.ChangeEvent<HTMLInputElement>)=> {

        const data = { kinde: (event.currentTarget.value as Kinde) }
        const currentVal = hidenComplitedPosts[data.kinde]
        let newData = currentVal

        if (currentVal === 'block') {
            newData = 'none'
        }
        else {
            newData = 'block'
        }

        const newObj = { ...hidenComplitedPosts, [data.kinde]: newData }
        setHidenComplitedPosts(newObj);
    },[hidenComplitedPosts])
    function handlePutCashDataLP(data: CashDataFromClient) {
        dispatch(putCashDataLP(data))
    }
    function handlePatchLPCashData(data: CashDataPatch) {
        dispatch(patchLPCashData(data))
    }
    function handleDeleteCashDataLP(data: CashDataPatch) {
        dispatch(deleteCashDataLP(data))
    }






    useEffect(() => {
        getCurrentPost();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localPosts]);

    useEffect(() => {
        //эффект замены отображаемых данных
        getCurrentPost()
        setLpContainerStyle('local-posts__container')
        setTimeout(() => {
            setLpContainerStyle('local-posts__container local-posts__container_active')
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showedPost]);

    return (
        <main className={`local-posts`}>

            <Profile apiStatus={apiStatus} userMe={userMe} />
            <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />
            <section className="local-posts__wrapper">
                <div className={lpContainerStyle}>
                    <button className={`stats__show-stats-btn `}
                        type="button"
                        onClick={() => { setStatsOpened(!statsOpened) }}>
                        Статистика
                        <ShowMoreBtn active={statsOpened} />
                        <span className={`stats__show-stats-btn-triangle ${statsOpened && 'stats__show-stats-btn-triangle_open'}`}></span>
                    </button>
                    <div className={`stats__wrapper ${statsOpened && 'stats__wrapper_opened'}`}>
                        {Number(totalLose) + Number(totalProfit) > 0 ? <Statistics
                            currentWW={currentWW}
                            localPost={showedPostData}
                            totalLose={totalLose}
                            totalProfit={totalProfit}
                            statsOpened={statsOpened}
                        /> :
                            <div className={`stats__wrapper ${statsOpened && 'stats__wrapper_opened'}`}> <p>пусто</p></div>}
                    </div>

                    {!showedPostData.current ?
                        <div className="local-post__empty-el">
                            <p className="local-post__empty-el-text">{apiStatus.isLoading ? 'Добавляем запись' : 'Добавить запись'}</p>
                            <button
                                disabled={apiStatus.isLoading}
                                onClick={() => { dispatch(createLPel({ choisenMonth: showedPost, choisenYear: 2023 })) }}
                                className={`local-post__empty-el-add-btn ${apiStatus.isLoading && 'local-post__empty-el-add-btn_loading'}`}
                                type="button"
                            >+</button>
                        </div>
                        :
                        <>
                            <nav className="lp__list-nav">
                                <button className="lp__list-nav-btn" onClick={() => slideCashData()}>
                                    <p className="local-posts__list-heading">Доход:</p>
                                    <p className="local-posts__list-heading">{totalProfit}</p>
                                </button>
                                <button className="lp__list-nav-btn" onClick={() => slideCashData()}>
                                    <p className="local-posts__list-heading">Расход:</p>
                                    <p className="local-posts__list-heading">{totalLose}</p>

                                </button>

                                {(currentWW as number) < 701 ? <ActuveBtnSlider transformValue={currentKindeShowed} /> : ''}

                            </nav>
                            <div className="lp__list-wrapper" style={slideStyle}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleTouchStart}
                                onMouseMove={handleTouchMove}
                                onMouseUp={handleTouchEnd}>
                                <div className="local-posts__list-wrapper">
                                    <LocalPostForm
                                        LPResMsg={apiStatus}
                                        isLoadingLP={apiStatus.isLoading}
                                        kinde={'profit'}
                                        heading={'Добавить доход'}
                                        postId={(showedPostData.current as LocalPost)._id}
                                        submitForm={handlePutCashDataLP}
                                    />
                                    {(totalProfit as number) > 0 &&
                                        <Sorting
                                            defaultVal={appSettings.profitSorting}
                                            kinde={'profit'}
                                            hidenComplitedPosts={hidenComplitedPosts}
                                            hideComplited={hideComplited}
                                            sortMassive={sortMassive} />}

                                    <ul className="local-posts__list">

                                        {Array.isArray((showedPostData.current as LocalPost)?.cashData.profit) && showedPostData.current?.cashData.profit.length > 0
                                            ?
                                            (showedPostData.current as LocalPost)?.cashData.profit.map((item) => (
                                                <PostedEl
                                                    hidenComplitedPost={hidenComplitedPosts}

                                                    openEmailModal={props.openEmailModal}
                                                    isLoading={apiStatus.isLoading}
                                                    patchLPCashData={handlePatchLPCashData}
                                                    deleteCashDataLP={handleDeleteCashDataLP}
                                                    item={item}
                                                    key={item._id}
                                                    kinde={'profit'}
                                                />
                                            )) :
                                            <li className="local-posts__list-elPlaceholder">
                                                <p className="local-posts__list-elPlaceholder-text">Тут еще нету статей доходов</p>
                                            </li>}

                                    </ul>
                                </div>
                                <div className="local-posts__list-wrapper">
                                    <LocalPostForm
                                        LPResMsg={apiStatus}
                                        isLoadingLP={apiStatus.isLoading}
                                        kinde={'lose'}
                                        heading={'Добавить расход'}
                                        postId={(showedPostData.current as LocalPost)._id}
                                        submitForm={handlePutCashDataLP} />
                                    {(totalLose as number) > 0
                                        &&
                                        <Sorting
                                            defaultVal={appSettings.loseSorting}
                                            kinde={'lose'}
                                            hidenComplitedPosts={hidenComplitedPosts}
                                            hideComplited={hideComplited}
                                            sortMassive={sortMassive} />}
                                    <ul className="local-posts__list">
                                        {Array.isArray((showedPostData.current as LocalPost)?.cashData.lose) && showedPostData.current?.cashData.lose.length > 0
                                            ?
                                            (showedPostData.current as LocalPost)?.cashData.lose.map((item) => (
                                                <PostedEl
                                                    hidenComplitedPost={hidenComplitedPosts}
                                                    openEmailModal={props.openEmailModal}
                                                    isLoading={apiStatus.isLoading}
                                                    patchLPCashData={handlePatchLPCashData}
                                                    deleteCashDataLP={handleDeleteCashDataLP}
                                                    item={item}
                                                    key={item._id}
                                                    kinde={'lose'}
                                                />
                                            ))
                                            :
                                            <li className="local-posts__list-elPlaceholder">
                                                <p className="local-posts__list-elPlaceholder-text">Тут еще нету статей расходов</p>
                                            </li>}

                                    </ul>
                                </div>
                            </div>
                            <div className='local-posts__public-btn-container'  >

                            </div>
                        </>}
                </div>

            </section>
        </main>
    )
}