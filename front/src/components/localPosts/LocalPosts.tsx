import { useContext, useEffect, useMemo, useState } from "react";
import Profile from "./profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import PostedEl from "./PostedEl/PostedEl";
import LocalPostForm from "./form/localPostForm";
import Sorting from "./Sorting/Sorting";
import Statistics from "./Statistics/Statistics";
import ActuveBtnSlider from "../ui/activeBtnSlider/ActiveBtnSlider";
import useTouchSlider from "../../utils/customHooks/useTouchSlider";
import { CashDataPatch, CashData, LocalPost, CashDataFromClient, MetaData, Kinde } from "../../utils/types";
import { CurrentContext } from "../Context";

interface props {
    isLoadingUser: boolean
    changeUserInfo: () => Promise<{ success: boolean }>
    localData: LocalPost[]
    isLoadingLP: boolean
    LPResMsg: MetaData
    emailModalLodaing: boolean
    openEmailModal: (data: CashData) => void
    deleteCashDataLP: (data: CashDataPatch) => void
    putCashDataLP: (data: CashDataFromClient) => void
    patchLPCashData: () => void
    createPost: (data: { choisenMonth: number, choisenYear: number }) => void
}




export default function LocalPosts(props: props) {
    const { appSettings } = useContext(CurrentContext)
    const date = new Date();
    const [showedPost, setShowedPost] = useState<number>(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState<{ current: LocalPost | null, prev: LocalPost | null }>({ current: null, prev: null });
    const [lpContainerStyle, setLpContainerStyle] = useState<string>('local-posts__container');
    const [hidenComplitedPosts, setHidenComplitedPosts] = useState<{ lose: string, profit: string }>({ lose: appSettings.loseHideComplited ? 'none' : 'block', profit: appSettings.profitHideComplited ? 'none' : 'block' });

    // для мобилок
    // отображаемый тип кэш даты profit/lose
    const [currentKindeShowed, setCurrentKindeShowed] = useState<number>(0);

    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: currentKindeShowed, callback: slideCashData })
    const [currentWW, setCurrentWW] = useState<number>(window.innerWidth);

    const totalProfit = showedPostData.current?.cashData.profit.reduce((acc: number, item: CashData) => acc + Number(Object.values(item.data)[0]), 0);
    const totalLose = showedPostData.current?.cashData.lose.reduce((acc: number, item: CashData) => acc + Number(Object.values(item.data)[0]), 0);
    const [currentSorting, setCurrentSorting] = useState<{ kinde: Kinde, value: string }[]>([{ kinde: 'profit', value: appSettings.profitSorting }, { kinde: 'lose', value: appSettings.loseSorting }])



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
        const currentData = props.localData?.filter(item => item.choisenMonth === showedPost)[0];
        const previousData = props.localData?.filter(item => item.choisenMonth === showedPost - 1)[0] || null;
        if (currentData) {
            if (currentSorting.length > 0) {
                //вызывается 2 раза на каждый тип cashData
                currentSorting.forEach(el => { currentData.cashData[el.kinde] = (sortMassive(el, false, currentData) as CashData[]) })
            }

        }
        setShowedPostData({ current: currentData, prev: previousData });
    }


    function switchMonth(e: number) {
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



    function sortMassive(data: { kinde: Kinde, value: string }, mustUpdate: boolean = true, currentArray: LocalPost = (showedPostData.current as LocalPost)): CashData[] | void {
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


    }

    function hideComplited(event: React.ChangeEvent<HTMLInputElement>) {

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
    }



    function slideCashData() {

        if (window.innerWidth < 700) {
            if (currentKindeShowed === 1) {
                setCurrentKindeShowed(0)
                return
            }
            setCurrentKindeShowed(1)
        }

    }


    useEffect(() => {
        getCurrentPost();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.localData]);

    useEffect(() => {
        //эффект замены отображаемых данных
        getCurrentPost()
        setLpContainerStyle('local-posts__container')
        setTimeout(() => {
            setLpContainerStyle('local-posts__container local-posts__container_active')
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showedPost]);



    /* рендер элементов из массива */

    const postedElsRenderProfit = useMemo(() => {
        return renderPostedEl('profit')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showedPostData.current?.cashData.profit, hidenComplitedPosts.profit])

    const postedElsRenderLose = useMemo(() => {
        return renderPostedEl('lose')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showedPostData.current?.cashData.lose, hidenComplitedPosts.lose])

    function renderPostedEl(kinde: Kinde): JSX.Element {
        if (Array.isArray((showedPostData.current as LocalPost)?.cashData[kinde])
            &&
            (showedPostData.current as LocalPost)?.cashData[kinde].length > 0) {

            return (<>
                {(showedPostData.current as LocalPost)?.cashData[kinde].map((item) => (
                    <PostedEl
                        hidenComplitedPost={hidenComplitedPosts}
                        patchLPCashData={props.patchLPCashData}
                        emailModalLodaing={props.emailModalLodaing}
                        openEmailModal={props.openEmailModal}
                        isLoadingLP={props.isLoadingLP}
                        deleteCashDataLP={props.deleteCashDataLP}
                        item={item}
                        key={item._id}
                        kinde={kinde}
                    />
                ))}
            </>)
        } else {
            return (<li className="local-posts__list-elPlaceholder">
                <p className="local-posts__list-elPlaceholder-text">{`Тут еще нету статей ${kinde === 'lose' ? 'расходов' : 'доходов'}`}</p>
            </li>)
        }


    }
    /* профиль */
    //надо выносить стейты значений полей

    /* слайдер месяцев */
    const memoMounthSlider = useMemo(() => <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />, [showedPost]);



    return (
        <main className='local-posts'>
            <Profile changeUserInfo={props.changeUserInfo} isLoading={props.isLoadingUser} />
            {memoMounthSlider}
            <section className="local-posts__wrapper">
                <div className={lpContainerStyle}>
                    {(totalProfit as number) + (totalLose as number) !== 0 && totalLose !== undefined && totalProfit !== undefined ?
                        <Statistics
                            currentWW={currentWW}
                            localPost={showedPostData}
                            totalLose={totalLose}
                            totalProfit={totalProfit} /> :
                        ''}
                    {!showedPostData.current ?
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
                                        LPResMsg={props.LPResMsg}
                                        isLoadingLP={props.isLoadingLP}
                                        kinde={'profit'}
                                        heading={'Добавить доход'}
                                        postId={(showedPostData.current as LocalPost)._id}
                                        submitForm={props.putCashDataLP}
                                    />
                                    {(totalProfit as number) > 0 &&
                                        <Sorting
                                            defaultVal={appSettings.profitSorting}
                                            kinde={'profit'}
                                            hidenComplitedPosts={hidenComplitedPosts}
                                            hideComplited={hideComplited}
                                            sortMassive={sortMassive} />}

                                    <ul className="local-posts__list">

                                        {postedElsRenderProfit}

                                    </ul>
                                </div>
                                <div className="local-posts__list-wrapper">
                                    <LocalPostForm
                                        LPResMsg={props.LPResMsg}
                                        isLoadingLP={props.isLoadingLP}
                                        kinde={'lose'}
                                        heading={'Добавить расход'}
                                        postId={(showedPostData.current as LocalPost)._id}
                                        submitForm={props.putCashDataLP} />
                                    {(totalLose as number) > 0
                                        &&
                                        <Sorting
                                            defaultVal={appSettings.loseSorting}
                                            kinde={'lose'}
                                            hidenComplitedPosts={hidenComplitedPosts}
                                            hideComplited={hideComplited}
                                            sortMassive={sortMassive} />}
                                    <ul className="local-posts__list">
                                        {postedElsRenderLose}

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