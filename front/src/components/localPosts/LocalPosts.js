import React, { useEffect, useState } from "react";
import Profile from "../profile/Profile";
import MounthSlider from "./mounthSlider/MounthSlider";
import PostedEl from "./PostedEl/PostedEl";
import LocalPostForm from "./form/localPostForm";
import Sorting from "./Sorting/Sorting";
import Statistics from "./Statistics/Statistics";
import ActuveBtnSlider from "../activeBtnSlider/ActiveBtnSlider";
import useTouchSlider from "../../utils/customHooks/useTouchSlider";






export default function LoaclPosts(props) {
    const date = new Date();
    const [showedPost, setShowedPost] = useState(date.getMonth() + 1);
    const [showedPostData, setShowedPostData] = useState(null);
    const totalProfit = showedPostData?.cashData.profit.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
    const totalLose = showedPostData?.cashData.lose.reduce((acc, item) => acc + Object.values(item.data)[0], 0);
 /*    const [showDescription, setShowDescription] = useState(false);
    const [descriptionValue, setDescriptionValue] = useState(null); */
    const [dataForStatistic, setDataForStatistic] = useState(null);
    const [lpContainerStyle, setLpContainerStyle] = useState('local-posts__container');
    const [complitedElStatus, setComplitedElStatus] = useState({ lose: 'showed', profit: 'showed' });
    const [previousPostData, setPreviousPostData] = useState(null);
    const [showedCashData, setShwoedCashData] = useState(0);
    const { handleTouchStart, handleTouchMove, handleTouchEnd, slideStyle } = useTouchSlider({ step: showedCashData, slideFunction: slideCashData })
    const [currentWW, setCurrentWW] = useState(null);

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
        const postId = showedPostData._id;
        props.putCashDataLP({ cashData, postId });
    };
    function deleteCashDataLP(data) {
        data.postId = showedPostData._id;
        props.deleteCashDataLP(data);
    }
    function filterList() {
        const currentData = (props.localData?.filter(item => item.choisenMonth === showedPost));
        const previousData = ((props.localData?.filter(item => item.choisenMonth === showedPost - 1)));
        if (currentData) {
            setShowedPostData(currentData[0]);
            currentData.length > 0 ? setDataForStatistic(currentData[0]) : setDataForStatistic(null);
            previousData.length > 0 ? setPreviousPostData(previousData[0]) : setPreviousPostData(null);
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
    function setShowedPostDataFoo(data) {
        setShowedPostData(data)
    }
    function setComplitedElStatusFoo(data) {
        const previousObj = { ...complitedElStatus };
        setComplitedElStatus({ ...previousObj, [data.kinde]: data.value })
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
        <section className='local-posts'>
            <Profile changeUserInfo={props.changeUserInfo} isLoading={props.isLoading} />
            <MounthSlider showedPost={showedPost} switchMonth={switchMonth} />
            <div className="local-posts__wrapper">
                <div className={lpContainerStyle}>
                    {totalProfit + totalLose !== 0 && totalLose !== undefined && totalProfit !== undefined ?
                        <Statistics
                            currentWW={currentWW}
                            previousPostData={previousPostData}
                            totalLose={totalLose}
                            totalProfit={totalProfit}
                            dataForStatistic={dataForStatistic} /> :
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

                                {currentWW < 701 ? <ActuveBtnSlider transformValue={showedCashData} /> : ''}

                            </nav>
                            <section className="lp__list-wrapper" style={slideStyle}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleTouchStart}
                                onMouseMove={handleTouchMove}
                                onMouseUp={handleTouchEnd}>
                                <ul className="local-posts__list">

                                    <li className="local-posts__posted-el">
                                        <LocalPostForm
                                            complitedElStatus={complitedElStatus}
                                            LPResMsg={props.LPResMsg}
                                            isLoadingLP={props.isLoadingLP}
                                            kinde={'profit'}
                                            heading={'Добавить доход'}
                                            submitForm={submitFormPutCashData}
                                        />

                                    </li>
                                    <li className="lp__sort-el">
                                        <Sorting
                                            kinde={'profit'}
                                            complitedElStatus={complitedElStatus}
                                            setComplitedElStatusFoo={setComplitedElStatusFoo}
                                            showedPostData={showedPostData}
                                            setShowedPostData={setShowedPostDataFoo} />
                                    </li>
                                    {Array.isArray(showedPostData?.cashData.profit) && showedPostData?.cashData.profit.map((item) => (
                                        <PostedEl
                                            complitedElStatus={complitedElStatus}
                                            patchLPCashData={props.patchLPCashData}
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

                                </ul>
                                <ul className="local-posts__list">
                                    <li className="local-posts__posted-el">
                                        <LocalPostForm
                                            LPResMsg={props.LPResMsg}
                                            isLoadingLP={props.isLoadingLP}
                                            kinde={'lose'}
                                            heading={'Добавить расход'}
                                            submitForm={submitFormPutCashData} />

                                    </li>
                                    <li className="lp__sort-el">
                                        <Sorting
                                            setComplitedElStatusFoo={setComplitedElStatusFoo}
                                            kinde={'lose'}
                                            showedPostData={showedPostData}
                                            setShowedPostData={setShowedPostDataFoo} />

                                    </li>
                                    {Array.isArray(showedPostData?.cashData.lose) && showedPostData?.cashData.lose.map((item) => (
                                        <PostedEl
                                            complitedElStatus={complitedElStatus}
                                            patchLPCashData={props.patchLPCashData}
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

                                </ul>
                            </section>
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

            </div>
        </section>
    )
}