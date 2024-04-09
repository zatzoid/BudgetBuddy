import { useEffect, useState } from "react";
import Profile from "../profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import PostedEl from "./PostedEl/PostedEl";
import LocalPostForm from "./form/localPostForm";
import Sorting from "./Sorting/Sorting";
import Statistics from "./Statistics/Statistics";
import ActuveBtnSlider from "../activeBtnSlider/ActiveBtnSlider";
import useTouchSlider from "../../utils/customHooks/useTouchSlider";
import { ApiRes, CashDataPatch, CashData, LocalPost, CashDataFromClient } from "../../utils/types";

interface props {
    isLoading: boolean
    changeUserInfo: () => Promise<{ success: boolean }>
    localData: LocalPost[]
    isLoadingLP: boolean
    LPResMsg: ApiRes
    emailModalLodaing: boolean
    openEmailModal: (data: CashData) => void
    deleteCashDataLP: (data: CashDataPatch) => void
    putCashDataLP: (data: CashDataFromClient) => void
    patchLPCashData: () => void
    createPost: (data: { choisenMonth: number, choisenYear: number }) => void
}




export default function LocalPosts(props: props) {
    const date = new Date();
    const [showedPost, setShowedPost] = useState<number>(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState<LocalPost | null>(null);
    const totalProfit = showedPostData?.cashData.profit.reduce((acc: number, item: CashData) => acc + Number(Object.values(item.data)[0]), 0);
    const totalLose = showedPostData?.cashData.lose.reduce((acc: number, item: CashData) => acc + Number(Object.values(item.data)[0]), 0);
    const [lpContainerStyle, setLpContainerStyle] = useState<string>('local-posts__container');
    const [showComplitedPosts, setShowComplitedPosts] = useState<{ lose: string, profit: string }>({ lose: 'block', profit: 'block' });
    const [previousLocalPost, setPreviousLocalPost] = useState<LocalPost | null>(null);
    const [showedCashData, setShwoedCashData] = useState<number>(0);
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: showedCashData, callback: slideCashData })
    const [currentWW, setCurrentWW] = useState<number>(window.innerWidth);

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



    function filterList() {
        const currentData = (props.localData?.filter(item => item.choisenMonth === showedPost));
        const previousData = ((props.localData?.filter(item => item.choisenMonth === showedPost - 1)));
        if (currentData) {
            setShowedPostData(currentData[0]);

            previousData.length > 0 ? setPreviousLocalPost(previousData[0]) : setPreviousLocalPost(null);
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

    function setShowedPostDataFoo(data: LocalPost) {
        setShowedPostData(data)
    }
    function setShowComplitedPostsFoo(data: { kinde: string, value: string }) {
        const newObj = { ...showComplitedPosts, [data.kinde]: data.value }
        setShowComplitedPosts(newObj);
    }


    function slideCashData() {
        if (window.innerWidth < 700) {
            if (showedCashData === 1) {
                setShwoedCashData(0)
                return
            }
            setShwoedCashData(1)
        }

    }

    return (
        <main className='local-posts'>
            <Profile changeUserInfo={props.changeUserInfo} isLoading={props.isLoading} />
            <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />
            <section className="local-posts__wrapper">
                <div className={lpContainerStyle}>
                    {(totalProfit as number) + (totalLose as number) !== 0 && totalLose !== undefined && totalProfit !== undefined ?
                        <Statistics
                            currentWW={currentWW}
                            previousLocalPost={previousLocalPost}
                            totalLose={totalLose}
                            totalProfit={totalProfit}
                            currentLocalPost={(showedPostData as LocalPost)} /> :
                        ''}
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
                            <nav className="lp__list-nav">
                                <button className="lp__list-nav-btn" onClick={() => slideCashData()}>
                                    <p className="local-posts__list-heading">Доход:</p>
                                    <p className="local-posts__list-heading">{totalProfit}</p>
                                </button>
                                <button className="lp__list-nav-btn" onClick={() => slideCashData()}>
                                    <p className="local-posts__list-heading">Расход:</p>
                                    <p className="local-posts__list-heading">{totalLose}</p>

                                </button>

                                {(currentWW as number) < 701 ? <ActuveBtnSlider transformValue={showedCashData} /> : ''}

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
                                        postId={(showedPostData as LocalPost)._id}
                                        submitForm={props.putCashDataLP}
                                    />
                                    {(totalProfit as number) > 0 && <Sorting
                                        kinde={'profit'}
                                        setShowComplitedPostsFoo={setShowComplitedPostsFoo}
                                        showedPostData={showedPostData}
                                        setShowedPostData={setShowedPostDataFoo} />}

                                    <ul className="local-posts__list">

                                        {Array.isArray(showedPostData?.cashData.profit) && showedPostData?.cashData.profit.map((item) => (
                                            <PostedEl
                                                showComplitedPosts={showComplitedPosts}
                                                patchLPCashData={props.patchLPCashData}
                                                emailModalLodaing={props.emailModalLodaing}
                                                openEmailModal={props.openEmailModal}
                                                isLoadingLP={props.isLoadingLP}
                                                deleteCashDataLP={props.deleteCashDataLP}
                                                item={item}
                                                key={item._id}
                                                kinde={'profit'}
                                             /*    keyName={Object.keys(item.data)[0]}
                                                value={Object.values(item.data)[0]}  *//>
                                        ))}

                                    </ul>
                                </div>
                                <div className="local-posts__list-wrapper">
                                    <LocalPostForm
                                        LPResMsg={props.LPResMsg}
                                        isLoadingLP={props.isLoadingLP}
                                        kinde={'lose'}
                                        heading={'Добавить расход'}
                                        postId={(showedPostData as LocalPost)._id}
                                        submitForm={props.putCashDataLP} />
                                    {(totalLose as number) > 0 && <Sorting
                                        setShowComplitedPostsFoo={setShowComplitedPostsFoo}
                                        kinde={'lose'}
                                        showedPostData={showedPostData}
                                        setShowedPostData={setShowedPostDataFoo} />}
                                    <ul className="local-posts__list">
                                        {Array.isArray(showedPostData?.cashData.lose) && showedPostData?.cashData.lose.map((item) => (
                                            <PostedEl
                                                showComplitedPosts={showComplitedPosts}
                                                patchLPCashData={props.patchLPCashData}
                                                emailModalLodaing={props.emailModalLodaing}
                                                openEmailModal={props.openEmailModal}
                                                isLoadingLP={props.isLoadingLP}
                                                deleteCashDataLP={props.deleteCashDataLP}
                                                item={item}
                                                key={item._id}
                                                kinde={'lose'}
                                                /* keyName={Object.keys(item.data)[0]}
                                                value={Object.values(item.data)[0]} */ />
                                        ))}

                                    </ul>
                                </div>
                            </div>
                            <div className='local-posts__public-btn-container'  >
                                {/* {showDescription && <div className="local-posts__public-add-description" >
                                    <textarea
                                        required
                                        className="local-posts__public-add-description-value"
                                        placeholder="Добавьте описание (это обязательно)"
                                        value={descriptionValue || ''}
                                        onChange={(e) => { setDescriptionValue(e.target.value) }}
                                    />
                                    <button className="local-posts__public-add-description-btn" >Опубликовать</button>
                                    <button 
                                        onClick={() => { setShowDescription(false) }}
                                        className="local-posts__public-add-description-btn">Отмена</button>
                                </div>}
                                {!showedPostData.posted &&
                                    <button
                                        onClick={() => { setShowDescription(true) }}
                                        className={`local-posts__public-btn ${showDescription && 'local-posts__public-btn_active'}`}>
                                        Опубликовать запись</button>}

                                {showedPostData.posted && <p className="local-posts__public-btn_posted">Запись опубликована</p>} */}
                            </div>
                        </>}
                </div>

            </section>
        </main>
    )
}